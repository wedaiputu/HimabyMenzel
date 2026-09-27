import { Link } from 'react-router-dom';

export default function Navbar({ navItems, mobileMenu, setMobileMenu, scrollTo }) {
  return (
    <nav className="navbar" aria-label="Main">
      <Link to="/" className="nav-logo">
  <span className="nav-logo-main">Hima</span>
  <span className="nav-logo-sub">by Menzel</span>
</Link>

      <div className={`nav-links ${mobileMenu ? "open" : ""}`}>
        {navItems.map((item) => (
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
  );
}