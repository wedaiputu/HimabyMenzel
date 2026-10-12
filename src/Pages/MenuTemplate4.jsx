import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Navbar2 from "../Components/Navbar2";
import Footer from "../Components/Footer";
import "../HimaTemplate3.css";

/* ------------------------------------------------------------------
   Hima Menu Template 4
   Source: Cloudinary folder "Hima_Menu3" (cloud: dimnv9sq5)
   Pages are sorted ascending by Cloudinary display name:
   "1", "2", then MENU_HIMA_2026_page-0005 ... page-0031
------------------------------------------------------------------- */

const CLOUD = "https://res.cloudinary.com/dimnv9sq5/image/upload";

const RAW = [
  ["1", "MENU_HIMA_2026_page-0003_bsbfki"],
  ["2", "MENU_HIMA_2026_page-0004_byctm1"],
  ...[
    "0005_ogqz7n", "0006_d3nrx5", "0007_yofvvk", "0008_plsxi4", "0009_dku9wg",
    "0010_qznwva", "0011_ccp9ln", "0012_jcpvla", "0013_mriycr", "0014_oaoc5z",
    "0015_obe4j7", "0016_ve9nlk", "0017_cpix3n", "0018_jpcgqu", "0019_zbjurn",
    "0020_yaaqaq", "0021_inxwxk", "0022_mh8byg", "0023_icltch", "0024_ooq6ky",
    "0025_nwudtb", "0026_xyeeqv", "0027_aio7no", "0028_s7vkad", "0029_soqlpg",
    "0030_dvzptx", "0031_abfcsv",
  ].map((s) => [`MENU_HIMA_2026_page-${s}`, `MENU_HIMA_2026_page-${s}`]),
];

const PAGES = RAW.map(([display, id]) => ({ display, id }))
  .sort((a, b) => a.display.localeCompare(b.display, undefined, { numeric: true }))
  .map((p) => ({
    ...p,
    thumb: `${CLOUD}/f_auto,q_auto,w_160/${p.id}.jpg`,
    view: `${CLOUD}/f_auto,q_auto,w_1100/${p.id}.jpg`,
    full: `${CLOUD}/f_auto,q_auto,w_2000/${p.id}.jpg`,
  }));

const pad = (n) => String(n).padStart(2, "0");

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "reader", label: "Menu" },
];

export default function MenuTemplate4() {
  const total = PAGES.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [lens, setLens] = useState({ on: false, x: 0, y: 0, px: 0, py: 0 });
  const [open, setOpen] = useState(false);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  const go = useCallback(
    (n) => {
      setI((cur) => {
        const next = Math.min(total - 1, Math.max(0, n));
        if (next !== cur) setDir(next > cur ? 1 : -1);
        return next;
      });
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  // Warm the neighbouring pages so turning feels instant
  useEffect(() => {
    [i - 1, i + 1].forEach((n) => {
      if (PAGES[n]) new Image().src = PAGES[n].view;
    });
  }, [i]);

  // Keep the active thumbnail in view inside the index
  useEffect(() => {
    const el = railRef.current?.querySelector('[aria-current="page"]');
    el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [i]);

  const onMove = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    setLens({ on: true, x: e.clientX - r.left, y: e.clientY - r.top, px, py });
  };

  const page = PAGES[i];
  const progress = useMemo(() => ((i + 1) / total) * 100, [i, total]);

  return (
    <div className="hima-page menu-page">
      <Navbar2
        navItems={NAV_ITEMS}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        scrollTo={scrollTo}
      />

      {/* Opening: the cover with the next page layered behind it */}
      <section id="home" className="hm-hero">
        <div className="hm-hero-copy">
          <h2><b>Menu</b></h2>
          <p>
  Browse all {total} pages. Use arrow keys to turn, or hover to zoom in.
</p>
          <a className="pill-btn" href="#reader" onClick={() => go(0)}>Open the menu</a>
        </div>
        <div className="hm-hero-art" aria-hidden="true">
          <img className="back" src={PAGES[1].view} alt="" />
          <img className="front" src={PAGES[0].view} alt="" />
        </div>
      </section>

      <section id="reader" className="hm-reader" aria-label="Menu pages">
        <nav className="hm-rail" ref={railRef} aria-label="Page index">
          {PAGES.map((p, n) => (
            <button
              key={p.id}
              className="hm-thumb"
              aria-current={n === i ? "page" : undefined}
              aria-label={`Go to page ${n + 1}`}
              onClick={() => go(n)}
            >
              <img src={p.thumb} alt="" loading="lazy" />
              <span>{pad(n + 1)}</span>
            </button>
          ))}
        </nav>

        <div className="hm-stagewrap">
          <div
            className="hm-stage"
            ref={stageRef}
            onMouseMove={onMove}
            onMouseLeave={() => setLens((l) => ({ ...l, on: false }))}
            onClick={() => setOpen(true)}
            role="button"
            tabIndex={0}
            aria-label={`Page ${i + 1} of ${total}, open full size`}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
          >
            <img
              key={page.id}
              className={`hm-page ${dir > 0 ? "from-right" : "from-left"}`}
              src={page.view}
              alt={`Menu page ${i + 1} of ${total}`}
              draggable="false"
            />
            <span
              className="hm-lens"
              style={{
                opacity: lens.on ? 1 : 0,
                transform: `translate(${lens.x - 90}px, ${lens.y - 90}px)`,
                backgroundImage: `url(${page.full})`,
                backgroundPosition: `${lens.px}% ${lens.py}%`,
              }}
            />
          </div>
        </div>

        <aside className="hm-info">
          <div className="hm-count" aria-live="polite">
            <strong>{pad(i + 1)}</strong>
            <span>of {total}</span>
          </div>
          <div className="hm-bar" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={i + 1}>
            <i style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <div className="hm-actions">
            <button onClick={() => go(i - 1)} disabled={i === 0}>Previous page</button>
            <button onClick={() => go(i + 1)} disabled={i === total - 1}>Next page</button>
            <button onClick={() => setOpen(true)}>Read full size</button>
          </div>
        </aside>
      </section>

      <Footer />

      {open && (
        <div className="hm-lightbox" role="dialog" aria-modal="true" aria-label={`Page ${i + 1} full size`}>
          <button className="hm-close" onClick={() => setOpen(false)} autoFocus>Close</button>
          <div className="hm-scroll" onClick={() => setOpen(false)}>
            <img src={page.full} alt={`Menu page ${i + 1}, full size`} />
          </div>
          <div className="hm-lbnav">
            <button onClick={() => go(i - 1)} disabled={i === 0}>Previous</button>
            <span>{pad(i + 1)} / {total}</span>
            <button onClick={() => go(i + 1)} disabled={i === total - 1}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}