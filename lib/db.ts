import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * libSQL is SQLite — same engine, same SQL. Locally it reads and writes a plain
 * .db file; on Vercel (read-only filesystem) point DATABASE_URL at a Turso
 * database and nothing else changes.
 */
function createDbClient(): Client {
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    return createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || undefined,
    });
  }

  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL is not set. Vercel's filesystem is read-only, so the local " +
        "SQLite file cannot be used in production — point DATABASE_URL at a Turso " +
        "database (see .env.example).",
    );
  }

  const file = join(process.cwd(), "data", "afri.db");
  mkdirSync(dirname(file), { recursive: true });
  return createClient({ url: `file:${file}` });
}

// Reuse one client across hot reloads in dev, and across warm invocations in prod.
const globalForDb = globalThis as unknown as { __afriDb?: Client; __afriDbReady?: Promise<void> };

export const db: Client = globalForDb.__afriDb ?? createDbClient();
if (process.env.NODE_ENV !== "production") globalForDb.__afriDb = db;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  title        TEXT    NOT NULL,
  excerpt      TEXT    NOT NULL DEFAULT '',
  body         TEXT    NOT NULL DEFAULT '',
  category     TEXT    NOT NULL DEFAULT '',
  read_minutes INTEGER NOT NULL DEFAULT 5,
  featured     INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published, published_at DESC);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id    INTEGER NOT NULL,
  author     TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  body       TEXT    NOT NULL,
  hidden     INTEGER NOT NULL DEFAULT 0,
  visitor_id TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS comments_post_idx ON comments (post_id, hidden, created_at);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id    INTEGER NOT NULL,
  visitor_id TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (post_id, visitor_id)
);
`;

/**
 * Columns added after the first release. `ALTER TABLE ... ADD COLUMN` is not
 * idempotent in SQLite, so each one is checked against the table first.
 */
const ADDED_COLUMNS: Array<[column: string, definition: string]> = [
  ["image_data", "BLOB"],
  ["image_type", "TEXT"],
  ["image_alt", "TEXT NOT NULL DEFAULT ''"],
];

async function migrate(): Promise<void> {
  const info = await db.execute("PRAGMA table_info(posts)");
  const existing = new Set(info.rows.map((row) => String(row.name)));
  for (const [column, definition] of ADDED_COLUMNS) {
    if (existing.has(column)) continue;
    await db.execute(`ALTER TABLE posts ADD COLUMN ${column} ${definition}`);
  }
}

/**
 * Idempotent schema creation, run once per process before the first query.
 */
export function ready(): Promise<void> {
  globalForDb.__afriDbReady ??= db
    .executeMultiple(SCHEMA)
    .then(migrate)
    .catch((error) => {
      // Don't cache a rejection — a transient connection failure would
      // otherwise poison every later request in this process.
      globalForDb.__afriDbReady = undefined;
      throw error;
    });
  return globalForDb.__afriDbReady;
}
