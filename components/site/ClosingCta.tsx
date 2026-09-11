export default function ClosingCta() {
  return (
    <>
      <section className="section cta" id="contact">
        <div className="shell">
          <p className="eyebrow eyebrow--green reveal">Let's Work Together</p>
          <h2 className="cta__headline reveal">
            Building better digital finance starts <br />with <span className="hl-red">understanding the problem.</span>
          </h2>
          <div className="btn-row btn-row--center reveal">
            <a className="btn btn--green" href="mailto:info@afriinclusion.com?subject=Consultation%20request">Book a Consultation <span className="ico-arrow" aria-hidden="true">&#8594;</span></a>
            <a className="btn btn--ghost-dark" href="mailto:info@afriinclusion.com?subject=Inquiry">Send an Inquiry</a>
          </div>
        </div>
      </section>

    </>
  );
}
