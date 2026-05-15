import { useEffect, useState, useSyncExternalStore } from 'react'
import BookList from '../components/BookList'
import { searchBooks } from '../../services/bookApi'
import {
  getRecommendationSearchQuery,
  getRecommendationSearchTerms,
  hasTasteProfile,
  subscribeLikesTaste,
} from '../../utils/localStorage'
import { useInfiniteBooks } from '../../hooks/useInfiniteBooks'

const RECOMMENDED_MAX = 12
const RECOMMENDATION_TERMS_MAX = 3
const RECOMMENDATIONS_CACHE_TTL = 10 * 60 * 1000
const recommendationsCache = new Map()

function mergeUniqueBooks(bookGroups, maxBooks) {
  const seen = new Set()
  const merged = []
  const longestGroup = Math.max(0, ...bookGroups.map((group) => group.length))

  for (let index = 0; index < longestGroup && merged.length < maxBooks; index += 1) {
    for (const group of bookGroups) {
      const book = group[index]
      if (!book || seen.has(book.id)) continue
      seen.add(book.id)
      merged.push(book)
      if (merged.length === maxBooks) break
    }
  }

  return merged
}

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
    const cacheKey = tasteQuery
    const cached = recommendationsCache.get(cacheKey)
    const cacheFresh =
      cached && Date.now() - cached.cachedAt <= RECOMMENDATIONS_CACHE_TTL

    if (cacheFresh) {
      setRecommendedBooks(cached.books)
      setRecommendedLoading(false)
      setRecommendedError(null)
      return () => {
        cancelled = true
      }
    } else if (cached) {
      setRecommendedBooks(cached.books)
      setRecommendedLoading(false)
      setRecommendedError(null)
    } else {
      setRecommendedLoading(true)
      setRecommendedError(null)
    }

    ;(async () => {
      try {
        const terms = getRecommendationSearchTerms().slice(0, RECOMMENDATION_TERMS_MAX)
        const personalized = terms.length > 0 && terms[0] !== 'fiction'
        const responses = await Promise.all(
          terms.map((term) =>
            searchBooks(term, {
              limit: Math.ceil(RECOMMENDED_MAX / terms.length) + 3,
              offset: 0,
              searchBy: personalized ? 'subject' : 'q',
            }),
          ),
        )
        const books = mergeUniqueBooks(
          responses.map((response) => response.books),
          RECOMMENDED_MAX,
        )
        if (!cancelled) {
          setRecommendedBooks(books)
          recommendationsCache.set(cacheKey, {
            books,
            cachedAt: Date.now(),
          })
        }
      } catch (e) {
        if (!cancelled) {
          setRecommendedError(e)
          if (!cached) setRecommendedBooks([])
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
