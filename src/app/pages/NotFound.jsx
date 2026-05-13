import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="px-6 pb-10 pt-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}