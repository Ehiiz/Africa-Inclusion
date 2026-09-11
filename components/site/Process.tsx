export default function Process() {
  return (
    <>
      <section className="section section--yellow">
        <div className="shell">
          <header className="section-head reveal">
            <p className="eyebrow eyebrow--ink">How We Work</p>
            <h2>Diagnose the friction. Design the <br />solution. Drive adoption.</h2>
          </header>

          <ol className="process reveal">
            <li className="proc">
              <div className="proc__top">
                <span className="ico-chip ico-chip--tint-green"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="m15.2 8.8-2 4.4-4.4 2 2-4.4z"/></svg></span>
                <span className="proc__num">01</span>
              </div>
              <h3>Discover</h3>
              <p className="proc__sub">Understand the ecosystem.</p>
              <p className="proc__body">Customers, channels, products, operations, market conditions and institutional environment.</p>
            </li>
            <li className="proc">
              <div className="proc__top">
                <span className="ico-chip ico-chip--tint-green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 12.5h4L9 8l3.2 9L15 12.5h6.2"/></svg></span>
                <span className="proc__num">02</span>
              </div>
              <h3>Diagnose</h3>
              <p className="proc__sub">Find what's getting in the way.</p>
              <p className="proc__body">Behavioral, technical, operational and trust-related friction across the journey.</p>
            </li>
            <li className="proc">
              <div className="proc__top">
                <span className="ico-chip ico-chip--tint-green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3.5 20.5 7.5 8 20H4v-4z"/><path d="m14 6 4 4"/></svg></span>
                <span className="proc__num">03</span>
              </div>
              <h3>Design</h3>
              <p className="proc__sub">Turn insight into intervention.</p>
              <p className="proc__body">Practical recommendations across product, channels, operations and consumer protection.</p>
            </li>
            <li className="proc">
              <div className="proc__top">
                <span className="ico-chip ico-chip--tint-green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 3.5c3.5 0 7 3.5 7 7-3.5 4-7.5 7-11 8l-4-4c1-3.5 4-7.5 8-11z"/><path d="M5.5 14.5 3 21l6.5-2.5"/><circle cx="15" cy="9" r="1.6"/></svg></span>
                <span className="proc__num">04</span>
              </div>
              <h3>Activate</h3>
              <p className="proc__sub">Move from strategy to usage.</p>
              <p className="proc__body">Translate recommendations into systems designed to improve adoption and inclusion.</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
