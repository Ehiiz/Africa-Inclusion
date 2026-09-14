"use server";

import { revalidatePath } from "next/cache";
import { isPublished } from "@/lib/posts";
import {
  commentCooldownRemaining,
  createComment,
  toggleLike,
  validateComment,
} from "@/lib/engagement";
import { ensureVisitorId, rememberCommenter } from "@/lib/visitor";

export type CommentState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "posted" };

/**
 * Post a comment. No account — a name, an email and the comment itself. The
 * email is stored for the admin and never rendered on the page.
 */
export async function postCommentAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const postId = Number(formData.get("postId"));
  const slug = String(formData.get("slug") ?? "");
  if (!Number.isFinite(postId) || !(await isPublished(postId))) {
    return { status: "error", error: "That post is no longer available." };
  }

  const result = validateComment({
    author: String(formData.get("author") ?? ""),
    email: String(formData.get("email") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if (!result.ok) return { status: "error", error: result.error };

  // The honeypot is hidden from people and irresistible to form-filling bots.
  // Accept the submission so the bot sees success, but keep it off the page.
  const trapped = String(formData.get("website") ?? "").trim().length > 0;

  const visitorId = await ensureVisitorId();
  if (!trapped) {
    const wait = await commentCooldownRemaining(visitorId);
    if (wait > 0) {
      return {
        status: "error",
        error: `Just posted — give it ${wait} more second${wait === 1 ? "" : "s"}.`,
      };
    }
  }

  await createComment(postId, result.value, { visitorId, hidden: trapped });
  await rememberCommenter(result.value.author, result.value.email);

  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/insights");
  return { status: "posted" };
}

/** Add or remove this reader's like. Returns the state the button should settle on. */
export async function toggleLikeAction(
  postId: number,
): Promise<{ liked: boolean; likes: number } | null> {
  if (!Number.isFinite(postId) || !(await isPublished(postId))) return null;
  const visitorId = await ensureVisitorId();
  const result = await toggleLike(postId, visitorId);
  revalidatePath("/insights");
  return result;
}
