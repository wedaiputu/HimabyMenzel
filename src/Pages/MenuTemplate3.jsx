import { useState, useEffect, useMemo, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  MenuTemplate3 — HIMA by Menzel, menu 2026
 *  Recreates the look of MENU_HIMA_2026.pdf as a scrolling web page:
 *  the menu pages (Cloudinary folder "Hima_Menu3", sorted by display
 *  name ascending), then the suite rooms / contact page.
 *
 *  Cloudinary only holds PDF pages 3–31. Pages 32 and 33 are rebuilt
 *  here in HTML (no photos yet).
 * ------------------------------------------------------------------ */

const CONFIG = {
  cloudName: "dimnv9sq5",
  pageTransform: "c_limit,w_1400,q_auto,f_auto",
  phone: "+62 821-3849-221",
  email: "himabymenzel@gmail.com",
};

const RAW_PAGES = [
  { displayName: "MENU_HIMA_2026_page-0003_bsbfki", version: 1791805808 },
  { displayName: "MENU_HIMA_2026_page-0004_byctm1", version: 1791805808 },
  { displayName: "MENU_HIMA_2026_page-0005_ogqz7n", version: 1791805808 },
  { displayName: "MENU_HIMA_2026_page-0006_d3nrx5", version: 1791805808 },
  { displayName: "MENU_HIMA_2026_page-0007_yofvvk", version: 1791805808 },
  { displayName: "MENU_HIMA_2026_page-0008_plsxi4", version: 1791805808 },
  { displayName: "MENU_HIMA_2026_page-0009_dku9wg", version: 1791805809 },
  { displayName: "MENU_HIMA_2026_page-0010_qznwva", version: 1791805809 },
  { displayName: "MENU_HIMA_2026_page-0011_ccp9ln", version: 1791805809 },
  { displayName: "MENU_HIMA_2026_page-0012_jcpvla", version: 1791805809 },
  { displayName: "MENU_HIMA_2026_page-0013_mriycr", version: 1791805809 },
  { displayName: "MENU_HIMA_2026_page-0014_oaoc5z", version: 1791805810 },
  { displayName: "MENU_HIMA_2026_page-0015_obe4j7", version: 1791805810 },
  { displayName: "MENU_HIMA_2026_page-0016_ve9nlk", version: 1791805810 },
  { displayName: "MENU_HIMA_2026_page-0017_cpix3n", version: 1791805810 },
  { displayName: "MENU_HIMA_2026_page-0018_jpcgqu", version: 1791805810 },
  { displayName: "MENU_HIMA_2026_page-0019_zbjurn", version: 1791805810 },
  { displayName: "MENU_HIMA_2026_page-0020_yaaqaq", version: 1791805811 },
  { displayName: "MENU_HIMA_2026_page-0021_inxwxk", version: 1791805811 },
  { displayName: "MENU_HIMA_2026_page-0022_mh8byg", version: 1791805811 },
  { displayName: "MENU_HIMA_2026_page-0023_icltch", version: 1791805811 },
  { displayName: "MENU_HIMA_2026_page-0024_ooq6ky", version: 1791805812 },
  { displayName: "MENU_HIMA_2026_page-0025_nwudtb", version: 1791805812 },
  { displayName: "MENU_HIMA_2026_page-0026_xyeeqv", version: 1791805812 },
  { displayName: "MENU_HIMA_2026_page-0027_aio7no", version: 1791805812 },
  { displayName: "MENU_HIMA_2026_page-0028_s7vkad", version: 1791805812 },
  { displayName: "MENU_HIMA_2026_page-0029_soqlpg", version: 1791805813 },
  { displayName: "MENU_HIMA_2026_page-0030_dvzptx", version: 1791805813 },
  { displayName: "MENU_HIMA_2026_page-0031_abfcsv", version: 1791805813 },
];

// First PDF page of each section (page number = the "page-00NN" in the file name).
const SECTIONS = [
  { label: "Brunch", from: 3 },
  { label: "Small bite", from: 4 },
  { label: "Salad", from: 5 },
  { label: "Sando", from: 6 },
  { label: "Asian fusion", from: 7 },
  { label: "Italian", from: 8 },
  { label: "Nusantara", from: 9 },
  { label: "Soup", from: 14 },
  { label: "Western", from: 15 },
  { label: "Dessert & side", from: 16 },
  { label: "Cocktails", from: 17 },
  { label: "Timeless", from: 20 },
  { label: "Mocktails", from: 23 },
  { label: "Young coconut", from: 26 },
  { label: "Juice", from: 27 },
  { label: "Matcha", from: 28 },
  { label: "Coffee", from: 29 },
  { label: "Tea", from: 30 },
  { label: "Wine", from: 31 },
];

const QR_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAACSAQAAAABtNxUgAAAC2ElEQVR42q2WwY7cRBCGv+ox2Ae0bk7kgGILcYdjkDa7DhdeggOvwG2RWLaXjJTc2EfgDXgCpJ7sSrnyAEixAwIOHNpoEXZkuzjMZsbxjEjYGR9/VXVV/fVXuUSZfueGzW/vWCsiCbSuktOiFhH7375+C1aMsWNVruqkz9MIVAcwFOCGsDKSXevoxXI/14dlpd/SSj62kx140W12tv9md54jAC5L+lz7t97EV940vxE208D9vHWZBWItuUUvxzE8uJGjgmEhwmUJ8MgjYm5Tx/hNVdWB+KEGRFVV3f41flrYx9D0eaqe1j0HA8/GNl531eRcwomUCUiiEs+zV+eo+9+9XGovAaIch4KJdSFSpAE4ucv5V2PuPysnWgPubc3Zr3lxhLPz/AI+fvyLhpkPmJuGOUi6koTRbFktoul7+fOfPphixffrphvmd9NEFjwKOOp4zpqXszvtrxNfGb5Yr5OXdp3bqMO0xO9/yHKlmNhVUp/m/AF3NIds7fvXz1s5KCdYFA1cr7HPs/KHIikNA4cp/A2GHFs6SwTXBvhz9F63JUa+gQUOxtiiyJonTa5Xpn9QtQUBg38G0CVH0152vE3oJzGsMOrHkrWB30pueEG1TN1xVat+d+nRyzJdzZYZTfYNpgG1ftKP3r7IR7kseasTjX7EfQqgLlP1UnoZZp7YZ+sY6b2DYVKHsYR2Sz+alV3bUb/3zztA2mlany0+Ws1CvakD7MWLTe6vf59gQ1imbm/0ElX2y6hu+sLOpYznhL38V09e1vkumFbLNDnigiycLKT9+mC3/bLck55mpqoLbQ5J974naYB4QLtMOwnNrNx/DMOZqhOVeFHHPoUs7Pjv7sVyVYdPjkAlOazsqudJcducDfh8gh3CU586Ufrj/eil2cCeYPvMAjwt7S1uAZneAsfqqspBc1i9hudCX3MfeHDDK7feUi8+i3W5Fvall2SEyZ7v4n8Bbvoq8/+Mj+EAAAAASUVORK5CYII=";

const pageNumber = (p) => Number(p.displayName.match(/page-(\d+)/)?.[1] ?? 0);
const imageUrl = (p) =>
  `https://res.cloudinary.com/${CONFIG.cloudName}/image/upload/${CONFIG.pageTransform}/v${p.version}/${p.displayName}.jpg`;

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Hanken+Grotesk:wght@300;400;500;600&display=swap");

.mt3 {
  --brown: #645349;
  --deep: #3a2f29;
  --mist: #fff9f5;
  --soft: rgba(255, 249, 245, 0.72);
  --serif: "Cormorant Garamond", "Times New Roman", serif;
  --sans: "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  background: var(--deep);
  color: var(--mist);
  font-family: var(--sans);
}
.mt3 *, .mt3 *::before, .mt3 *::after { box-sizing: border-box; }
.mt3 a { color: inherit; }
.mt3 :focus-visible { outline: 2px solid var(--mist); outline-offset: 3px; }

/* ---------- Top bar ---------- */
.mt3-bar {
  position: sticky; top: 0; z-index: 20;
  background: rgba(58, 47, 41, 0.92); backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 249, 245, 0.12);
}
.mt3-bar-top { display: flex; align-items: center; justify-content: center; padding: 10px 16px 4px; }
.mt3-bar-top a { text-decoration: none; font-family: var(--serif); font-weight: 400; font-size: 1.35rem; letter-spacing: 0.5em; padding-left: 0.5em; }
.mt3-chips {
  display: flex; gap: 4px; overflow-x: auto; padding: 4px 12px 8px;
  scrollbar-width: none; justify-content: flex-start;
}
.mt3-chips::-webkit-scrollbar { display: none; }
@media (min-width: 1100px) { .mt3-chips { justify-content: center; } }
.mt3-chip {
  flex: 0 0 auto; text-decoration: none; font-size: 0.82rem; font-weight: 400;
  padding: 6px 12px; color: var(--soft); border-bottom: 1px solid transparent; white-space: nowrap;
}
.mt3-chip:hover { color: var(--mist); }
.mt3-chip[aria-current="true"] { color: var(--mist); border-bottom-color: var(--mist); }

/* ---------- Pages ---------- */
.mt3-pages { display: flex; flex-direction: column; align-items: center; gap: clamp(12px, 2.5vw, 28px); padding: clamp(12px, 3vw, 36px) clamp(0px, 2vw, 24px) 60px; }
.mt3-page {
  position: relative; width: min(100%, 720px); aspect-ratio: 595.276 / 841.89;
  container-type: inline-size; overflow: hidden; background: var(--brown);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.38);
  scroll-margin-top: 96px;
}
.mt3-page img.photo { width: 100%; height: 100%; display: block; object-fit: cover; background: #d9c8ba; }

/* Closing: suite rooms + contact */
.mt3-close { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 14cqw 9cqw 8cqw; background: linear-gradient(180deg, #6b5a4e 0%, #7d6c5f 55%, #cdb8a6 100%); }
.mt3-close h2 { margin: 0 0 7cqw; font-family: var(--serif); font-weight: 300; font-size: max(4.6cqw, 20px); letter-spacing: 0.55em; padding-left: 0.55em; }
.mt3-close p { margin: 0 0 4.4cqw; max-width: 46ch; font-size: max(1.62cqw, 11px); line-height: 1.8; font-weight: 300; text-wrap: balance; }
.mt3-close .contact { margin-top: auto; display: grid; justify-items: center; gap: 1.6cqw; color: #3a2f29; }
.mt3-close .qr { width: 15cqw; min-width: 76px; aspect-ratio: 1; background: #fff; padding: 1.2cqw; border-radius: 3px; image-rendering: pixelated; }
.mt3-close .qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
.mt3-close .contact a { font-size: max(1.7cqw, 12px); letter-spacing: 0.08em; text-decoration: none; font-weight: 500; }

@media (max-width: 640px) {
  .mt3-pages { padding-left: 0; padding-right: 0; }
  .mt3-page { box-shadow: none; }
}
`;

export default function MenuTemplate3() {
  const pages = useMemo(
    () =>
      [...RAW_PAGES].sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { numeric: true })
      ),
    []
  );

  const [active, setActive] = useState(SECTIONS[0].from);
  const refs = useRef({});

  // Highlight the section whose page is nearest the top of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!hit) return;
        const n = Number(hit.target.dataset.page);
        const sec = [...SECTIONS].reverse().find((s) => s.from <= n);
        if (sec) setActive(sec.from);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [pages]);

  const jump = (e, n) => {
    e.preventDefault();
    refs.current[n]?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="mt3">
      <style>{CSS}</style>

      <header className="mt3-bar">
        <div className="mt3-bar-top">
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="HIMA, back to top">HIMA</a>
        </div>
        <nav className="mt3-chips" aria-label="Menu sections">
          {SECTIONS.map((s) => (
            <a key={s.label} href={`#p-${s.from}`} className="mt3-chip"
              aria-current={active === s.from} onClick={(e) => jump(e, s.from)}>
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mt3-pages" id="top">
        {/* PDF pages 3–31 — menu pages from Cloudinary, sorted by display name */}
        {pages.map((p, i) => {
          const n = pageNumber(p);
          return (
            <section key={p.displayName} id={`p-${n}`} data-page={n}
              ref={(el) => (refs.current[n] = el)} className="mt3-page">
              <img className="photo" src={imageUrl(p)} loading={i < 2 ? "eager" : "lazy"}
                alt={`${SECTIONS.slice().reverse().find((s) => s.from <= n)?.label ?? "Menu"} — menu page ${n}`} />
            </section>
          );
        })}

        {/* PDF pages 32–33 — suite rooms and contact */}
        <section className="mt3-page mt3-close" aria-label="Suite rooms">
          <h2>SUITE ROOMS</h2>
          <p>Experience comfort and tranquility in our collection of seven thoughtfully designed suites, offering breathtaking views of Kintamani’s beautiful natural landscape.</p>
          <p>Featuring six intimate suites ideal for couples and one spacious Family Suite, each room provides a welcoming retreat where modern comfort meets the serene charm of the mountains. Whether you are seeking a romantic getaway or a relaxing family escape, enjoy a memorable stay surrounded by the beauty of Kintamani.</p>
          <div className="contact">
            <div className="qr"><img src={QR_SRC} alt="QR code" /></div>
            <a href={`tel:${CONFIG.phone.replace(/[^+\d]/g, "")}`}>{CONFIG.phone}</a>
            <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
          </div>
        </section>
      </main>
    </div>
  );
}