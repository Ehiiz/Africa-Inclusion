import Image from "next/image";

export default function Challenge() {
  return (
    <>
      <section className="section section--blush" id="about">
        <div className="shell">
          <p className="eyebrow eyebrow--red reveal">The Challenge</p>
          <div className="challenge reveal">
            <figure className="challenge__media">
              <Image src="/assets/img/challenge-branch.jpg" alt="Customers being served in a modern bank branch" width={580} height={340} />
            </figure>
            <div className="challenge__copy">
              <h2>Opening an account is only the beginning.</h2>
              <p>
                Across emerging African markets, institutions are opening millions of digital
                accounts &mdash; yet many never become active. <span className="hl-red">Dormancy</span> isn't simply an
                acquisition problem. It's a trust, experience, infrastructure and accessibility
                problem.
              </p>
              <blockquote>
                We move financial inclusion beyond access &mdash; toward meaningful, sustained usage.
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
