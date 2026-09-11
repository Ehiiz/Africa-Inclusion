import Link from "next/link";
import { formatMonth, listAll } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  const posts = await listAll();
  const published = posts.filter((p) => p.published).length;

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <h1>Posts</h1>
          <p className="admin-head__meta">
            {posts.length} total &middot; {published} published &middot;{" "}
            {posts.length - published} draft
          </p>
        </div>
        <Link className="btn btn--green" href="/admin/posts/new">
          New post{" "}
          <span className="ico-arrow" aria-hidden="true">
            &#8594;
          </span>
        </Link>
      </header>

      {deleted && <p className="admin-flash">Post deleted.</p>}

      {posts.length === 0 ? (
        <div className="admin-card admin-empty">
          <h2>No posts yet</h2>
          <p>
            Write the first insight and it will appear on the landing page and the Insights
            index as soon as you publish it.
          </p>
          <Link className="btn btn--green" href="/admin/posts/new">
            Write the first post
          </Link>
        </div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Read</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link className="admin-table__title" href={`/admin/posts/${post.id}`}>
                      {post.title}
                    </Link>
                    {post.featured && <span className="admin-pill admin-pill--featured">Featured</span>}
                    <span className="admin-table__slug">/insights/{post.slug}</span>
                  </td>
                  <td>{post.category || <span className="admin-muted">—</span>}</td>
                  <td>
                    <span
                      className={`admin-pill ${
                        post.published ? "admin-pill--live" : "admin-pill--draft"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post.published ? formatMonth(post.publishedAt) : <span className="admin-muted">—</span>}</td>
                  <td>{post.readMinutes} min</td>
                  <td className="admin-table__actions">
                    <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                    {post.published && (
                      <Link href={`/insights/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
