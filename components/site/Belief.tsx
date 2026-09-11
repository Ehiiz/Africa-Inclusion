export default function Belief() {
  return (
    <>
      <section className="section section--ink belief">
        <div className="shell">
          <p className="eyebrow eyebrow--dots reveal">
            <span className="dots" aria-hidden="true"><i></i><i></i><i></i></span>
            The Afri Inclusion Belief
          </p>
          <h2 className="belief__headline reveal">
            Financial inclusion isn't just about giving people access. It's about
            giving them a reason to <span className="hl-green">trust</span>, <span className="hl-yellow">use</span>{" "}
            and <span className="hl-red">return.</span>
          </h2>
          <p className="belief__body reveal">
            Afri Inclusion Advisory works at the intersection of digital finance, institutional trust, consumer
            protection and human behavior to make that possible.
          </p>
          <div className="btn-row reveal">
            <a className="btn btn--green" href="#contact">Let's Build Better Finance <span className="ico-arrow" aria-hidden="true">&#8594;</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
