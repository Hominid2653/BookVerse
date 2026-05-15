import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BookLikeButton from './BookLikeButton'
import { PLACEHOLDER_COVER_URL } from '../../services/bookApi'
import { addBookToLibrary, isBookInLibrary } from '../../utils/localStorage'

export default function BookCard({ id, image, title, author, subjects = [] }) {
  const [inLibrary, setInLibrary] = useState(() => isBookInLibrary(id))
  const [showAddedFeedback, setShowAddedFeedback] = useState(false)
  const addedTimerRef = useRef(null)

  useEffect(() => {
    setInLibrary(isBookInLibrary(id))
  }, [id])

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    }
  }, [])

  const handleAddToLibrary = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addBookToLibrary({ id, title, author, image, subjects })
    setInLibrary(true)
    setShowAddedFeedback(true)

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    addedTimerRef.current = setTimeout(() => {
      setShowAddedFeedback(false)
    }, 1600)
  }

  const likeBook = { id, title, author, image, subjects }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/book/${encodeURIComponent(id)}`} className="group block">
        <div className="aspect-[3/4] overflow-hidden bg-slate-950">
          <img
            src={image || PLACEHOLDER_COVER_URL}
            alt={`Cover of ${title}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = PLACEHOLDER_COVER_URL
            }}
          />
        </div>

        <div className="p-2.5 sm:p-3">
          <p className="truncate text-xs font-medium text-slate-500">{author}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-950">
            {title}
          </h3>
        </div>
      </Link>

      <div className="flex gap-2 px-2.5 pb-2.5 sm:gap-2 sm:px-3 sm:pb-3">
        <BookLikeButton book={likeBook} className="min-w-0 flex-1" />
        <button
          type="button"
          onClick={handleAddToLibrary}
          disabled={inLibrary}
          className={`inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-semibold shadow-sm transition active:scale-[0.98] sm:gap-2 sm:text-sm ${
            inLibrary
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-slate-950 bg-slate-950 text-white hover:bg-slate-800'
          }`}
          aria-label={inLibrary ? `${title} is already in your library` : `Add to library: ${title}`}
        >
          {inLibrary ? (
            <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          )}
          <span>{inLibrary ? (showAddedFeedback ? 'Added!' : 'Added') : 'Library'}</span>
        </button>
      </div>
    </article>
  )
}
