import Link from "next/link";
import { formatCommentDate, listAllComments } from "@/lib/engagement";
import { deleteCommentAction, setCommentHiddenAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  const comments = await listAllComments();
  const hidden = comments.filter((c) => c.hidden).length;

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <h1>Comments</h1>
          <p className="admin-head__meta">
            {comments.length} total &middot; {comments.length - hidden} visible &middot; {hidden}{" "}
            hidden
          </p>
        </div>
      </header>

      {deleted && <p className="admin-flash">Comment deleted.</p>}

      {comments.length === 0 ? (
        <div className="admin-card admin-empty">
          <h2>No comments yet</h2>
          <p>
            Readers can comment on any published insight without an account. Anything they
            leave shows up here, where you can hide or delete it.
          </p>
        </div>
      ) : (
        <ul className="admin-comments">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className={`admin-card admin-comment${comment.hidden ? " is-hidden" : ""}`}
            >
              <div className="admin-comment__head">
                <div>
                  <p className="admin-comment__author">
                    {comment.author}
                    {comment.hidden && <span className="admin-pill admin-pill--draft">Hidden</span>}
                  </p>
                  <p className="admin-comment__meta">
                    <a href={`mailto:${comment.email}`}>{comment.email}</a> &middot;{" "}
                    {formatCommentDate(comment.createdAt)}
                  </p>
                </div>
                <p className="admin-comment__post">
                  on{" "}
                  {comment.postSlug ? (
                    <Link href={`/insights/${comment.postSlug}#comments`} target="_blank" rel="noopener noreferrer">
                      {comment.postTitle}
                    </Link>
                  ) : (
                    <span className="admin-muted">{comment.postTitle}</span>
                  )}
                </p>
              </div>

              <p className="admin-comment__text">{comment.body}</p>

              <div className="admin-comment__actions">
                <form action={setCommentHiddenAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="slug" value={comment.postSlug} />
                  <input type="hidden" name="hidden" value={comment.hidden ? "0" : "1"} />
                  <button type="submit" className="admin-linkbtn">
                    {comment.hidden ? "Show on the site" : "Hide"}
                  </button>
                </form>
                <form action={deleteCommentAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="slug" value={comment.postSlug} />
                  <button type="submit" className="admin-danger">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
