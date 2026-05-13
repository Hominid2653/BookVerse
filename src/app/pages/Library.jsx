export default function Library() {
  return (
    <main className="px-6 pb-10 pt-8">
      <h1 className="text-3xl font-semibold text-slate-950">My Library</h1>
      <p className="mt-3 text-slate-600">Saved books and reading progress will appear here.</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Your shelf is currently empty. Add books from the home or search pages.</p>
      </div>
    </main>
  )
}
