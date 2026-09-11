export default function Research() {
  return (
    <>
      <section className="section">
        <div className="shell">
          <header className="section-head reveal">
            <p className="eyebrow eyebrow--red">Why Afri Inclusion</p>
            <h2>Expertise backed by research. <br />Designed for real-world markets.</h2>
          </header>

          <div className="split reveal">
            <div className="split__pane split__pane--light">
              <p className="eyebrow eyebrow--green eyebrow--sm">Digital Finance Mastery</p>
              <h3>Certified digital finance expertise</h3>
              <p className="split__body">
                Our work is grounded in professional training, including <strong>Certified Expert
                in Digital Finance (CEDF)</strong> credentials from the Frankfurt School of
                Finance &amp; Management.
              </p>
              <ul className="dot-list dot-list--green dot-list--two-col">
                <li>Digital payment rails</li>
                <li>Agent networks</li>
                <li>Interoperability</li>
                <li>Digital channels</li>
                <li>Financial ecosystems</li>
              </ul>
            </div>

            <div className="split__pane split__pane--ink">
              <p className="eyebrow eyebrow--amber eyebrow--sm">Empirical Market Insight</p>
              <h3>Understanding why people drop off</h3>
              <p className="split__ask">Instead of asking:</p>
              <p className="split__struck">&ldquo;Why aren't customers using the product?&rdquo;</p>
              <p className="split__reframe">
                We ask: what is stopping them from <span className="hl-green">trusting</span>,
                <span className="hl-yellow">understanding</span>, accessing or repeatedly <span className="hl-green">using</span> it?
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
