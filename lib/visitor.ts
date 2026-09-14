import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { COMMENTER_COOKIE, VISITOR_COOKIE } from "./engagement-shared";

const YEAR = 60 * 60 * 24 * 365;

/**
 * An opaque, random id in a cookie — the only thing tying a like or a comment
 * cooldown to a person. It holds no personal data and is never shown; clearing
 * cookies simply looks like a new reader.
 */
export async function readVisitorId(): Promise<string> {
  const jar = await cookies();
  return jar.get(VISITOR_COOKIE)?.value ?? "";
}

/**
 * The visitor id, minting one when this is the reader's first interaction.
 * Writes a cookie, so only a Server Action or Route Handler may call it.
 */
export async function ensureVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  jar.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: YEAR,
  });
  return id;
}

/** Name and email of the last comment from this browser, for prefilling the form. */
export async function readCommenter(): Promise<{ author: string; email: string }> {
  const jar = await cookies();
  const raw = jar.get(COMMENTER_COOKIE)?.value;
  if (!raw) return { author: "", email: "" };
  try {
    const parsed = JSON.parse(raw) as { author?: unknown; email?: unknown };
    return {
      author: typeof parsed.author === "string" ? parsed.author : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return { author: "", email: "" };
  }
}

/** Remember the commenter so a returning reader does not retype their details. */
export async function rememberCommenter(author: string, email: string): Promise<void> {
  const jar = await cookies();
  jar.set(COMMENTER_COOKIE, JSON.stringify({ author, email }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: YEAR,
  });
}
