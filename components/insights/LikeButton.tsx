"use client";

import { useState, useTransition } from "react";
import { toggleLikeAction } from "@/app/insights/actions";
import { plural } from "@/lib/engagement-shared";

/**
 * An anonymous like. The reader is identified only by an opaque cookie, so the
 * count is optimistic on click and settles on whatever the server returns.
 */
export default function LikeButton({
  postId,
  likes,
  liked,
}: {
  postId: number;
  likes: number;
  liked: boolean;
}) {
  const [state, setState] = useState({ likes, liked });
  const [pending, startTransition] = useTransition();

  function toggle() {
    const optimistic = { liked: !state.liked, likes: state.likes + (state.liked ? -1 : 1) };
    const previous = state;
    setState(optimistic);

    startTransition(async () => {
      const settled = await toggleLikeAction(postId);
      setState(settled ?? previous);
    });
  }

  return (
    <button
      type="button"
      className={`like-btn${state.liked ? " is-liked" : ""}`}
      onClick={toggle}
      disabled={pending}
      aria-pressed={state.liked}
      aria-label={state.liked ? "Remove your like" : "Like this insight"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.4 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13Z" />
      </svg>
      <span className="like-btn__count">{state.likes}</span>
      <span className="sr-only">{plural(state.likes, "like")}</span>
    </button>
  );
}
