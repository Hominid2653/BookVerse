import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBookDetails, PLACEHOLDER_COVER_URL } from '../../services/bookApi'
import {
  addBookToLibrary,
  getSavedLibrary,
  isBookInLibrary,
  ReadingStatus,
  removeBookFromLibrary,
  updateBookStatus,
} from '../../utils/localStorage'

const DESCRIPTION_PREVIEW = 900
const GENRE_DISPLAY_LIMIT = 16

function BookDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse" aria-busy="true" aria-label="Loading book details">
      <div className="h-4 w-36 rounded bg-slate-200" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <div className="mx-auto aspect-[3/4] w-full max-w-[220px] rounded-2xl bg-slate-200 lg:mx-0 lg:max-w-none" />
        <div className="space-y-5">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-10 max-w-xl rounded-lg bg-slate-200" />
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="h-12 w-full max-w-md rounded-full bg-slate-200" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-slate-200" />
            ))}
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-full max-w-[85%] rounded bg-slate-200" />
            <div className="h-4 w-full max-w-[70%] rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookDetails() {
  const { id: rawId } = useParams()
  const id = rawId ? decodeURIComponent(rawId) : ''

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [libraryVersion, setLibraryVersion] = useState(0)

  const refreshLibrary = useCallback(() => {
    setLibraryVersion((v) => v + 1)
  }, [])

  const inLibrary = useMemo(() => (id ? isBookInLibrary(id) : false), [id, libraryVersion])

  const savedEntry = useMemo(() => {
    if (!id) return null
    return getSavedLibrary().find((item) => item.id === id) ?? null
  }, [id, libraryVersion])

  useEffect(() => {
    setDescriptionExpanded(false)
  }, [id])

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

  const primaryCover = book?.coverImages?.[0] || PLACEHOLDER_COVER_URL
  const authorsLabel = book?.authors?.length
    ? book.authors.filter(Boolean).join(', ')
    : 'Unknown Author'

  const genres = Array.isArray(book?.subjects) ? book.subjects.filter(Boolean) : []
  const genresShown = genres.slice(0, GENRE_DISPLAY_LIMIT)
  const genresOverflow = genres.length - genresShown.length

  const description = book?.description?.trim() || 'No description available.'
  const descriptionLong = description.length > DESCRIPTION_PREVIEW
  const descriptionDisplay =
    descriptionLong && !descriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW).trim()}…`
      : description

  const handleAddToLibrary = () => {
    if (!book) return
    addBookToLibrary({
      id: book.id,
      title: book.title,
      author: authorsLabel,
      image: primaryCover,
    })
    refreshLibrary()
  }

  const handleRemove = () => {
    if (!book) return
    removeBookFromLibrary(book.id)
    refreshLibrary()
  }

  const handleStatusChange = (event) => {
    if (!book) return
    updateBookStatus(book.id, event.target.value)
    refreshLibrary()
  }

  return (
    <main className="px-6 pb-16 pt-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <span aria-hidden>←</span>
          Back to discovery
        </Link>

        {loading && <BookDetailsSkeleton />}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-950">Could not load this book</h1>
            <p className="mt-3 text-slate-600">
              {error.message ||
                'The book may be unavailable or the link might use an unsupported identifier.'}
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Return home
            </Link>
          </div>
        )}

        {!loading && !error && book && (
          <article className="mt-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start">
              <div className="mx-auto w-full max-w-[240px] lg:mx-0 lg:max-w-none">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-md">
                  <img
                    src={primaryCover}
                    alt={`Cover: ${book.title}`}
                    className="aspect-[3/4] w-full object-cover"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_COVER_URL
                    }}
                  />
                </div>
              </div>

              <div className="min-w-0 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  {book.publishedYear && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800">
                      {book.publishedYear}
                    </span>
                  )}
                  {book.firstPublishDate && !book.publishedYear && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800">
                      {book.firstPublishDate}
                    </span>
                  )}
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">
                    Open Library
                  </span>
                </div>

                <header className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {book.title}
                  </h1>
                  <p className="text-lg text-slate-600">by {authorsLabel}</p>
                </header>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {!inLibrary ? (
                    <button
                      type="button"
                      onClick={handleAddToLibrary}
                      className="inline-flex justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Add to library
                    </button>
                  ) : (
                    <>
                      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 sm:max-w-xs">
                        Reading status
                        <select
                          value={savedEntry?.status ?? ReadingStatus.WANT_TO_READ}
                          onChange={handleStatusChange}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-950 outline-none focus:ring-2 focus:ring-slate-950/20"
                        >
                          {Object.values(ReadingStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="inline-flex justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                      >
                        Remove from library
                      </button>
                    </>
                  )}
                </div>

                {genresShown.length > 0 && (
                  <section aria-labelledby="book-genres-heading">
                    <h2 id="book-genres-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                      Genres
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {genresShown.map((subject) => (
                        <li key={subject}>
                          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                            {subject}
                          </span>
                        </li>
                      ))}
                      {genresOverflow > 0 && (
                        <li>
                          <span className="inline-block rounded-full border border-dashed border-slate-200 px-3 py-1 text-xs text-slate-500">
                            +{genresOverflow} more
                          </span>
                        </li>
                      )}
                    </ul>
                  </section>
                )}

                <section aria-labelledby="book-description-heading">
                  <h2 id="book-description-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </h2>
                  <div className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
                    <p className="whitespace-pre-wrap">{descriptionDisplay}</p>
                    {descriptionLong && (
                      <button
                        type="button"
                        onClick={() => setDescriptionExpanded((v) => !v)}
                        className="mt-3 text-sm font-semibold text-slate-950 underline-offset-2 hover:underline"
                      >
                        {descriptionExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </section>

                {book.excerpts?.filter(Boolean).length > 0 && (
                  <section aria-labelledby="book-excerpts-heading">
                    <h2 id="book-excerpts-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                      Excerpts
                    </h2>
                    <ul className="mt-3 space-y-4">
                      {book.excerpts.filter(Boolean).slice(0, 3).map((text, index) => (
                        <li
                          key={index}
                          className="border-l-4 border-slate-200 pl-4 text-sm italic leading-relaxed text-slate-600"
                        >
                          {text}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  )
}
