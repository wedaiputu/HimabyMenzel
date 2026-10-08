import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { NAV_ITEMS } from "../data/navItems";
import { categories, MENU_ITEMS } from "../data/menu";
// import "../HimaTemplate3.css";

/* Page + hero background (same for every category) and text color */
const BG = "#928572";
const INK = "#1f1510";

/* Accent per category (big word, glow, active tab). Same order as `categories`. */
const PALETTE = ["#5b1a7a", "#b4390f", "#14532d", "#1e3a8a", "#881337", "#78350f", "#134e4a", "#3f3f46"];

/* "cover"   -> normal food photos (round plates)
   "contain" -> transparent cut-out PNGs */
const IMAGE_FIT = "cover";

/* Floating dishes. l/t = position %, k = size factor, dx/dy = scroll drift (px),
   rot = scroll spin (deg), mx = mouse parallax (px).
   `m` = the position used on phones, so all 5 fit around the main dish. */
const FLOATS = [
  { l: "10%", t: "27%", k: 1.0, dx: -130, dy: -70, rot: -90, mx: 18, m: { l: "15%", t: "21%", k: 1.0 } },
  { l: "88%", t: "25%", k: 0.85, dx: 150, dy: -90, rot: 120, mx: -24, m: { l: "85%", t: "18%", k: 0.85 } },
  { l: "8%", t: "70%", k: 1.15, dx: -170, dy: 90, rot: 70, mx: 26, m: { l: "11%", t: "52%", k: 0.95 } },
  { l: "90%", t: "68%", k: 1.0, dx: 180, dy: 100, rot: -110, mx: -18, m: { l: "89%", t: "58%", k: 0.9 } },
  { l: "70%", t: "88%", k: 0.7, dx: 70, dy: 150, rot: 160, mx: 30, m: { l: "80%", t: "76%", k: 0.75 } },
];

/* Space under the fixed navbar (smaller on phones) */
const NAV_OFFSET = "clamp(72px, 12vw, 96px)";
const HERO_HEIGHT = `calc(100svh - ${NAV_OFFSET})`;

/* Font: uses your --font-body, defined here too so it always resolves */
const FONT_BODY = '"HT Grotesk", sans-serif';

const pick = (item, keys, fallback = "") => {
  for (const k of keys) if (item?.[k] !== undefined && item[k] !== "") return item[k];
  return fallback;
};
const labelOf = (c) => (typeof c === "string" ? c : c.name ?? c.label ?? c.title);
const imgOf = (item) => pick(item, ["image", "img", "src"]);
const pad = (n) => String(n).padStart(2, "0");
const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/* Your data uses image file names as names (e.g. "dsc04349_b3pma6").
   Those are replaced by the category until real dish names are added. */
function titleOf(item) {
  const raw = String(pick(item, ["name", "title"]));
  const looksLikeFile = /\.(jpe?g|png|webp|avif)$/i.test(raw) || /^[a-z]*\d{3,}[\w-]*$/i.test(raw);
  if (raw && !looksLikeFile) return raw;
  return String(pick(item, ["dish", "label"], item.category || "chef's pick"));
}

/* true on phone-sized screens */
function useIsMobile(max = 639) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(`(max-width: ${max}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${max}px)`);
    const h = () => setM(mq.matches);
    h();
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h));
  }, [max]);
  return m;
}

/* true shortly after `dep` changes -> lets CSS transitions replay on every swap */
function useEntered(dep) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    const t = setTimeout(() => setOn(true), 40);
    return () => clearTimeout(t);
  }, [dep]);
  return on;
}

const dishShape =
  IMAGE_FIT === "cover"
    ? "rounded-full object-cover ring-[6px] ring-white shadow-2xl shadow-[#3c230a]/25"
    : "object-contain drop-shadow-[0_22px_24px_rgba(60,35,10,0.30)]";

/* ---------------------------------------------------------------- HERO */
function Hero({ word, color, pool, idx, setIdx, active, onTab }) {
  const n = pool.length;
  const featured = pool[idx];
  const entered = useEntered(`${word}-${idx}`);
  const touchX = useRef(null);
  const isMobile = useIsMobile();

  // the next dishes in line float around the main one
  const floatCount = Math.min(FLOATS.length, Math.max(n - 1, 0));
  const floats = Array.from({ length: floatCount }, (_, i) => {
    const real = (idx + 1 + i) % n;
    return { item: pool[real], real };
  });

  const go = (d) => n && setIdx((idx + d + n) % n);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    e.currentTarget.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  }
  function onLeave(e) {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  }
  // swipe left / right on touch screens
  function onTouchEnd(e) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }

  // long words get a smaller watermark so they still fit on phones
  const wordVw = Math.min(21, 150 / Math.max(word.length, 1));
  const baseFloat = isMobile ? "clamp(54px, 17vw, 92px)" : "clamp(52px, 12vmin, 160px)";
  const drift = isMobile ? 0.5 : 1; // bubbles drift less on small screens

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
      style={{ height: HERO_HEIGHT, minHeight: 480, backgroundColor: BG, color: INK }}
      className="relative block w-full overflow-hidden"
    >
      {/* soft glow in the category color */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(circle at 50% 50%, ${hexA(color, 0.22)}, transparent 62%)` }}
      />

      {/* huge word behind everything */}
      <div className="pointer-events-none absolute inset-0 grid select-none place-items-center">
        <span
          className={`whitespace-nowrap uppercase leading-none transition-all duration-700 ${
            entered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            color: hexA(color, 0.14),
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontSize: `clamp(64px, ${wordVw}vw, 300px)`,
            transform: "translate3d(calc(var(--p, 0) * -200px), calc(var(--p, 0) * -40px), 0)",
          }}
        >
          {word}
        </span>
      </div>

      {/* floating dishes */}
      {floats.map(({ item, real }, i) => {
        const f = FLOATS[i];
        const pos = isMobile ? f.m : f;
        return (
          <button
            key={`float-${i}`}
            type="button"
            onClick={() => setIdx(real)}
            aria-label={`Show ${titleOf(item)}`}
            className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out hover:scale-110 ${
              entered ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            style={{
              left: pos.l,
              top: pos.t,
              width: `calc(${baseFloat} * ${pos.k})`,
              transitionDelay: `${i * 70}ms`,
            }}
          >
            <span
              className="block h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `translate3d(calc(var(--mx, 0) * ${f.mx}px), calc(var(--my, 0) * ${f.mx}px), 0)` }}
            >
              <span
                className="block h-full w-full"
                style={{
                  transform: `translate3d(calc(var(--p, 0) * ${f.dx * drift}px), calc(var(--p, 0) * ${f.dy * drift}px), 0) rotate(calc(var(--p, 0) * ${f.rot}deg))`,
                }}
              >
                <img src={imgOf(item)} alt="" loading="lazy" className={`h-full w-full ${dishShape}`} />
              </span>
            </span>
          </button>
        );
      })}

      {/* main dish: spins, drifts down and shrinks while you scroll */}
      {featured && (
        <div
          className={`absolute left-1/2 top-[47%] aspect-square -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${
            entered ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{ width: "clamp(190px, 46vmin, 470px)" }}
        >
          <div
            className="h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: "translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -14px), 0)" }}
          >
            <img
              src={imgOf(featured)}
              alt={titleOf(featured)}
              className={`h-full w-full ${dishShape}`}
              style={{
                transform:
                  "translate3d(0, calc(var(--p, 0) * 170px), 0) rotate(calc(var(--p, 0) * 140deg)) scale(calc(1 - var(--p, 0) * 0.28))",
              }}
            />
          </div>
        </div>
      )}

      {/* category tabs: scroll sideways on phones, centered on bigger screens */}
      <div
        role="tablist"
        className="absolute left-0 right-0 top-3 z-10 overflow-x-auto sm:top-6"
        style={{ padding: "0 14px", scrollbarWidth: "none" }}
      >
        <div className="flex w-max gap-2" style={{ margin: "0 auto" }}>
          {categories.map((c) => {
            const label = labelOf(c);
            const on = active === label;
            return (
              <button
                key={label}
                role="tab"
                aria-selected={on}
                onClick={() => onTab(label)}
                className="shrink-0 whitespace-nowrap rounded-full text-[13px] font-medium lowercase transition sm:text-sm"
                style={{
                  padding: "8px 16px",
                  backgroundColor: on ? color : "rgba(31,21,16,0.07)",
                  color: on ? "#fff" : INK,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* caption, bottom left */}
      {featured && (
        <div
          className={`absolute bottom-5 left-5 right-[10.5rem] transition-all duration-700 sm:bottom-9 sm:left-10 sm:right-40 ${
            entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2
            className="lowercase"
            style={{
              margin: 0,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontSize: "clamp(26px, 4.6vw, 60px)",
              overflowWrap: "anywhere",
            }}
          >
            {titleOf(featured)}
          </h2>
          {pick(featured, ["description", "desc"]) && (
            <p
              className="max-w-md text-[13px] sm:text-sm"
              style={{
                margin: "8px 0 0",
                color: "rgba(31,21,16,0.7)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {pick(featured, ["description", "desc"])}
            </p>
          )}
          {pick(featured, ["price"]) !== "" && (
            <p className="text-base font-medium sm:text-lg" style={{ margin: "10px 0 0" }}>
              {pick(featured, ["price"])}
            </p>
          )}
        </div>
      )}

      {/* prev / counter / next: bottom-right row on phones, right-side column on desktop */}
      {n > 1 && (
        <div className="absolute bottom-5 right-4 flex flex-row items-center gap-2 sm:bottom-auto sm:right-7 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous dish"
            className="grid h-10 w-10 place-items-center rounded-full border text-lg transition hover:text-white"
            style={{ borderColor: "rgba(31,21,16,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">↑</span>
          </button>
          <span className="flex items-center gap-1 text-xs tabular-nums sm:flex-col sm:gap-0" style={{ opacity: 0.75 }}>
            <span>{pad(idx + 1)}</span>
            <span className="sm:hidden">/</span>
            <span style={{ opacity: 0.55 }}>{pad(n)}</span>
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next dish"
            className="grid h-10 w-10 place-items-center rounded-full border text-lg transition hover:text-white"
            style={{ borderColor: "rgba(31,21,16,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span className="sm:hidden">→</span>
            <span className="hidden sm:inline">↓</span>
          </button>
        </div>
      )}

      {n === 0 && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center" style={{ opacity: 0.6 }}>
          no dishes with photos in this category yet.
        </p>
      )}

      <p className="absolute bottom-4 right-6 hidden text-xs sm:block" style={{ opacity: 0.5 }}>
        scroll ↓
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- PAGE */
export default function MenuTemplate() {
  const [activeCategory, setActiveCategory] = useState("Recomended");
  const [idx, setIdx] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // scroll progress (0 -> 1) written to a CSS variable (no re-renders)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = el.firstElementChild;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const range = Math.max(1, Math.min((hero ? hero.offsetHeight : 600) * 0.8, maxScroll));
      el.style.setProperty("--p", reduce ? "0" : Math.min(1, Math.max(0, window.scrollY / range)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // every dish of the active category that has a photo
  const pool = useMemo(
    () =>
      (activeCategory === "All" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === activeCategory)).filter((i) =>
        imgOf(i)
      ),
    [activeCategory]
  );

  const catIdx = Math.max(0, categories.findIndex((c) => labelOf(c) === activeCategory));
  const color = PALETTE[catIdx % PALETTE.length];

  function selectCategory(category) {
    setActiveCategory(category);
    setIdx(0);
  }

  return (
    <div
      className="hima-page mt-root min-h-screen"
      style={{ "--font-body": FONT_BODY, fontFamily: "var(--font-body)", backgroundColor: BG, color: INK }}
      lang="en"
    >
      {/* make buttons use the page font */}
      <style>{`.mt-root button { font-family: inherit; }`}</style>

      <Navbar navItems={NAV_ITEMS} />

      <main style={{ width: "100%", margin: 0, padding: `${NAV_OFFSET} 0 0`, boxSizing: "border-box" }}>
        <div ref={trackRef}>
          <Hero
            word={activeCategory == "Recomended" ? "menu" : activeCategory}
            color={color}
            pool={pool}
            idx={Math.min(idx, Math.max(pool.length - 1, 0))}
            setIdx={setIdx}
            active={activeCategory}
            onTab={selectCategory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}