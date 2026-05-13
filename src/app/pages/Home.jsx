import { useEffect, useState, useSyncExternalStore } from 'react'
import BookList from '../components/BookList'
import { searchBooks } from '../../services/bookApi'
import {
  getRecommendationSearchQuery,
  hasTasteProfile,
  subscribeLikesTaste,
} from '../../utils/localStorage'
import { useInfiniteBooks } from '../../hooks/useInfiniteBooks'

const RECOMMENDED_MAX = 12

export default function Home() {
  const tasteQuery = useSyncExternalStore(
    subscribeLikesTaste,
    getRecommendationSearchQuery,
    () => 'fiction',
  )

  const tastePersonalized = useSyncExternalStore(
    subscribeLikesTaste,
    hasTasteProfile,
    () => false,
  )

  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [recommendedLoading, setRecommendedLoading] = useState(true)
  const [recommendedError, setRecommendedError] = useState(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setRecommendedLoading(true)
      setRecommendedError(null)
      try {
        const { books } = await searchBooks(tasteQuery, {
          limit: RECOMMENDED_MAX,
          offset: 0,
        })
        if (!cancelled) {
          setRecommendedBooks(books.slice(0, RECOMMENDED_MAX))
        }
      } catch (e) {
        if (!cancelled) {
          setRecommendedError(e)
          setRecommendedBooks([])
        }
      } finally {
        if (!cancelled) setRecommendedLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [tasteQuery])

  const trending = useInfiniteBooks('bestseller', 12)

  return (
    <main className="px-6 pb-10 pt-8 space-y-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Home</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Discover your next favorite book
        </h1>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">
          Explore carefully selected reads from your personal library, tailored recommendations, and trending stories.
        </p>
        {tastePersonalized && (
          <p className="text-sm font-medium text-violet-700">
            Your &ldquo;Recommended for you&rdquo; picks follow subjects from books you&apos;ve liked.
          </p>
        )}
      </div>

      <BookList
        title="Recommended For You"
        books={recommendedBooks}
        hasMore={false}
        loadingInitial={recommendedLoading}
        loadingMore={false}
        error={recommendedError}
        initialSkeletonCount={RECOMMENDED_MAX}
      />
      <BookList
        title="Trending Now"
        books={trending.books}
        hasMore={trending.hasMore}
        loadingInitial={trending.loadingInitial}
        loadingMore={trending.loadingMore}
        error={trending.error}
        onLoadMore={trending.loadMore}
      />
    </main>
  )
}
