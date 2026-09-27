import { SITE } from "../data/site";

export default function BookSection() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    SITE.mapsQuery
  )}`;

  // Google Maps Embed URL for Hima by Menzel Kintamani
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    SITE.mapsQuery
  )}&output=embed`;

  return (
    <section className="book-screen" id="book" aria-label="Book">
      <div className="book-content">
        <div className="eyebrow-num book-eyebrow">
          <span className="num">05</span> / BOOK
        </div>

        <img
          src="/Images/HimaLogo.png"
          alt="Hima by Menzel"
          className="book-logo"
        />

        <div className="book-address">
          {SITE.addressLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
          <strong>{SITE.addressShort}</strong>
        </div>
      </div>

      <div className="map-card">
        {/* Full real interactive map */}
        <iframe
          title={`Google Map showing ${SITE.name}`}
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Clickable overlay link to launch Google Maps on click */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-overlay-link"
          aria-label="Open in Google Maps"
        />
      </div>
    </section>
  );
}