import "server-only";
import { db, ready } from "./db";
import type { Post, PostInput } from "./posts-shared";
import { slugify } from "./posts-shared";
import { deleteEngagementFor } from "./engagement";

// The pure half of the module is re-exported so `@/lib/posts` stays the
// single import site for server code.
export * from "./posts-shared";

/**
 * Every column except the image blob. List views must never pull image bytes —
 * a handful of posts would otherwise mean megabytes per query.
 */
const COLUMNS = `id, slug, title, excerpt, body, category, read_minutes, featured,
  published, published_at, created_at, updated_at, image_alt,
  image_data IS NOT NULL AS has_image`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toPost(row: any): Post {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? ""),
    category: String(row.category ?? ""),
    readMinutes: Number(row.read_minutes ?? 5),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    publishedAt: row.published_at ? String(row.published_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    hasImage: Boolean(row.has_image),
    imageAlt: String(row.image_alt ?? ""),
  };
}

/** Published posts, newest first. Used by the Insights section and index. */
export async function listPublished(limit?: number): Promise<Post[]> {
  await ready();
  const sql =
    `SELECT ${COLUMNS} FROM posts WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC` +
    (limit ? " LIMIT ?" : "");
  const res = await db.execute({ sql, args: limit ? [limit] : [] });
  return res.rows.map(toPost);
}

/** Every post regardless of state, newest first. Admin only. */
export async function listAll(): Promise<Post[]> {
  await ready();
  const res = await db.execute(`SELECT ${COLUMNS} FROM posts ORDER BY updated_at DESC`);
  return res.rows.map(toPost);
}

export async function getBySlug(slug: string): Promise<Post | null> {
  await ready();
  const res = await db.execute({
    sql: `SELECT ${COLUMNS} FROM posts WHERE slug = ? LIMIT 1`,
    args: [slug],
  });
  return res.rows.length ? toPost(res.rows[0]) : null;
}

/**
 * Cheap existence check for the engagement actions — a like or a comment should
 * not be able to name an arbitrary id, and neither needs the post's columns.
 */
export async function isPublished(id: number): Promise<boolean> {
  await ready();
  const res = await db.execute({
    sql: "SELECT 1 FROM posts WHERE id = ? AND published = 1 LIMIT 1",
    args: [id],
  });
  return res.rows.length > 0;
}

export async function getById(id: number): Promise<Post | null> {
  await ready();
  const res = await db.execute({
    sql: `SELECT ${COLUMNS} FROM posts WHERE id = ? LIMIT 1`,
    args: [id],
  });
  return res.rows.length ? toPost(res.rows[0]) : null;
}

/**
 * The Insights section and index lead with a featured post. Fall back to the
 * newest published one so the layout is never empty.
 */
export async function getFeatured(): Promise<Post | null> {
  await ready();
  const res = await db.execute(
    `SELECT ${COLUMNS} FROM posts WHERE published = 1
     ORDER BY featured DESC, COALESCE(published_at, created_at) DESC LIMIT 1`,
  );
  return res.rows.length ? toPost(res.rows[0]) : null;
}

/** Ensure `slug` is unique, appending -2, -3 … when it is not. */
async function uniqueSlug(slug: string, exceptId?: number): Promise<string> {
  const base = slug || "post";
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const res = await db.execute({
      sql: "SELECT id FROM posts WHERE slug = ? LIMIT 1",
      args: [candidate],
    });
    const taken = res.rows.length > 0 && Number(res.rows[0].id) !== exceptId;
    if (!taken) return candidate;
  }
}

/** Only one post carries the featured flag at a time. */
async function clearOtherFeatured(keepId: number): Promise<void> {
  await db.execute({ sql: "UPDATE posts SET featured = 0 WHERE id != ?", args: [keepId] });
}

export async function createPost(input: PostInput): Promise<Post> {
  await ready();
  const slug = await uniqueSlug(input.slug || slugify(input.title));
  const image = input.image.action === "set" ? input.image : null;
  const res = await db.execute({
    sql: `INSERT INTO posts
            (slug, title, excerpt, body, category, read_minutes, featured, published,
             published_at, image_data, image_type, image_alt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          RETURNING ${COLUMNS}`,
    args: [
      slug,
      input.title,
      input.excerpt,
      input.body,
      input.category,
      input.readMinutes,
      input.featured ? 1 : 0,
      input.published ? 1 : 0,
      input.published ? new Date().toISOString() : null,
      image ? image.bytes : null,
      image ? image.type : null,
      input.imageAlt,
    ],
  });
  const post = toPost(res.rows[0]);
  if (post.featured) await clearOtherFeatured(post.id);
  return post;
}

export async function updatePost(id: number, input: PostInput): Promise<Post | null> {
  await ready();
  const existing = await getById(id);
  if (!existing) return null;

  const slug = await uniqueSlug(input.slug || slugify(input.title), id);
  // Stamp published_at the first time a post goes live; keep it thereafter.
  const publishedAt = input.published ? existing.publishedAt ?? new Date().toISOString() : null;

  // "keep" leaves the stored blob untouched; the other two overwrite it.
  const imageSql =
    input.image.action === "keep" ? "" : ", image_data = ?, image_type = ?";
  const imageArgs =
    input.image.action === "set"
      ? [input.image.bytes, input.image.type]
      : input.image.action === "clear"
        ? [null, null]
        : [];

  const res = await db.execute({
    sql: `UPDATE posts SET
            slug = ?, title = ?, excerpt = ?, body = ?, category = ?,
            read_minutes = ?, featured = ?, published = ?, published_at = ?,
            image_alt = ?, updated_at = datetime('now')${imageSql}
          WHERE id = ?
          RETURNING ${COLUMNS}`,
    args: [
      slug,
      input.title,
      input.excerpt,
      input.body,
      input.category,
      input.readMinutes,
      input.featured ? 1 : 0,
      input.published ? 1 : 0,
      publishedAt,
      input.imageAlt,
      ...imageArgs,
      id,
    ],
  });
  const post = toPost(res.rows[0]);
  if (post.featured) await clearOtherFeatured(post.id);
  return post;
}

export async function deletePost(id: number): Promise<void> {
  await ready();
  await db.execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
  await deleteEngagementFor(id);
}

/**
 * The stored preview image. Kept out of every other query so list views never
 * pull blob bytes.
 */
export async function getPostImage(
  id: number,
): Promise<{ bytes: Uint8Array; type: string; updatedAt: string } | null> {
  await ready();
  const res = await db.execute({
    sql: "SELECT image_data, image_type, updated_at FROM posts WHERE id = ? LIMIT 1",
    args: [id],
  });
  const row = res.rows[0];
  if (!row?.image_data) return null;
  const raw = row.image_data as ArrayBuffer | Uint8Array;
  return {
    bytes: raw instanceof Uint8Array ? raw : new Uint8Array(raw),
    type: String(row.image_type ?? "image/jpeg"),
    updatedAt: String(row.updated_at),
  };
}
