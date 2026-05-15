export default function NoResults({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-slate-100 p-6 mb-6">
        <svg
          className="h-16 w-16 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-slate-950 mb-3">
        No Results Found
      </h2>

      <p className="text-slate-600 mb-4 max-w-md">
        {query
          ? `We couldn't find any books matching "${query}". Try adjusting your search terms or filters.`
          : 'Try searching for a book title, author, or category.'}
      </p>

      <div className="space-y-3 text-sm text-slate-500">
        <p className="font-medium">Suggestions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Check the spelling of your search term</li>
          <li>Try searching with different keywords</li>
          <li>Remove or adjust filters</li>
          <li>Browse our popular books instead</li>
        </ul>
      </div>
    </div>
  )
}
