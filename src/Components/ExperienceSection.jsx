import Art from "../data/Art";
import { EXPERIENCE_PHOTO } from "../data/photos";

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
        <Art
          src={EXPERIENCE_PHOTO}
          alt="Guests relaxing on the terrace under an umbrella"
          variant={1}
        />
      </div>
    </section>
  );
}