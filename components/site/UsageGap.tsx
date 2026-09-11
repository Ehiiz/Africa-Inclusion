export default function UsageGap() {
  return (
    <>
      <section className="section">
        <div className="shell">
          <header className="section-head reveal">
            <p className="eyebrow eyebrow--amber">The Usage Gap</p>
            <h2>From account opened to account <br />active.</h2>
            <p className="section-head__lede">
              We examine the entire journey &mdash; not just the onboarding screen &mdash; and translate friction into
              practical changes across product, operations, technology and policy.
            </p>
          </header>

          <ol className="journey reveal">
            <li>
              <span className="journey__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.6" cy="10.6" r="6.6"/><path d="m15.5 15.5 4.5 4.5"/></svg></span>
              <span className="journey__num">01</span>
              <h3>Discover</h3>
              <p>Can the customer understand the value?</p>
            </li>
            <li>
              <span className="journey__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9.5" cy="8" r="3.4"/><path d="M3 20c0-3.4 2.9-5.7 6.5-5.7"/><path d="M17.5 13v6M14.5 16h6"/></svg></span>
              <span className="journey__num">02</span>
              <h3>Onboard</h3>
              <p>Can they successfully register?</p>
            </li>
            <li>
              <span className="journey__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6c0 4.6-3.2 7.7-8 9.2C7.2 19.7 4 16.6 4 12V6z"/></svg></span>
              <span className="journey__num">03</span>
              <h3>Trust</h3>
              <p>Do they feel safe using the service?</p>
            </li>
            <li>
              <span className="journey__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h13l-3-3"/><path d="M20 15.5H7l3 3"/></svg></span>
              <span className="journey__num">04</span>
              <h3>Transact</h3>
              <p>Can they complete a first transaction?</p>
            </li>
            <li>
              <span className="journey__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h12.5a3.5 3.5 0 0 1 0 7H9"/><path d="m7.5 5.5-3.5 4 3.5 4"/></svg></span>
              <span className="journey__num">05</span>
              <h3>Return</h3>
              <p>Is there enough value to come back?</p>
            </li>
            <li>
              <span className="journey__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 17.5 5.5-6 4 3.5 7.5-8"/><path d="M15.5 7h5v5"/></svg></span>
              <span className="journey__num">06</span>
              <h3>Grow</h3>
              <p>Can it become meaningful participation?</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
