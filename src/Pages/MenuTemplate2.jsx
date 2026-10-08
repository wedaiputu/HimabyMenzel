import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { NAV_ITEMS } from "../data/navItems";
import { categories, MENU_ITEMS } from "../data/menu";

/* =====================================================================
   MenuTemplate2  ·  "Dish Orbit"
   - dishes sit on a real 3D ring: drag, swipe, arrow keys or click to spin it
   - the whole scene re-tints itself when the category changes (animated CSS @property colors)
   - ⌘K / Ctrl+K opens a search palette, results jump straight to the dish
   - live order tray with animated total (hook your real checkout at `placeOrder`)
   - full menu grid below with pointer-tracked tilt + light
   Same data contract as before: categories, MENU_ITEMS { name, category, image, description, price }
   ===================================================================== */

const FONT_BODY = '"HT Grotesk", sans-serif';
const NAV_OFFSET = "clamp(72px, 12vw, 96px)";
const HERO_HEIGHT = `calc(100svh - ${NAV_OFFSET})`;
const RING_MAX = 12; // dishes on the ring at once; the grid below shows everything

/* deep accent per category (same order as `categories`); the page itself stays warm taupe #928572 / #a89c86 */
const PALETTE = ["#5b1a7a", "#b4390f", "#14532d", "#1e3a8a", "#881337", "#78350f", "#134e4a", "#3f3f46"];

/* ------------------------------------------------------------ helpers */
const pick = (item, keys, fallback = "") => {
  for (const k of keys) if (item?.[k] !== undefined && item[k] !== "") return item[k];
  return fallback;
};
const labelOf = (c) => (typeof c === "string" ? c : c.name ?? c.label ?? c.title);
const imgOf = (item) => pick(item, ["image", "img", "src"]);
const pad = (n) => String(n).padStart(2, "0");

/* data uses image file names as names (e.g. "dsc04349_b3pma6") -> fall back to the category */
function titleOf(item) {
  const raw = String(pick(item, ["name", "title"]));
  const looksLikeFile = /\.(jpe?g|png|webp|avif)$/i.test(raw) || /^[a-z]*\d{3,}[\w-]*$/i.test(raw);
  if (raw && !looksLikeFile) return raw;
  return String(pick(item, ["dish", "label"], item.category || "chef's pick"));
}

const isFileName = (raw) => /\.(jpe?g|png|webp|avif)$/i.test(raw) || /^[a-z]*\d{3,}[\w-]*$/i.test(raw);
const BASE = MENU_ITEMS.map((it, i) => ({ ...it, _k: String(it.id ?? `${it.category}-${i}`), _t: titleOf(it), _fb: isFileName(String(pick(it, ["name", "title"]))) }));
/* dishes that only have a placeholder title ("Appetizer", "Appetizer"...) get a number so you can tell them apart */
const FB_TOTAL = {};
BASE.forEach((it) => it._fb && (FB_TOTAL[it._t] = (FB_TOTAL[it._t] || 0) + 1));
const FB_SEEN = {};
const ITEMS = BASE.map((it) => {
  if (!it._fb || FB_TOTAL[it._t] < 2) return it;
  FB_SEEN[it._t] = (FB_SEEN[it._t] || 0) + 1;
  return { ...it, _t: `${it._t} ${FB_SEEN[it._t]}` };
});

/* "Rp 45.000", "$12.50", 45000 ... -> number */
function parsePrice(p) {
  if (typeof p === "number") return p;
  const s = String(p ?? "").replace(/[^\d.,]/g, "");
  if (!s) return 0;
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) return Number(s.replace(/[.,]/g, ""));
  return Number(s.replace(",", ".")) || 0;
}
/* build a formatter that mimics the menu's own price style */
const SAMPLE = String(ITEMS.map((i) => pick(i, ["price"])).find((p) => p !== "" && p != null) ?? "");
const PRICE_PREFIX = (SAMPLE.match(/^[^\d]*/) || [""])[0];
const PRICE_SUFFIX = (SAMPLE.match(/[^\d]*$/) || [""])[0];
const PRICE_LOCALE = /\d\.\d{3}\b/.test(SAMPLE) ? "id-ID" : "en-US";
const HAS_DECIMALS = ITEMS.some((i) => parsePrice(pick(i, ["price"])) % 1 !== 0);
const money = (n) =>
  `${PRICE_PREFIX}${n.toLocaleString(PRICE_LOCALE, {
    minimumFractionDigits: HAS_DECIMALS ? 2 : 0,
    maximumFractionDigits: HAS_DECIMALS ? 2 : 0,
  })}${PRICE_SUFFIX}`;

/* number that glides to its new value */
function useTween(value, ms = 600) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - k, 4);
      const cur = a + (value - a) * e;
      from.current = cur;
      setV(cur);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return v;
}

/* adds .is-in once scrolled into view */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`m2-reveal ${on ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const Icon = {
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  bag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
  left: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 5-7 7 7 7" />
    </svg>
  ),
  right: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 5 7 7-7 7" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  minus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),
};

/* ----------------------------------------------------------- add button */
function AddButton({ qty, onAdd, onRemove, big = false }) {
  const ref = useRef(null);
  // magnetic pull toward the pointer
  const move = (e) => {
    const el = ref.current;
    if (!el || qty > 0) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = "");
  if (qty > 0) {
    return (
      <div className={`m2-stepper ${big ? "m2-big" : ""}`}>
        <button type="button" onClick={onRemove} aria-label="Remove one">
          {Icon.minus}
        </button>
        <span key={qty} className="m2-pop">{qty}</span>
        <button type="button" onClick={onAdd} aria-label="Add one more">
          {Icon.plus}
        </button>
      </div>
    );
  }
  return (
    <button
      ref={ref}
      type="button"
      onClick={onAdd}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`m2-add ${big ? "m2-big" : ""}`}
    >
      {Icon.plus}
      <span>Add to order</span>
    </button>
  );
}

/* ----------------------------------------------------------------- HERO */
function Hero({ word, active, onTab, ring, t, setT, qtyOf, onAdd, onRemove, onSearch, trayCount }) {
  const heroRef = useRef(null);
  const dockRef = useRef(null);
  const dragX = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 760 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    dockRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const m = ring.length;
  const idx = m ? ((t % m) + m) % m : 0;
  const featured = ring[idx];
  const go = useCallback((d) => m > 1 && setT((v) => v + d), [m, setT]);

  /* geometry */
  const s = Math.max(130, Math.min(size.w * 0.5, (size.h - 250) * 0.8, 360));
  const step = m <= 2 ? 30 : 360 / m;
  const r = Math.max(s * 1.25, (s * 1.18) / (2 * Math.sin((step * Math.PI) / 360)));

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, [role=dialog]")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onMove = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", (((e.clientX - b.left) / b.width - 0.5) * 2).toFixed(3));
    e.currentTarget.style.setProperty("--my", (((e.clientY - b.top) / b.height - 0.5) * 2).toFixed(3));
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  };
  const down = (e) => (dragX.current = e.clientX);
  const up = (e) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  };

  const wordVw = Math.min(22, 150 / Math.max(word.length, 1));

  return (
    <section
      ref={heroRef}
      className="m2-hero"
      style={{ height: HERO_HEIGHT }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={() => (dragX.current = null)}
    >
      {/* giant outlined word, drifts sideways while scrolling */}
      <div className="m2-word" aria-hidden="true">
        <span key={word} style={{ fontSize: `clamp(70px, ${wordVw}vw, 320px)` }}>
          {word}
        </span>
      </div>

      {/* category dock + search */}
      <div className="m2-dockbar">
        <div ref={dockRef} role="tablist" aria-label="Menu categories" className="m2-dock">
          {categories.map((c) => {
            const label = labelOf(c);
            const on = active === label;
            return (
              <button key={label} role="tab" aria-selected={on} onClick={() => onTab(label)} className="m2-tab">
                {label}
              </button>
            );
          })}
        </div>
        <button type="button" className="m2-search-btn" onClick={onSearch} aria-label="Search the menu">
          {Icon.search}
          <span className="m2-hide-sm">Search</span>
          <kbd className="m2-hide-sm">Ctrl K</kbd>
        </button>
      </div>

      {/* 3D ring */}
      <div className="m2-stage" style={{ top: 64, bottom: size.w < 640 ? 214 : 176 }}>
        <div className="m2-tilt">
          {m > 0 && (
            <div
              key={active + ring[0]?._k}
              className="m2-ring"
              style={{ transform: `translateZ(${-r}px) rotateY(${-t * step}deg)` }}
            >
              {ring.map((item, i) => {
                let d = i - idx;
                if (d > m / 2) d -= m;
                if (d < -m / 2) d += m;
                const a = Math.abs(d);
                const isActive = d === 0;
                return (
                  <button
                    key={item._k}
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-label={isActive ? `${item._t}, selected` : `Show ${item._t}`}
                    onClick={() => !isActive && go(d)}
                    className={`m2-dish ${isActive ? "is-active" : ""}`}
                    style={{
                      width: s,
                      height: s,
                      marginLeft: -s / 2,
                      marginTop: -s / 2,
                      transform: `rotateY(${i * step}deg) translateZ(${r}px)`,
                      opacity: Math.max(0, 1 - a * 0.3),
                      filter: a ? `blur(${Math.min(a, 3) * 1.6}px) saturate(${1 - Math.min(a, 3) * 0.15})` : "none",
                      animationDelay: `${i * 55}ms`,
                    }}
                  >
                    <span className="m2-bob" style={{ animationDelay: `${-i * 0.7}s` }}>
                      <img src={imgOf(item)} alt="" draggable="false" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {m > 1 && (
          <>
            <button type="button" className="m2-arrow m2-prev" onClick={() => go(-1)} aria-label="Previous dish">
              {Icon.left}
            </button>
            <button type="button" className="m2-arrow m2-next" onClick={() => go(1)} aria-label="Next dish">
              {Icon.right}
            </button>
          </>
        )}
        {m === 0 && <p className="m2-empty">No dishes with photos in this category yet.</p>}
      </div>

      {/* info panel */}
      {featured && (
        <div className="m2-info" aria-live="polite">
          <div key={featured._k} className="m2-swap">
            <p className="m2-cat">{featured.category}</p>
            <h2>{featured._t}</h2>
            {pick(featured, ["description", "desc"]) && <p className="m2-desc">{pick(featured, ["description", "desc"])}</p>}
          </div>
          <div className="m2-buy">
            {pick(featured, ["price"]) !== "" && <span className="m2-price">{pick(featured, ["price"])}</span>}
            <AddButton big qty={qtyOf(featured._k)} onAdd={() => onAdd(featured)} onRemove={() => onRemove(featured)} />
          </div>
          {m > 1 && (
            <div className="m2-dots" aria-hidden="true">
              {ring.map((it, i) => (
                <i key={it._k} className={i === idx ? "on" : ""} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ GRID CARD */
function Card({ item, qty, onAdd, onRemove, onFocusDish, delay }) {
  const move = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width;
    const y = (e.clientY - b.top) / b.height;
    const el = e.currentTarget;
    el.style.setProperty("--rx", `${((x - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((0.5 - y) * 10).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const leave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  const price = pick(item, ["price"]);
  const img = imgOf(item);
  return (
    <Reveal delay={delay}>
      <article className="m2-card" onPointerMove={move} onPointerLeave={leave}>
        <button
          type="button"
          className="m2-card-media"
          onClick={() => img && onFocusDish(item)}
          disabled={!img}
          aria-label={`Show ${item._t} in the orbit`}
        >
          {img ? <img src={img} alt={item._t} loading="lazy" /> : <span className="m2-ph">{item._t.slice(0, 1)}</span>}
        </button>
        <div className="m2-card-body">
          <div>
            <h3>{item._t}</h3>
            {price !== "" && <p className="m2-price-sm">{price}</p>}
          </div>
          {qty > 0 ? (
            <div className="m2-stepper">
              <button type="button" onClick={onRemove} aria-label="Remove one">
                {Icon.minus}
              </button>
              <span>{qty}</span>
              <button type="button" onClick={onAdd} aria-label="Add one more">
                {Icon.plus}
              </button>
            </div>
          ) : (
            <button type="button" className="m2-round" onClick={onAdd} aria-label={`Add ${item._t}`}>
              {Icon.plus}
            </button>
          )}
        </div>
      </article>
    </Reveal>
  );
}

/* --------------------------------------------------------- SEARCH PALETTE */
function Palette({ onClose, onPick }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const listRef = useRef(null);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return ITEMS.slice(0, 40);
    return ITEMS.filter((i) => {
      const hay = `${i._t} ${pick(i, ["description", "desc"])} ${i.category} ${pick(i, ["price"])}`.toLowerCase();
      return words.every((w) => hay.includes(w)); // every word must match
    }).slice(0, 40);
  }, [q]);

  useEffect(() => {
    setSel(0);
  }, [q]);

  // keep the highlighted row visible while using the arrow keys
  useEffect(() => {
    listRef.current?.querySelector("button.on")?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") (e.preventDefault(), setSel((v) => Math.min(v + 1, results.length - 1)));
    if (e.key === "ArrowUp") (e.preventDefault(), setSel((v) => Math.max(v - 1, 0)));
    if (e.key === "Enter" && results[sel]) onPick(results[sel]);
  };

  return (
    <div className="m2-overlay" onMouseDown={onClose}>
      <div className="m2-palette" role="dialog" aria-modal="true" aria-label="Search the menu" onMouseDown={(e) => e.stopPropagation()}>
        <div className="m2-palette-input">
          {Icon.search}
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search dishes or categories"
            aria-label="Search"
          />
          <kbd>Esc</kbd>
        </div>
        <ul ref={listRef} className="m2-results">
          {results.map((it, i) => (
            <li key={it._k}>
              <button
                type="button"
                className={i === sel ? "on" : ""}
                onMouseEnter={() => setSel(i)}
                onClick={() => onPick(it)}
              >
                {imgOf(it) ? <img src={imgOf(it)} alt="" /> : <span className="m2-ph-sm" />}
                <span className="m2-res-t">
                  {it._t}
                  <small>{it.category}</small>
                </span>
                <span className="m2-res-p">{pick(it, ["price"])}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="m2-none">Nothing matches "{q}". Try a shorter word or a category name.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ ORDER TRAY */
function Tray({ orders, onAdd, onRemove, open, setOpen, onPlace, placed }) {
  const lines = Object.values(orders);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.qty * parsePrice(pick(l.item, ["price"])), 0);
  const shown = useTween(total);

  if (!count && !open && !placed) return null;
  return (
    <>
      {!open && count > 0 && (
        <button type="button" className="m2-fab" onClick={() => setOpen(true)} aria-label={`Open order, ${count} items`}>
          {Icon.bag}
          <span key={count} className="m2-pop m2-fab-n">{count}</span>
          <span className="m2-fab-t">{money(shown)}</span>
        </button>
      )}
      {open && (
        <div className="m2-overlay m2-overlay-r" onMouseDown={() => setOpen(false)}>
          <aside className="m2-drawer" role="dialog" aria-modal="true" aria-label="Your order" onMouseDown={(e) => e.stopPropagation()}>
            <header>
              <h3>Your order</h3>
              <button type="button" className="m2-round" onClick={() => setOpen(false)} aria-label="Close order">
                {Icon.close}
              </button>
            </header>
            {placed ? (
              <p className="m2-placed">Order sent to the kitchen. We will bring it to you shortly.</p>
            ) : (
              <>
                <ul>
                  {lines.map(({ item, qty }) => (
                    <li key={item._k}>
                      {imgOf(item) ? <img src={imgOf(item)} alt="" /> : <span className="m2-ph-sm" />}
                      <span className="m2-res-t">
                        {item._t}
                        <small>{money(qty * parsePrice(pick(item, ["price"])))}</small>
                      </span>
                      <div className="m2-stepper">
                        <button type="button" onClick={() => onRemove(item)} aria-label="Remove one">
                          {Icon.minus}
                        </button>
                        <span>{qty}</span>
                        <button type="button" onClick={() => onAdd(item)} aria-label="Add one more">
                          {Icon.plus}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer>
                  <div className="m2-total">
                    <span>Total</span>
                    <strong>{money(shown)}</strong>
                  </div>
                  <button type="button" className="m2-add m2-big m2-full" onClick={onPlace}>
                    Place order
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

/* ----------------------------------------------------------------- PAGE */
export default function MenuTemplate2() {
  const labels = categories.map(labelOf);
  const [cat, setCat] = useState(labels.includes("Recomended") ? "Recomended" : labels[0] ?? "All");
  const [start, setStart] = useState(0); // which dish the ring starts with
  const [t, setT] = useState(0); // ring turns (can grow forever, so it never spins back)
  const [orders, setOrders] = useState({});
  const [trayOpen, setTrayOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* scroll progress -> --p, pointer -> --px/--py (no re-renders) */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const range = Math.max(1, window.innerHeight * 0.7);
      el.style.setProperty("--p", reduce ? "0" : Math.min(1, Math.max(0, window.scrollY / range)).toFixed(4));
    };
    const onScroll = () => !raf && (raf = requestAnimationFrame(update));
    const onPtr = (e) => {
      el.style.setProperty("--px", `${e.clientX}px`);
      el.style.setProperty("--py", `${e.clientY}px`);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPtr, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPtr);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Ctrl/Cmd + K */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setTrayOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const inCat = useMemo(() => (cat === "All" ? ITEMS : ITEMS.filter((i) => i.category === cat)), [cat]);
  const pool = useMemo(() => inCat.filter((i) => imgOf(i)), [inCat]);
  const ring = useMemo(() => pool.slice(start).concat(pool.slice(0, start)).slice(0, RING_MAX), [pool, start]);

  const catIdx = Math.max(0, labels.indexOf(cat));
  const c1 = PALETTE[catIdx % PALETTE.length];
  const c2 = PALETTE[(catIdx + 3) % PALETTE.length];

  const selectCategory = (c) => {
    setCat(c);
    setStart(0);
    setT(0);
  };
  const focusDish = (item) => {
    const p = ITEMS.filter((i) => i.category === item.category && imgOf(i));
    setCat(item.category);
    setStart(Math.max(0, p.findIndex((i) => i._k === item._k)));
    setT(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const add = (item) =>
    setOrders((o) => ({ ...o, [item._k]: { item, qty: (o[item._k]?.qty ?? 0) + 1 } }));
  const remove = (item) =>
    setOrders((o) => {
      const q = (o[item._k]?.qty ?? 0) - 1;
      const n = { ...o };
      if (q <= 0) delete n[item._k];
      else n[item._k] = { item, qty: q };
      return n;
    });
  const qtyOf = (k) => orders[k]?.qty ?? 0;

  const placeOrder = () => {
    // TODO: send `orders` to your backend / WhatsApp / POS here
    setPlaced(true);
    setOrders({});
    setTimeout(() => {
      setPlaced(false);
      setTrayOpen(false);
    }, 2600);
  };

  const word = cat === "Recomended" ? "menu" : cat;

  return (
    <div
      ref={rootRef}
      className="m2-root"
      lang="en"
      style={{ "--font-body": FONT_BODY, "--c1": c1, "--c2": c2 }}
    >
      <style>{CSS}</style>

      {/* living background: two colors that morph with the category */}
      <div className="m2-bg" aria-hidden="true">
        <i className="m2-blob m2-b1" />
        <i className="m2-blob m2-b2" />
        <i className="m2-grain" />
        <i className="m2-spot" />
      </div>

      <Navbar navItems={NAV_ITEMS} />

      <main className="m2-main" style={{ paddingTop: NAV_OFFSET }}>
        <Hero
          word={word}
          active={cat}
          onTab={selectCategory}
          ring={ring}
          t={t}
          setT={setT}
          qtyOf={qtyOf}
          onAdd={add}
          onRemove={remove}
          onSearch={() => setSearchOpen(true)}
        />

        <section className="m2-gridwrap" aria-label="Full menu">
          <Reveal>
            <div className="m2-gridhead">
              <h2>{cat === "Recomended" ? "Everything we recommend" : `All ${cat}`}</h2>
              <p>{inCat.length} {inCat.length === 1 ? "dish" : "dishes"}. Tap a photo to bring it to the front.</p>
            </div>
          </Reveal>
          <div className="m2-grid">
            {inCat.map((item, i) => (
              <Card
                key={item._k}
                item={item}
                qty={qtyOf(item._k)}
                onAdd={() => add(item)}
                onRemove={() => remove(item)}
                onFocusDish={focusDish}
                delay={(i % 4) * 60}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {searchOpen && (
        <Palette
          onClose={() => setSearchOpen(false)}
          onPick={(it) => {
            setSearchOpen(false);
            focusDish(it);
          }}
        />
      )}
      <Tray orders={orders} onAdd={add} onRemove={remove} open={trayOpen} setOpen={setTrayOpen} onPlace={placeOrder} placed={placed} />
    </div>
  );
}

/* ----------------------------------------------------------------- CSS */
const CSS = `
@property --c1 { syntax: '<color>'; inherits: true; initial-value: #5b1a7a; }
@property --c2 { syntax: '<color>'; inherits: true; initial-value: #b4390f; }

.m2-root{
  --base:#928572; --base-2:#a89c86; --cream:#f4efe4;
  --ink:#ffffff; --ink-2:rgba(255,255,255,.84); --ink-3:rgba(255,255,255,.64);
  --glass:rgba(31,21,16,.34); --glass-2:rgba(255,255,255,.16); --line:rgba(255,255,255,.22);
  --p:0; --mx:0; --my:0; --px:50vw; --py:30vh;
  position:relative; min-height:100vh; color:var(--ink); background:var(--base);
  font-family:var(--font-body); overflow-x:clip;
  transition:--c1 1.1s ease, --c2 1.1s ease;
}
.m2-root button{font-family:inherit;color:inherit;cursor:pointer}
.m2-root button:focus-visible,.m2-root input:focus-visible{outline:2px solid var(--c1);outline-offset:3px}
.m2-root kbd{font:inherit;font-size:11px;padding:2px 6px;border:1px solid var(--line);border-radius:6px;color:var(--ink-3)}

/* background: warm taupe with soft light + a hint of the category color */
.m2-bg{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;
  background:radial-gradient(120% 90% at 50% 0%,var(--base-2) 0%,var(--base) 60%)}
.m2-blob{position:absolute;border-radius:50%;filter:blur(80px);will-change:transform}
.m2-b1{width:62vmax;height:62vmax;left:-18vmax;top:-22vmax;background:radial-gradient(circle,var(--c1),transparent 66%);opacity:.22;animation:m2-d1 26s ease-in-out infinite alternate}
.m2-b2{width:54vmax;height:54vmax;right:-20vmax;bottom:-24vmax;background:radial-gradient(circle,var(--cream),transparent 66%);opacity:.38;animation:m2-d2 31s ease-in-out infinite alternate}
.m2-grain{position:absolute;inset:-50%;opacity:.14;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .12  0 0 0 .7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.m2-spot{position:absolute;inset:0;background:radial-gradient(520px circle at var(--px) var(--py),rgba(255,248,232,.28),transparent 62%)}
@keyframes m2-d1{to{transform:translate3d(14vmax,10vmax,0) scale(1.15)}}
@keyframes m2-d2{to{transform:translate3d(-12vmax,-8vmax,0) scale(1.1)}}

.m2-main{position:relative;z-index:1;width:100%;box-sizing:border-box}

/* hero */
.m2-hero{position:relative;min-height:620px;overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.m2-word{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}
.m2-word span{white-space:nowrap;text-transform:uppercase;font-weight:800;letter-spacing:-.03em;line-height:1;
  color:color-mix(in srgb,var(--c1) 15%,transparent);
  transform:translate3d(calc(var(--p) * -180px),calc(var(--p) * -30px),0);animation:m2-word-in 1s cubic-bezier(.2,.8,.2,1) both}
@keyframes m2-word-in{from{opacity:0;letter-spacing:.08em}to{opacity:1}}

.m2-dockbar{position:absolute;z-index:6;left:0;right:0;top:12px;display:flex;align-items:center;gap:10px;padding:0 14px}
.m2-dock{flex:1;min-width:0;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding:5px;border-radius:999px;
  background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);
  width:max-content;max-width:calc(100% - 56px);margin:0 auto}
.m2-dock::-webkit-scrollbar{display:none}
.m2-tab{flex:none;border:0;background:transparent;border-radius:999px;padding:8px 16px;font-size:14px;font-weight:500;color:var(--ink-2);white-space:nowrap;transition:background .35s,color .35s}
.m2-tab:hover{color:var(--ink)}
.m2-tab[aria-selected="true"]{background:var(--c1);color:#fff;font-weight:600}
.m2-search-btn{flex:none;display:flex;align-items:center;gap:8px;height:42px;padding:0 14px;border-radius:999px;font-size:14px;
  background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);color:var(--ink-2)}
.m2-search-btn:hover{background:var(--glass-2);color:var(--ink)}
@media (min-width:900px){.m2-dockbar{padding:0 28px;justify-content:center}.m2-dock{flex:none;margin:0}.m2-search-btn{position:absolute;right:28px}}
@media (max-width:639px){.m2-hide-sm{display:none}.m2-search-btn{width:42px;padding:0;justify-content:center}}

/* stage + ring */
.m2-stage{position:absolute;left:0;right:0;perspective:1500px;display:grid;place-items:center;
  transform:translate3d(0,calc(var(--p) * -50px),0) scale(calc(1 - var(--p) * .1));opacity:calc(1 - var(--p) * .5)}
.m2-tilt{position:relative;width:100%;height:100%;transform-style:preserve-3d;
  transform:rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 7deg));transition:transform .35s ease-out}
.m2-ring{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d;
  transition:transform 1s cubic-bezier(.22,.9,.24,1)}
.m2-dish{position:absolute;left:0;top:0;padding:0;border:0;background:none;border-radius:50%;backface-visibility:hidden;-webkit-backface-visibility:hidden;
  transition:opacity .8s ease,filter .8s ease;animation:m2-in .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes m2-in{from{opacity:0}}
.m2-bob{display:block;width:100%;height:100%;animation:m2-bob 6s ease-in-out infinite}
@keyframes m2-bob{50%{transform:translateY(-8px)}}
/* plates: white rim like a real plate */
.m2-dish img{width:100%;height:100%;object-fit:cover;border-radius:50%;pointer-events:none;
  border:6px solid var(--cream);box-shadow:0 30px 50px -18px rgba(60,35,10,.45)}
.m2-dish.is-active img{box-shadow:0 0 0 10px color-mix(in srgb,var(--c1) 22%,transparent),0 0 90px -10px color-mix(in srgb,var(--c1) 55%,transparent),0 40px 60px -20px rgba(60,35,10,.5)}
.m2-dish:not(.is-active){cursor:pointer}

.m2-arrow{position:absolute;top:50%;z-index:5;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;
  background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transform:translateY(-50%);transition:background .25s,color .25s}
.m2-arrow:hover{background:var(--c1);color:#fff}
.m2-prev{left:14px}.m2-next{right:14px}
@media (min-width:900px){.m2-prev{left:32px}.m2-next{right:32px}}
.m2-empty{color:var(--ink-2);text-align:center;padding:0 24px}

/* info panel */
.m2-info{position:absolute;z-index:6;left:12px;right:12px;bottom:14px;display:grid;gap:12px;padding:16px 18px;border-radius:26px;
  background:rgba(31,21,16,.5);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(26px) saturate(1.3);-webkit-backdrop-filter:blur(26px) saturate(1.3);
  box-shadow:0 30px 60px -30px rgba(20,12,6,.7)}
.m2-info h2{margin:2px 0 0;font-size:clamp(24px,3.4vw,42px);font-weight:700;letter-spacing:-.025em;line-height:1.05;overflow-wrap:anywhere;text-transform:capitalize}
.m2-cat{margin:0;font-size:13px;color:color-mix(in srgb,var(--c1) 30%,#fff);font-weight:700;transition:color 1s}
.m2-desc{margin:8px 0 0;max-width:56ch;font-size:14px;line-height:1.5;color:var(--ink-2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.m2-swap{animation:m2-swap .55s cubic-bezier(.2,.8,.2,1) both}
@keyframes m2-swap{from{opacity:0;transform:translateY(10px);filter:blur(4px)}}
.m2-buy{display:flex;align-items:center;justify-content:space-between;gap:12px}
.m2-price{font-size:clamp(20px,2.4vw,28px);font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.m2-dots{display:flex;gap:5px;justify-content:center}
.m2-dots i{width:5px;height:5px;border-radius:99px;background:rgba(255,255,255,.35);transition:width .4s,background .4s}
.m2-dots i.on{width:22px;background:#fff}
@media (min-width:900px){
  .m2-info{left:50%;right:auto;width:min(980px,calc(100% - 64px));transform:translateX(-50%);grid-template-columns:1fr auto;align-items:center;gap:8px 32px;padding:20px 26px}
  .m2-buy{flex-direction:column;align-items:flex-end}
  .m2-dots{grid-column:1 / -1}
}

/* buttons */
.m2-add{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:11px 18px;font-weight:600;font-size:14px;
  background:var(--c1);color:#fff;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .3s,background 1s}
.m2-add:hover{box-shadow:0 12px 30px -8px color-mix(in srgb,var(--c1) 70%,transparent)}
.m2-add:active{transform:scale(.95)!important}
.m2-add.m2-big{padding:14px 24px;font-size:15px}
.m2-full{width:100%;justify-content:center}
.m2-stepper{display:inline-flex;align-items:center;gap:2px;border-radius:999px;padding:3px;background:var(--c1);color:#fff}
.m2-stepper button{width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;color:#fff}
.m2-stepper button:hover{background:rgba(255,255,255,.32)}
.m2-stepper span{min-width:28px;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}
.m2-stepper.m2-big button{width:40px;height:40px}
.m2-round{width:40px;height:40px;flex:none;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:var(--glass-2);transition:background .25s,color .25s,transform .25s}
.m2-round:hover{background:var(--c1);color:#fff;transform:rotate(90deg)}
.m2-pop{display:inline-block;animation:m2-pop .38s cubic-bezier(.2,1.6,.4,1)}
@keyframes m2-pop{from{transform:scale(.4);opacity:.2}}

/* grid */
.m2-gridwrap{max-width:1240px;margin:0 auto;padding:clamp(48px,8vw,110px) 18px 90px}
.m2-gridhead{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 24px;margin-bottom:28px}
.m2-gridhead h2{margin:0;font-size:clamp(28px,4.5vw,56px);font-weight:700;letter-spacing:-.03em;text-transform:capitalize}
.m2-gridhead p{margin:0;color:var(--ink-2);font-size:14px}
.m2-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr))}
.m2-reveal{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
.m2-reveal.is-in{opacity:1;transform:none}

.m2-card{--rx:0deg;--ry:0deg;--gx:50%;--gy:50%;position:relative;border-radius:26px;padding:10px;overflow:hidden;
  background:rgba(31,21,16,.34);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  box-shadow:0 18px 40px -26px rgba(60,35,10,.5);
  transform:perspective(900px) rotateX(var(--ry)) rotateY(var(--rx));transition:transform .25s ease-out,border-color .3s}
.m2-card::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;
  background:radial-gradient(280px circle at var(--gx) var(--gy),rgba(255,255,255,.2),transparent 65%)}
.m2-card:hover::after{opacity:1}
.m2-card:hover{border-color:color-mix(in srgb,var(--c1) 55%,transparent)}
.m2-card-media{display:block;width:100%;aspect-ratio:1;padding:0;border:0;border-radius:18px;overflow:hidden;background:rgba(255,255,255,.08)}
.m2-card-media:disabled{cursor:default}
.m2-card-media img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.2,.8,.2,1)}
.m2-card:hover .m2-card-media img{transform:scale(1.07)}
.m2-ph,.m2-ph-sm{display:grid;place-items:center;width:100%;height:100%;font-size:64px;font-weight:700;color:var(--ink-3);text-transform:uppercase}
.m2-card-body{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 6px 4px}
.m2-card-body h3{margin:0;font-size:16px;font-weight:600;text-transform:capitalize;overflow-wrap:anywhere}
.m2-price-sm{margin:2px 0 0;font-size:14px;color:var(--ink-2);font-variant-numeric:tabular-nums}

/* overlays */
.m2-overlay{position:fixed;inset:0;z-index:100;display:flex;justify-content:center;align-items:flex-start;padding:12vh 14px 14px;
  background:rgba(31,21,16,.42);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:m2-fade .25s both}
.m2-overlay-r{justify-content:flex-end;align-items:stretch;padding:0}
@keyframes m2-fade{from{opacity:0}}
.m2-palette{width:min(640px,100%);border-radius:24px;overflow:hidden;background:#2b2019;color:var(--ink);border:1px solid rgba(255,255,255,.2);box-shadow:0 40px 100px -20px rgba(0,0,0,.7);animation:m2-rise .35s cubic-bezier(.2,.9,.3,1) both;align-self:flex-start}
@keyframes m2-rise{from{opacity:0;transform:translateY(14px) scale(.98)}}
.m2-palette-input{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line);color:var(--ink-2)}
.m2-palette-input input{flex:1;min-width:0;background:none;border:0;outline:0;color:var(--ink);font:inherit;font-size:17px}
.m2-palette-input input::placeholder{color:var(--ink-3)}
.m2-palette ul,.m2-drawer ul{list-style:none;margin:0;padding:8px;display:grid;gap:2px}
.m2-palette li button{display:flex;align-items:center;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:14px;background:transparent;text-align:left}
.m2-palette li button.on{background:rgba(255,255,255,.12)}
.m2-palette img,.m2-drawer img,.m2-ph-sm{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:none;background:rgba(255,255,255,.1);font-size:0}
.m2-res-t{flex:1;min-width:0;display:grid;font-weight:600;text-transform:capitalize;overflow-wrap:anywhere}
.m2-res-t small{font-weight:400;color:var(--ink-3);text-transform:none}
.m2-res-p{color:var(--ink-2);font-size:14px;font-variant-numeric:tabular-nums}
.m2-none{padding:22px;text-align:center;color:var(--ink-2)}
.m2-palette-input input:focus,.m2-palette-input input:focus-visible{outline:none;box-shadow:none}
.m2-palette-input:focus-within{border-bottom-color:rgba(255,255,255,.45)}
.m2-results{max-height:min(58vh,520px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}

.m2-drawer{width:min(420px,100%);height:100%;display:flex;flex-direction:column;background:#2b2019;color:var(--ink);border-left:1px solid rgba(255,255,255,.2);animation:m2-slide .45s cubic-bezier(.2,.9,.3,1) both}
@keyframes m2-slide{from{transform:translateX(40px);opacity:0}}
.m2-drawer header{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px}
.m2-drawer h3{margin:0;font-size:24px;letter-spacing:-.02em}
.m2-drawer ul{flex:1;overflow:auto;padding:8px 14px}
.m2-drawer li{display:flex;align-items:center;gap:12px;padding:10px;border-radius:16px;background:rgba(255,255,255,.08)}
.m2-drawer footer{padding:16px 20px calc(20px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);display:grid;gap:14px}
.m2-total{display:flex;justify-content:space-between;align-items:baseline;color:var(--ink-2)}
.m2-total strong{font-size:28px;color:var(--ink);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.m2-placed{margin:auto;padding:32px;text-align:center;font-size:20px;line-height:1.4;animation:m2-swap .6s both}
.m2-fab{position:fixed;z-index:90;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:10px;height:54px;padding:0 20px 0 16px;border:0;border-radius:999px;
  background:var(--c1);color:#fff;font-weight:700;box-shadow:0 18px 40px -12px rgba(31,21,16,.6);animation:m2-rise .5s cubic-bezier(.2,1.2,.3,1) both}
.m2-fab-n{display:grid;place-items:center;min-width:24px;height:24px;border-radius:99px;background:rgba(255,255,255,.22);font-size:13px;padding:0 6px}
.m2-fab-t{font-variant-numeric:tabular-nums}

@media (prefers-reduced-motion:reduce){
  .m2-root *,.m2-root *::before,.m2-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`;