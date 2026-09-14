"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { endSession, startSession, verifyPassword } from "@/lib/auth";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  createPost,
  deletePost,
  estimateReadMinutes,
  slugify,
  updatePost,
  type PostInput,
} from "@/lib/posts";
import { deleteComment, setCommentHidden } from "@/lib/engagement";
import { firstParagraph } from "@/lib/markdown";

export type FormState = { error?: string } | undefined;

/* ------------------------------------------------------------------ auth -- */

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!password) return { error: "Enter the admin password." };
  if (!verifyPassword(password)) return { error: "That password is not correct." };

  await startSession();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ----------------------------------------------------------------- posts -- */

/**
 * The file input, the "remove image" checkbox and the stored blob, resolved into
 * a single instruction for the data layer.
 */
async function readImage(formData: FormData): Promise<
  { image: PostInput["image"]; error?: string }
> {
  if (formData.get("removeImage") === "on") return { image: { action: "clear" } };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { image: { action: "keep" } };

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      image: { action: "keep" },
      error: "The preview image must be a JPEG, PNG, WebP or AVIF file.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0);
    return {
      image: { action: "keep" },
      error: `That image is ${(file.size / (1024 * 1024)).toFixed(1)} MB — the limit is ${mb} MB.`,
    };
  }

  return {
    image: { action: "set", bytes: new Uint8Array(await file.arrayBuffer()), type: file.type },
  };
}

async function readForm(formData: FormData): Promise<{ input: PostInput; error?: string }> {
  const { image, error: imageError } = await readImage(formData);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const excerptRaw = String(formData.get("excerpt") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const readRaw = String(formData.get("readMinutes") ?? "").trim();

  const input: PostInput = {
    title,
    slug: slugRaw ? slugify(slugRaw) : slugify(title),
    excerpt: excerptRaw || firstParagraph(body),
    body,
    category: String(formData.get("category") ?? "").trim(),
    readMinutes: readRaw ? Math.max(1, Number(readRaw) || 1) : estimateReadMinutes(body),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    image,
  };

  if (!title) return { input, error: "A title is required." };
  if (!body) return { input, error: "The post needs a body." };
  if (imageError) return { input, error: imageError };
  return { input };
}

export async function createPostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { input, error } = await readForm(formData);
  if (error) return { error };

  const post = await createPost(input);
  revalidatePath("/");
  revalidatePath("/insights");
  redirect(`/admin/posts/${post.id}?created=1`);
}

export async function updatePostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return { error: "Unknown post." };

  const { input, error } = await readForm(formData);
  if (error) return { error };

  const post = await updatePost(id, input);
  if (!post) return { error: "That post no longer exists." };

  revalidatePath("/");
  revalidatePath("/insights");
  revalidatePath(`/insights/${post.slug}`);
  redirect(`/admin/posts/${post.id}?saved=1`);
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (Number.isFinite(id)) {
    await deletePost(id);
    revalidatePath("/");
    revalidatePath("/insights");
  }
  redirect("/admin?deleted=1");
}

/* -------------------------------------------------------------- comments -- */

/**
 * Comments post straight to the page, so moderation is after the fact: hide one
 * to take it down without losing it, delete to be rid of it.
 */
export async function setCommentHiddenAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const hidden = formData.get("hidden") === "1";
  if (Number.isFinite(id)) {
    await setCommentHidden(id, hidden);
    revalidateAfterComment(String(formData.get("slug") ?? ""));
  }
  redirect("/admin/comments");
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (Number.isFinite(id)) {
    await deleteComment(id);
    revalidateAfterComment(String(formData.get("slug") ?? ""));
  }
  redirect("/admin/comments?deleted=1");
}

function revalidateAfterComment(slug: string): void {
  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/insights");
}
