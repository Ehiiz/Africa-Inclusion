"use client";

import { useActionState, useEffect, useRef } from "react";
import { postCommentAction, type CommentState } from "@/app/insights/actions";
import {
  MAX_AUTHOR_LENGTH,
  MAX_COMMENT_LENGTH,
  MAX_EMAIL_LENGTH,
} from "@/lib/engagement-shared";

export default function CommentForm({
  postId,
  slug,
  author,
  email,
}: {
  postId: number;
  slug: string;
  /** Prefilled from the last comment this browser left, if any. */
  author: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    postCommentAction,
    { status: "idle" },
  );
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Clear only the comment itself on success — the name and email stay so a
  // reader can add a second thought without retyping who they are.
  useEffect(() => {
    if (state.status === "posted" && bodyRef.current) bodyRef.current.value = "";
  }, [state]);

  return (
    <form className="comment-form" action={formAction}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="slug" value={slug} />

      <label className="comment-field comment-field--wide">
        <span className="comment-field__label">Comment</span>
        <textarea
          ref={bodyRef}
          className="comment-input comment-textarea"
          name="body"
          rows={5}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="What does this look like in the markets you work in?"
          required
        />
      </label>

      <label className="comment-field">
        <span className="comment-field__label">Name</span>
        <input
          className="comment-input"
          name="author"
          defaultValue={author}
          maxLength={MAX_AUTHOR_LENGTH}
          autoComplete="name"
          placeholder="Amina Bello"
          required
        />
      </label>

      <label className="comment-field">
        <span className="comment-field__label">Email</span>
        <input
          className="comment-input"
          name="email"
          type="email"
          defaultValue={email}
          maxLength={MAX_EMAIL_LENGTH}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <span className="comment-field__hint">Never published, never shared.</span>
      </label>

      {/* Honeypot. Hidden from people; bots fill every field they find. */}
      <div className="comment-trap" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="comment-form__foot">
        <button className="btn btn--green" type="submit" disabled={pending}>
          {pending ? "Posting…" : "Post comment"}
        </button>

        {state.status === "error" && (
          <p className="comment-msg comment-msg--error" role="alert">
            {state.error}
          </p>
        )}
        {state.status === "posted" && (
          <p className="comment-msg comment-msg--ok" role="status">
            Thank you — your comment is live.
          </p>
        )}
      </div>
    </form>
  );
}
