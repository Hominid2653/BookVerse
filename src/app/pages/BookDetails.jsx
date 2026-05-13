import { useParams } from 'react-router-dom'

export default function BookDetails() {
  const { id } = useParams()

  return (
    <main className="px-6 pb-10 pt-8">
      <h1 className="text-3xl font-semibold text-slate-950">Book Details</h1>
      <p className="mt-3 text-slate-600">Viewing details for book ID: {id}</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Book detail content will be shown here once the details page is integrated.</p>
      </div>
    </main>
  )
}
