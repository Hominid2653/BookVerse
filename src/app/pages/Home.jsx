import BookList from '../components/BookList'
import { useInfiniteBooks } from '../../hooks/useInfiniteBooks'

export default function Home() {
  const recommended = useInfiniteBooks('fiction', 12)
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
      </div>

      <BookList
        title="Recommended For You"
        books={recommended.books}
        hasMore={recommended.hasMore}
        loadingInitial={recommended.loadingInitial}
        loadingMore={recommended.loadingMore}
        error={recommended.error}
        onLoadMore={recommended.loadMore}
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
