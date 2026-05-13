import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchBooks } from '../../services/bookApi'
import BookCard from '../components/BookCard'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (query) {
      setLoading(true)
      setError(null)
      searchBooks(query)
        .then(setBooks)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    } else {
      setBooks([])
    }
  }, [query])

  return (
    <div className="px-6 pb-10 pt-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Search</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {query ? `Results for "${query}"` : 'Search for books'}
        </h1>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">
          {query ? `Found ${books.length} books matching your search.` : 'Use the search bar above to find books.'}
        </p>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <p className="text-slate-600">Searching...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}

      {!loading && !error && query && books.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">No books found for "{query}". Try a different search term.</p>
        </div>
      )}
    </div>
  )
}