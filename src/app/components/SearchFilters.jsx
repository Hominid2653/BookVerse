export default function SearchFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  minRating,
  onRatingChange,
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-950 mb-4">Filters & Sort</h3>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Category Filter */}
          <div className="space-y-3">
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 transition focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <label htmlFor="sort" className="block text-sm font-medium text-slate-700">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full rounded-[12px] border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 transition focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
              <option value="relevance">Relevance</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Minimum Rating Filter */}
          <div className="space-y-3">
            <label htmlFor="rating" className="block text-sm font-medium text-slate-700">
              Minimum Rating: {minRating.toFixed(1)}★
            </label>
            <input
              id="rating"
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => onRatingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0★</span>
              <span>5★</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
