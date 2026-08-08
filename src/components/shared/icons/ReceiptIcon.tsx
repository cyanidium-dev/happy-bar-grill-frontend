/** Document / receipt leaf with text lines — solid fill, same language as CartIcon. */
export default function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7 2.5A2.5 2.5 0 0 0 4.5 5v14A2.5 2.5 0 0 0 7 21.5h10a2.5 2.5 0 0 0 2.5-2.5V5A2.5 2.5 0 0 0 17 2.5zm1.25 4h7.5v1.5h-7.5zm0 3.5h7.5v1.5h-7.5zm0 3.5h5v1.5h-5z"
      />
    </svg>
  );
}
