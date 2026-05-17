import { Link } from 'react-router-dom'
import BookLikeButton from './BookLikeButton'
import { PLACEHOLDER_COVER_URL } from '../../services/bookApi'
import { ReadingStatus } from '../../utils/localStorage'

export default function LibraryBookItem({
  book,
  onToggleFavorite,
  onStatusChange,
  onRemove,
  removeLabel = 'Remove',
  showLibraryControls = true,
}) {
  const isFavorite = Boolean(book.favorite)

  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-4">
      <Link
        to={`/book/${encodeURIComponent(book.id)}`}
        className="shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80"
      >
        <img
          src={book.image || PLACEHOLDER_COVER_URL}
          alt=""
          className="aspect-[3/4] h-24 w-[4.5rem] object-cover sm:h-28 sm:w-[5.25rem]"
          onError={(e) => {
            e.target.src = PLACEHOLDER_COVER_URL
          }}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="min-w-0">
          <Link
            to={`/book/${encodeURIComponent(book.id)}`}
            className="line-clamp-2 text-base font-semibold text-slate-950 hover:text-violet-700"
          >
            {book.title}
          </Link>
          <p className="mt-1 truncate text-sm text-slate-500">{book.author}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BookLikeButton
            book={{
              id: book.id,
              title: book.title,
              author: book.author,
              image: book.image,
              subjects: Array.isArray(book.subjects) ? book.subjects : [],
            }}
            className="min-w-[7.5rem] py-2"
          />
          {showLibraryControls && (
            <>
              <label className="sr-only" htmlFor={`status-${book.id}`}>
                Reading status for {book.title}
              </label>
              <select
                id={`status-${book.id}`}
                value={book.status}
                onChange={(e) => onStatusChange(book.id, e.target.value)}
                className="max-w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 sm:text-sm"
              >
                {Object.values(ReadingStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </>
          )}

          {showLibraryControls && (
            <button
              type="button"
              onClick={() => onToggleFavorite(book.id)}
              className={`inline-flex items-center justify-center rounded-full border p-2 transition ${
                isFavorite
                  ? 'border-violet-500 bg-violet-50 text-violet-600'
                  : 'border-slate-200 bg-white text-slate-400 hover:border-violet-300 hover:text-violet-600'
              }`}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Mark as favorite read'}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                {isFavorite ? (
                  <path
                    fill="currentColor"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                ) : (
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.65"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                )}
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(book.id)}
            className="ml-auto text-xs font-semibold text-slate-500 underline-offset-2 hover:text-red-600 hover:underline sm:text-sm"
          >
            {removeLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
