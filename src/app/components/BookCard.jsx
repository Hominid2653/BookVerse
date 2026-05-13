import { Link } from 'react-router-dom'
import { PLACEHOLDER_COVER_URL } from '../../services/bookApi'
import { addBookToLibrary, isBookInLibrary } from '../../utils/localStorage'

export default function BookCard({ id, image, title, author }) {
  const inLibrary = isBookInLibrary(id)

  const handleAddToLibrary = (e) => {
    e.preventDefault()
    addBookToLibrary({ id, title, author, image })
  }

  return (
    <Link to={`/book/${id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
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

          {!inLibrary && (
            <button
              type="button"
              onClick={handleAddToLibrary}
              className="mt-2.5 w-full rounded-full bg-slate-950 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Add to Library
            </button>
          )}
        </div>
      </article>
    </Link>
  )
}
