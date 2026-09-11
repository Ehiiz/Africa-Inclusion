export default function Expertise() {
  return (
    <>
      <section className="section section--ink" id="expertise">
        <div className="shell">
          <header className="section-head reveal">
            <p className="eyebrow eyebrow--green">Our Expertise</p>
            <h2>Three pillars. One goal: more <br />trusted, <span className="hl-yellow">more inclusive finance.</span></h2>
          </header>

          <div className="expertise reveal">
            <article className="xcard">
              <div className="xcard__top">
                <span className="xcard__num xcard__num--green">01</span>
                <span className="ico-chip ico-chip--outline-green">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>
                </span>
              </div>
              <h3>Digital Financial Services</h3>
              <p className="xcard__desc">Optimizing the channels that connect people to finance.</p>
              <ul className="dot-list dot-list--green">
                <li>Mobile wallet architecture</li>
                <li>USSD journeys</li>
                <li>Digital onboarding</li>
                <li>Transaction flows</li>
                <li>Agent banking</li>
                <li>Liquidity management</li>
              </ul>
              <a className="link link--green" href="#contact">Explore DFS <span className="ico-arrow" aria-hidden="true">&#8594;</span></a>
            </article>

            <article className="xcard">
              <div className="xcard__top">
                <span className="xcard__num xcard__num--yellow">02</span>
                <span className="ico-chip ico-chip--outline-yellow">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6c0 4.6-3.2 7.7-8 9.2C7.2 19.7 4 16.6 4 12V6z"/><path d="m9.2 12.2 2 2 3.6-4"/></svg>
                </span>
              </div>
              <h3>Institutional Trust &amp; <br />Consumer Protection</h3>
              <p className="xcard__desc">Designing confidence into every financial interaction.</p>
              <ul className="dot-list dot-list--yellow">
                <li>Consumer protection workflows</li>
                <li>Transparent fee structures</li>
                <li>e-KYC experiences</li>
                <li>Dispute resolution</li>
                <li>Data privacy</li>
                <li>Friction mapping</li>
              </ul>
              <a className="link link--yellow" href="#contact">Build Greater Trust <span className="ico-arrow" aria-hidden="true">&#8594;</span></a>
            </article>

            <article className="xcard">
              <div className="xcard__top">
                <span className="xcard__num xcard__num--red">03</span>
                <span className="ico-chip ico-chip--outline-red">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4"/><path d="M12 2.8c2.4 2.6 3.6 5.7 3.6 9.2s-1.2 6.6-3.6 9.2c-2.4-2.6-3.6-5.7-3.6-9.2S9.6 5.4 12 2.8Z"/></svg>
                </span>
              </div>
              <h3>Financial Inclusion &amp; Public <br />Sector Strategy</h3>
              <p className="xcard__desc">Building financial infrastructure that reaches further.</p>
              <ul className="dot-list dot-list--red">
                <li>G2P digital distribution</li>
                <li>Social cash transfers</li>
                <li>Micro-savings &amp; insurance</li>
                <li>Alternative credit scoring</li>
                <li>Inclusion policy</li>
                <li>Distribution strategy</li>
              </ul>
              <a className="link link--red" href="#contact">Explore Inclusion Strategy <span className="ico-arrow" aria-hidden="true">&#8594;</span></a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
