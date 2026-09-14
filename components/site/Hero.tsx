import Image from "next/image";

export default function Hero() {
  return (
    <>
      <section className="hero">
        <div className="shell">
          <div className="hero__grid">
            <div className="hero__copy reveal">
              <p className="eyebrow eyebrow--yellow">Digital Financial Services &middot; Trust &middot; Inclusion</p>
              <h1>Building trusted <br />digital finance <br />for <em>Africa.</em></h1>
              <p className="hero__lede">
                We help financial institutions, fintechs, governments and development
                organizations turn digital infrastructure into active, trusted, everyday
                financial services &mdash; moving people from <strong>being registered</strong> to <strong>being
                financially active.</strong>
              </p>
              <div className="btn-row">
                <a className="btn btn--white" href="#contact">Start a Conversation <span className="ico-arrow" aria-hidden="true">&#8594;</span></a>
                <a className="btn btn--ghost-light" href="#expertise">Explore Our Expertise <span aria-hidden="true">&#8595;</span></a>
              </div>
            </div>

            <div className="hero__media reveal">
              <figure className="hero__photo">
                <Image src="/assets/img/hero-merchant.jpg" alt="A market trader in Northern Nigeria using a mobile phone at her stall" width={497} height={622} priority />
              </figure>
              <div className="stat-card">
                <p className="stat-card__label">Dormancy today</p>
                <p className="stat-card__value">62%</p>
                <p className="stat-card__note">of new accounts go inactive</p>
              </div>
            </div>
          </div>

          <ul className="hero__pillars reveal">
            <li>
              <span className="ico-chip ico-chip--pillar ico-chip--pillar-green">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>
              </span>
              <span className="hero__pillar-label">Digital Financial Services</span>
              <p>Designing channels people actually use.</p>
            </li>
            <li>
              <span className="ico-chip ico-chip--pillar ico-chip--pillar-gold">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6c0 4.6-3.2 7.7-8 9.2C7.2 19.7 4 16.6 4 12V6z"/><path d="m9.2 12.2 2 2 3.6-4"/></svg>
              </span>
              <span className="hero__pillar-label">Institutional Trust &amp; Consumer Protection</span>
              <p>Building confidence into every interaction.</p>
            </li>
            <li>
              <span className="ico-chip ico-chip--pillar ico-chip--pillar-red">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M17 6.2a3 3 0 0 1 0 5.6"/><path d="M18.4 14.9c1.8.8 2.8 2.4 2.8 5.1"/></svg>
              </span>
              <span className="hero__pillar-label">Financial Inclusion</span>
              <p>Connecting underserved communities to opportunity.</p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
