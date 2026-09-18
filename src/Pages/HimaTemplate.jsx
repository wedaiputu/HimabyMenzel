import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Play, X } from "lucide-react";
import MENU from "../assets/json/HimaRestaurant.json";

const MENU_CATEGORIES = [...new Set(MENU.map((item) => item.category))];
const NAV_LINKS = [
  "About",
  "Venue",
  "Menu",
  "Dining",
  "Kitchen",
  "Team",
  "Stories",
  "Contact",
].map((label) => ({
  label,
  href: `#${label === "Stories" ? "journal" : label.toLowerCase()}`,
}));
// const STATS = [
//   { n: "4+", l: "Years in the kitchen" },
//   { n: "30+", l: "Dishes on rotation, from classics to seasonal specials" },
//   { n: "96%", l: "Guests who come back for more" },
//   { n: "20+", l: "Local farms and purveyors we cook with" },
// ];
const PROCESS = [
  {
    n: "01",
    t: "Sourcing",
    d: "Each morning we walk the market for what's freshest — fish, greens, chilies — before the day's menu is set.",
  },
  {
    n: "02",
    t: "Prep",
    d: "Stocks, sambals and marinades are built from scratch, the slow way, every single day.",
  },
  {
    n: "03",
    t: "Cook",
    d: "Dishes are cooked to order over open flame and charcoal, timed to the table, not the ticket.",
  },
  {
    n: "04",
    t: "Plate & serve",
    d: "Finished with fresh herbs and citrus at the pass, then carried straight to you while it's hot.",
  },
];
const SERVICES = [
  {
    t: "Walk-in Dining",
    d: "Open seating in the main room, first come first served — no reservation needed for smaller parties.",
    p: "No booking required",
  },
  {
    t: "Chef's Table",
    d: "A seasonal tasting menu served at the pass, talking through each dish as it's plated.",
    p: "$85 / person",
  },
  {
    t: "Private Events",
    d: "Full restaurant buyout for celebrations, launches and private gatherings, menu built around your guests.",
    p: "from $2,000",
  },
  {
    t: "Takeaway & Delivery",
    d: "The full menu, packed to travel well, ready for pickup or delivered across the city.",
    p: "Free pickup",
  },
];
const TEAM = [
  {
    name: "Made Wirawan",
    role: "Executive Chef & Founder",
    img: "https://images.unsplash.com/photo-1663530761401-15eefb544889?w=500&q=80",
  },
  {
    name: "Putu Ayu Lestari",
    role: "Head Chef",
    img: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=500&q=80",
  },
  {
    name: "Kadek Surya Pradana",
    role: "Sous Chef",
    img: "https://images.unsplash.com/photo-1572715382241-f41ee117f1c4?w=500&q=80",
  },
  {
    name: "Wayan Sudiartha",
    role: "Restaurant Manager",
    img: "https://images.unsplash.com/photo-1503453776591-b4548af666a2?w=500&q=80",
  },
  {
    name: "Ni Luh Kartika Dewi",
    role: "Sommelier & Bar Lead",
    img: "https://images.unsplash.com/photo-1573013919066-ab9778f4d0e1?w=500&q=80",
  },
];
const JOURNAL = [
  { t: "Why we still pound our sambal by hand", m: "Notes · 4 min read" },
  {
    t: "A short guide to Bali's morning wet markets",
    m: "Sourcing · 6 min read",
  },
  {
    t: "Inside our rendang: three days, start to finish",
    m: "Case study · 8 min read",
  },
];
const VENUES = [
  {
    name: "Hima Suites",
    tag: "Flagship dining room",
    img: "/Images/HimaVenue1.jpg",
    href: "#contact",
  },
  {
    name: "Hima Suites",
    tag: "Sundowners & small plates",
    img: "/Images/HimaVenue2.jpg",
    href: "#contact",
  },
  {
    name: "Hima Garden Terrace",
    tag: "Private events & celebrations",
    img: "/Images/HimaVenue3.jpg",
    href: "#contact",
  },
  {
    name: "Hima Suites",
    tag: "Sun loungers & seafood grill",
    img: "/Images/HimaVenue4.jpg",
    href: "#contact",
  },
  {
    name: "Hima Suites",
    tag: "Curated tastings & pairings",
    img: "/Images/HimaVenue5.jpg",
    href: "#contact",
  },
  {
    name: "Hima Suites",
    tag: "Seasonal tasting menu at the pass",
    img: "/Images/HimaVenue6.jpg",
    href: "#contact",
  },
  {
    name: "Hima Suites",
    tag: "Celebrations & private gatherings",
    img: "/Images/HimaVenue7.jpg",
    href: "#contact",
  },
];

const eyebrow = "mb-4 text-xs uppercase tracking-[0.12em] text-[#726a5e]";
const section = "mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-10 lg:py-24";
const title = "font-serif text-3xl leading-tight sm:text-4xl";

export default function HimaTemplate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("Mains");
  const [showAllDishes, setShowAllDishes] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const MENU_PAGE_SIZE = 8;
  const tabItems = MENU.filter((item) => item.category === tab);
  const visibleItems = showAllDishes
    ? tabItems
    : tabItems.slice(0, MENU_PAGE_SIZE);

  function selectTab(category) {
    setTab(category);
    setShowAllDishes(false);
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#d7cbb0] font-sans text-[#1c1a16] antialiased">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || menuOpen
            ? "border-b border-[#dad3c4] bg-[#E7E0D0]/95 text-[#1c1a16] backdrop-blur"
            : "border-b border-transparent bg-transparent text-[#f2efe8]"
        }`}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-10">
          {/* <a href="#top" className="font-serif text-xl tracking-tight sm:text-2xl">
            HIMA
          </a> */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm uppercase tracking-wide transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 lg:hidden"
          >
            {menuOpen ? <X size={36} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-[#dad3c4] bg-[#E7E0D0] px-5 py-5 text-[#1c1a16] sm:px-6 lg:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
      <main>
        <section
          id="top"
          className="relative flex h-[100svh] min-h-[100svh] items-center justify-center overflow-hidden text-center text-[#f2efe8]"
        >
          <video
            // poster="/Images/HimaResto1.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 size-full object-cover"
          >
            <source
              src="/videos/HimaRestaurant.mp4"
              media="(min-width: 768px)"
            />
            <source src="/videos/HimaRestaurant1.mp4" />
          </video>
          <div className="absolute inset-0 bg-[#171410]/55" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6">
            <img
              src="/Images/HimaLogo.png"
              alt="Hima Restaurant"
              className="mx-auto w-[48rem] sm:w-[72rem] lg:w-[108rem]"
            />
          </div>
        </section>
        <section id="about" className="scroll-mt-24 border-t border-[#dad3c4]">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 lg:py-24">
            <p className={eyebrow}>About</p>
            <h2 className={title}>Hima By Menzel</h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#726a5e]">
              A Mountain Escape in Kintamani HIMA by Menzel is a unique
              hospitality destination in Kintamani, Bali, offering a combination
              of dining and suite accommodation surrounded by the beauty of the
              highlands. Featuring a welcoming restaurant and seven private
              suite rooms with stunning mountain views, HIMA is designed as a
              place to dine, stay, relax, and reconnect with nature. With warm
              hospitality, quality food, comfortable spaces, and breathtaking
              surroundings, HIMA offers a memorable mountain experience in Bali.
            </p>
          </div>
          {/* <div className="border-t border-[#dad3c4] bg-[#171410] text-[#f2efe8]">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-12 sm:px-6 md:grid-cols-4 lg:px-10 lg:py-16">
              {STATS.map((stat) => (
                <div key={stat.l}>
                  <p className="font-serif text-4xl">{stat.n}</p>
                  <p className="mt-2 max-w-[18ch] text-sm leading-relaxed text-[#a69c8c]">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
        </section>
        <section id="about" className="scroll-mt-24 border-t border-[#dad3c4]">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 lg:py-24">
            <p className={eyebrow}>Suite Rooms</p>
            <h2 className={title}>Explore our selection of venue</h2>
            {/* <p className="mx-auto mt-5 max-w-xl leading-7 text-[#726a5e]">
              Founded with a simple belief: dining should feel personal.
              Every element of our restaurant has been thoughtfully curated —
              natural light floods through open windows, our wooden tables are
              built to encourage lingering, and the acoustics create an
              intimacy that makes strangers feel like friends. This is a space
              designed not just for eating, but for living.
            </p> */}
          </div>
          {/* <div className="border-t border-[#dad3c4] bg-[#171410] text-[#f2efe8]">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-12 sm:px-6 md:grid-cols-4 lg:px-10 lg:py-16">
              {STATS.map((stat) => (
                <div key={stat.l}>
                  <p className="font-serif text-4xl">{stat.n}</p>
                  <p className="mt-2 max-w-[18ch] text-sm leading-relaxed text-[#a69c8c]">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
        </section>
        <section id="venue" className="scroll-mt-24 border-t border-[#dad3c4]">
          <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-6 lg:px-10 lg:pt-24">
            {/* <p className={eyebrow}>Venues</p>
            <h2 className={`${title} mb-12 max-w-lg`}>
              Explore our selection of venues.
            </h2> */}
          </div>
          <div className="grid gap-1 lg:grid-cols-3">
            {VENUES.map((venue) => (
              <a
                key={venue.name}
                href={venue.href}
                className="group relative block h-[100svh] overflow-hidden"
              >
                <img
                  src={venue.img}
                  alt={venue.name}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-between gap-4 p-6 sm:p-10 lg:flex-row lg:items-end lg:gap-3 lg:p-6">
                  <div>
                    {/* <h3 className="font-serif text-4xl leading-tight text-white sm:text-6xl lg:text-2xl">
                      {venue.name}
                    </h3> */}
                    {/* <p className="mt-2 text-sm text-white/70 sm:text-base lg:mt-1 lg:text-sm">
                      {venue.tag}
                    </p> */}
                  </div>
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap border border-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#1c1a16] sm:text-sm lg:px-4 lg:py-2 lg:text-xs">
                    Book Now
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section id="menu" className="scroll-mt-24 border-t border-[#dad3c4]">
          <div className={section}>
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className={eyebrow}>Our menu</p>
                <h2 className={title}>Dishes that speak for themselves</h2>
              </div>
              <div
                className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
                role="tablist"
              >
                {MENU_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={tab === category}
                    onClick={() => selectTab(category)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${tab === category ? "border-[#1c1a16] bg-[#1c1a16] text-[#f2efe8]" : "border-[#dad3c4] text-[#726a5e] hover:border-[#1c1a16] hover:text-[#1c1a16]"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 xl:grid-cols-4">
              {visibleItems.map((item, index) => (
                <a
                  href="#contact"
                  key={`${item.name}-${index}`}
                  className="group block min-w-0"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white p-1.5 sm:p-3">
                    {item.type === "gif" ? (
                      <MenuVideoThumbnail item={item} />
                    ) : (
                      <img
                        src={item.img}
                        alt={item.name}
                        className="size-full rounded object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 sm:mt-4 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold sm:text-base">
                          {item.name}
                        </h3>
                        {item.price && (
                          <span className="shrink-0 text-sm font-semibold text-[#1c1a16]">
                            {item.price}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#726a5e] sm:text-sm">
                        {item.meta}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 shrink-0" size={16} />
                  </div>
                </a>
              ))}
            </div>
            {tabItems.length > MENU_PAGE_SIZE && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllDishes((show) => !show)}
                  className="inline-flex items-center gap-2 border border-[#1c1a16] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#1c1a16] hover:text-[#f2efe8]"
                >
                  {showAllDishes
                    ? "Show less"
                    : `Show all ${tabItems.length} ${tab.toLowerCase()}`}
                </button>
              </div>
            )}
          </div>
        </section>
        <section id="dining" className="scroll-mt-24 border-t border-[#dad3c4]">
          <div className={section}>
            <p className={eyebrow}>Dining</p>
            <h2 className={`${title} mb-10 max-w-md`}>
              A few ways to eat with us, held to one standard
            </h2>
            <div className="border-t border-[#dad3c4]">
              {SERVICES.map((service) => (
                <div
                  key={service.t}
                  className="grid gap-3 border-b border-[#dad3c4] py-6 transition-colors hover:bg-black/[0.02] md:grid-cols-[minmax(10rem,1fr)_2fr_10rem] md:items-center md:gap-8"
                >
                  <h3 className="font-semibold tracking-tight">{service.t}</h3>
                  <p className="leading-relaxed text-[#726a5e]">{service.d}</p>
                  <p className="text-sm font-medium text-[#1c1a16] md:border-l md:border-[#dad3c4] md:pl-8 md:text-right">
                    {service.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="kitchen"
          className="scroll-mt-24 border-t border-[#dad3c4]"
        >
          <div className={section}>
            <p className={eyebrow}>How we cook</p>
            <h2 className={`${title} mb-12 max-w-md`}>
              From the morning market to your table
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step) => (
                <div key={step.n}>
                  <p className="font-serif text-2xl text-[#a69c8c]">{step.n}</p>
                  <h3 className="mt-3 font-semibold">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#726a5e]">
                    {step.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="team" className="scroll-mt-24 border-t border-[#dad3c4]">
          <div className={section}>
            <p className={eyebrow}>Our team</p>
            <h2 className={`${title} mb-12 max-w-lg`}>
              A small kitchen, deliberately kept that way
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
              {TEAM.map((member) => (
                <div key={member.name}>
                  <div className="aspect-[3/4] rounded-lg bg-white p-2">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="size-full rounded object-cover grayscale-[15%]"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold sm:text-base">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#726a5e]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="journal"
          className="scroll-mt-24 border-t border-[#dad3c4]"
        >
          <div className={section}>
            <p className={eyebrow}>Stories</p>
            <h2 className={`${title} mb-10`}>
              Notes on ingredients, method and eating well
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {JOURNAL.map((entry) => (
                <a href="#top" key={entry.t} className="group">
                  <p className="mb-3 text-sm text-[#726a5e]">{entry.m}</p>
                  <h3 className="font-serif text-xl leading-snug transition-opacity group-hover:opacity-60">
                    {entry.t}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className={`${section} scroll-mt-24`}>
          <div className="grid gap-8 bg-[#171410] p-6 text-[#f2efe8] sm:p-8 md:grid-cols-2 md:items-center lg:p-14">
            <div>
              <h2 className="max-w-md font-serif text-3xl leading-tight sm:text-4xl">
                Let's set a table for you
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-[#a69c8c]">
                Tell us the date, the time, and how many are joining. We'll
                confirm your table within two hours.
              </p>
              <a
                href="https://wa.me/6283169530888"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 border border-[#f2efe8] bg-[#c6af7a] px-5 py-3 text-sm font-semibold text-[#171410] transition-colors hover:bg-transparent hover:text-[#f2efe8]"
              >
                Reserve a Table <ArrowUpRight size={16} />
              </a>
            </div>
            <Picture
              src="/Images/HimaResto2.jpg"
              alt="Restaurant interior with natural lighting and communal seating"
              ratio="aspect-[6/5]"
              tone="dark"
            />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function MenuVideoThumbnail({ item }) {
  const [playing, setPlaying] = useState(false);
  // Cloudinary auto-generates a still-frame thumbnail for any video at the
  // same URL with the extension swapped to .jpg — no extra upload needed.
  const poster = item.img.replace(/\.[^./]+$/, ".jpg");

  if (playing) {
    return (
      <video
        src={item.img}
        controls
        autoPlay
        playsInline
        className="size-full rounded object-cover"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); // stop the card's <a href="#contact"> from firing
        e.stopPropagation();
        setPlaying(true);
      }}
      className="group/play relative block size-full"
      aria-label={`Play video: ${item.name}`}
    >
      <img
        src={poster}
        alt={item.name}
        className="size-full rounded object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 flex items-center justify-center rounded bg-black/10 transition-colors group-hover/play:bg-black/25">
        <span className="flex size-11 items-center justify-center rounded-full bg-[#E7E0D0]/95 text-[#1c1a16] shadow-md transition-transform group-hover/play:scale-110 sm:size-14">
          <Play size={20} fill="currentColor" className="ml-0.5" />
        </span>
      </span>
    </button>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6283169530888"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="size-7">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.31.66 4.47 1.8 6.31L4 29l7.86-1.76A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.9a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-4.66 1.04 1.06-4.55-.24-.37A9.87 9.87 0 0 1 5.1 15c0-6.01 4.9-10.9 10.9-10.9 5.99 0 10.9 4.89 10.9 10.9s-4.9 10.9-10.9 10.9Zm5.98-8.17c-.33-.16-1.94-.96-2.24-1.07-.3-.11-.52-.16-.74.16-.22.33-.85 1.07-1.04 1.29-.19.22-.38.24-.71.08-.33-.16-1.38-.51-2.63-1.63-.97-.87-1.62-1.94-1.81-2.27-.19-.33-.02-.5.14-.67.15-.15.33-.38.5-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41s-1.15 1.12-1.15 2.74 1.18 3.18 1.34 3.4c.16.22 2.32 3.54 5.63 4.96.79.34 1.4.55 1.88.7.79.25 1.51.21 2.08.13.63-.09 1.94-.79 2.22-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.63-.38Z" />
      </svg>
    </a>
  );
}

function Picture({ src, alt, ratio = "aspect-[4/3]", tone = "light" }) {
  const frame =
    tone === "dark"
      ? "border border-[#f2efe8]/20 bg-transparent p-1.5 sm:p-2"
      : "bg-white p-2 sm:p-3";
  return (
    <div className={`${ratio} rounded-lg ${frame}`}>
      <img src={src} alt={alt} className="size-full rounded object-cover" />
    </div>
  );
}
function InstagramIcon({ size = 24, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 24, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
    >
      <path d="M13.5 21v-7.8h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46H16.7V4.14C16.34 4.1 15.1 4 13.66 4 10.65 4 8.6 5.82 8.6 9.17V10.2H6v3h2.6V21h4.9Z" />
    </svg>
  );
}

function TikTokIcon({ size = 24, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M16.6 3h-3.2v13.1a3.15 3.15 0 1 1-2.23-3.01v-3.28a6.4 6.4 0 1 0 5.43 6.32V9.7a8.2 8.2 0 0 0 4.8 1.55V8.05a4.85 4.85 0 0 1-4.8-5.05Z" />
    </svg>
  );
}

function LinktreeIcon({ size = 24, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <path d="M12 2v20M12 8 6 4M12 8l6-4M12 14l-6-4M12 14l6-4M7 17l5-3M17 17l-5-3" />
      <circle cx="12" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Footer() {
  const socials = [
    [
      InstagramIcon,
      "Instagram",
      "https://www.instagram.com/himabymenzel?stkn=N2x5cTRvdGF1Mm92",
    ],
    [
      TikTokIcon,
      "TikTok",
      "https://www.facebook.com/Himabymenzel/?ref=PROFILE_EDIT_xav_ig_profile_page_web#",
    ],
    [
      FacebookIcon,
      "Facebook",
      "https://www.facebook.com/Himabymenzel/?ref=PROFILE_EDIT_xav_ig_profile_page_web#",
    ],
    [LinktreeIcon, "Linktree", "https://linktr.ee/himabymenzel"],
  ];
  return (
    <footer className="border-t border-[#dad3c4]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <p className="font-serif text-xl">
            Hima by<strong> Menzel</strong>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#726a5e]">
            One Stop Destination at Kintamani Asian Fusion • Coffee • Suites
            Room
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(([Icon, label, href]) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                key={label}
                aria-label={label}
                className="inline-flex size-9 items-center justify-center border border-[#dad3c4] transition-colors hover:border-[#1c1a16] hover:bg-[#1c1a16] hover:text-[#f2efe8]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className={eyebrow}>Navigate</p>
          <div className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="w-fit hover:opacity-60"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className={eyebrow}>Menu highlights</p>
          <div className="flex flex-col gap-2 text-sm text-[#726a5e]">
            {MENU.filter((item) => item.category === "Mains")
              .slice(0, 4)
              .map((item, index) => (
                <span key={`${item.name}-${index}`}>{item.name}</span>
              ))}
          </div>
        </div>
        <div>
          <p className={eyebrow}>Contact</p>
          <div className="flex flex-col gap-2 text-sm text-[#726a5e]">
            <span>reservations@himarestaurant.com</span>
            <span>+628 123 456</span>
            <span> Kintamani, Bali, Indonesia 80652</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-[#dad3c4] px-5 py-6 text-sm text-[#726a5e] sm:px-6 md:flex-row md:justify-between lg:px-10">
        <span>
          © {new Date().getFullYear()} Hima by Menzel. All rights reserved.
        </span>
        <span>Personal data processing policy</span>
      </div>
    </footer>
  );
}
