import { useSyncExternalStore } from 'react'
import { isBookLiked, subscribeLikesTaste, toggleBookLike } from '../../utils/localStorage'

export default function BookLikeButton({ book, className = '' }) {
  const liked = useSyncExternalStore(
    subscribeLikesTaste,
    () => isBookLiked(book.id),
    () => false,
  )

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookLike({
      id: book.id,
      title: book.title,
      author: book.author,
      image: book.image,
      subjects: book.subjects,
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-semibold transition sm:gap-2 sm:text-sm ${
        liked
          ? 'border-violet-500 bg-violet-50 text-violet-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
      } ${className}`}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike and update recommendations' : 'Like to tune recommendations'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M7 10v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z" />
        <path d="M21 12v6a2 2 0 0 1-2 2h-6.5l1-6H15a1 1 0 0 0 1-1v-1.76a2 2 0 0 0-1.11-1.79L10 6V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 1.73l1.38 9.66A2 2 0 0 1 16.62 12H21z" />
      </svg>
      <span>{liked ? 'Liked' : 'Like'}</span>
    </button>
  )
}
