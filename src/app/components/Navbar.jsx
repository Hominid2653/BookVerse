import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 transition ${
      isActive ? 'bg-slate-950 text-white' : 'hover:bg-slate-100'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-40 w-full border border-slate-200 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,34,69,0.08)] backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-4 md:rounded-[28px] md:p-5">
      <div className="flex items-center justify-between gap-4 md:contents">
        <Link to="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl border-2 border-slate-950 text-sm tracking-[0.18em]">
            |||
          </span>
          <span className="text-base">BookVerse</span>
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="hidden items-center gap-8 text-slate-950 md:flex">
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/library"
            className={navLinkClass}
          >
            Library
          </NavLink>
        </nav>
      </div>

      <form
        className="hidden flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 md:flex md:min-w-[280px] md:max-w-[640px]"
        onSubmit={handleSubmit}
      >
        <label htmlFor="desktop-navbar-search" className="sr-only">
          Search books
        </label>
        <input
          id="desktop-navbar-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type to Search Books"
          aria-label="Search books"
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-950 placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white hover:opacity-95 transition"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"
              fill="currentColor"
            />
          </svg>
        </button>
      </form>

      <Link
        to="/library"
        className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_8px_20px_rgba(15,34,69,0.05)] transition hover:opacity-95 md:inline-flex"
      >
        <span>My Library</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 stroke-current">
          <path
            d="M6 4h12a2 2 0 012 2v14l-8-4-8 4V6a2 2 0 012-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div
        id="mobile-navigation"
        className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}
      >
        <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            <NavLink to="/" className={mobileNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/library" className={mobileNavLinkClass}>
              Library
            </NavLink>
          </nav>

          <form
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2"
            onSubmit={handleSubmit}
          >
            <label htmlFor="mobile-navbar-search" className="sr-only">
              Search books
            </label>
            <input
              id="mobile-navbar-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to Search Books"
              aria-label="Search books"
              className="min-w-0 flex-1 border-none bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition hover:opacity-95"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
