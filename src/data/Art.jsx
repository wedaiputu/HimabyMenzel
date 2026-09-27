/* ---------------------------- PLACEHOLDER ART ---------------------------- */

const HILLS = {
  1: {
    sun: [290, 92],
    back: "M0 178 L58 146 L104 168 L166 112 L204 100 L246 118 L302 166 L352 146 L400 172 L400 300 L0 300Z",
    mid: "M0 214 Q60 176 122 200 T246 190 T400 210 L400 300 L0 300Z",
    front: "M0 252 Q100 228 200 246 T400 240 L400 300 L0 300Z",
  },
  2: {
    sun: [110, 84],
    back: "M0 200 Q80 150 160 176 T320 150 T400 178 L400 300 L0 300Z",
    mid: "M0 226 Q90 196 170 214 T340 204 T400 220 L400 300 L0 300Z",
    front: "M0 262 Q120 244 220 258 T400 252 L400 300 L0 300Z",
  },
  3: {
    sun: [236, 118],
    back: "M0 170 L70 136 L120 158 L188 96 L236 132 L292 118 L346 156 L400 138 L400 300 L0 300Z",
    mid: "M0 222 Q70 190 140 212 T290 198 T400 224 L400 300 L0 300Z",
    front: "M0 256 Q90 236 190 252 T400 246 L400 300 L0 300Z",
  },
};

export default function Art({ src, alt, className = "", variant = 1 }) {
  if (src)
    return (
      <img
        className={className}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    );
  const h = HILLS[variant] || HILLS[1];
  return (
    <div className={`art ${className}`} role="img" aria-label={alt}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <circle
          cx={h.sun[0]}
          cy={h.sun[1]}
          r="22"
          fill="#f7f4ec"
          fillOpacity=".8"
        />
        <path d={h.back} fill="#2a241b" fillOpacity=".16" />
        <path d={h.mid} fill="#2a241b" fillOpacity=".3" />
        <path d={h.front} fill="#2a241b" fillOpacity=".65" />
      </svg>
    </div>
  );
}