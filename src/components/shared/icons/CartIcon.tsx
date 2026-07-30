export default function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5.5 7h13l-1.1 11.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5.5 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
