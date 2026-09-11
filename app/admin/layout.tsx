import type { Metadata } from "next";
import Link from "next/link";
import { isSignedIn } from "@/lib/auth";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already redirects anonymous traffic; this is the second check,
  // so a middleware misconfiguration cannot expose the admin shell.
  const signedIn = await isSignedIn();

  return (
    <div className="admin">
      {signedIn && (
        <header className="admin__bar">
          <div className="admin__bar-inner">
            <Link className="admin__brand" href="/admin">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              Afri Inclusion <span className="admin__brand-sub">Admin</span>
            </Link>
            <nav className="admin__nav">
              <Link href="/admin">Posts</Link>
              <Link href="/admin/posts/new">New post</Link>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                View site
              </Link>
              <form action={signOut}>
                <button type="submit" className="admin__signout">
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>
      )}
      <main className="admin__main">{children}</main>
    </div>
  );
}
