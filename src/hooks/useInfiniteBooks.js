import { useCallback, useEffect, useRef, useState } from 'react'
import { searchBooks } from '../services/bookApi'

function mergeById(existing, incoming) {
  const seen = new Set(existing.map((b) => b.id))
  const next = [...existing]
  for (const book of incoming) {
    if (!seen.has(book.id)) {
      seen.add(book.id)
      next.push(book)
    }
  }
  return next
}

/**
 * Paginated search with append-on-load-more. Resets when `subject` changes.
 * @param {string} subject Search query passed to Open Library.
 * @param {number} pageSize Items per request.
 */
export function useInfiniteBooks(subject, pageSize = 16) {
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const offsetRef = useRef(0)
  const subjectRef = useRef(subject)
  const inFlightRef = useRef(false)
  const hasMoreRef = useRef(true)

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    subjectRef.current = subject
    offsetRef.current = 0
    setBooks([])
    setHasMore(true)
    hasMoreRef.current = true
    setError(null)

    const q = subject?.trim()
    if (!q) {
      setLoadingInitial(false)
      setHasMore(false)
      hasMoreRef.current = false
      return
    }

    let cancelled = false
    inFlightRef.current = true
    setLoadingInitial(true)

    ;(async () => {
      try {
        const { books: first, hasMore: more } = await searchBooks(q, {
          limit: pageSize,
          offset: 0,
        })
        if (cancelled || subjectRef.current !== subject) return
        setBooks(first)
        offsetRef.current = first.length
        setHasMore(more)
        hasMoreRef.current = more
      } catch (e) {
        if (!cancelled && subjectRef.current === subject) {
          setError(e)
          setBooks([])
          setHasMore(false)
          hasMoreRef.current = false
        }
      } finally {
        if (!cancelled && subjectRef.current === subject) {
          inFlightRef.current = false
          setLoadingInitial(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [subject, pageSize])

  const loadMore = useCallback(async () => {
    const q = subjectRef.current?.trim()
    if (!q || inFlightRef.current || !hasMoreRef.current) return

    inFlightRef.current = true
    setLoadingMore(true)
    setError(null)

    try {
      const { books: batch, hasMore: more } = await searchBooks(q, {
        limit: pageSize,
        offset: offsetRef.current,
      })
      if (subjectRef.current?.trim() !== q) return

      if (batch.length === 0) {
        setHasMore(false)
        hasMoreRef.current = false
        return
      }

      setBooks((prev) => mergeById(prev, batch))
      offsetRef.current += batch.length
      setHasMore(more)
      hasMoreRef.current = more
    } catch (e) {
      setError(e)
    } finally {
      inFlightRef.current = false
      setLoadingMore(false)
    }
  }, [pageSize])

  return {
    books,
    hasMore,
    loadingInitial,
    loadingMore,
    error,
    loadMore,
  }
}
