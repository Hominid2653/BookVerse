/** Books-on-shelf mark for library UI (header + empty states). */
export default function BookshelfIcon({ className = 'h-7 w-7' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 19h18v1.5H3V19z"
        className="fill-current opacity-30"
      />
      <rect x="4.5" y="7" width="3.2" height="10" rx="0.4" className="fill-current" />
      <rect x="10.4" y="5" width="3.2" height="12" rx="0.4" className="fill-current" />
      <rect x="16.3" y="8" width="3.2" height="9" rx="0.4" className="fill-current" />
    </svg>
  )
}
