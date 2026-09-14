import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ClosingCta from "@/components/site/ClosingCta";
import Reveal from "@/components/site/Reveal";
import CoreValues from "@/components/about/CoreValues";

export const metadata: Metadata = {
  title: "About",
  description:
    "Afri Inclusion Advisory is a boutique advisory firm turning digital access into active, " +
    "trusted financial usage across emerging African markets.",
};

export default function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main">
        <section className="page-head">
          <div className="shell">
            <p className="eyebrow eyebrow--on-green">About Us</p>
            <h1>
              Digital Financial Services &amp; <br />
              Financial Inclusion Advisory.
            </h1>
            <p className="page-head__lede">Building trusted digital finance for Africa.</p>
          </div>
        </section>

        {/* ------------------------------------------------------- history -- */}
        <section className="section section--mist">
          <div className="shell">
            <header className="section-head reveal">
              <p className="eyebrow eyebrow--green">Our History</p>
              <h2>
                Built to solve what comes <br />
                after the account is opened.
              </h2>
            </header>

            <div className="about-history reveal">
              <div className="about-history__media">
                <figure>
                  <Image
                    src="/assets/img/challenge-branch.jpg"
                    alt="Customers being served in a modern bank branch"
                    width={580}
                    height={340}
                  />
                </figure>
                <div className="stat-card stat-card--inline">
                  <p className="stat-card__label">The paradox we exist for</p>
                  <p className="stat-card__value">62%</p>
                  <p className="stat-card__note">of newly opened accounts go inactive</p>
                </div>
              </div>

              <div className="about-history__copy prose">
                <p>
                  Afri Inclusion Advisory (AIA) was established to confront one of the most
                  critical paradoxes in emerging African markets: while digital transformation
                  has enabled millions of citizens to open bank accounts and digital wallets,
                  over <strong>62% of newly opened accounts</strong> quickly go inactive or
                  dormant.
                </p>
                <p>
                  Traditional financial strategy has long focused on top-of-funnel account
                  acquisition. AIA was built to solve what comes next.
                </p>
                <p>
                  Born out of senior commercial banking expertise, empirical market research
                  across African financial corridors, and global digital finance frameworks, AIA
                  was founded to bridge the critical gap between digital infrastructure
                  deployment and active daily usage. We recognized that account dormancy is
                  rarely just an onboarding issue; it is a complex ecosystem challenge rooted in
                  technical friction, lack of transparent consumer protection, fragile
                  institutional trust, and misaligned product design for the formal commercial
                  sector and low-literacy or informal-market users.
                </p>
                <p>
                  Today, AIA serves as a specialized boutique advisory firm partnering with
                  commercial banks, microfinance institutions, fintechs, central banks, and
                  development finance organizations to turn cold digital access into active,
                  trusted, and inclusive financial ecosystems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- philosophy -- */}
        <section className="section">
          <div className="shell">
            <header className="section-head reveal">
              <p className="eyebrow eyebrow--green">Corporate Philosophy</p>
              <h2>
                Where we are going, <br />
                and how we get there.
              </h2>
            </header>

            {/* The same solid brand-colour cards as Why Afri Inclusion. */}
            <div className="pillars pillars--two reveal">
              <article className="pillar pillar--green pillar--statement">
                <div className="pillar__top">
                  <span className="pillar__num">01</span>
                  <span className="ico-chip ico-chip--solid">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M1.9 12S5.8 5.4 12 5.4 22.1 12 22.1 12 18.2 18.6 12 18.6 1.9 12 1.9 12Z" />
                      <circle cx="12" cy="12" r="3.1" />
                    </svg>
                  </span>
                </div>
                <p className="pillar__kicker">Vision</p>
                <h3>
                  To build an empowered Africa where digital finance is trusted, active, and
                  inclusive for everyone.
                </h3>
              </article>

              <article className="pillar pillar--yellow pillar--statement">
                <div className="pillar__top">
                  <span className="pillar__num">02</span>
                  <span className="ico-chip ico-chip--solid">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21c0-5 3-6.5 3-10a3 3 0 0 0-6 0c0 3.5 3 5 3 10Z" />
                      <path d="M4.5 6.5 8 8M19.5 6.5 16 8M5 14l3-.6M19 14l-3-.6" />
                    </svg>
                  </span>
                </div>
                <p className="pillar__kicker">Mission</p>
                <h3>
                  To help institutions eliminate friction, build trust and turn digital
                  financial access into active everyday usage.
                </h3>
              </article>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- core values -- */}
        {/* Owns its own section: the ground is what changes per value. */}
        <CoreValues />

        <ClosingCta />
      </main>

      <SiteFooter />
      <Reveal />
    </>
  );
}
