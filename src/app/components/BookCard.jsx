import { Link } from 'react-router-dom'
import { addBookToLibrary, isBookInLibrary } from '../../utils/localStorage'

export default function BookCard({ id, image, title, author }) {
  const inLibrary = isBookInLibrary(id)

  const handleAddToLibrary = (e) => {
    e.preventDefault()
    addBookToLibrary({ id, title, author, image })
  }

  return (
    <Link to={`/book/${id}`} className="group block">
      <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="aspect-[4/5] overflow-hidden bg-slate-950">
          <img
            src={image}
            alt={`Cover of ${title}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <p className="text-sm font-medium text-slate-500">{author}</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
          {!inLibrary && (
            <button
              onClick={handleAddToLibrary}
              className="mt-4 w-full rounded-full bg-slate-950 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Add to Library
            </button>
          )}
        </div>
      </article>
    </Link>
  )
}
