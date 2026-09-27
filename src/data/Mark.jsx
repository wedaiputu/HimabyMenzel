// Small mountain + sun mark used as the wordmark icon, echoing the roofline
// in the source logo without depending on an external image file.
export default function Mark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 34"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="9" r="3.4" fill="currentColor" />
      <path
        d="M2 30 L14 12 L20 19 L24 12 L30 21 L36 13 L46 30"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}