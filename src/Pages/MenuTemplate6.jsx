import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Navbar from "../Components/Navbar";
// The navbar's base styles (.navbar, .nav-logo, .nav-links, .mobile-toggle) come from HimaTemplate3.css.
// If it is not already loaded globally in your app, import it here:
import "../HimaTemplate3.css";

/* ------------------------------------------------------------------ */
/*  HIMA by Menzel - MenuTemplate6 (fine-dining edition)               */
/*  Palette: HimaTemplate3.css taupe + taupe-deep, white text          */
/*  Menu text comes from the HIMA menu; printed pages from Hima_Menu3. */
/* ------------------------------------------------------------------ */

const CLOUD = "dimnv9sq5";

// Edit these to match the real venue details.
const PHONE = "+62000000000";
const PHONE_LABEL = "+62 000 0000 0000";
const WHATSAPP = "62000000000";
const MAPS_URL = "https://maps.google.com/?q=HIMA+by+Menzel+Kintamani";

// Hero photo (Cloudinary public ID, from Hima_Menu2/Mains). Swap for your best candlelit plate.
const HERO_IMAGE = "DSC04424_g2jsle";

const NAV = [
  { id: "menu", label: "Menu" },
  { id: "drinks", label: "Drinks" },
  { id: "experience", label: "Experience" },
  { id: "reservations", label: "Reservations" },
];

// Menu sections. A section with no items is skipped, so add items to
// "Desserts" or "Wine Pairings" below and they appear automatically.
// Optional per-item `diet`: ["spicy", "vegetarian", "gluten-free"] shows small icons.
const MENU = [
  {
    id: "starters",
    title: "Starters",
    items: [
      { name: "Thai Beef Salad", price: "99K", desc: "Grilled beef, aromatic leaves, red onion, cucumber, tomato, peanut, rice crisps, Thai dressing." },
      { name: "Caesar Salad", price: "79K", desc: "Baby romaine, beef bacon, parmesan, crouton, Caesar dip dressing." },
    ],
  },
  {
    id: "mains",
    title: "Main Courses",
    items: [
      { name: "Bebek Madura", price: "125K", desc: "Crispy duck, mango salsa, steamed vegetables, steamed rice, authentic Madura black sauce." },
      { name: "Salmon Steak", price: "175K", desc: "Salmon fillet, summer vegetables, beurre blanc sauce." },
    ],
  },
  {
    id: "brunch",
    title: "Brunch",
    items: [
      { name: "Turkish Egg", price: "89K", desc: "Greek yogurt, poached egg, chili oil, sourdough." },
      { name: "Avocado on Toast", price: "89K", desc: "Sourdough, avocado, tomato, feta cheese, dukkah." },
      { name: "Blueberry Pancake", price: "95K", desc: "Three-layer pancake, whipped cream cheese, blueberries, maple syrup." },
    ],
  },
  {
    id: "drinks",
    title: "Cocktails & Zero-proof",
    items: [
      { name: "Hima Bloody Martini", price: "120K", desc: "The house cocktail." },
      { name: "Watermelon Mocktail", price: "45K", desc: "Zero-proof." },
    ],
  },
  { id: "desserts", title: "Desserts", items: [] },
  { id: "wine", title: "Wine Pairings", items: [] },
];

// Printed menu pages in Hima_Menu3 (page number, Cloudinary suffix).
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

const img = (id, w, extra = "") =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${w}${extra}/${id}`;

const DIET = {
  spicy: { label: "Spicy", d: "M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 2 2 2 0-3-1-5 0-7z" },
  vegetarian: { label: "Vegetarian", d: "M5 19c0-8 5-13 14-14 0 9-5 14-14 14zM5 19l8-8" },
  "gluten-free": { label: "Gluten free", d: "M12 4v16M12 9c-2 0-3-1-3-3 2 0 3 1 3 3zm0 0c2 0 3-1 3-3-2 0-3 1-3 3zM12 15c-2 0-3-1-3-3 2 0 3 1 3 3zm0 0c2 0 3-1 3-3-2 0-3 1-3 3zM5 5l14 14" },
};

function Diet({ list }) {
  if (!list || !list.length) return null;
  return (
    <span className="lux-diet">
      {list.map((k) =>
        DIET[k] ? (
          <svg key={k} viewBox="0 0 24 24" role="img" aria-label={DIET[k].label}>
            <title>{DIET[k].label}</title>
            <path d={DIET[k].d} />
          </svg>
        ) : null
      )}
    </span>
  );
}

export default function MenuTemplate6() {
  const [open, setOpen] = useState(null); // index into PAGES
  const [mobileMenu, setMobileMenu] = useState(false);
  const closeRef = useRef(null);

  const sections = useMemo(() => MENU.filter((s) => s.items.length > 0), []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d) => setOpen((i) => (i === null ? i : Math.min(PAGES.length - 1, Math.max(0, i + d)))),
    []
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

  const current = open !== null ? PAGES[open] : null;

  return (
    <div className="hima-page lux">
      <Navbar navItems={NAV} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} scrollTo={scrollTo} />

      {/* Hero */}
      <section className="lux-hero" id="top">
        <img className="lux-hero-img" src={img(HERO_IMAGE, 2200, ",e_brightness:-20")} alt="" loading="eager" />
        <div className="lux-glow" aria-hidden="true" />
        <div className="lux-hero-inner">
          <p className="lux-kicker">Kintamani · Bali</p>
          <h1 className="lux-title">
            <img className="lux-logo" src="/Images/HimaLogo.png" alt="Hima by Menzel" />
          </h1>
          <div className="lux-rule" />
          <p className="lux-tagline">Where the highlands meet the table.</p>
          <button type="button" className="lux-btn" onClick={() => scrollTo("menu")}>
            View the menu
          </button>
        </div>
      </section>

      {/* Menu */}
      <section className="lux-menu" id="menu">
        <div className="lux-wrap">
          <div className="lux-intro">
            <span className="lux-eyebrow">The Menu</span>
            <h2 className="lux-h2">A taste of the highlands</h2>
            <p>An Asian fusion bistro shaped by the highlands, thoughtful flavours, and the beauty of slowing down.</p>
          </div>

          <div className="lux-cols">
            {sections.map((s) => (
              <div className="lux-cat" key={s.id} id={s.id === "drinks" ? "drinks" : undefined}>
                <h3 className="lux-cat-title">{s.title}</h3>
                {s.items.map((it) => (
                  <div className="lux-item" key={it.name}>
                    <div className="lux-item-head">
                      <span className="lux-item-name">
                        {it.name}
                        <Diet list={it.diet} />
                      </span>
                      <span className="lux-price">{it.price}</span>
                    </div>
                    {it.desc && <p>{it.desc}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="lux-printed">
            <button type="button" className="lux-btn" onClick={() => setOpen(0)}>
              View the printed menu
            </button>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="lux-exp" id="experience">
        <span className="lux-eyebrow">The Experience</span>
        <h2 className="lux-h2">Seven suites.<br />One unforgettable view.</h2>
        <p>Good food, good view, good time, and a suite to wake up to.</p>
        <ul className="lux-points">
          <li>Six intimate suites for couples</li>
          <li>One spacious Family Suite</li>
          <li>A peaceful Kintamani escape</li>
        </ul>
        <a className="lux-btn" href={`https://wa.me/${WHATSAPP}`}>Discover the suites</a>
      </section>

      {/* Reservations */}
      <section className="lux-res" id="reservations">
        <div className="lux-wrap">
          <span className="lux-eyebrow">Reservations</span>
          <h2 className="lux-h2">Reserve your table</h2>
          <p>Book through WhatsApp, or call us directly.</p>
          <a className="lux-btn" href={`https://wa.me/${WHATSAPP}`}>Reserve your table</a>

          <div className="lux-contact">
            <a href={MAPS_URL} target="_blank" rel="noreferrer">Directions</a>
            <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp</a>
            <a href={`tel:${PHONE}`}>{PHONE_LABEL}</a>
          </div>

          <div className="lux-foot">
            <span>HIMA by Menzel · Kintamani, Bali</span>
            <span>No pork · No lard</span>
          </div>
        </div>
      </section>

      <a className="lux-btn lux-reserve" href={`https://wa.me/${WHATSAPP}`}>Reserve Your Table</a>

      {/* Printed menu viewer */}
      {current && (
        <div className="lux-lb" role="dialog" aria-modal="true" aria-label={`Menu page ${current.page}`}>
          <button ref={closeRef} type="button" className="lux-lb-close" onClick={close}>Close</button>
          <div className="lux-lb-scroll" onClick={close}>
            <img src={img(current.id, 1600)} alt={`HIMA menu page ${current.page}`} />
          </div>
          <div className="lux-lb-nav">
            <button type="button" onClick={() => step(-1)} disabled={open === 0}>Previous</button>
            <span>Page {current.page}</span>
            <button type="button" onClick={() => step(1)} disabled={open === PAGES.length - 1}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}