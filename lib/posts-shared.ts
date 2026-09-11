/**
 * Types and pure helpers shared by server code and client components. Nothing
 * here touches the database, so a "use client" file can import it safely.
 */

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  readMinutes: number;
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** True when the post carries an uploaded preview image. */
  hasImage: boolean;
  imageAlt: string;
};

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  readMinutes: number;
  featured: boolean;
  published: boolean;
  imageAlt: string;
  /** Replace the preview image, drop it, or leave whatever is stored alone. */
  image: { action: "set"; bytes: Uint8Array; type: string } | { action: "clear" } | { action: "keep" };
};

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
/** Turn a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** A rough read time, floored at one minute. */
export function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Cache-busting URL for a post's preview image, or null when it has none. */
export function imageUrl(post: Post): string | null {
  if (!post.hasImage) return null;
  return `/insights/image/${post.id}?v=${encodeURIComponent(post.updatedAt)}`;
}

/** "Jan 2026" — the format the Insights cards use. */
export function formatMonth(iso: string | null): string {
  if (!iso) return "Draft";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Draft";
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/** "12 February 2026" — used on the post page itself. */
export function formatLongDate(iso: string | null): string {
  if (!iso) return "Unpublished";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unpublished";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
