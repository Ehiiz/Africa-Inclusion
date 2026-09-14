import CommentForm from "./CommentForm";
import {
  formatCommentDate,
  initialOf,
  plural,
  type Comment,
} from "@/lib/engagement-shared";

/**
 * The comment thread. Rendered on the server so the stored email never reaches
 * the browser — the public `Comment` shape does not carry it, and bodies are
 * plain text that React escapes.
 */
export default function Comments({
  postId,
  slug,
  comments,
  author,
  email,
}: {
  postId: number;
  slug: string;
  comments: Comment[];
  author: string;
  email: string;
}) {
  return (
    <section className="section section--mist" id="comments">
      <div className="shell">
        <header className="section-head section-head--tight">
          <p className="eyebrow eyebrow--green">Discussion</p>
          <h2>
            {comments.length === 0
              ? "Start the conversation."
              : plural(comments.length, "comment") + "."}
          </h2>
        </header>

        {comments.length > 0 && (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <span className="comment__avatar" aria-hidden="true">
                  {initialOf(comment.author)}
                </span>
                <div className="comment__body">
                  <p className="comment__byline">
                    <strong>{comment.author}</strong>
                    <span>{formatCommentDate(comment.createdAt)}</span>
                  </p>
                  <p className="comment__text">{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="comment-compose">
          <h3 className="comment-compose__title">Leave a comment</h3>
          <p className="comment-compose__note">
            No account needed — a name and an email is enough.
          </p>
          <CommentForm postId={postId} slug={slug} author={author} email={email} />
        </div>
      </div>
    </section>
  );
}
