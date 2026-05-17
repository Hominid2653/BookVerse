export default function SearchSummary({ query, resultCount }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold text-slate-950">
        Search Results for "{query}"
      </h1>
      <p className="text-base text-slate-600">
        {resultCount === 0
          ? 'No books found matching your search'
          : `Found ${resultCount} book${resultCount !== 1 ? 's' : ''}`}
      </p>
    </div>
  )
}
