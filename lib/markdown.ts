import { marked } from "marked";

/**
 * Post bodies are Markdown. Only the authenticated admin can write them, but
 * raw HTML is still disabled so a pasted snippet cannot inject script tags.
 */
marked.setOptions({ gfm: true, breaks: false });

const ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function renderMarkdown(source: string): string {
  const escaped = source.replace(/[&<>"']/g, (c) => ESCAPE[c]);
  return marked.parse(escaped, { async: false });
}

/** First paragraph of a body, trimmed to `max` characters. For excerpt defaults. */
export function firstParagraph(source: string, max = 200): string {
  const text = source
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/[*_`>#-]/g, "")
    .trim()
    .split(/\n\s*\n/)[0]
    ?.replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + "…";
}
