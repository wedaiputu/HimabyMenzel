import SuiteGallery from "../data/SuiteGallery";
import { suites, suiteCountWord, wa } from "../data/site";

export default function SuitesDetailSection() {
  return (
    <section
      className="suites-detail"
      id="suites-detail"
      aria-label="Reserve a suite"
    >
      <div className="section-header">
        <div>
          <div className="eyebrow-num">
            <span className="num">—</span> Stay With Us
          </div>
          <h2>Reserve a suite</h2>
        </div>
        <p>
          {suiteCountWord} quiet rooms above the restaurant. Every stay
          includes breakfast downstairs.
        </p>
      </div>

      <div className="suite-grid">
        {suites.map((s) => (
          <article className="menu-card" key={s.name}>
            <SuiteGallery
              images={s.images}
              variant={s.variant}
              alt={s.name}
            />
            <div className="suite-content">
              <div className="menu-category">{s.sleeps}</div>
              <div className="menu-name serif">{s.name}</div>
              <p className="suite-blurb">{s.blurb}</p>
              <ul className="suite-features">
                {s.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="suite-foot">
                <div className="menu-price">
                  <strong>{s.price}</strong> per night
                </div>
                <a
                  className="pill-btn pill-btn--outline"
                  href={wa(
                    `Hello, I would like to book the ${s.name}. Is it available?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}