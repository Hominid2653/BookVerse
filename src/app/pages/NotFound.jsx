import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="px-6 pb-10 pt-8">
      <h1 className="text-3xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">We couldn't find that page.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        Back to home
      </Link>
    </main>
  )
}
