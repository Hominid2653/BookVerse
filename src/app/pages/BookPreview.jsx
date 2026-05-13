import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FlipbookReader from '../components/FlipbookReader'
import { getBookDetails, PLACEHOLDER_COVER_URL } from '../../services/bookApi'
import { buildPreviewPages } from '../../utils/buildPreviewPages'

export default function BookPreview() {
  const { id: rawId } = useParams()
  const id = rawId ? decodeURIComponent(rawId) : ''

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setBook(null)
      setError(new Error('Missing book identifier.'))
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setBook(null)

    ;(async () => {
      try {
        const data = await getBookDetails(id)
        if (!cancelled) setBook(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error('Failed to load book.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  const previewPages = useMemo(() => (book ? buildPreviewPages(book) : []), [book])

  const authorsLabel = book?.authors?.length
    ? book.authors.filter(Boolean).join(', ')
    : ''

  const archiveEmbedUrl = book?.internetArchiveId
    ? `https://archive.org/embed/${encodeURIComponent(book.internetArchiveId)}?ui=embed`
    : null

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 pb-16 pt-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to={`/book/${encodeURIComponent(id)}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              <span aria-hidden>←</span>
              Back to book details
            </Link>
            {book && (
              <div className="mt-4">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {book.title}
                </h1>
                {authorsLabel && <p className="mt-1 text-slate-600">by {authorsLabel}</p>}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-800">{error.message}</p>
            <Link
              to="/"
              className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Home
            </Link>
          </div>
        )}

        {!loading && !error && book && (
          <>
            {archiveEmbedUrl && (
              <section className="space-y-3" aria-labelledby="archive-reader-heading">
                <h2 id="archive-reader-heading" className="text-lg font-semibold text-slate-900">
                  Internet Archive reader
                </h2>
                <p className="max-w-3xl text-sm text-slate-600">
                  When Open Library links an Internet Archive scan, you can read the digitized volume here. If the
                  embed is empty, lending or region limits may apply—use the flipbook below for a built-in sample.
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg">
                  <iframe
                    title={`Internet Archive: ${book.title}`}
                    src={archiveEmbedUrl}
                    className="aspect-[4/3] w-full min-h-[320px] border-0 sm:min-h-[420px]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </section>
            )}

            <section className="space-y-4" aria-labelledby="flipbook-heading">
              <div>
                <h2 id="flipbook-heading" className="text-lg font-semibold text-slate-900">
                  Flipbook preview
                </h2>
                <p className="mt-1 max-w-3xl text-sm text-slate-600">
                  Turn pages for a quick sampler built from the description and excerpts. This is not the full
                  scanned book unless the Archive reader above is available.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-900/15 bg-gradient-to-b from-[#efe8dc] to-[#e8dfd0] p-4 shadow-inner sm:p-6">
                <FlipbookReader key={book.id} pages={previewPages} bookTitle={book.title} />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
