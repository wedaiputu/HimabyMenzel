import Art from "../data/Art";
import { EVENTS_PHOTO, BEAUTY_PHOTOS } from "../data/photos";

export default function EventsSection({ scrollTo }) {
  return (
    <section className="events-screen" id="events" aria-label="Events">
      <div className="events-head">
        <div className="eyebrow-num">
          <span className="num">04</span> / Experience
        </div>
        <h2 className="serif">Dine. Stay. Gather. Celebrate.</h2>
      </div>

      <div className="events-photo">
        <Art
          src={EVENTS_PHOTO}
          alt="A private celebration set up on the terrace"
          variant={1}
        />
        <button
          className="pill-btn pill-btn--sm"
          onClick={() => scrollTo("book")}
        >
          Plan Your Event
        </button>
      </div>

      <div className="events-cols">
        <div className="events-col">
          <div className="idx">01</div>
          <h3 className="serif">Dining</h3>
          <p>A contemporary Asian Fusion experience.</p>
        </div>
        <div className="events-col">
          <div className="idx">02</div>
          <h3 className="serif">Stay</h3>
          <p>Private suites in the Kintamani landscape.</p>
        </div>
        <div className="events-col">
          <div className="idx">03</div>
          <h3 className="serif">Celebrate</h3>
          <p>Intimate moments with a mountain view.</p>
        </div>
        <div className="events-col">
          <div className="idx">04</div>
          <h3 className="serif">Gather</h3>
          <p>Private, corporate and community occasions.</p>
        </div>
      </div>

      <div className="beauty-split">
        <div className="beauty-panel">
          <Art
            src={BEAUTY_PHOTOS.left}
            alt="Guests overlooking Mount Batur at sunrise"
            variant={3}
          />
        </div>
        <div className="beauty-panel">
          <Art
            src={BEAUTY_PHOTOS.right}
            alt="A couple celebrating on the terrace"
            variant={2}
          />
        </div>
        <div className="beauty-caption">
          <div className="eyebrow-num">The Beauty of Kintamani</div>
          <h3 className="serif">Wake up, dine and gather</h3>
        </div>
      </div>
      <div className="beauty-strapline">
        surrounded by the natural beauty of Bali's highlands.
      </div>
    </section>
  );
}
