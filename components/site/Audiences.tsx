import Image from "next/image";

export default function Audiences() {
  return (
    <>
      <section className="section section--mist" id="audiences">
        <div className="shell">
          <header className="section-head reveal">
            <p className="eyebrow eyebrow--green">Who We Work With</p>
            <h2>Built for institutions shaping Africa's <br />financial future.</h2>
          </header>

          <div className="audiences reveal">
            <article className="aud">
              <figure className="aud__media">
                <Image src="/assets/img/commercial-banks-mfis.jpg" alt="A shop owner behind her counter taking a digital payment" width={900} height={1100} />
              </figure>
              <div className="aud__body">
                <p className="aud__tag aud__tag--green">
                  <span className="ico-chip ico-chip--tint-green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9.5 12 4.5l8.5 5"/><path d="M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8"/><path d="M3.5 19.5h17"/></svg></span>
                  Commercial Banks &amp; MFIs
                </p>
                <h3>Reduce dormancy. Increase digital adoption. Mobilize deposits.</h3>
                <a className="link link--green" href="#contact"><span className="ico-arrow" aria-hidden="true">&#8594;</span> Improve Digital Adoption</a>
              </div>
            </article>

            <article className="aud">
              <figure className="aud__media">
                <Image src="/assets/img/fintechs-payment-providers.jpg" alt="Customers at a brightly lit retail payment point" width={900} height={1100} />
              </figure>
              <div className="aud__body">
                <p className="aud__tag aud__tag--amber">
                  <span className="ico-chip ico-chip--tint-amber"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2.5 5 13.5h6L10.5 21.5 19 10.5h-6z"/></svg></span>
                  Fintechs &amp; Payment Providers
                </p>
                <h3>Build trust. Reduce churn. Reach further.</h3>
                <a className="link link--amber" href="#contact"><span className="ico-arrow" aria-hidden="true">&#8594;</span> Strengthen Your Platform</a>
              </div>
            </article>

            <article className="aud">
              <figure className="aud__media">
                <Image src="/assets/img/regulators.jpg" alt="A trader smiling while using a mobile phone at her stall" width={900} height={1029} />
              </figure>
              <div className="aud__body">
                <p className="aud__tag aud__tag--red">
                  <span className="ico-chip ico-chip--tint-red"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M6 20h12"/><path d="M4 8h16"/><path d="M4 8 1.8 13.5h4.4zM20 8l-2.2 5.5h4.4z"/></svg></span>
                  Regulators
                </p>
                <h3>Turn evidence into better financial systems.</h3>
                <a className="link link--red" href="#contact"><span className="ico-arrow" aria-hidden="true">&#8594;</span> Develop Better Policy</a>
              </div>
            </article>

            <article className="aud">
              <figure className="aud__media">
                <Image src="/assets/img/development-finance-institutions.jpg" alt="A mother and child outside a rural home" width={900} height={1100} />
              </figure>
              <div className="aud__body">
                <p className="aud__tag aud__tag--green">
                  <span className="ico-chip ico-chip--tint-green"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4"/><path d="M12 2.8c2.4 2.6 3.6 5.7 3.6 9.2s-1.2 6.6-3.6 9.2c-2.4-2.6-3.6-5.7-3.6-9.2S9.6 5.4 12 2.8Z"/></svg></span>
                  Development Finance Institutions
                </p>
                <h3>Design infrastructure that delivers impact.</h3>
                <a className="link link--green" href="#contact"><span className="ico-arrow" aria-hidden="true">&#8594;</span> Create Greater Impact</a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
