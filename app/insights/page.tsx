import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/site/Reveal";
import { formatMonth, imageUrl, listPublished } from "@/lib/posts";
import { engagementFor, plural, type Engagement } from "@/lib/engagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on trust, friction, dormancy and the future of financial inclusion across " +
    "emerging African markets.",
};

export default async function InsightsIndexPage() {
  const posts = await listPublished();
  const counts = await engagementFor(posts.map((post) => post.id));

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main">
        <section className="page-head">
          <div className="shell">
            <p className="eyebrow eyebrow--on-green">Insights</p>
            <h1>
              Perspectives on the future of <br />
              financial inclusion.
            </h1>
            <p className="page-head__lede">
              Research, field notes and argument on why digital accounts go dormant &mdash; and
              what it takes to move people from registered to financially active.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            {posts.length === 0 ? (
              <p className="empty-note">
                No insights have been published yet. Check back shortly.
              </p>
            ) : (
              <ul className="post-index">
                {posts.map((post) => (
                  <li key={post.id} className="reveal">
                    <Link href={`/insights/${post.slug}`}>
                      {imageUrl(post) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          className="post-index__thumb"
                          src={imageUrl(post) as string}
                          alt={post.imageAlt}
                        />
                      ) : (
                        <span className="post-index__thumb" aria-hidden="true" />
                      )}
                      <span className="post-index__body">
                        {post.category && (
                          <span className="post-index__category">{post.category}</span>
                        )}
                        <span className="post-index__title">{post.title}</span>
                        {post.excerpt && (
                          <span className="post-index__excerpt">{post.excerpt}</span>
                        )}
                        <span className="post-index__meta">
                          {formatMonth(post.publishedAt)} &middot; {post.readMinutes} min read
                          <EngagementMeta engagement={counts.get(post.id)} />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
      <Reveal />
    </>
  );
}

/** "· 12 likes · 3 comments", once a post has either. */
function EngagementMeta({ engagement }: { engagement?: Engagement }) {
  if (!engagement || (engagement.likes === 0 && engagement.comments === 0)) return null;
  return (
    <>
      {" "}
      &middot; {plural(engagement.likes, "like")} &middot;{" "}
      {plural(engagement.comments, "comment")}
    </>
  );
}
