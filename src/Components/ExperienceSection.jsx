import { EXPERIENCE_VIDEO, EXPERIENCE_VIDEO_POSTER } from "../data/photos";

export default function ExperienceSection() {
  return (
    <section
      className="screen screen-split"
      id="experience"
      aria-label="The Hima Experience"
    >
      <div className="screen-copy">
        <div className="eyebrow-num">
          <span className="num">01</span> / The Hima Experience
        </div>
        <h2 className="serif">
          A place to
          <br />
          slow down.
        </h2>
        <p>
          A contemporary Asian Fusion Bistro and boutique stay in the heart of
          Kintamani, shaped by the landscape.
        </p>
      </div>
      <div className="screen-photo">
        <video
          src={EXPERIENCE_VIDEO}
          poster={EXPERIENCE_VIDEO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Guests relaxing on the terrace at Hima"
        />
      </div>
    </section>
  );
}