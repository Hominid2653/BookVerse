import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBookDetails } from '../../services/bookApi'
import { addBookToLibrary, isBookInLibrary, ReadingStatus } from '../../utils/localStorage'

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inLibrary, setInLibrary] = useState(false)

  useEffect(() => {
    if (id) {
      setLoading(true)
      setError(null)
      getBookDetails(id)
        .then((data) => {
          setBook(data)
          setInLibrary(isBookInLibrary(data.id))
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleAddToLibrary = () => {
    if (book) {
      addBookToLibrary(book)
      setInLibrary(true)
    }
  }

  if (loading) {
    return (
      <div className="px-6 pb-10 pt-8">
        <div className="text-center">
          <p className="text-slate-600">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 pb-10 pt-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="px-6 pb-10 pt-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Book not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pb-10 pt-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Book Details</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {book.title}
        </h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {book.coverImages?.[0] && (
            <img
              src={book.coverImages[0]}
              alt={`Cover of ${book.title}`}
              className="aspect-[4/5] w-full rounded-3xl border border-slate-200 object-cover shadow-sm"
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Authors</h2>
            <p className="mt-2 text-slate-600">{book.authors?.join(', ') || 'Unknown'}</p>
          </div>

          {book.firstPublishDate && (
            <div>
              <h2 className="text-xl font-semibold text-slate-950">First Published</h2>
              <p className="mt-2 text-slate-600">{book.firstPublishDate}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-slate-950">Description</h2>
            <p className="mt-2 text-slate-600 leading-relaxed">{book.description}</p>
          </div>

          {book.subjects?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Subjects</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {book.subjects.slice(0, 10).map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!inLibrary ? (
              <button
                onClick={handleAddToLibrary}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Add to Library
              </button>
            ) : (
              <Link
                to="/library"
                className="rounded-full border border-slate-950 bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 transition"
              >
                View in Library
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}