import { Link } from 'react-router-dom'

export default function AboutButton() {
  return (
    <Link
      to="/about"
      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
    >
      Learn More About BookVerse
    </Link>
  )
}
