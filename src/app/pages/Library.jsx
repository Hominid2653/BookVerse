import { useState, useEffect } from 'react'
import { getSavedLibrary, updateBookStatus, removeBookFromLibrary, ReadingStatus } from '../../utils/localStorage'
import BookCard from '../components/BookCard'

export default function Library() {
  const [library, setLibrary] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setLibrary(getSavedLibrary())
  }, [])

  const handleStatusChange = (bookId, status) => {
    updateBookStatus(bookId, status)
    setLibrary(getSavedLibrary())
  }

  const handleRemove = (bookId) => {
    removeBookFromLibrary(bookId)
    setLibrary(getSavedLibrary())
  }

  const filteredBooks = filter === 'all' ? library : library.filter((book) => book.status === filter)

  const statusCounts = {
    all: library.length,
    [ReadingStatus.WANT_TO_READ]: library.filter((b) => b.status === ReadingStatus.WANT_TO_READ).length,
    [ReadingStatus.CURRENTLY_READING]: library.filter((b) => b.status === ReadingStatus.CURRENTLY_READING).length,
    [ReadingStatus.FINISHED]: library.filter((b) => b.status === ReadingStatus.FINISHED).length,
  }

  return (
    <div className="px-6 pb-10 pt-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Library</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          My Library
        </h1>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">
          Track your reading progress and manage your personal book collection.
        </p>
      </div>

      {library.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Books' : status} ({count})
            </button>
          ))}
        </div>
      )}

      {filteredBooks.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <div key={book.id} className="relative">
              <BookCard {...book} />
              <div className="mt-3 flex gap-2">
                <select
                  value={book.status}
                  onChange={(e) => handleStatusChange(book.id, e.target.value)}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <option value={ReadingStatus.WANT_TO_READ}>Want to Read</option>
                  <option value={ReadingStatus.CURRENTLY_READING}>Currently Reading</option>
                  <option value={ReadingStatus.FINISHED}>Finished</option>
                </select>
                <button
                  onClick={() => handleRemove(book.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">
            {library.length === 0
              ? 'Your library is empty. Search for books and add them to get started.'
              : `No books in the "${filter}" category.`}
          </p>
        </div>
      )}
    </div>
  )
}