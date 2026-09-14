import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { formatLongDate, getBySlug, imageUrl, listPublished } from "@/lib/posts";
import { firstParagraph, renderMarkdown } from "@/lib/markdown";
import { engagementOf, hasLiked, listComments, plural } from "@/lib/engagement";
import { readCommenter, readVisitorId } from "@/lib/visitor";
import Comments from "@/components/insights/Comments";
import LikeButton from "@/components/insights/LikeButton";
import ShareBar from "@/components/insights/ShareBar";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBySlug(slug);
  if (!post || !post.published) return { title: "Insight not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBySlug(slug);
  if (!post || !post.published) notFound();

  const visitorId = await readVisitorId();
  const [others, comments, counts, liked, commenter] = await Promise.all([
    listPublished(4).then((list) => list.filter((p) => p.id !== post.id).slice(0, 3)),
    listComments(post.id),
    engagementOf(post.id),
    hasLiked(post.id, visitorId),
    readCommenter(),
  ]);

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/insights/${post.slug}`;

  // An excerpt left blank is derived from the opening paragraph. Showing it as a
  // standfirst above that same paragraph would just repeat it.
  const showLede = Boolean(post.excerpt) && post.excerpt !== firstParagraph(post.body);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main">
        <article>
          <header className="page-head page-head--article">
            <div className="shell">
              <Link className="page-head__back" href="/insights">
                <span aria-hidden="true">&#8592;</span> All insights
              </Link>
              {post.category && <p className="eyebrow eyebrow--on-green">{post.category}</p>}
              <h1>{post.title}</h1>
              <p className="page-head__meta">
                {formatLongDate(post.publishedAt)} &middot; {post.readMinutes} min read &middot;{" "}
                <a className="page-head__jump" href="#comments">
                  {plural(comments.length, "comment")}
                </a>
              </p>
            </div>
          </header>

          {imageUrl(post) && (
            <div className="shell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="article-banner"
                src={imageUrl(post) as string}
                alt={post.imageAlt}
              />
            </div>
          )}

          <div className="section">
            <div className="shell">
              {showLede && <p className="prose-lede">{post.excerpt}</p>}
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
              />

              <div className="article-actions">
                <LikeButton postId={post.id} likes={counts.likes} liked={liked} />
                <ShareBar url={shareUrl} title={post.title} />
              </div>
            </div>
          </div>
        </article>

        <Comments
          postId={post.id}
          slug={post.slug}
          comments={comments}
          author={commenter.author}
          email={commenter.email}
        />

        {others.length > 0 && (
          <section className="section section--mist">
            <div className="shell">
              <header className="section-head">
                <p className="eyebrow eyebrow--green">Keep reading</p>
                <h2>More insights.</h2>
              </header>
              <ul className="post-index post-index--compact">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link href={`/insights/${other.slug}`}>
                      {imageUrl(other) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          className="post-index__thumb"
                          src={imageUrl(other) as string}
                          alt={other.imageAlt}
                        />
                      ) : (
                        <span className="post-index__thumb" aria-hidden="true" />
                      )}
                      <span className="post-index__body">
                        <span className="post-index__title">{other.title}</span>
                        <span className="post-index__meta">
                          {formatLongDate(other.publishedAt)} &middot; {other.readMinutes} min read
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
