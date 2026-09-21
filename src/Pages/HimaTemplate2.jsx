import { useEffect, useRef, useState } from "react";
import MENU from "../assets/json/HimaRestaurant.json";

/* ==========================================================================
   HIMA BY MENZEL  |  Restaurant and Suites  |  Template 2
   Same look and structure as BenihCafe.jsx, rebuilt for a restaurant with suites.
   Edit the DATA block below (contact, suites, reviews, photos).
   The menu itself now comes from HimaRestaurant.json (same file HimaTemplate.jsx
   uses) — edit that JSON to add, remove or re-price dishes; don't hardcode
   menu items here.
   Leave an `image` empty to show the drawn placeholder, or paste a photo URL.
   ========================================================================== */

/* ------------------------------- DATA ---------------------------------- */

// Categories are derived from whatever is in the JSON, same as HimaTemplate.jsx's
// MENU_CATEGORIES. "All" is prepended so the filter bar can still show everything.
const MENU_CATEGORIES = [...new Set(MENU.map((item) => item.category))];
const categories = ["All", ...MENU_CATEGORIES];

const SITE = {
  name: "Hima by Menzel",
  mark: "H",
  whatsapp: "+6283169530888", // digits only, with country code, no + sign
  phone: "+6283169530888",
  instagram: "himabymenzel",
  address: ["Jl. Raya Kintamani,", "Kintamani, Bangli Regency,", "Bali"], // replace with the exact address
  mapsQuery: "Hima by Menzel Kintamani",
  hours: "Open daily · Kitchen closes 9:00 PM",
  heroImage: "",
  featureImage: "",
};

const suites = [
  {
    name: "Hima Suite",
    sleeps: "Sleeps 2",
    blurb: "A calm room with a king bed, a writing desk and a hot shower for cool mornings.",
    features: ["King bed", "Hot shower", "Breakfast included"],
    price: "Rp 850K",
    variant: 2,
    images: ["/Images/HimaVenue1.jpg", "/Images/HimaVenue2.jpg", "/Images/HimaVenue3.jpg"],
  },
  {
    name: "Menzel Suite",
    sleeps: "Sleeps 2 to 3",
    blurb: "More room to spread out, with a sitting area and a wide window facing the hills.",
    features: ["King bed and daybed", "Sitting area", "Breakfast included"],
    price: "Rp 1.2M",
    variant: 3,
    images: ["/Images/HimaVenue4.jpg", "/Images/HimaVenue5.jpg"],
  },
  {
    name: "Family Suite",
    sleeps: "Sleeps 4",
    blurb: "Two bedrooms and a shared lounge, made for four people who want to stay close.",
    features: ["Two bedrooms", "Private lounge", "Breakfast included"],
    price: "Rp 1.8M",
    variant: 1,
    images: ["/Images/HimaVenue6.jpg", "/Images/HimaVenue7.jpg"],
  },
];

// Sample copy. Replace with real guest reviews before launch.
const reviews = [
  {
    name: "Sarah M.",
    text: "We came for dinner and stayed the night. Breakfast the next morning was even better than dinner.",
    rating: 5,
  },
  {
    name: "Daniel R.",
    text: "A quiet room, a very comfortable bed, and nobody rushed us out of the restaurant at closing time.",
    rating: 5,
  },
  {
    name: "Maya K.",
    text: "Small place, big attention. They remembered how I take my coffee on the second morning.",
    rating: 5,
  },
];

const wa = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------------------------- PLACEHOLDERS ----------------------------- */

const HILLS = {
  1: {
    sun: [290, 92],
    back: "M0 178 L58 146 L104 168 L166 112 L204 100 L246 118 L302 166 L352 146 L400 172 L400 300 L0 300Z",
    mid: "M0 214 Q60 176 122 200 T246 190 T400 210 L400 300 L0 300Z",
    front: "M0 252 Q100 228 200 246 T400 240 L400 300 L0 300Z",
  },
  2: {
    sun: [110, 84],
    back: "M0 200 Q80 150 160 176 T320 150 T400 178 L400 300 L0 300Z",
    mid: "M0 226 Q90 196 170 214 T340 204 T400 220 L400 300 L0 300Z",
    front: "M0 262 Q120 244 220 258 T400 252 L400 300 L0 300Z",
  },
  3: {
    sun: [236, 118],
    back: "M0 170 L70 136 L120 158 L188 96 L236 132 L292 118 L346 156 L400 138 L400 300 L0 300Z",
    mid: "M0 222 Q70 190 140 212 T290 198 T400 224 L400 300 L0 300Z",
    front: "M0 256 Q90 236 190 252 T400 246 L400 300 L0 300Z",
  },
};

const HERO_VIDEO = {
  desktop:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/v1789888455/HimaRestaurant_xz3rpf.mp4",
  mobile:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/v1789888455/HimaRestaurant1_yj94cx.mp4",
};

const HERO_POSTER = {
  desktop:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/so_0,w_1600,q_auto/v1789888455/HimaRestaurant_xz3rpf.jpg",
  mobile:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/so_0,w_800,q_auto/v1789888455/HimaRestaurant1_yj94cx.jpg",
};

// Logo shown over the hero video. Put the file in your public folder (public/Images/HimaLogo.png).
// If it can't load, the page falls back to a text wordmark.
const HERO_LOGO = "/Images/HimaLogo.png";

// Photos for the feature card gallery (files live in public/Images/HimaResto/).
const FEATURE_PHOTOS = [
  "/Images/HimaVenue3.jpg",
  "/Images/HimaVenue2.jpg",
  "/Images/HimaResto/4.jpeg",
  "/Images/HimaResto/5.jpeg",
  "/Images/HimaResto/6.jpeg",
];

// Local video for the "hero" section (file lives in public/videos/HimaRestaurant1.mp4).
const HERO_SECTION_VIDEO = "/videos/HimaRestaurant1.mp4";

function Art({ src, alt, className = "", kind = "hills", variant = 1 }) {
  if (src) return <img className={className} src={src} alt={alt} />;
  const h = HILLS[variant];
  return (
    <div className={`art ${className}`} role="img" aria-label={alt}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {kind === "plate" ? (
          <g>
            <circle cx="200" cy="150" r="112" fill="#263126" fillOpacity=".08" />
            <circle cx="200" cy="150" r="86" fill="none" stroke="#263126" strokeOpacity=".25" strokeWidth="2" />
            <circle cx="200" cy="150" r="52" fill="#9b7547" fillOpacity=".28" />
          </g>
        ) : (
          <g>
            <circle cx={h.sun[0]} cy={h.sun[1]} r="22" fill="#f7f4ed" fillOpacity=".85" />
            <path d={h.back} fill="#263126" fillOpacity=".14" />
            <path d={h.mid} fill="#263126" fillOpacity=".3" />
            <path d={h.front} fill="#263126" fillOpacity=".72" />
          </g>
        )}
      </svg>
    </div>
  );
}

// A small sliding carousel for suite cards with 2-3 photos each. Auto-advances
// every 4.5s, pauses that timer while a photo is being changed manually isn't
// necessary here since the interval just resets on every index change.
function SuiteGallery({ images = [], alt, variant = 1 }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 4500);
    return () => clearInterval(id);
  }, [count, index]);

  if (count === 0) {
    return <Art className="suite-img" src="" kind="hills" variant={variant} alt={alt} />;
  }

  return (
    <div className="suite-gallery">
      <div
        className="suite-gallery-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img key={src} src={src} alt={`${alt} — photo ${i + 1}`} className="suite-img" />
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="suite-gallery-nav prev"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            aria-label={`Previous photo of ${alt}`}
          >
            ‹
          </button>
          <button
            type="button"
            className="suite-gallery-nav next"
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label={`Next photo of ${alt}`}
          >
            ›
          </button>
          <div className="suite-gallery-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`suite-gallery-dot ${i === index ? "active" : ""}`}
                aria-label={`Go to photo ${i + 1} of ${alt}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------- PAGE --------------------------------- */

export default function HimaTemplate2() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllDishes, setShowAllDishes] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Hero video
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [heroSrc, setHeroSrc] = useState(null); // null = no video (reduced motion), poster only
  const [videoReady, setVideoReady] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [sectionVideoFailed, setSectionVideoFailed] = useState(false);

  // Pick the right file for the screen size. (The media attribute on <source> is
  // ignored by most browsers for video, so the choice is made here instead.)
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pick = () =>
      setHeroSrc(reduce.matches ? null : wide.matches ? HERO_VIDEO.desktop : HERO_VIDEO.mobile);
    pick();
    wide.addEventListener("change", pick);
    reduce.addEventListener("change", pick);
    return () => {
      wide.removeEventListener("change", pick);
      reduce.removeEventListener("change", pick);
    };
  }, []);

  // Start playback (muted is required for autoplay) and reset the fade when the file changes.
  useEffect(() => {
    setVideoReady(false);
    const v = videoRef.current;
    if (!v || !heroSrc) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {}); // autoplay blocked: the poster stays visible
  }, [heroSrc]);

  // Pause the video while the hero is off screen to save data and battery.
  useEffect(() => {
    const section = heroRef.current;
    if (!section || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      const v = videoRef.current;
      if (!v) return;
      if (entry.isIntersecting) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const MENU_PAGE_SIZE = 8;
  const filteredItems =
    activeCategory === "All"
      ? MENU
      : MENU.filter((item) => item.category === activeCategory);
  const visibleItems = showAllDishes ? filteredItems : filteredItems.slice(0, MENU_PAGE_SIZE);

  function selectCategory(category) {
    setActiveCategory(category);
    setShowAllDishes(false);
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  return (
    <div className="hima-page" lang="en">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

        .hima-page,
        .hima-page *,
        .hima-page *::before,
        .hima-page *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        .hima-page {
          font-family: 'DM Sans', sans-serif;
          background: #f7f4ed;
          color: #263126;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .hima-page button {
          font-family: inherit;
        }

        .hima-page :focus-visible {
          outline: 2px solid #9b7547;
          outline-offset: 3px;
        }

        .hima-page section {
          scroll-margin-top: 76px;
        }

        /* PLACEHOLDER ART */

        .art {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #e8e0cc 0%, #d3c7a9 100%);
        }

        .art svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* NAVBAR */

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6%;
          background: rgba(247, 244, 237, .94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(38,49,38,.08);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #263126;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
        }

        .logo-mark {
          width: 37px;
          height: 37px;
          border: 1.5px solid currentColor;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 23px;
          font-weight: 600;
          letter-spacing: -.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 34px;
        }

        .nav-links button {
          border: none;
          background: transparent;
          color: #263126;
          font-size: 14px;
          cursor: pointer;
          transition: .2s;
        }

        .nav-links button:hover {
          color: #8c6d45;
        }

        .nav-links .nav-cta {
          background: #263126;
          color: white;
          padding: 12px 20px;
          border-radius: 30px;
        }

        .nav-links .nav-cta:hover {
          background: #425140;
          color: white;
        }

        .mobile-toggle {
          display: none;
          border: none;
          background: none;
          color: #263126;
          font-size: 25px;
          cursor: pointer;
        }

        /* HERO VIDEO */

        .video-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          height: 100svh;
          min-height: 520px;
          padding-top: 76px;
          overflow: hidden;
          background: #171410;
          color: #f2efe8;
          text-align: center;
        }

        .video-hero-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        video.video-hero-media {
          opacity: 0;
          transition: opacity .7s ease;
        }

        video.video-hero-media.ready {
          opacity: 1;
        }

        .video-hero-scrim {
          position: absolute;
          inset: 0;
          background: rgba(23, 20, 16, .55);
        }

        .video-hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          padding: 0 24px;
        }

        .video-hero-logo {
          display: block;
          width: min(78vw, 560px);
          height: auto;
          margin: 0 auto;
          filter: drop-shadow(0 2px 18px rgba(0, 0, 0, .35));
        }

        .video-hero-wordmark {
          font-family: 'Playfair Display', serif;
          font-size: clamp(56px, 12vw, 128px);
          font-weight: 600;
          letter-spacing: -3px;
          line-height: 1;
        }

        .video-hero-by {
          margin-top: 10px;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(18px, 3vw, 28px);
          color: #d6c8aa;
        }

        /* HERO */

        .hero {
          min-height: 730px;
          padding: 150px 6% 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 70px;
          max-width: 1450px;
          margin: auto;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #9b7547;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 22px;
        }

        .eyebrow-line {
          width: 35px;
          height: 1px;
          background: #9b7547;
        }

        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(58px, 7vw, 100px);
          line-height: .94;
          letter-spacing: -4px;
          font-weight: 600;
          color: #263126;
          max-width: 650px;
        }

        .hero h1 span {
          color: #9b7547;
          font-style: italic;
        }

        .hero-description {
          margin-top: 30px;
          max-width: 510px;
          color: #667066;
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          gap: 13px;
          margin-top: 34px;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-block;
          border: none;
          border-radius: 40px;
          padding: 15px 25px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: .25s;
        }

        .btn-primary {
          background: #263126;
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          background: #41503f;
        }

        .btn-secondary {
          background: transparent;
          color: #263126;
          border: 1px solid #bdb8ac;
        }

        .btn-secondary:hover {
          background: #ece8de;
        }

        .hero-rating {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 35px;
          font-size: 13px;
          color: #737970;
        }

        .hero-rating strong {
          color: #263126;
        }

        .hero-image-wrap {
          position: relative;
        }

        .hero-image {
          width: 100%;
          height: 570px;
          object-fit: cover;
          border-radius: 220px 220px 15px 15px;
          display: block;
          filter: saturate(.88);
        }

        video.hero-image {
          background: #171410;
        }

        .hero-video-overlay {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          border-radius: 220px 220px 15px 15px;
          background: linear-gradient(rgba(23, 20, 16, .28), rgba(23, 20, 16, .45));
          pointer-events: none;
        }

        .hero-video-overlay-logo {
          width: min(62%, 300px);
          height: auto;
          display: block;
          filter: drop-shadow(0 2px 14px rgba(0, 0, 0, .4));
        }

        .image-note {
          position: absolute;
          left: -32px;
          bottom: 30px;
          width: 155px;
          height: 155px;
          border-radius: 50%;
          background: #d6c8aa;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 20px;
          transform: rotate(-9deg);
          color: #344032;
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          line-height: 1.15;
        }

        .hero-logo-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #e7e1d5;
          display: grid;
          place-items: center;
          padding: 14px;
          box-shadow: 0 10px 30px rgba(23, 20, 16, .18);
        }

        .hero-logo-badge img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* INTRO */

        .intro {
          background: #263126;
          color: #f7f4ed;
          padding: 100px 6%;
          text-align: center;
        }

        .intro-inner {
          max-width: 850px;
          margin: auto;
        }

        .intro .eyebrow {
          justify-content: center;
          color: #d1b17c;
        }

        .intro .eyebrow-line {
          background: #d1b17c;
        }

        .intro h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 500;
          line-height: 1.1;
        }

        .intro p {
          margin: 25px auto 0;
          color: #bec5ba;
          max-width: 680px;
          line-height: 1.8;
          font-size: 16px;
        }

        /* MENU + SUITES */

        .menu-section,
        .suites-section {
          padding: 110px 6%;
          max-width: 1450px;
          margin: auto;
        }

        .suites-section {
          padding-top: 0;
        }

        .section-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 40px;
        }

        .section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 65px);
          font-weight: 600;
          line-height: 1;
          color: #263126;
        }

        .section-header p {
          max-width: 390px;
          color: #747a70;
          line-height: 1.7;
          font-size: 14px;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .filter {
          border: 1px solid #d4cfc2;
          background: transparent;
          padding: 10px 17px;
          border-radius: 30px;
          color: #626a60;
          cursor: pointer;
          font-size: 13px;
          transition: .2s;
        }

        .filter.active,
        .filter:hover {
          background: #263126;
          border-color: #263126;
          color: white;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .menu-more {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .suite-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .menu-card {
          background: #fffdf8;
          border-radius: 14px;
          overflow: hidden;
          transition: .3s;
          border: 1px solid #e7e1d5;
        }

        .menu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(38,49,38,.1);
        }

        .menu-img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
        }

        .suite-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }

        .suite-gallery {
          position: relative;
          overflow: hidden;
        }

        .suite-gallery-track {
          display: flex;
          transition: transform .5s ease;
        }

        .suite-gallery-track .suite-img {
          flex: 0 0 100%;
        }

        .suite-gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(23, 20, 16, .45);
          color: #fff;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: .2s;
        }

        .suite-gallery-nav:hover {
          background: rgba(23, 20, 16, .75);
        }

        .suite-gallery-nav.prev {
          left: 10px;
        }

        .suite-gallery-nav.next {
          right: 10px;
        }

        .suite-gallery-dots {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .suite-gallery-dot {
          width: 7px;
          height: 7px;
          padding: 0;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, .55);
          cursor: pointer;
          transition: .2s;
        }

        .suite-gallery-dot.active {
          width: 18px;
          border-radius: 4px;
          background: #fff;
        }

        .menu-content {
          padding: 18px;
        }

        .menu-category {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #9b7547;
          font-weight: 700;
        }

        .menu-name {
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          margin-top: 7px;
          color: #293329;
        }

        .menu-price {
          color: #737970;
          font-size: 13px;
          margin-top: 9px;
        }

        .menu-price strong {
          color: #263126;
          font-size: 15px;
        }

        .suite-content {
          padding: 22px;
        }

        .suite-blurb {
          color: #687066;
          font-size: 14px;
          line-height: 1.7;
          margin-top: 10px;
        }

        .suite-features {
          list-style: none;
          margin-top: 16px;
          display: grid;
          gap: 8px;
          color: #4b554a;
          font-size: 13px;
        }

        .suite-features li::before {
          content: "✓";
          margin-right: 10px;
          color: #8c6d45;
          font-weight: bold;
        }

        .suite-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid #ebe5d8;
        }

        .suite-foot .menu-price {
          margin-top: 0;
        }

        .suite-foot .btn-secondary {
          padding: 11px 18px;
          font-size: 13px;
        }

        /* FEATURE */

        .feature {
          padding: 0 6% 110px;
          max-width: 1450px;
          margin: auto;
        }

        .feature-card {
          background: #f4efe3;
          min-height: 520px;
          border: 1px solid #1f1d19;
          border-radius: 2px;
          box-shadow: 0 18px 40px rgba(38, 49, 38, .12);
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        .feature-image {
          width: 100%;
          height: 100%;
          min-height: 520px;
          object-fit: cover;
          display: block;
        }

        /* Editorial collage: mixed shapes, cut-out borders and a slight tilt */
        /* Newspaper-style gallery. The gallery only sets a minimum size; the layout lives in an
           absolutely positioned inner box, so photo dimensions never stretch the card.
           Photos are always cropped (object-fit: cover) to fill their tile. */
        .feature-gallery {
          position: relative;
          min-height: 520px;
          height: 100%;
        }

        .feature-gallery-grid {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          padding: 22px 26px;
          background: #f4efe3;
          color: #1f1d19;
          border-right: 1px solid #1f1d19;
        }

        .paper-masthead {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          padding: 6px 0;
          border-top: 3px double #1f1d19;
          border-bottom: 1px solid #1f1d19;
          font-size: 10px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .paper-masthead span:last-child {
          text-align: right;
        }

        .paper-masthead strong {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(16px, 2vw, 22px);
          letter-spacing: 1px;
          font-weight: 700;
          white-space: nowrap;
        }

        .paper-grid {
          flex: 1;
          min-height: 0;
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-template-rows: repeat(6, minmax(0, 1fr));
          gap: 12px;
        }

        .paper-fig {
          margin: 0;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .feature-photo {
          flex: 1;
          width: 100%;
          min-height: 0;
          object-fit: cover;
          display: block;
          background: #d8d0bd;
          border: 1px solid #1f1d19;
          filter: grayscale(.35) sepia(.18) contrast(1.05);
          transition: filter .4s ease;
        }

        .paper-fig:hover .feature-photo {
          filter: none;
        }

        /* Lead photo, then a column stack, then a wide strip along the bottom */
        .paper-fig-1 { grid-column: 1 / 8;  grid-row: 1 / 5; }
        .paper-fig-2 { grid-column: 8 / 13; grid-row: 1 / 3; }
        .paper-fig-3 { grid-column: 8 / 13; grid-row: 3 / 5; }
        .paper-fig-4 { grid-column: 1 / 5;  grid-row: 5 / 7; }
        .paper-fig-5 { grid-column: 5 / 13; grid-row: 5 / 7; }

        /* Newspaper-style copy column */
        .feature-copy {
          padding: 46px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #1f1d19;
        }

        .feature-copy .eyebrow {
          width: 100%;
          margin-bottom: 20px;
          padding: 6px 0;
          border-top: 3px double #1f1d19;
          border-bottom: 1px solid #1f1d19;
          color: #1f1d19;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .feature-copy .eyebrow-line {
          display: none;
        }

        .feature-copy h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 3.8vw, 54px);
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -1px;
          padding-bottom: 20px;
          border-bottom: 1px solid #1f1d19;
        }

        .feature-copy p {
          font-family: Georgia, 'Times New Roman', serif;
          color: #3b382f;
          font-size: 16px;
          line-height: 1.75;
          margin-top: 20px;
          text-align: justify;
          hyphens: auto;
        }

        .feature-copy p::first-letter {
          float: left;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 58px;
          line-height: .82;
          font-weight: 800;
          padding: 6px 10px 0 0;
          color: #1f1d19;
        }

        .feature-list {
          list-style: none;
          margin-top: 24px;
          border-top: 3px double #1f1d19;
          color: #1f1d19;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 14px;
        }

        .feature-list li {
          padding: 10px 0;
          border-bottom: 1px solid rgba(31, 29, 25, .35);
        }

        .feature-list li::before {
          content: "■";
          margin-right: 12px;
          font-size: 8px;
          vertical-align: middle;
          color: #1f1d19;
        }

        /* REVIEWS */

        .reviews {
          padding: 100px 6%;
          background: #f0ece2;
        }

        .reviews-inner {
          max-width: 1250px;
          margin: auto;
        }

        .reviews-heading {
          text-align: center;
          margin-bottom: 50px;
        }

        .reviews-heading h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 5vw, 60px);
        }

        .reviews-heading p {
          color: #72786e;
          margin-top: 12px;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .review-card {
          background: #fffdf8;
          padding: 30px;
          border-radius: 14px;
          border: 1px solid #e2ddd1;
        }

        .review-stars {
          color: #c28a3d;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .review-text {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          line-height: 1.55;
          margin-top: 20px;
          color: #344034;
        }

        .review-author {
          margin-top: 24px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6f756b;
        }

        /* LOCATION */

        .location {
          max-width: 1450px;
          margin: auto;
          padding: 110px 6%;
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 70px;
          align-items: center;
        }

        .location h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 65px);
          line-height: 1;
        }

        .location-text {
          color: #687066;
          line-height: 1.8;
          margin-top: 25px;
          max-width: 470px;
        }

        .details {
          display: grid;
          gap: 17px;
          margin-top: 30px;
        }

        .detail {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .detail-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e4ded1;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .detail strong {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .detail span {
          color: #646b61;
          font-size: 13px;
          line-height: 1.5;
        }

        .map-card {
          min-height: 430px;
          border-radius: 18px;
          background:
            linear-gradient(rgba(47,61,48,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,61,48,.08) 1px, transparent 1px),
            #dedfd5;
          background-size: 45px 45px;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
        }

        .map-road {
          position: absolute;
          width: 140%;
          height: 90px;
          background: #f7f5ed;
          transform: rotate(-22deg);
          box-shadow: 0 0 0 1px rgba(50,60,50,.06);
        }

        .map-road.two {
          transform: rotate(55deg);
          width: 130%;
          height: 65px;
        }

        .pin {
          position: relative;
          z-index: 2;
          width: 70px;
          height: 70px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: #263126;
          display: grid;
          place-items: center;
          box-shadow: 0 10px 25px rgba(38,49,38,.25);
        }

        .pin::after {
          content: "H";
          transform: rotate(45deg);
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 28px;
        }

        .map-label {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: rgba(255,253,248,.94);
          padding: 16px;
          border-radius: 10px;
          z-index: 3;
          font-size: 12px;
          color: #5e665c;
        }

        /* FOOTER */

        .footer {
          background: #263126;
          color: white;
          padding: 70px 6% 30px;
        }

        .footer-top {
          max-width: 1250px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          gap: 50px;
          align-items: flex-start;
        }

        .footer-brand .logo {
          color: white;
          cursor: default;
        }

        .footer-brand p {
          color: #aeb7aa;
          max-width: 350px;
          margin-top: 18px;
          line-height: 1.7;
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          gap: 60px;
        }

        .footer-column h4 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 18px;
          color: #d3b27d;
        }

        .footer-column button,
        .footer-column a {
          display: block;
          border: none;
          background: none;
          color: #aeb7aa;
          margin-bottom: 10px;
          cursor: pointer;
          font-size: 13px;
          text-align: left;
          text-decoration: none;
        }

        .footer-column button:hover,
        .footer-column a:hover {
          color: white;
        }

        .footer-bottom {
          max-width: 1250px;
          margin: 60px auto 0;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,.1);
          display: flex;
          justify-content: space-between;
          color: #96a094;
          font-size: 11px;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 125px;
          }

          .hero-image-wrap {
            max-width: 650px;
            margin: auto;
            width: 100%;
          }

          .menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .suite-grid {
            grid-template-columns: 1fr 1fr;
          }

          .location {
            grid-template-columns: 1fr;
          }

          .feature-card {
            grid-template-columns: 1fr;
          }

          .feature-gallery {
            min-height: 0;
            height: 520px;
          }

          .feature-gallery-grid {
            padding: 18px 16px;
            border-right: 0;
            border-bottom: 1px solid #1f1d19;
          }
        }

        @media (max-width: 720px) {
          .navbar {
            padding: 0 5%;
          }

          .nav-links {
            display: none;
            position: absolute;
            top: 76px;
            left: 0;
            right: 0;
            padding: 25px;
            background: #f7f4ed;
            border-bottom: 1px solid #ddd8cd;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .nav-links.open {
            display: flex;
          }

          .mobile-toggle {
            display: block;
          }

          .hero {
            padding: 115px 5% 70px;
            gap: 50px;
          }

          .hero h1 {
            letter-spacing: -2.5px;
          }

          .hero-image {
            height: 440px;
            border-radius: 180px 180px 14px 14px;
          }

          .hero-video-overlay {
            border-radius: 180px 180px 14px 14px;
          }

          .image-note {
            width: 115px;
            height: 115px;
            font-size: 15px;
            left: -10px;
          }

          .hero-logo-badge {
            width: 64px;
            height: 64px;
            top: 16px;
            left: 16px;
            padding: 10px;
          }

          .intro,
          .menu-section,
          .suites-section,
          .reviews,
          .location {
            padding-left: 5%;
            padding-right: 5%;
          }

          .section-header {
            display: block;
          }

          .section-header p {
            margin-top: 18px;
          }

          .menu-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .suite-grid {
            grid-template-columns: 1fr;
          }

          .menu-content {
            padding: 14px;
          }

          .menu-name {
            font-size: 18px;
          }

          .feature {
            padding: 0 5% 70px;
          }

          .feature-copy {
            padding: 45px 30px;
          }

          .review-grid {
            grid-template-columns: 1fr;
          }

          .footer-top {
            flex-direction: column;
          }

          .footer-links {
            gap: 45px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 430px) {
          .menu-grid {
            grid-template-columns: 1fr;
          }

          .hero h1 {
            font-size: 58px;
          }

          .hero-image {
            height: 390px;
          }

          .footer-links {
            flex-direction: column;
            gap: 25px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .menu-card,
          .btn-primary {
            transition: none;
          }

          .menu-card:hover,
          .btn-primary:hover {
            transform: none;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar" aria-label="Main">
        <button className="logo" onClick={() => scrollTo("home")}>
          <span className="logo-mark">{SITE.mark}</span>
          <span className="logo-text">{SITE.name}</span>
        </button>

        <div className={`nav-links ${mobileMenu ? "open" : ""}`}>
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("menu")}>Menu</button>
          <button onClick={() => scrollTo("suites")}>Suites</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("reviews")}>Reviews</button>
          <button className="nav-cta" onClick={() => scrollTo("location")}>
            Find Us
          </button>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? "×" : "☰"}
        </button>
      </nav>

      {/* HERO VIDEO */}
      <section className="video-hero" id="home" ref={heroRef} aria-label="Welcome to Hima by Menzel">
        {/* Poster: shows instantly, and stays if the video is blocked or motion is reduced */}
        <picture>
          <source media="(min-width: 768px)" srcSet={HERO_POSTER.desktop} />
          <img
            src={HERO_POSTER.mobile}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="video-hero-media"
          />
        </picture>

        {heroSrc ? (
          <video
            ref={videoRef}
            src={heroSrc}
            onPlaying={() => setVideoReady(true)}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className={`video-hero-media ${videoReady ? "ready" : ""}`}
          />
        ) : null}

        <div className="video-hero-scrim" />

        <div className="video-hero-content">
          {logoFailed ? (
            <div>
              <div className="video-hero-wordmark">Hima</div>
              <div className="video-hero-by">by Menzel</div>
            </div>
          ) : (
            <img
              className="video-hero-logo"
              src={HERO_LOGO}
              alt="Hima by Menzel, restaurant and suites"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>
      </section>

      <section className="hero" id="welcome">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            Kintamani · Bali
          </div>

          <h1>
            Good food,
            <br />
            <span>good rest.</span>
          </h1>

          <p className="hero-description">
            A restaurant with a few quiet suites, high in Kintamani. Cool
            highland air, honest food cooked to order, and a comfortable bed
            waiting upstairs.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo("menu")}>
              Explore our menu →
            </button>

            <button className="btn-secondary" onClick={() => scrollTo("suites")}>
              View the suites
            </button>
          </div>

          <div className="hero-rating">
            <strong>3 suites</strong>
            <span>Restaurant open daily, breakfast included with every stay</span>
          </div>
        </div>

        <div className="hero-image-wrap">
          {/* Video with the artwork as fallback (reduced motion, missing file, or load error) */}
          {heroSrc && !sectionVideoFailed ? (
            <video
              className="hero-image"
              src={HERO_SECTION_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Hima by Menzel restaurant"
              onError={() => setSectionVideoFailed(true)}
            />
          ) : (
            <Art
              className="hero-image"
              src={SITE.heroImage}
              kind="hills"
              variant={1}
              alt="Hima by Menzel"
            />
          )}

          {/* Logo overlay on top of the video */}
          {!logoFailed && (
            <div className="hero-video-overlay">
              <img
                className="hero-video-overlay-logo"
                src={HERO_LOGO}
                alt="Hima by Menzel logo"
                onError={() => setLogoFailed(true)}
              />
            </div>
          )}

          <div className="image-note">
            Fresh air.
            <br />
            Warm beds.
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="intro" id="about">
        <div className="intro-inner">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            Our philosophy
            <span className="eyebrow-line" />
          </div>

          <h2>
            A house in
            <br />
            the hills.
          </h2>

          <p>
            Hima by Menzel is a restaurant with a handful of suites above it,
            run the way a family runs a house. Come for breakfast, stay for
            lunch, or book a suite and let the mountain air do the rest. The
            kitchen keeps a short menu that follows the market.
          </p>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-section" id="menu">
        <div className="section-header">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              From the kitchen
            </div>
            <h2>Our favourites</h2>
          </div>

          <p>
            Simple, fresh and generous. A short menu, cooked properly and
            served warm.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Menu category">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter ${activeCategory === category ? "active" : ""}`}
              aria-pressed={activeCategory === category}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {visibleItems.map((item, index) => (
            <article className="menu-card" key={`${item.name}-${index}`}>
              <Art className="menu-img" src={item.img} kind="plate" alt={item.name} />

              <div className="menu-content">
                <div className="menu-category">{item.category}</div>
                <div className="menu-name">{item.name}</div>
                {item.price && <div className="menu-price">{item.price}</div>}
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length > MENU_PAGE_SIZE && (
          <div className="menu-more">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowAllDishes((show) => !show)}
            >
              {showAllDishes
                ? "Show less"
                : `Show all ${filteredItems.length} ${activeCategory === "All" ? "dishes" : activeCategory.toLowerCase()}`}
            </button>
          </div>
        )}
      </section>

      {/* SUITES */}
      <section className="suites-section" id="suites">
        <div className="section-header">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              Stay with us
            </div>
            <h2>Our suites</h2>
          </div>

          <p>
            Three quiet rooms above the restaurant. Every stay includes
            breakfast downstairs.
          </p>
        </div>

        <div className="suite-grid">
          {suites.map((s) => (
            <article className="menu-card" key={s.name}>
              <SuiteGallery images={s.images} variant={s.variant} alt={s.name} />

              <div className="suite-content">
                <div className="menu-category">{s.sleeps}</div>
                <div className="menu-name">{s.name}</div>
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
                    className="btn-secondary"
                    href={wa(`Hello, I would like to book the ${s.name}. Is it available?`)}
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

      {/* FEATURE */}
      <section className="feature">
        <div className="feature-card">
          <div className="feature-gallery">
            <div className="feature-gallery-grid">
              <div className="paper-masthead">
                <span>Vol. 01</span>
                <strong>Hima By Menzel</strong>
                <span>Kintamani, Bali</span>
              </div>

              <div className="paper-grid">
                {FEATURE_PHOTOS.map((src, i) => (
                  <figure className={`paper-fig paper-fig-${i + 1}`} key={src}>
                    <img
                      className="feature-photo"
                      src={src}
                      alt={`Hima by Menzel atmosphere ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>

          <div className="feature-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              One address, two ways to enjoy it
            </div>

            <h2>
              A table for tonight.
              <br />
              A room for the night.
            </h2>

            <p>
              Whether you are here for one dinner or a long weekend, there is
              always a table waiting at Hima, and a bed just upstairs.
            </p>

            <ul className="feature-list">
              <li>Dine-in restaurant</li>
              <li>Three quiet suites</li>
              <li>Breakfast included with every stay</li>
              <li>Tables and suites booked on WhatsApp</li>
            </ul>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews" id="reviews">
        <div className="reviews-inner">
          <div className="reviews-heading">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              <span className="eyebrow-line" />
              Guestbook
              <span className="eyebrow-line" />
            </div>

            <h2>Loved by our guests.</h2>

            <p>A few words from people who stayed and ate with us.</p>
          </div>

          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(review.rating)}
                </div>

                <p className="review-text">“{review.text}”</p>

                <div className="review-author">{review.name}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="location" id="location">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            Visit Hima
          </div>

          <h2>
            Find us
            <br />
            in Kintamani.
          </h2>

          <p className="location-text">
            An easy stop for breakfast, lunch or a slow dinner, and a quiet
            place to stay the night. Message us on WhatsApp to book a table or
            a suite.
          </p>

          <div className="details">
            <div className="detail">
              <div className="detail-icon">⌖</div>
              <div>
                <strong>Address</strong>
                <span>
                  {SITE.address.map((line, i) => (
                    <span key={line} style={{ display: "block" }}>
                      {line}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <div className="detail">
              <div className="detail-icon">◷</div>
              <div>
                <strong>Opening hours</strong>
                <span>{SITE.hours}</span>
              </div>
            </div>

            <div className="detail">
              <div className="detail-icon">☎</div>
              <div>
                <strong>Phone</strong>
                <span>{SITE.phone}</span>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Open in Google Maps →
            </a>

            <a
              href={wa("Hello, can I book a table?")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Contact Us (WhatsApp) →
            </a>
          </div>
        </div>

        <div className="map-card">
          <div className="map-road" />
          <div className="map-road two" />

          <div className="pin" />

          <div className="map-label">
            <strong>{SITE.name}</strong>
            <br />
            {SITE.address.join(" ")}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-mark">{SITE.mark}</span>
              <span className="logo-text">{SITE.name}</span>
            </div>

            <p>
              A restaurant and suites in Kintamani, Bali. Honest food, cool
              mountain air and quiet rooms.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Explore</h4>
              <button onClick={() => scrollTo("home")}>Home</button>
              <button onClick={() => scrollTo("menu")}>Menu</button>
              <button onClick={() => scrollTo("suites")}>Suites</button>
              <button onClick={() => scrollTo("reviews")}>Reviews</button>
            </div>

            <div className="footer-column">
              <h4>Connect</h4>
              <a href={wa("Hello, can I book a table?")} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a
                href={`https://www.instagram.com/${SITE.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <button onClick={() => scrollTo("location")}>Find us</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Restaurant and suites · Kintamani, Bali</span>
        </div>
      </footer>
    </div>
  );
}