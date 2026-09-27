import Mark from "../data/Mark";
import { SITE } from "../data/site";
import { HERO_LOGO, HERO_SECTION_VIDEO_POSTER_ALT } from "../data/photos";

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
            <button className="pill-btn" onClick={() => scrollTo("menu")}>
              Dine With Us
            </button>
            <button
              className="pill-btn pill-btn--outline"
              onClick={() => scrollTo("suites-detail")}
            >
              Stay With Us
            </button>
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