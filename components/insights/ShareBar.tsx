"use client";

import { useEffect, useState, type ReactElement } from "react";

type Target = { key: string; label: string; href: (url: string, title: string) => string; icon: ReactElement };

const TARGETS: Target[] = [
  {
    key: "linkedin",
    label: "Share on LinkedIn",
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7.6 10.4v6.2M7.6 7.6v.1M11.6 16.6v-6.2M11.6 12.8c0-1.4 1-2.4 2.4-2.4s2.4 1 2.4 2.4v3.8" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "Share on X",
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h3.6l5 6.6L18 4h2l-6.5 7.7L20.4 20h-3.6l-5.3-7L5 20H3l7-8.2Z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Share on Facebook",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M15.2 8.2h-1.4c-.9 0-1.5.6-1.5 1.5v1.5m-1.6 0h4.4m-2.8 0V19" />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    label: "Share on WhatsApp",
    href: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.6 20.4 5 16.6A8 8 0 1 1 8 19.4Z" />
        <path d="M9 9.4c0 3 2.4 5.4 5.4 5.4l.8-1.4-1.8-.9-.9.8a4.6 4.6 0 0 1-2-2l.8-.9-.9-1.8Z" />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Share by email",
    href: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.8 7 8.2 6 8.2-6" />
      </svg>
    ),
  },
];

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [href, setHref] = useState(url);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Resolved on the client so a missing NEXT_PUBLIC_SITE_URL still shares the
  // page the reader is actually on. navigator.share is checked here too — doing
  // it during render would not match the server's HTML.
  useEffect(() => {
    setHref(new URL(url, window.location.href).toString());
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [url]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
    } catch {
      // Clipboard access can be refused (insecure origin, denied permission).
      // Selecting the address bar is the reader's fallback; say nothing.
      setCopied(false);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url: href });
    } catch {
      // An abandoned share sheet rejects. Nothing to report.
    }
  }

  return (
    <div className="share">
      <span className="share__label">Share</span>

      <ul className="share__list">
        {canNativeShare && (
          <li>
            <button type="button" className="share__btn" onClick={nativeShare} aria-label="Share this insight">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 15.5V4m0 0L8.4 7.6M12 4l3.6 3.6" />
                <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" />
              </svg>
            </button>
          </li>
        )}

        {TARGETS.map((target) => (
          <li key={target.key}>
            <a
              className="share__btn"
              href={target.href(href, title)}
              target={target.key === "email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={target.label}
            >
              {target.icon}
            </a>
          </li>
        ))}

        <li>
          <button
            type="button"
            className={`share__btn${copied ? " is-done" : ""}`}
            onClick={copy}
            aria-label={copied ? "Link copied" : "Copy link"}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12.6 4.2 4.2L19 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.5 13.5a3.6 3.6 0 0 0 5.2 0l2.4-2.4a3.7 3.7 0 0 0-5.2-5.2l-1 1" />
                <path d="M13.5 10.5a3.6 3.6 0 0 0-5.2 0l-2.4 2.4a3.7 3.7 0 0 0 5.2 5.2l1-1" />
              </svg>
            )}
          </button>
        </li>
      </ul>

      <span className="share__flash" role="status">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
