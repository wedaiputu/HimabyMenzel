import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Navbar from "../Components/Navbar";
import { NAV_ITEMS } from "../data/navItems"; // adjust path to where navItems.js lives
// Styles come from HimaTemplate3.css. If it is not already loaded globally in your app, import it here:
import "../HimaTemplate3.css";

/* ------------------------------------------------------------------ */
/*  HIMA by Menzel - MenuTemplate5                                     */
/*  Source: Cloudinary folder "Hima_Menu3" (menu pages 3-31)           */
/*  All styling comes from HimaTemplate3.css (no CSS in this file).    */
/* ------------------------------------------------------------------ */

const CLOUD = "dimnv9sq5";

// Edit these to match the real venue details.
const PHONE = "+62000000000";
const PHONE_LABEL = "+62 000 0000 0000";
const WHATSAPP = "62000000000";
const MAPS_URL = "https://maps.google.com/?q=HIMA+by+Menzel+Kintamani";

// Every page in Hima_Menu3, in page order.
const PAGES = [
  [3, "bsbfki"], [4, "byctm1"], [5, "ogqz7n"], [6, "d3nrx5"], [7, "yofvvk"],
  [8, "plsxi4"], [9, "dku9wg"], [10, "qznwva"], [11, "ccp9ln"], [12, "jcpvla"],
  [13, "mriycr"], [14, "oaoc5z"], [15, "obe4j7"], [16, "ve9nlk"], [17, "cpix3n"],
  [18, "jpcgqu"], [19, "zbjurn"], [20, "yaaqaq"], [21, "inxwxk"], [22, "mh8byg"],
  [23, "icltch"], [24, "ooq6ky"], [25, "nwudtb"], [26, "xyeeqv"], [27, "aio7no"],
  [28, "s7vkad"], [29, "soqlpg"], [30, "dvzptx"], [31, "abfcsv"],
].map(([n, id]) => ({
  page: n,
  id: `MENU_HIMA_2026_page-${String(n).padStart(4, "0")}_${id}`,
}));

// Category filters. `from`/`to` are page numbers (inclusive).
// The filter row appears when there is more than one entry. Example:
//   { key: "brunch",  label: "Brunch",  from: 3,  to: 5  },
//   { key: "western", label: "Western", from: 6,  to: 9  },
const CATEGORIES = [{ key: "all", label: "Full menu", from: 0, to: 999 }];

const img = (id, w) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${w}/${id}`;

const iconProps = {
  className: "footer-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export default function MenuTemplate5() {
  const [cat, setCat] = useState(CATEGORIES[0].key);
  const [open, setOpen] = useState(null); // index within visible pages
  const [mobileMenu, setMobileMenu] = useState(false);
  const closeRef = useRef(null);

  const visible = useMemo(() => {
    const c = CATEGORIES.find((x) => x.key === cat) || CATEGORIES[0];
    return PAGES.filter((p) => p.page >= c.from && p.page <= c.to);
  }, [cat]);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d) => setOpen((i) => (i === null ? i : Math.min(visible.length - 1, Math.max(0, i + d)))),
    [visible.length]
  );

  const scrollTo = useCallback((id) => {
    setMobileMenu(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open !== null ? visible[open] : null;
  const first = PAGES[0];
  const second = PAGES[1];

  return (
    <div className="hima-page menu-page" style={{ background: "var(--taupe-deep)" }}>
      <Navbar
        navItems={NAV_ITEMS}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        scrollTo={scrollTo}
      />

      {/* Hero */}
      <section className="hm-hero" id="experience">
        <div className="hm-hero-copy">
          <p className="eyebrow-num" style={{ marginBottom: 18 }}>Kintamani, Bali</p>
          <h2 style={{ fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 1.02 }}>
            Good Food.<br />Good View.<br />Good Time.
          </h2>
          <p>
            An Asian fusion bistro shaped by the highlands, thoughtful flavours,
            and the beauty of slowing down.
          </p>
          <button type="button" className="pill-btn pill-btn--light" onClick={() => scrollTo("dining")}>
            Explore the menu
          </button>
          <p className="eyebrow-num" style={{ marginTop: 22, fontSize: 11 }}>No pork • No lard</p>
        </div>
        <div className="hm-hero-art" aria-hidden="true">
          <img className="back" src={img(second.id, 700)} alt="" loading="eager" />
          <img className="front" src={img(first.id, 700)} alt="" loading="eager" />
        </div>
      </section>

      {/* Menu pages */}
      <section className="menu-detail" id="dining">
        <div className="section-header">
          <div>
            <span className="eyebrow-num">The menu</span>
            <h2>A menu made to explore</h2>
          </div>
          <p>Tap any page to read it full size, then move through the menu with the arrows.</p>
        </div>

        {CATEGORIES.length > 1 && (
          <div className="filters" role="group" aria-label="Menu categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`filter ${cat === c.key ? "active" : ""}`}
                aria-pressed={cat === c.key}
                onClick={() => setCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="menu-grid">
          {visible.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="menu-card"
              style={{ width: "100%", textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit" }}
              onClick={() => setOpen(i)}
              aria-label={`Open menu page ${p.page}`}
            >
              <img
                className="menu-img"
                style={{ aspectRatio: "1241 / 1754" }}
                src={img(p.id, 520)}
                srcSet={`${img(p.id, 520)} 520w, ${img(p.id, 900)} 900w`}
                sizes="(min-width: 981px) 22vw, 46vw"
                alt={`HIMA menu page ${p.page}`}
                width="1241"
                height="1754"
                loading={i < 4 ? "eager" : "lazy"}
              />
              <div className="menu-content">
                <div className="menu-category">Menu</div>
                <div className="menu-name">Page {p.page}</div>
                <div className="menu-price">Tap to read</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Suites */}
      <section className="suites-screen" id="suites">
        <div className="suites-screen-head">
          <span className="eyebrow-num">Suite rooms</span>
          <h2>Seven suites.<br />One unforgettable view.</h2>
          <p>
            Six intimate suites for couples, one spacious Family Suite, and a
            peaceful Kintamani escape.
          </p>
        </div>
        <div className="suites-screen-foot">
          <a className="pill-btn pill-btn--light" href={`https://wa.me/${WHATSAPP}`}>
            Discover the suites
          </a>
        </div>
      </section>

      {/* Book / footer */}
      <footer className="footer-bar" id="book">
        <div className="footer-contacts">
          <a className="footer-contact-item" href={MAPS_URL} target="_blank" rel="noreferrer">
            <svg {...iconProps}>
              <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>Directions</span>
          </a>
          <a className="footer-contact-item" href={`https://wa.me/${WHATSAPP}`}>
            <svg {...iconProps}>
              <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" />
            </svg>
            <span>WhatsApp</span>
          </a>
          <a className="footer-contact-item" href={`tel:${PHONE}`}>
            <svg {...iconProps}>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </svg>
            <span className="phone-num">{PHONE_LABEL}</span>
          </a>
        </div>
        <div className="footer-right">
          <a className="footer-btn" href={`https://wa.me/${WHATSAPP}`}>Book a table</a>
          <span className="footer-tag">No pork • No lard</span>
        </div>
      </footer>

      {/* Full-size page viewer */}
      {current && (
        <div className="hm-lightbox" role="dialog" aria-modal="true" aria-label={`Menu page ${current.page}`}>
          <button ref={closeRef} type="button" className="hm-close" onClick={close}>Close</button>
          <div className="hm-scroll" onClick={close}>
            <img src={img(current.id, 1600)} alt={`HIMA menu page ${current.page}`} />
          </div>
          <div className="hm-lbnav">
            <button type="button" onClick={() => step(-1)} disabled={open === 0}>Previous</button>
            <span>Page {current.page}</span>
            <button type="button" onClick={() => step(1)} disabled={open === visible.length - 1}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}