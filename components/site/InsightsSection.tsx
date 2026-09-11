import Image from "next/image";
import Link from "next/link";
import { formatMonth, getFeatured, imageUrl, listPublished, type Post } from "@/lib/posts";

function FeaturedCard({ post }: { post: Post }) {
  const src = imageUrl(post);
  return (
    <article className="feature">
      {src ? (
        /* Served from the database, already sized by the uploader. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="feature__bg" src={src} alt={post.imageAlt} />
      ) : (
        <Image
          className="feature__bg"
          src="/assets/img/insight-featured.jpg"
          alt=""
          fill
          sizes="(max-width: 1080px) 100vw, 620px"
        />
      )}
      <div className="feature__body">
        <p className="feature__tag">Featured</p>
        <h3>{post.title}</h3>
        <p className="feature__desc">{post.excerpt}</p>
        <Link className="link link--green" href={`/insights/${post.slug}`}>
          Read the Insight{" "}
          <span className="ico-arrow" aria-hidden="true">
            &#8594;
          </span>
        </Link>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <article className="feature feature--empty">
      <div className="feature__body">
        <p className="feature__tag">Insights</p>
        <h3>No insights published yet.</h3>
        <p className="feature__desc">
          Perspectives on trust, friction and financial inclusion will appear here as they are
          published.
        </p>
      </div>
    </article>
  );
}

export default async function InsightsSection() {
  const featured = await getFeatured();
  // Four gives the featured card plus three for the list, even when the
  // featured post is also the most recent.
  const recent = await listPublished(4);
  const rest = recent.filter((p) => p.id !== featured?.id).slice(0, 3);

  return (
    <section className="section section--green" id="insights">
      <div className="shell">
        <header className="section-head section-head--on-green reveal">
          <p className="eyebrow eyebrow--on-green">Insights</p>
          <h2>
            Perspectives on the future of <br />
            financial inclusion.
          </h2>
        </header>

        <div className="insights reveal">
          {featured ? <FeaturedCard post={featured} /> : <EmptyState />}

          {rest.length > 0 && (
            <ul className="post-list">
              {rest.map((post) => (
                <li key={post.id}>
                  <Link href={`/insights/${post.slug}`}>
                    {imageUrl(post) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        className="post-list__thumb"
                        src={imageUrl(post) as string}
                        alt={post.imageAlt}
                      />
                    ) : (
                      <span className="post-list__thumb" aria-hidden="true" />
                    )}
                    <span className="post-list__text">
                      <span className="post-list__title">{post.title}</span>
                      <span className="post-list__meta">
                        {formatMonth(post.publishedAt)} &middot; {post.readMinutes} min
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {recent.length > 0 && (
          <div className="btn-row insights__more">
            <Link className="btn btn--white" href="/insights">
              All Insights{" "}
              <span className="ico-arrow" aria-hidden="true">
                &#8594;
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
