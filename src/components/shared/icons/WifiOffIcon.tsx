/** Struck-through wifi arcs — offline page and the offline banner. */
export default function WifiOffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 3l18 18" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <path d="M5 12.2a9.6 9.6 0 0 1 3.6-2.3" />
      <path d="M15.4 9.9a9.6 9.6 0 0 1 3.6 2.3" />
      <path d="M2 8.8A14.3 14.3 0 0 1 8 5.5" />
      <path d="M13 5.2a14.3 14.3 0 0 1 9 3.6" />
      <path d="M12 19.5h.01" />
    </svg>
  );
}
