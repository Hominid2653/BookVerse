import { Link } from 'react-router-dom'
import BookLikeButton from './BookLikeButton'
import { PLACEHOLDER_COVER_URL } from '../../services/bookApi'
import { addBookToLibrary, isBookInLibrary } from '../../utils/localStorage'

export default function BookCard({ id, image, title, author, subjects = [] }) {
  const inLibrary = isBookInLibrary(id)

  const handleAddToLibrary = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addBookToLibrary({ id, title, author, image, subjects })
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
        {!inLibrary && (
          <button
            type="button"
            onClick={handleAddToLibrary}
            className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full bg-slate-950 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 sm:text-sm"
          >
            Add to Library
          </button>
        )}
      </div>
    </article>
  )
}
