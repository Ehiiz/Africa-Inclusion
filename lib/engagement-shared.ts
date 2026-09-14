/**
 * Types and pure helpers for post engagement — comments and likes. Nothing here
 * touches the database, so a "use client" file can import it safely.
 *
 * Comments are open: a name and an email, no account. The email is stored for
 * the admin's benefit and is never rendered on the public page, so the public
 * `Comment` shape does not carry it at all.
 */

export type Comment = {
  id: number;
  postId: number;
  author: string;
  body: string;
  createdAt: string;
};

export type AdminComment = Comment & {
  email: string;
  hidden: boolean;
  postSlug: string;
  postTitle: string;
};

/** Comment and like totals for one post. */
export type Engagement = {
  comments: number;
  likes: number;
};

export const EMPTY_ENGAGEMENT: Engagement = { comments: 0, likes: 0 };

export const MAX_AUTHOR_LENGTH = 60;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_COMMENT_LENGTH = 2000;
export const MIN_COMMENT_LENGTH = 2;

/** Seconds a visitor must wait between comments. A crude but effective brake. */
export const COMMENT_COOLDOWN_SECONDS = 30;

/** Cookie names. The visitor id backs likes and the cooldown; the other prefills the form. */
export const VISITOR_COOKIE = "afri_visitor";
export const COMMENTER_COOKIE = "afri_commenter";

// Deliberately loose — the point is to catch typos, not to police the RFC.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export type CommentDraft = { author: string; email: string; body: string };

/**
 * Validate a comment draft. Returns the cleaned values, or the first problem
 * worth telling the reader about.
 */
export function validateComment(
  draft: CommentDraft,
): { ok: true; value: CommentDraft } | { ok: false; error: string } {
  const author = draft.author.trim().replace(/\s+/g, " ");
  const email = draft.email.trim().toLowerCase();
  const body = draft.body.trim();

  if (author.length < 2) return { ok: false, error: "Please give a name to post under." };
  if (author.length > MAX_AUTHOR_LENGTH) {
    return { ok: false, error: `That name is longer than ${MAX_AUTHOR_LENGTH} characters.` };
  }
  if (!EMAIL_RE.test(email) || email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "That email address does not look right." };
  }
  if (body.length < MIN_COMMENT_LENGTH) return { ok: false, error: "Write a comment first." };
  if (body.length > MAX_COMMENT_LENGTH) {
    return { ok: false, error: `Comments are limited to ${MAX_COMMENT_LENGTH} characters.` };
  }

  return { ok: true, value: { author, email, body } };
}

/** The letter shown in a commenter's avatar circle. */
export function initialOf(author: string): string {
  return author.trim().charAt(0).toUpperCase() || "?";
}

/** "12 February 2026 at 14:30" — the byline under a comment. */
export function formatCommentDate(iso: string): string {
  // Rows written by the app carry a full ISO string; SQLite's own
  // datetime('now') default is UTC in "YYYY-MM-DD HH:MM:SS" form. Normalise
  // both to something Date parses the same way everywhere.
  const norm = iso.replace(" ", "T");
  const d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(norm) ? norm : `${norm}Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "1 like" / "12 likes" — and the same for comments. */
export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
