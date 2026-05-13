import { useSearchParams } from 'react-router-dom'
import BookList from '../components/BookList'
import { useInfiniteBooks } from '../../hooks/useInfiniteBooks'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { books, hasMore, loadingInitial, loadingMore, error, loadMore } = useInfiniteBooks(
    query,
    20,
  )

  return (
    <main className="px-6 pb-10 pt-8">
      <h1 className="text-3xl font-semibold text-slate-950">Search Results</h1>
      <p className="mt-3 text-slate-600">
        {query
          ? `Showing results for "${query}". Scroll to load more.`
          : 'Enter a search term in the navbar to find books.'}
      </p>

      {query ? (
        <div className="mt-8">
          <BookList
            books={books}
            hasMore={hasMore}
            loadingInitial={loadingInitial}
            loadingMore={loadingMore}
            error={error}
            onLoadMore={loadMore}
          />
        </div>
      ) : (
        <div className="mt-8 text-slate-500">
          Search results will appear here after you submit a query.
        </div>
      )}
    </main>
  )
}
