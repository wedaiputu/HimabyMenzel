import { SITE, wa } from "../data/site";

export default function Footer() {
  return (
    <footer className="footer-bar">
      <div className="footer-contacts">
        <a
          href={wa("Hello, can I book a table or a suite?")}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-contact-item"
        >
          <svg
            className="footer-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="phone-num">{SITE.phone}</span>
        </a>

        <a
          href={`https://www.instagram.com/${SITE.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-contact-item"
        >
          <svg
            className="footer-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span>@{SITE.instagram}</span>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="footer-contact-item"
          aria-label="Email Us"
        >
          <svg
            className="footer-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>
      </div>

      <div className="footer-right">
        <a
          className="footer-btn"
          href={wa("Hello, can I book a table or a suite?")}
          target="_blank"
          rel="noopener noreferrer"
        >
          BOOK NOW
        </a>
        <div className="footer-tag">DINE · STAY · GATHER · CELEBRATE</div>
      </div>
    </footer>
  );
}