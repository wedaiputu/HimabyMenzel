import { useEffect, useRef, useState } from "react";
import MENU from "../assets/json/HimaRestaurant.json";

/* ==========================================================================
   HIMA BY MENZEL  |  Restaurant and Suites  |  Template 3
   Rebuilt to match web_hima_design.pdf: a triptych hero, five numbered
   full-bleed screens (Experience / Dining / Suites / Events / Book), a
   dark "Dine. Stay. Gather. Celebrate." block and a mint map + footer.

   The working parts of the old template are kept underneath the new look:
   - the menu still comes from HimaRestaurant.json (edit that file, not this
     one, to add/remove/re-price dishes)
   - "CHECK MENU" scrolls down to a full filterable menu section
   - "BOOK NOW" on the suites screen scrolls down to full suite cards with
     photo galleries and a WhatsApp booking link

   Edit the DATA block below for copy, contact details and photos. Leave any
   image path empty ("") to fall back to a drawn placeholder.
   ========================================================================== */

/* ------------------------------- DATA ---------------------------------- */

const MENU_CATEGORIES = [...new Set(MENU.map((item) => item.category))];
const categories = ["All", ...MENU_CATEGORIES];

const SITE = {
  name: "Hima by Menzel",
  tagline: "Asian Fusion Bistro & Suites",
  place: "Kintamani · Bali",
  whatsapp: "+6283169530888", // digits only, with country code, no + sign
  phone: "+6283169530888",
  instagram: "himabymenzel",
  email: "hello@himabymenzel.com",
  addressLines: ["Jl. Raya Penelokan No. 890", "Batur Selatan, Kintamani, Bangli, Bali 80652"],
  addressShort: "Penelokan, Kintamani, Bali",
  mapsQuery: "Hima by Menzel Kintamani",
  hours: "Open daily · 05:30 AM — 09:00 PM",
  hoursShort: "OPEN DAILY  05:30 AM — 09:00 PM",
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

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const suiteCountWord = NUMBER_WORDS[suites.length] || String(suites.length);

const wa = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------------------------- PHOTO SLOTS -------------------------------
   Leave any of these as "" to show a drawn placeholder instead. Files are
   expected under the public/ folder, matching the rest of the project
   (public/Images, public/Images/HimaResto, public/videos). */

const HERO_VIDEO = {
  desktop: "https://res.cloudinary.com/dimnv9sq5/video/upload/v1789888455/HimaRestaurant_xz3rpf.mp4",
  mobile: "https://res.cloudinary.com/dimnv9sq5/video/upload/v1789888455/HimaRestaurant1_yj94cx.mp4",
};

const HERO_POSTER = {
  desktop: "https://res.cloudinary.com/dimnv9sq5/video/upload/so_2,w_1600,q_auto/v1789888455/HimaRestaurant_xz3rpf.jpg",
  mobile: "https://res.cloudinary.com/dimnv9sq5/video/upload/so_2,w_800,q_auto/v1789888455/HimaRestaurant1_yj94cx.jpg",
};

const EXPERIENCE_PHOTO = "https://res.cloudinary.com/dimnv9sq5/image/upload/v1790495733/Pixflux.AI_1790495670687_1_cbi0o3.png"; // section 01, right-hand photo
const DINING_PHOTO = "/Images/HimaResto/DineImage.jpeg"; // section 02, full-bleed background

const SUITE_STRIP_PHOTOS = [
  "/Images/HimaVenue2.jpg",
  "/Images/HimaVenue4.jpg",
  "/Images/HimaVenue5.jpg",
  "/Images/HimaVenue6.jpg",
  "/Images/HimaVenue7.jpg",
];

const EVENTS_PHOTO = "/Images/HimaResto/6.jpeg"; // section 04, event setup photo
const BEAUTY_PHOTOS = {
  left: "/Images/HimaVenue1.jpg", // guests relaxing, overlooking the caldera
  right: "/Images/HimaVenue3.jpg", // a celebration on the terrace
};

const HERO_SECTION_VIDEO_POSTER_ALT = "Hima by Menzel, seen from the terrace";

// Logo shown over the hero video's middle panel. Put the file in your public
// folder (public/Images/HimaLogo.png) — reference it here by its web path,
// not the full disk path. Falls back to a drawn mark + wordmark if it 404s.
const HERO_LOGO = "/Images/HimaLogo.png";

/* ---------------------------- PLACEHOLDER ART ---------------------------- */

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

function Art({ src, alt, className = "", variant = 1 }) {
  if (src) return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" />;
  const h = HILLS[variant] || HILLS[1];
  return (
    <div className={`art ${className}`} role="img" aria-label={alt}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx={h.sun[0]} cy={h.sun[1]} r="22" fill="#f7f4ec" fillOpacity=".8" />
        <path d={h.back} fill="#2a241b" fillOpacity=".16" />
        <path d={h.mid} fill="#2a241b" fillOpacity=".3" />
        <path d={h.front} fill="#2a241b" fillOpacity=".65" />
      </svg>
    </div>
  );
}

// Small mountain + sun mark used as the wordmark icon, echoing the roofline
// in the source logo without depending on an external image file.
function Mark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 34" fill="none" aria-hidden="true">
      <circle cx="24" cy="9" r="3.4" fill="currentColor" />
      <path
        d="M2 30 L14 12 L20 19 L24 12 L30 21 L36 13 L46 30"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// A small sliding carousel for suite cards with 2-3 photos each.
function SuiteGallery({ images = [], alt, variant = 1 }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(id);
  }, [count, index]);

  if (count === 0) return <Art className="suite-img" src="" variant={variant} alt={alt} />;

  return (
    <div className="suite-gallery">
      <div className="suite-gallery-track" style={{ transform: `translateX(-${index * 100}%)` }}>
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

const NAV_ITEMS = [
  { id: "experience", label: "The Hima Experience" },
  { id: "dining", label: "Dining" },
  { id: "suites", label: "Suites Experience" },
  { id: "events", label: "Events" },
  { id: "book", label: "Book" },
];

export default function HimaTemplate3() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllDishes, setShowAllDishes] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [heroSrc, setHeroSrc] = useState(null);
  const [posterSrc, setPosterSrc] = useState(HERO_POSTER.mobile);
  const [videoReady, setVideoReady] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pick = () => {
      setPosterSrc(wide.matches ? HERO_POSTER.desktop : HERO_POSTER.mobile);
      setHeroSrc(reduce.matches ? null : wide.matches ? HERO_VIDEO.desktop : HERO_VIDEO.mobile);
    };
    pick();
    wide.addEventListener("change", pick);
    reduce.addEventListener("change", pick);
    return () => {
      wide.removeEventListener("change", pick);
      reduce.removeEventListener("change", pick);
    };
  }, []);

  useEffect(() => {
    setVideoReady(false);
    const v = videoRef.current;
    if (!v || !heroSrc) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, [heroSrc]);

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
    activeCategory === "All" ? MENU : MENU.filter((item) => item.category === activeCategory);
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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,500&family=Meddon&display=swap"
      />
      <style>{`
        .hima-page, .hima-page *, .hima-page *::before, .hima-page *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .hima-page {
          --cream: #f7f4ec;
          --taupe: #a89c86;
          --taupe-deep: #928572;
          --ink: #201c17;
          --ink-soft: rgba(32,28,23,.68);
          --dark: #17140f;
          --dark-soft: rgba(247,244,236,.66);
          --amber: #b6905e;
          --line-light: rgba(32,28,23,.16);
          --line-dark: rgba(247,244,236,.2);
          font-family: 'DM Sans', sans-serif;
          background: var(--dark);
          color: var(--ink);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .hima-page button { font-family: inherit; }
        .hima-page :focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }
        html { scroll-behavior: smooth; }
        .hima-page section { scroll-margin-top: 84px; }

        .serif { font-family: 'Playfair Display', serif; }
        .script { font-family: 'Meddon', cursive; font-weight: 400; }

        .eyebrow-num {
          font-size: 13px;
          letter-spacing: .14em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }
        .eyebrow-num .num { color: var(--amber); }

        .art { position: relative; overflow: hidden; background: linear-gradient(180deg, #ece5d3 0%, #d7cbb0 100%); }
        .art svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

        /* PILL BUTTONS */
        .pill-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 999px;
          border: none;
          background: var(--ink);
          color: var(--cream);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: transform .2s ease, opacity .2s ease;
        }
        .pill-btn:hover { transform: translateY(-2px); opacity: .92; }
        .pill-btn--light { background: var(--cream); color: var(--ink); }
        .pill-btn--outline { background: transparent; color: inherit; border: 1px solid currentColor; }

        /* NAVBAR — white text on a translucent dark bar, readable over the
           hero video and every section below it. */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          color: #fff;
          background: transparent;
        }
        .nav-logo { display: flex; align-items: baseline; gap: 8px; background: none; border: none; color: inherit; cursor: pointer; }
        .nav-logo-main { font-family: 'Playfair Display', serif; font-size: 21px; letter-spacing: .02em; text-transform: uppercase; }
        .nav-logo-sub { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; opacity: .85; }
        .nav-links { display: flex; align-items: center; gap: 30px; }
        .nav-links button {
          border: none; background: none; color: inherit; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; letter-spacing: .1em; text-transform: uppercase; font-weight: 500;
          padding: 4px 0;
        }
        .mobile-toggle { display: none; border: none; background: none; color: inherit; font-size: 22px; cursor: pointer; }

        /* HERO */
        .hero-wrap { position: relative; }
        .triptych {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          height: 88vh;
          min-height: 560px;
        }
        .triptych-panel { position: relative; overflow: hidden; background: #d9d0ba; }
        .triptych-panel img, .triptych-panel video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .triptych-video { position: relative; }
        .triptych-play {
          position: absolute; inset: 0; margin: auto; width: 74px; height: 74px;
          border-radius: 50%; border: 1.5px solid rgba(255,255,255,.85);
          display: grid; place-items: center; pointer-events: none;
          transition: opacity .5s ease;
        }
        .triptych-play.hidden { opacity: 0; }
        .triptych-play svg { width: 22px; height: 22px; fill: #fff; }
        .triptych-tag {
          position: absolute; left: 24px; bottom: 22px;
          color: #fff; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600;
          text-shadow: 0 1px 6px rgba(0,0,0,.4);
        }

        .hero-lockup {
          position: absolute; inset: 0;
          z-index: 5; text-align: center; color: #fff;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
          text-shadow: 0 2px 18px rgba(0,0,0,.35);
          pointer-events: none;
        }
        .hero-lockup .mark { width: 54px; height: 40px; margin-bottom: 4px; }
        .hero-lockup-logo { width: clamp(220px, 26vw, 340px); height: auto; display: block; }
        .hero-lockup h1 {
          font-family: 'Playfair Display', serif; font-weight: 500;
          font-size: clamp(46px, 7vw, 84px); letter-spacing: .01em; line-height: .95;
        }
        .hero-lockup .script { font-size: clamp(20px, 2.6vw, 30px); margin-top: -4px; }
        .hero-lockup .tag {
          margin-top: 14px; font-size: 12.5px; letter-spacing: .28em; text-transform: uppercase; font-weight: 600;
        }

        .hero-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          background: var(--taupe);
          color: var(--cream);
          padding: 46px 5%;
          margin-bottom: 24px;
        }
        .hero-bar-left p { font-family: 'Playfair Display', serif; font-size: clamp(18px, 1.6vw, 22px); max-width: 30ch; margin-bottom: 22px; }
        .hero-bar-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .hero-bar-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 22px; }
        .hero-bar-right p { font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(17px, 1.5vw, 21px); max-width: 30ch; }
        .hero-bar-right .hours { font-size: 12.5px; letter-spacing: .14em; font-weight: 700; }

        /* GENERIC NUMBERED SCREEN */
        .screen { position: relative; }
        .screen-split,
        .dining-screen,
        .suites-screen,
        .events-screen,
        .book-screen {
          margin-bottom: 24px;
        }
        @media (max-width: 860px) {
          .screen-split,
          .dining-screen,
          .suites-screen,
          .events-screen,
          .book-screen {
            margin-bottom: 14px;
          }
        }
        .screen-split {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          height: 142vh;
        }
        .screen-copy {
          background: var(--taupe);
          padding: 40px 6%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: var(--cream);
          overflow: hidden;
        }
        .screen-copy .eyebrow-num { color: var(--cream); }
        .screen-copy h2 {
          font-family: 'Playfair Display', serif; font-weight: 500;
          font-size: clamp(44px, 5.6vw, 76px); line-height: .98; margin: 22px 0 26px;
          color: var(--cream);
        }
        .screen-copy p { max-width: 42ch; font-size: 16px; line-height: 1.6; color: var(--dark-soft); }
        .screen-photo { position: relative; overflow: hidden; height: 100%; min-height: 0; background: #2a241b; }
        .screen-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* DINING (02) */
        .dining-screen {
          position: relative;
          min-height: 96vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 130px 6% 46px;
          color: #fff;
          overflow: hidden;
        }
        .dining-screen .bg-photo {
          position: absolute; inset: 0; z-index: 1;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          background-color: #2a241b;
        }
        .dining-screen .scrim {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(180deg, rgba(20,17,12,.42) 0%, rgba(20,17,12,.05) 30%, rgba(20,17,12,.1) 60%, rgba(20,17,12,.55) 100%);
        }
        .dining-screen .dining-heading,
        .dining-screen .dining-foot {
          position: relative; z-index: 3;
        }
        .dining-heading h2 {
          font-family: 'Playfair Display', serif; font-weight: 500;
          display: flex; align-items: baseline; flex-wrap: wrap; gap: 16px;
          font-size: clamp(44px, 6.4vw, 88px); line-height: 1;
        }
        .dining-heading h2 .small { font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: clamp(16px, 1.7vw, 22px); letter-spacing: .01em; }
        .dining-foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .dining-foot .hours-line { font-size: 12.5px; letter-spacing: .2em; text-transform: uppercase; font-weight: 700; }

        /* SUITES EXPERIENCE (03) */
        .suites-screen { background: var(--taupe); padding: 130px 6% 0; }
        .suites-screen-head { max-width: 640px; margin-bottom: 46px; }
        .suites-screen-head h2 {
          font-family: 'Playfair Display', serif; font-weight: 500;
          font-size: clamp(44px, 5.6vw, 76px); line-height: .98; margin: 22px 0 20px;
        }
        .suites-screen-head p { font-size: 16px; color: var(--ink-soft); max-width: 44ch; }
        .suite-strip { display: flex; width: 100%; height: 46vh; min-height: 300px; }
        .suite-strip-panel { flex: 1 1 0; overflow: hidden; position: relative; }
        .suite-strip-panel:nth-child(5) { flex: 2.1 1 0; }
        .suite-strip-panel img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .suites-screen-foot { display: flex; justify-content: flex-end; padding: 26px 0 30px; }

        /* EVENTS (04) */
        .events-screen { background: var(--dark); color: var(--cream); padding: 120px 6% 0; }
        .events-head h2 {
          font-family: 'Playfair Display', serif; font-weight: 500;
          font-size: clamp(36px, 5.4vw, 70px); line-height: 1.04; margin-top: 18px; max-width: 16ch;
        }
        .events-head .eyebrow-num { color: var(--dark-soft); }
        .events-photo { position: relative; margin-top: 46px; height: 56vh; min-height: 340px; overflow: hidden; }
        .events-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .events-photo .pill-btn { position: absolute; right: 26px; bottom: 26px; }
        .events-cols {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--line-dark);
        }
        .events-col { padding: 26px 24px 34px; border-left: 1px solid var(--line-dark); }
        .events-col:first-child { border-left: none; }
        .events-col .idx { font-size: 12px; color: var(--amber); font-weight: 700; letter-spacing: .1em; }
        .events-col h3 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 19px; margin: 10px 0 8px; }
        .events-col p { font-size: 13.5px; color: var(--dark-soft); line-height: 1.5; }

        .beauty-split { position: relative; display: grid; grid-template-columns: 1fr 1fr; height: 68vh; min-height: 420px; }
        .beauty-panel { position: relative; overflow: hidden; }
        .beauty-panel img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .beauty-panel::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(15,12,8,0) 55%, rgba(15,12,8,.65) 100%);
        }
        .beauty-caption {
          position: absolute; left: 6%; bottom: 64px; z-index: 2; color: #fff; max-width: 60%;
        }
        .beauty-caption .eyebrow-num { color: rgba(255,255,255,.8); }
        .beauty-caption h3 {
          font-family: 'Playfair Display', serif; font-weight: 500; font-style: italic;
          font-size: clamp(32px, 4.6vw, 58px); margin-top: 10px;
        }
        .beauty-strapline { background: var(--dark); color: var(--dark-soft); padding: 20px 6%; font-size: 13.5px; }

        /* BOOK (05) */
        .book-screen { background: var(--taupe); padding: 130px 6% 60px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px; align-items: center; min-height: 88vh; }
        .book-eyebrow { margin-bottom: 26px; }
        .book-mark { width: 46px; height: 34px; color: var(--ink); margin-bottom: 18px; }
        .book-logo-main { font-family: 'Playfair Display', serif; font-size: 30px; }
        .book-logo-script { font-size: 17px; margin-top: -4px; }
        .book-address { margin-top: 30px; font-size: 14.5px; line-height: 1.7; color: var(--ink-soft); }
        .book-address strong { display: block; font-family: 'Playfair Display', serif; font-size: 21px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }

        .map-card {
          position: relative; height: 62vh; min-height: 340px; border-radius: 22px;
          background: #cfe3d3; overflow: hidden; border: 1px solid rgba(255,255,255,.4);
        }
        .map-card svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .map-pin {
          position: absolute; left: 46%; top: 44%; display: flex; align-items: center; gap: 8px;
          transform: translate(-50%, -100%);
        }
        .map-pin .dot { width: 16px; height: 16px; border-radius: 50% 50% 50% 0; background: #c0443a; transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(0,0,0,.25); }
        .map-pin .label { background: #fff; padding: 5px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,.14); white-space: nowrap; }
        .map-chip { position: absolute; display: flex; align-items: center; gap: 6px; background: #fff; padding: 5px 9px 5px 5px; border-radius: 999px; font-size: 11px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
        .map-chip .swatch { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: 10px; }

        /* FOOTER */
        .footer-bar { background: var(--dark); color: var(--cream); display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; padding: 26px 5%; }
        .footer-contacts { display: flex; align-items: center; gap: 22px; }
        .footer-contacts a { display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; font-size: 14px; }
        .footer-icon { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--line-dark); display: grid; place-items: center; }
        .footer-icon svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.6; }
        .footer-right { display: flex; align-items: center; gap: 24px; }
        .footer-tag { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600; color: var(--dark-soft); }

        /* MENU DETAIL (supporting section, reached via CHECK MENU) */
        .menu-detail { padding: 90px 6%; background: var(--cream); }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; margin-bottom: 40px; flex-wrap: wrap; }
        .section-header h2 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: clamp(34px, 4vw, 50px); margin-top: 12px; }
        .section-header p { max-width: 36ch; color: var(--ink-soft); }
        .filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 34px; }
        .filter { border: 1px solid var(--line-light); background: transparent; border-radius: 999px; padding: 9px 18px; font-size: 13px; cursor: pointer; transition: .2s; }
        .filter.active, .filter:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
        .menu-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .menu-card { background: #fff; border: 1px solid var(--line-light); border-radius: 16px; overflow: hidden; }
        .menu-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .art.menu-img { aspect-ratio: 4/3; }
        .menu-content { padding: 16px; }
        .menu-category { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 6px; }
        .menu-name { font-family: 'Playfair Display', serif; font-size: 18px; margin-bottom: 6px; }
        .menu-price { font-size: 14px; color: var(--ink-soft); }
        .menu-more { display: flex; justify-content: center; margin-top: 34px; }

        /* SUITES DETAIL */
        .suites-detail { padding: 90px 6%; background: #f1ece0; }
        .suite-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .suite-gallery { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .suite-gallery-track { display: flex; height: 100%; transition: transform .5s ease; }
        .suite-img { width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; display: block; }
        .suite-gallery-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; border-radius: 50%; border: none; background: rgba(255,255,255,.85); cursor: pointer; font-size: 16px; }
        .suite-gallery-nav.prev { left: 10px; } .suite-gallery-nav.next { right: 10px; }
        .suite-gallery-dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; }
        .suite-gallery-dot { width: 6px; height: 6px; border-radius: 50%; border: none; background: rgba(255,255,255,.55); cursor: pointer; padding: 0; }
        .suite-gallery-dot.active { background: #fff; }
        .suite-content { padding: 18px; }
        .suite-blurb { font-size: 14px; color: var(--ink-soft); margin: 8px 0 12px; line-height: 1.55; }
        .suite-features { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .suite-features li { font-size: 12px; border: 1px solid var(--line-light); border-radius: 999px; padding: 5px 12px; }
        .suite-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }

        /* RESPONSIVE */
        @media (max-width: 980px) {
          .nav-links { display: none; position: fixed; top: 78px; left: 0; right: 0; background: var(--cream); color: var(--ink); flex-direction: column; align-items: flex-start; gap: 18px; padding: 26px 6%; border-bottom: 1px solid var(--line-light); }
          .nav-links.open { display: flex; }
          .mobile-toggle { display: block; }
          .triptych { height: 60vh; min-height: 380px; }
          .hero-lockup { padding: 0 6%; max-width: 100%; }
          .hero-lockup .tag { letter-spacing: .16em; font-size: 11px; text-align: center; }
          .hero-bar { grid-template-columns: 1fr; text-align: left; margin-bottom: 32px; }
          .hero-bar-right { align-items: flex-start; text-align: left; }
          .screen-split { grid-template-columns: 1fr; height: auto; }
          .screen-photo { height: 300px; min-height: 300px; order: -1; }
          .screen-copy { padding: 90px 6% 50px; }
          .suite-strip { flex-direction: column; height: auto; }
          .suite-strip-panel, .suite-strip-panel:nth-child(5) { flex: none; height: 42vw; min-height: 180px; }
          .events-cols { grid-template-columns: 1fr 1fr; }
          .events-col:nth-child(3) { border-left: none; }
          .beauty-split { grid-template-columns: 1fr; height: auto; }
          .beauty-panel { height: 42vw; min-height: 220px; }
          .beauty-caption { max-width: 90%; bottom: 30px; }
          .book-screen { grid-template-columns: 1fr; padding-top: 100px; }
          .menu-grid { grid-template-columns: repeat(2, 1fr); }
          .suite-grid { grid-template-columns: 1fr; }
          .footer-bar { flex-direction: column; align-items: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .pill-btn, .triptych-video-media { transition: none; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar" aria-label="Main">
        <button className="nav-logo" onClick={() => scrollTo("home")}>
          <span className="nav-logo-main">Hima</span>
          <span className="nav-logo-sub">by Menzel</span>
        </button>

        <div className={`nav-links ${mobileMenu ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? "×" : "☰"}
        </button>
      </nav>

      {/* HERO */}
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
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
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
            <p>Where contemporary Asian flavors meet the timeless landscape of Mount Batur.</p>
            <div className="hero-bar-actions">
              <button className="pill-btn" onClick={() => scrollTo("menu")}>Dine With Us</button>
              <button className="pill-btn pill-btn--outline" onClick={() => scrollTo("suites-detail")}>
                Stay With Us
              </button>
            </div>
          </div>
          <div className="hero-bar-right">
            <p>A warm mountain hideaway where food, views and meaningful moments meet.</p>
            <div className="hours">{SITE.hoursShort}</div>
          </div>
        </div>
      </div>

      {/* 01 / THE HIMA EXPERIENCE */}
      <section className="screen screen-split" id="experience" aria-label="The Hima Experience">
        <div className="screen-copy">
          <div className="eyebrow-num"><span className="num">01</span> / The Hima Experience</div>
          <h2 className="serif">
            A place to
            <br />
            slow down.
          </h2>
          <p>A contemporary Asian Fusion Bistro and boutique stay in the heart of Kintamani, shaped by the landscape.</p>
        </div>
        <div className="screen-photo">
          <Art src={EXPERIENCE_PHOTO} alt="Guests relaxing on the terrace under an umbrella" variant={1} />
        </div>
      </section>

      {/* 02 / DINING */}
      <section className="dining-screen" id="dining" aria-label="Dining">
        <img
          className="bg-photo"
          src={DINING_PHOTO}
          alt="A signature dish at Hima by Menzel"
        />
        <div className="scrim" />

        <div className="dining-heading">
          <div className="eyebrow-num"><span className="num">02</span> / Dining</div>
          <h2 className="serif">
            Asian Fusion
            <span className="small">with a sense of place.</span>
          </h2>
        </div>

        <div className="dining-foot">
          <button className="pill-btn pill-btn--light" onClick={() => scrollTo("menu")}>Check Menu</button>
          <div className="hours-line">Breakfast · Brunch · Lunch · Dinner</div>
        </div>
      </section>

      {/* 03 / THE SUITES */}
      <section className="suites-screen" id="suites" aria-label="Suites Experience">
        <div className="suites-screen-head">
          <div className="eyebrow-num"><span className="num">03</span> / The Suites</div>
          <h2 className="serif">
            Stay above
            <br />
            the clouds.
          </h2>
          <p>{suiteCountWord} private suites surrounded by the quiet beauty of Kintamani.</p>
        </div>

        <div className="suite-strip">
          {SUITE_STRIP_PHOTOS.map((src, i) => (
            <div className="suite-strip-panel" key={src}>
              <Art src={src} alt={`Hima suite detail ${i + 1}`} variant={(i % 3) + 1} />
            </div>
          ))}
        </div>

        <div className="suites-screen-foot">
          <button className="pill-btn" onClick={() => scrollTo("suites-detail")}>Book Now</button>
        </div>
      </section>

      {/* 04 / EXPERIENCE (Dine, Stay, Gather, Celebrate) */}
      <section className="events-screen" id="events" aria-label="Events">
        <div className="events-head">
          <div className="eyebrow-num"><span className="num">04</span> / Experience</div>
          <h2 className="serif">Dine. Stay. Gather. Celebrate.</h2>
        </div>

        <div className="events-photo">
          <Art src={EVENTS_PHOTO} alt="A private celebration set up on the terrace" variant={1} />
          <button className="pill-btn pill-btn--light" onClick={() => scrollTo("book")}>Plan Your Event</button>
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
            <Art src={BEAUTY_PHOTOS.left} alt="Guests overlooking Mount Batur at sunrise" variant={3} />
          </div>
          <div className="beauty-panel">
            <Art src={BEAUTY_PHOTOS.right} alt="A couple celebrating on the terrace" variant={2} />
          </div>
          <div className="beauty-caption">
            <div className="eyebrow-num">The Beauty of Kintamani</div>
            <h3 className="serif">Wake up, dine and gather</h3>
          </div>
        </div>
        <div className="beauty-strapline">surrounded by the natural beauty of Bali's highlands.</div>
      </section>

      {/* 05 / BOOK */}
      <section className="book-screen" id="book" aria-label="Book">
        <div>
          <div className="eyebrow-num book-eyebrow"><span className="num">05</span> / Book</div>

          <Mark className="book-mark" />
          <div className="book-logo-main serif">Hima</div>
          <div className="book-logo-script script">by Menzel</div>

          <div className="book-address">
            <strong>{SITE.addressShort}</strong>
            {SITE.addressLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>

          <div className="hero-bar-actions" style={{ marginTop: 30 }}>
            <a
              className="pill-btn"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
            <a className="pill-btn pill-btn--outline" href={wa("Hello, can I book a table or a suite?")} target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
          </div>
        </div>

        <div className="map-card" role="img" aria-label={`Map showing ${SITE.name} in ${SITE.addressShort}`}>
          <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
            <path d="M40 20 L200 130 L230 300" stroke="#fff" strokeWidth="10" fill="none" opacity=".7" />
            <path d="M0 210 L200 130 L400 190" stroke="#fff" strokeWidth="6" fill="none" opacity=".55" />
          </svg>
          <div className="map-pin">
            <div className="dot" />
            <div className="label">{SITE.name}</div>
          </div>
          <div className="map-chip" style={{ left: "16%", top: "18%" }}>
            <span className="swatch" style={{ background: "#3f8f5c" }}>◆</span> Hutan Pinus
          </div>
          <div className="map-chip" style={{ left: "58%", top: "62%" }}>
            <span className="swatch" style={{ background: "#e08a2f" }}>🍴</span> Lunamoon
          </div>
          <div className="map-chip" style={{ left: "78%", top: "40%" }}>
            <span className="swatch" style={{ background: "#c0439a" }}>🏕</span> Black Lava Camp
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-bar">
        <div className="footer-contacts">
          <a href={wa("Hello, can I book a table or a suite?")} target="_blank" rel="noopener noreferrer">
            <span className="footer-icon">
              <svg viewBox="0 0 24 24"><path d="M4 20l1.4-4.2A8 8 0 1112 20a8 8 0 01-4.2-1.2L4 20z" /></svg>
            </span>
            {SITE.phone}
          </a>
          <a href={`https://www.instagram.com/${SITE.instagram}/`} target="_blank" rel="noopener noreferrer">
            <span className="footer-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /></svg>
            </span>
            @{SITE.instagram}
          </a>
          <a href={`mailto:${SITE.email}`}>
            <span className="footer-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
            </span>
          </a>
        </div>

        <div className="footer-right">
          <div className="footer-tag">Dine · Stay · Gather · Celebrate</div>
          <a className="pill-btn pill-btn--light" href={wa("Hello, can I book a table or a suite?")} target="_blank" rel="noopener noreferrer">
            Book Now
          </a>
        </div>
      </footer>

      {/* MENU DETAIL — reached via "Check Menu" */}
      <section className="menu-detail" id="menu" aria-label="Menu">
        <div className="section-header">
          <div>
            <div className="eyebrow-num"><span className="num">—</span> From the Kitchen</div>
            <h2>Our favourites</h2>
          </div>
          <p>Simple, fresh and generous. A short menu, cooked properly and served warm.</p>
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
              <Art className="menu-img" src={item.img} variant={((index % 3) + 1)} alt={item.name} />
              <div className="menu-content">
                <div className="menu-category">{item.category}</div>
                <div className="menu-name serif">{item.name}</div>
                {item.price && <div className="menu-price">{item.price}</div>}
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length > MENU_PAGE_SIZE && (
          <div className="menu-more">
            <button type="button" className="pill-btn pill-btn--outline" onClick={() => setShowAllDishes((s) => !s)}>
              {showAllDishes
                ? "Show less"
                : `Show all ${filteredItems.length} ${activeCategory === "All" ? "dishes" : activeCategory.toLowerCase()}`}
            </button>
          </div>
        )}
      </section>

      {/* SUITES DETAIL — reached via "Book Now" */}
      <section className="suites-detail" id="suites-detail" aria-label="Reserve a suite">
        <div className="section-header">
          <div>
            <div className="eyebrow-num"><span className="num">—</span> Stay With Us</div>
            <h2>Reserve a suite</h2>
          </div>
          <p>{suiteCountWord} quiet rooms above the restaurant. Every stay includes breakfast downstairs.</p>
        </div>

        <div className="suite-grid">
          {suites.map((s) => (
            <article className="menu-card" key={s.name}>
              <SuiteGallery images={s.images} variant={s.variant} alt={s.name} />
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
                  <div className="menu-price"><strong>{s.price}</strong> per night</div>
                  <a
                    className="pill-btn pill-btn--outline"
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
    </div>
  );
}