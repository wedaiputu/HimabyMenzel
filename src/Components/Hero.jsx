import Mark from "../data/Mark";
import { SITE } from "../data/site";
import { HERO_LOGO, HERO_SECTION_VIDEO_POSTER_ALT } from "../data/photos";

// Replace with your WhatsApp number: country code + number, digits only
// (e.g. Indonesia: 6281234567890 - no "+", spaces or leading 0)
const WHATSAPP_NUMBER = SITE.whatsapp || "6281234567890";

const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function Hero({
  heroRef,
  videoRef,
  heroSrc,
  posterSrc,
  videoReady,
  setVideoReady,
  logoFailed,
  setLogoFailed,
  scrollTo,
}) {
  return (
    <div className="hero-wrap" id="home" ref={heroRef}>
      <div className="triptych">
        <div className="triptych-panel triptych-video">
          {heroSrc ? (
            <video
              ref={videoRef}
              src={heroSrc}
              poster={posterSrc}
              onPlaying={() => setVideoReady(true)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={HERO_SECTION_VIDEO_POSTER_ALT}
            />
          ) : (
            <img src={posterSrc} alt={HERO_SECTION_VIDEO_POSTER_ALT} />
          )}
          <div className={`triptych-play ${videoReady ? "hidden" : ""}`}>
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="triptych-tag">{SITE.place}</div>
        </div>

        <div className="hero-lockup">
          {logoFailed ? (
            <>
              <Mark className="mark" />
              <h1>Hima</h1>
              <div className="script">by Menzel</div>
            </>
          ) : (
            <img
              className="hero-lockup-logo"
              src={HERO_LOGO}
              alt="Hima by Menzel"
              onError={() => setLogoFailed(true)}
            />
          )}
          <div className="tag">{SITE.tagline}</div>
        </div>
      </div>

      <div className="hero-bar">
        <div className="hero-bar-left">
          <p>
            Where contemporary Asian flavors meet the timeless landscape of
            Mount Batur.
          </p>
          <div className="hero-bar-actions">
            <a
              className="pill-btn"
              href={whatsappLink("Hello Hima, I would like to reserve a table.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Dine With Us
            </a>
            <a
              className="pill-btn pill-btn--outline"
              href={whatsappLink("Hello Hima, I would like to book a stay.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Stay With Us
            </a>
          </div>
        </div>
        <div className="hero-bar-right">
          <p>
            A warm mountain hideaway where food, views and meaningful moments
            meet.
          </p>
          <div className="hours">{SITE.hoursShort}</div>
        </div>
      </div>
    </div>
  );
}