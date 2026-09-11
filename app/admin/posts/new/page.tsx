import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <Link className="admin-back" href="/admin">
            <span aria-hidden="true">&#8592;</span> Posts
          </Link>
          <h1>New post</h1>
        </div>
      </header>
      <PostForm />
    </div>
  );
}
