import { useCallback, useEffect, useMemo, useState } from 'react'
import BookshelfIcon from '../components/BookshelfIcon'
import LibraryBookItem from '../components/LibraryBookItem'
import { getBookDetails } from '../../services/bookApi'
import {
  getLikedBooks,
  getSavedLibrary,
  ReadingStatus,
  removeBookFromLibrary,
  subscribeLikesTaste,
  toggleBookFavorite,
  toggleBookLike,
  updateLikedBookDetails,
  updateBookStatus,
} from '../../utils/localStorage'

const LIKED_TAB = 'Liked Books'

const TABS = [
  { status: ReadingStatus.WANT_TO_READ, label: 'Want to Read' },
  { status: ReadingStatus.CURRENTLY_READING, label: 'Reading' },
  { status: ReadingStatus.FINISHED, label: 'Finished' },
  { status: LIKED_TAB, label: 'Liked' },
]

export default function Library() {
  const [libraryTick, setLibraryTick] = useState(0)

  const library = useMemo(() => getSavedLibrary(), [libraryTick])
  const likedBooks = useMemo(() => getLikedBooks(), [libraryTick])

  const refresh = useCallback(() => {
    setLibraryTick((n) => n + 1)
  }, [])

  useEffect(() => subscribeLikesTaste(refresh), [refresh])

  useEffect(() => {
    const missingDetails = likedBooks.filter((book) => book.title === 'Liked book')
    if (missingDetails.length === 0) return

    let cancelled = false

    ;(async () => {
      const resolvedBooks = await Promise.all(
        missingDetails.map(async (book) => {
          try {
            const details = await getBookDetails(book.id)
            const author = details.authors?.filter(Boolean).join(', ') || 'Unknown Author'
            return {
              id: details.id || book.id,
              title: details.title,
              author,
              image: details.coverImages?.[0] || book.image,
              subjects: Array.isArray(details.subjects) ? details.subjects : book.subjects,
            }
          } catch {
            return null
          }
        }),
      )

      if (cancelled) return

      let repaired = false
      resolvedBooks.filter(Boolean).forEach((book) => {
        updateLikedBookDetails(book)
        repaired = true
      })
      if (repaired) refresh()
    })()

    return () => {
      cancelled = true
    }
  }, [likedBooks, refresh])

  const [activeStatus, setActiveStatus] = useState(ReadingStatus.WANT_TO_READ)

  const booksInTab = useMemo(
    () =>
      activeStatus === LIKED_TAB
        ? likedBooks
        : library.filter((book) => book.status === activeStatus),
    [activeStatus, library, likedBooks],
  )

  const handleStatusChange = (bookId, status) => {
    updateBookStatus(bookId, status)
    refresh()
  }

  const handleToggleFavorite = (bookId) => {
    toggleBookFavorite(bookId)
    refresh()
  }

  const handleRemove = (bookId) => {
    removeBookFromLibrary(bookId)
    refresh()
  }

  const handleUnlike = (bookId) => {
    toggleBookLike({ id: bookId })
    refresh()
  }

  const emptyMessage =
    activeStatus === LIKED_TAB
      ? {
          title: 'No liked books yet',
          body: 'Like books from Home, Search, or Book Details to collect them here',
        }
      : {
          title: 'No books in this category',
          body: 'Start adding books to your library to see them here',
        }

  return (
    <main className="min-h-[calc(100dvh-8rem)] bg-white px-6 pb-16 pt-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center text-violet-600" aria-hidden>
            <BookshelfIcon className="h-8 w-8" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My Library</h1>
        </header>

        <div className="mt-8 border-b border-slate-200">
          <nav className="flex gap-6 overflow-x-auto sm:gap-10" aria-label="Library shelves">
            {TABS.map((tab) => {
              const isActive = activeStatus === tab.status
              return (
                <button
                  key={tab.status}
                  type="button"
                  onClick={() => setActiveStatus(tab.status)}
                  className={`relative pb-3 text-sm font-medium transition sm:text-base ${
                    isActive
                      ? 'text-violet-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600"
                      aria-hidden
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-10">
          {booksInTab.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
              <span className="text-slate-300" aria-hidden>
                <BookshelfIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </span>
              <p className="mt-6 text-lg font-semibold text-slate-700">{emptyMessage.title}</p>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {emptyMessage.body}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {booksInTab.map((book) => (
                <li key={book.id}>
                  <LibraryBookItem
                    book={book}
                    onToggleFavorite={handleToggleFavorite}
                    onStatusChange={handleStatusChange}
                    onRemove={activeStatus === LIKED_TAB ? handleUnlike : handleRemove}
                    removeLabel={activeStatus === LIKED_TAB ? 'Unlike' : 'Remove'}
                    showLibraryControls={activeStatus !== LIKED_TAB}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
