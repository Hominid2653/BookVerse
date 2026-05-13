import { useSearchParams } from 'react-router-dom'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div className="px-6 pb-10 pt-8">
      <h1 className="text-3xl font-semibold text-slate-950">Search Results</h1>
      <p className="mt-3 text-slate-600">
        {query ? `Showing results for "${query}".` : 'Enter a search term in the navbar to find books.'}
      </p>
      <div className="mt-8 text-slate-500">
        {query ? 'Search result cards will appear here once you add search integration.' : 'Search results are not available until a query is submitted.'}
      </div>
    </div>
  )
}
