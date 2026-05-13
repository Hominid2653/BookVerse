const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'
const OPEN_LIBRARY_WORKS_URL = 'https://openlibrary.org/works'
const OPEN_LIBRARY_AUTHOR_URL = 'https://openlibrary.org'

/** Shared placeholder when no cover is available (UI + API normalization). */
export const PLACEHOLDER_COVER_URL =
  'https://via.placeholder.com/300x450?text=No+Cover'

function getCoverImage(coverId, size = 'L') {
  if (!coverId) return PLACEHOLDER_COVER_URL

  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

function getSmartCover(doc) {
  if (doc.cover_i) {
    return getCoverImage(doc.cover_i)
  }

  if (Array.isArray(doc.edition_key) && doc.edition_key.length > 0) {
    return `https://covers.openlibrary.org/b/olid/${doc.edition_key[0]}-L.jpg`
  }

  return PLACEHOLDER_COVER_URL
}

function normalizeSearchResult(doc) {
  const key =
    doc.key?.replace('/works/', '') ||
    doc.edition_key?.[0] ||
    doc.title

  return {
    id: key,
    title: doc.title || 'Unknown Title',
    author: Array.isArray(doc.author_name)
      ? doc.author_name[0]
      : doc.author || 'Unknown Author',

    image: getSmartCover(doc),

    publishedYear: doc.first_publish_year || null,

    snippet: Array.isArray(doc.first_sentence)
      ? doc.first_sentence[0]
      : typeof doc.first_sentence === 'string'
      ? doc.first_sentence
      : '',

    source: 'openlibrary',
  }
}

async function searchBooks(query, limit = 20) {
  if (!query || !query.trim()) return []

  const url = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Book API search request failed')
  }

  const data = await response.json()
  return Array.isArray(data.docs)
    ? data.docs.map(normalizeSearchResult)
    : []
}

async function getBookDetails(workId) {
  if (!workId) {
    throw new Error('Missing book id for details request')
  }

  const response = await fetch(
    `${OPEN_LIBRARY_WORKS_URL}/${workId}.json`
  )

  if (!response.ok) {
    throw new Error('Book API detail request failed')
  }

  const work = await response.json()

  const authors = Array.isArray(work.authors)
    ? await Promise.all(
        work.authors.map(async (authorRef) => {
          if (!authorRef.author?.key) return 'Unknown Author'

          const authorResponse = await fetch(
            `${OPEN_LIBRARY_AUTHOR_URL}${authorRef.author.key}.json`
          )

          if (!authorResponse.ok) return 'Unknown Author'

          const authorData = await authorResponse.json()
          return authorData.name || 'Unknown Author'
        })
      )
    : []

  return {
    id: work.key?.replace('/works/', '') || workId,
    title: work.title || 'Unknown Title',

    description:
      typeof work.description === 'string'
        ? work.description
        : work.description?.value || 'No description available.',

    authors: authors.length ? authors : ['Unknown Author'],

    subjects: work.subjects || [],

    coverImages: Array.isArray(work.covers)
      ? work.covers.map((id) => getCoverImage(id))
      : [],

    firstPublishDate: work.first_publish_date || null,

    excerpts: Array.isArray(work.excerpts)
      ? work.excerpts.map((item) => item.comment || item.text)
      : [],

    source: 'openlibrary',
  }
}

export { searchBooks, getBookDetails, getCoverImage }