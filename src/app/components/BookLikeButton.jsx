import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { isBookLiked, subscribeLikesTaste, toggleBookLike } from '../../utils/localStorage'

export default function BookLikeButton({ book, className = '' }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const feedbackTimerRef = useRef(null)

  const liked = useSyncExternalStore(
    subscribeLikesTaste,
    () => isBookLiked(book.id),
    () => false,
  )

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    }
  }, [])

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

    setShowFeedback(true)
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = setTimeout(() => {
      setShowFeedback(false)
    }, 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-semibold shadow-sm transition active:scale-[0.98] sm:gap-2 sm:text-sm ${
        liked
          ? 'border-violet-500 bg-violet-600 text-white hover:bg-violet-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700'
      } ${className}`}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike and update recommendations' : 'Like to tune recommendations'}
    >
      <svg
        viewBox="0 0 512 512"
        className="h-4 w-4 shrink-0"
        fill="currentColor"
        aria-hidden
      >
        <path d="M104 224H24c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V248c0-13.3-10.7-24-24-24zM64 472c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zM384 81.5c0 42.4-26 66.2-33.3 94.5h101.7c33.4 0 59.4 27.7 59.6 58.1.1 17.9-7.5 33.6-19.6 44.6 10 23.8 2.1 54.1-16.4 69.1 5.5 22.7-.6 49.9-18.4 66.2 4.7 19.7 2.4 41-7.4 58.5-18 32.1-51.6 39.5-80.8 39.5H344c-48.7 0-90-17.6-123.5-32-16.8-7.2-32.6-14-44.5-14-6.6 0-12-5.4-12-12V252c0-3.2 1.3-6.2 3.5-8.5 39.6-39.1 56.6-80.6 89.1-113.1 14.8-14.8 20.7-37.2 26.4-58.9 4.9-18.8 13.9-39.5 35.7-39.5 27.9 0 65.3 9.3 65.3 49.5z" />
      </svg>
      <span>{showFeedback ? (liked ? 'Liked' : 'Removed') : liked ? 'Liked' : 'Like'}</span>
    </button>
  )
}
