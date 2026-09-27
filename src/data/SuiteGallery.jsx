import { useEffect, useState } from "react";
import Art from "./Art";

// A small sliding carousel for suite cards with 2-3 photos each.
export default function SuiteGallery({ images = [], alt, variant = 1 }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(id);
  }, [count, index]);

  if (count === 0)
    return <Art className="suite-img" src="" variant={variant} alt={alt} />;

  return (
    <div className="suite-gallery">
      <div
        className="suite-gallery-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — photo ${i + 1}`}
            className="suite-img"
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="suite-gallery-nav prev"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            aria-label={`Previous photo of ${alt}`}
          >
            ‹
          </button>
          <button
            type="button"
            className="suite-gallery-nav next"
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label={`Next photo of ${alt}`}
          >
            ›
          </button>
          <div className="suite-gallery-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`suite-gallery-dot ${i === index ? "active" : ""}`}
                aria-label={`Go to photo ${i + 1} of ${alt}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}