/**
 * Heart used for favourites. `filled` swaps the solid fill in for the outline
 * so one component covers both states of the toggle.
 */
export default function HeartIcon({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 20.4 4.9 13.6a4.6 4.6 0 0 1 0-6.7 4.9 4.9 0 0 1 6.8 0l.3.3.3-.3a4.9 4.9 0 0 1 6.8 0 4.6 4.6 0 0 1 0 6.7z" />
    </svg>
  );
}
