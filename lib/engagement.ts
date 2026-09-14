import "server-only";
import { db, ready } from "./db";
import type { AdminComment, Comment, CommentDraft, Engagement } from "./engagement-shared";
import { COMMENT_COOLDOWN_SECONDS, EMPTY_ENGAGEMENT } from "./engagement-shared";

// The pure half of the module is re-exported so `@/lib/engagement` stays the
// single import site for server code.
export * from "./engagement-shared";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toComment(row: any): Comment {
  return {
    id: Number(row.id),
    postId: Number(row.post_id),
    author: String(row.author),
    body: String(row.body),
    createdAt: String(row.created_at),
  };
}

/* -------------------------------------------------------------- comments -- */

/** Visible comments on a post, oldest first — a conversation reads downwards. */
export async function listComments(postId: number): Promise<Comment[]> {
  await ready();
  const res = await db.execute({
    sql: `SELECT id, post_id, author, body, created_at
            FROM comments
           WHERE post_id = ? AND hidden = 0
           ORDER BY created_at ASC, id ASC`,
    args: [postId],
  });
  return res.rows.map(toComment);
}

/** Every comment on every post, newest first, with the email. Admin only. */
export async function listAllComments(): Promise<AdminComment[]> {
  await ready();
  const res = await db.execute(
    `SELECT c.id, c.post_id, c.author, c.email, c.body, c.hidden, c.created_at,
            p.slug AS post_slug, p.title AS post_title
       FROM comments c
       LEFT JOIN posts p ON p.id = c.post_id
      ORDER BY c.created_at DESC, c.id DESC`,
  );
  return res.rows.map((row: any) => ({
    ...toComment(row),
    email: String(row.email ?? ""),
    hidden: Boolean(row.hidden),
    postSlug: String(row.post_slug ?? ""),
    postTitle: String(row.post_title ?? "Deleted post"),
  }));
}

/**
 * Seconds still to wait before this visitor may comment again, or 0. Anonymous
 * posting needs *some* brake; one comment every COMMENT_COOLDOWN_SECONDS is a
 * cheap one that a person never notices.
 */
export async function commentCooldownRemaining(visitorId: string): Promise<number> {
  if (!visitorId) return 0;
  await ready();
  const res = await db.execute({
    sql: `SELECT CAST(strftime('%s','now') AS INTEGER)
               - CAST(strftime('%s', MAX(created_at)) AS INTEGER) AS elapsed
            FROM comments WHERE visitor_id = ?`,
    args: [visitorId],
  });
  // MAX() over no rows is NULL, and Number(null) is 0 — which would read as
  // "commented just now" and block a first-time commenter. Check for it.
  const raw = res.rows[0]?.elapsed;
  if (raw === null || raw === undefined) return 0;
  const elapsed = Number(raw);
  if (!Number.isFinite(elapsed)) return 0;
  return Math.max(0, COMMENT_COOLDOWN_SECONDS - elapsed);
}

/**
 * Store a comment. `hidden` lets the caller accept a submission that tripped the
 * honeypot without telling the bot it failed.
 */
export async function createComment(
  postId: number,
  draft: CommentDraft,
  options: { visitorId: string; hidden?: boolean } = { visitorId: "" },
): Promise<Comment> {
  await ready();
  const res = await db.execute({
    sql: `INSERT INTO comments (post_id, author, email, body, hidden, visitor_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          RETURNING id, post_id, author, body, created_at`,
    args: [
      postId,
      draft.author,
      draft.email,
      draft.body,
      options.hidden ? 1 : 0,
      options.visitorId,
      new Date().toISOString(),
    ],
  });
  return toComment(res.rows[0]);
}

export async function setCommentHidden(id: number, hidden: boolean): Promise<void> {
  await ready();
  await db.execute({
    sql: "UPDATE comments SET hidden = ? WHERE id = ?",
    args: [hidden ? 1 : 0, id],
  });
}

export async function deleteComment(id: number): Promise<void> {
  await ready();
  await db.execute({ sql: "DELETE FROM comments WHERE id = ?", args: [id] });
}

/**
 * Drop everything hanging off a post. SQLite only enforces foreign keys when
 * `PRAGMA foreign_keys` is on, which is off by default, so the cascade is done
 * here rather than declared and quietly skipped.
 */
export async function deleteEngagementFor(postId: number): Promise<void> {
  await ready();
  await db.batch(
    [
      { sql: "DELETE FROM comments WHERE post_id = ?", args: [postId] },
      { sql: "DELETE FROM post_likes WHERE post_id = ?", args: [postId] },
    ],
    "write",
  );
}

/* ----------------------------------------------------------------- likes -- */

/** Add or remove this visitor's like, and report the state afterwards. */
export async function toggleLike(
  postId: number,
  visitorId: string,
): Promise<{ liked: boolean; likes: number }> {
  await ready();
  const existing = await db.execute({
    sql: "SELECT 1 FROM post_likes WHERE post_id = ? AND visitor_id = ? LIMIT 1",
    args: [postId, visitorId],
  });
  const liked = existing.rows.length === 0;

  await db.execute(
    liked
      ? {
          sql: `INSERT INTO post_likes (post_id, visitor_id, created_at) VALUES (?, ?, ?)
                ON CONFLICT (post_id, visitor_id) DO NOTHING`,
          args: [postId, visitorId, new Date().toISOString()],
        }
      : {
          sql: "DELETE FROM post_likes WHERE post_id = ? AND visitor_id = ?",
          args: [postId, visitorId],
        },
  );

  const count = await db.execute({
    sql: "SELECT COUNT(*) AS n FROM post_likes WHERE post_id = ?",
    args: [postId],
  });
  return { liked, likes: Number(count.rows[0]?.n ?? 0) };
}

export async function hasLiked(postId: number, visitorId: string): Promise<boolean> {
  if (!visitorId) return false;
  await ready();
  const res = await db.execute({
    sql: "SELECT 1 FROM post_likes WHERE post_id = ? AND visitor_id = ? LIMIT 1",
    args: [postId, visitorId],
  });
  return res.rows.length > 0;
}

/* ------------------------------------------------------------- aggregate -- */

/**
 * Comment and like totals for a set of posts, in one round trip each.
 *
 * These are deliberately not columns on `posts`: SQLite forbids subqueries in a
 * RETURNING clause, which every write in lib/posts.ts relies on.
 */
export async function engagementFor(postIds: number[]): Promise<Map<number, Engagement>> {
  const counts = new Map<number, Engagement>();
  if (postIds.length === 0) return counts;

  await ready();
  const ids = postIds.filter((id) => Number.isFinite(id));
  const placeholders = ids.map(() => "?").join(", ");
  const [comments, likes] = await db.batch(
    [
      {
        sql: `SELECT post_id, COUNT(*) AS n FROM comments
               WHERE hidden = 0 AND post_id IN (${placeholders}) GROUP BY post_id`,
        args: ids,
      },
      {
        sql: `SELECT post_id, COUNT(*) AS n FROM post_likes
               WHERE post_id IN (${placeholders}) GROUP BY post_id`,
        args: ids,
      },
    ],
    "read",
  );

  for (const id of ids) counts.set(id, { ...EMPTY_ENGAGEMENT });
  for (const row of comments.rows) {
    const entry = counts.get(Number(row.post_id));
    if (entry) entry.comments = Number(row.n ?? 0);
  }
  for (const row of likes.rows) {
    const entry = counts.get(Number(row.post_id));
    if (entry) entry.likes = Number(row.n ?? 0);
  }
  return counts;
}

/** The totals for a single post. */
export async function engagementOf(postId: number): Promise<Engagement> {
  const counts = await engagementFor([postId]);
  return counts.get(postId) ?? { ...EMPTY_ENGAGEMENT };
}
