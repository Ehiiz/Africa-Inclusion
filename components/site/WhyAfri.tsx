export default function WhyAfri() {
  return (
    <>
      <section className="section">
        <div className="shell">
          <header className="section-head reveal">
            <p className="eyebrow eyebrow--green">Why Afri</p>
            <h2>Designing finance around the <br />people it is meant to serve.</h2>
            <p className="section-head__lede">
              Afri Inclusion Advisory was established to address a persistent challenge: high account-opening
              numbers, but high rates of dormancy. We connect <strong>technology, trust, policy and human behavior</strong>
              to build financial systems that work beyond the first transaction.
            </p>
          </header>

          <div className="pillars reveal">
            <article className="pillar pillar--green">
              <div className="pillar__top">
                <span className="pillar__num">01</span>
                <span className="ico-chip ico-chip--solid">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3.5h4.5A1.5 1.5 0 0 1 20 5v14a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 8.5 14 12l-4 3.5"/><path d="M14 12H4"/></svg>
                </span>
              </div>
              <p className="pillar__kicker">Access</p>
              <h3>From access to opportunity.</h3>
              <p className="pillar__body">Designing digital channels that work for unbanked, underbanked, rural and informal-market users.</p>
            </article>

            <article className="pillar pillar--yellow">
              <div className="pillar__top">
                <span className="pillar__num">02</span>
                <span className="ico-chip ico-chip--solid">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6c0 4.6-3.2 7.7-8 9.2C7.2 19.7 4 16.6 4 12V6z"/><path d="m9.2 12.2 2 2 3.6-4"/></svg>
                </span>
              </div>
              <p className="pillar__kicker">Trust</p>
              <h3>Trust is infrastructure.</h3>
              <p className="pillar__body">Embedding transparency, consumer protection, privacy and dispute resolution into every experience.</p>
            </article>

            <article className="pillar pillar--red">
              <div className="pillar__top">
                <span className="pillar__num">03</span>
                <span className="ico-chip ico-chip--solid">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h13l-3-3"/><path d="M20 15.5H7l3 3"/></svg>
                </span>
              </div>
              <p className="pillar__kicker">Usage</p>
              <h3>Turning registration into activity.</h3>
              <p className="pillar__body">Reducing the friction that causes customers to abandon services after onboarding.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
