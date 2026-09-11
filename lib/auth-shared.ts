/**
 * Session primitives with no Node-only or server-only imports, so the same code
 * runs in Server Components, Server Actions and Edge middleware.
 */

export const SESSION_COOKIE = "afri_admin";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function secret(): string {
  const value = process.env.AUTH_SECRET?.trim();
  if (!value) {
    throw new Error("AUTH_SECRET is not set — generate one with `openssl rand -base64 32`.");
  }
  return value;
}

function toBase64Url(mac: ArrayBuffer): string {
  const bytes = new Uint8Array(mac);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** HMAC-SHA256 via Web Crypto — available in Node 20 and on the Edge runtime. */
async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

/** Constant-time comparison, so a wrong value leaks nothing through timing. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Token is `<expiry-ms>.<hmac>` — self-contained, no server-side session store. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${await sign(expiresAt)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiresAt, mac] = token.split(".");
  if (!expiresAt || !mac) return false;
  if (!timingSafeEqual(mac, await sign(expiresAt))) return false;
  return Number(expiresAt) > Date.now();
}
