import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { deletePostAction } from "@/app/admin/actions";
import { getById } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string }>;
}) {
  const { id } = await params;
  const { saved, created } = await searchParams;

  const post = await getById(Number(id));
  if (!post) notFound();

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <Link className="admin-back" href="/admin">
            <span aria-hidden="true">&#8592;</span> Posts
          </Link>
          <h1>Edit post</h1>
          <p className="admin-head__meta">
            {post.published ? (
              <>
                Live at{" "}
                <Link href={`/insights/${post.slug}`} target="_blank" rel="noopener noreferrer">
                  /insights/{post.slug}
                </Link>
              </>
            ) : (
              "Draft — not visible on the site."
            )}
          </p>
        </div>
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <button className="admin-danger" type="submit">
            Delete
          </button>
        </form>
      </header>

      {created && <p className="admin-flash">Post created.</p>}
      {saved && <p className="admin-flash">Changes saved.</p>}

      <PostForm post={post} />
    </div>
  );
}
