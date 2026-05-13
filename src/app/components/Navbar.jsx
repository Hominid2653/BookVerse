import { useState } from 'react'

function Navbar() {
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // Search action can be wired up later
  }

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[28px] shadow-[0_10px_30px_rgba(15,34,69,0.08)]">
      <div className="flex items-center gap-3 text-slate-950 font-semibold">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl border-2 border-slate-950 text-sm tracking-[0.18em]">
          |||
        </span>
        <span className="text-base">BookVerse</span>
      </div>

      <form
        className="flex-1 min-w-[280px] max-w-[640px] flex items-center gap-3 px-3 py-2 rounded-full bg-slate-100 border border-slate-200"
        onSubmit={handleSubmit}
      >
        <label htmlFor="navbar-search" className="sr-only">
          Search books
        </label>
        <input
          id="navbar-search"
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

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_8px_20px_rgba(15,34,69,0.05)] hover:opacity-95 transition"
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
      </button>
    </header>
  )
}

export default Navbar
