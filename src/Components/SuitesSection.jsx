import Art from "../data/Art";
import { SUITE_STRIP_PHOTOS } from "../data/photos";

export default function SuitesSection({ scrollTo, suiteCountWord }) {
  return (
    <section
      className="suites-screen"
      id="suites"
      aria-label="Suites Experience"
    >
      <div className="suites-screen-head">
        <div className="eyebrow-num">
          <span className="num">03</span> / The Suites
        </div>
        <h2 className="serif" style={{ color: "#ffffff" }}>
          Stay above
          <br />
          the clouds.
        </h2>
        <p>
          {suiteCountWord} private suites surrounded by the quiet beauty of
          Kintamani.
        </p>
      </div>

      <div className="suite-strip">
        {SUITE_STRIP_PHOTOS.map((src, i) => (
          <div className="suite-strip-panel" key={src}>
            <Art
              src={src}
              alt={`Hima suite detail ${i + 1}`}
              variant={(i % 3) + 1}
            />
          </div>
        ))}
      </div>

      <div className="suites-screen-foot">
        <button
          className="pill-btn"
          onClick={() => scrollTo("/Suites")}
        >
          Book Now
        </button>
      </div>
    </section>
  );
}