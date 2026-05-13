import { useEffect, useRef } from 'react'
import BookCard from './BookCard'

function BookCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-hidden
    >
      <div className="aspect-[3/4] animate-pulse bg-slate-200" />
      <div className="space-y-2 p-2.5 sm:p-3">
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3.5 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="mt-2.5 h-8 w-full animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  )
}

export default function BookList({
  title,
  books,
  hasMore = false,
  loadingInitial = false,
  loadingMore = false,
  error = null,
  onLoadMore,
  initialSkeletonCount = 12,
  loadMoreSkeletonCount = 6,
}) {
  const sentinelRef = useRef(null)
  const loadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    loadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current?.()
        }
      },
      { root: null, rootMargin: '240px 0px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore, books.length])

  const gridClassName = `grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${
    title ? 'mt-5' : 'mt-0'
  }`

  return (
    <section>
      {title ? (
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">{title}</h2>
        </div>
      ) : null}

      {error && (
        <p className={`text-sm text-red-600 ${title ? 'mt-4' : ''}`} role="alert">
          {error.message || 'Something went wrong loading books.'}
        </p>
      )}

      {loadingInitial && books.length === 0 ? (
        <div
          className={gridClassName + (title ? '' : '')}
          role="status"
          aria-label="Loading books"
        >
          {Array.from({ length: initialSkeletonCount }, (_, i) => (
            <BookCardSkeleton key={`sk-init-${i}`} />
          ))}
        </div>
      ) : (
        <>
          {books.length === 0 && !error ? (
            <p className={`text-center text-sm text-slate-500 ${title ? 'mt-6' : 'mt-4'}`}>
              No books found.
            </p>
          ) : (
            <div className={gridClassName}>
              {books.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
              {loadingMore &&
                Array.from({ length: loadMoreSkeletonCount }, (_, i) => (
                  <BookCardSkeleton key={`sk-more-${i}`} />
                ))}
            </div>
          )}

          {onLoadMore && hasMore && books.length > 0 && (
            <div
              ref={sentinelRef}
              className="flex h-12 w-full items-center justify-center"
              aria-hidden
            />
          )}

          {!hasMore && books.length > 0 && onLoadMore && (
            <p className="mt-4 text-center text-xs text-slate-500">You&apos;re all caught up.</p>
          )}
        </>
      )}
    </section>
  )
}
