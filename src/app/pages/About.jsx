import { Link } from 'react-router-dom'
import AboutSection from '../components/AboutSection'

export default function About() {
  return (
    <main className="px-6 pb-10 pt-8">
      <AboutSection />
      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
