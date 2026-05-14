const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'
const OPEN_LIBRARY_WORKS_URL = 'https://openlibrary.org/works'
const OPEN_LIBRARY_AUTHOR_URL = 'https://openlibrary.org'

/** Shared placeholder when no cover is available */
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

    subjects: Array.isArray(doc.subject)
      ? doc.subject.filter(Boolean).slice(0, 24)
      : [],

    source: 'openlibrary',
  }
}

/**
 * @param {string} query
 * @param {number | { limit?: number, offset?: number }} [options] If a number, treated as `limit` with offset 0.
 * @returns {Promise<{ books: object[], hasMore: boolean, total: number }>}
 */
async function searchBooks(query, options = {}) {
  if (!query || !query.trim()) {
    return { books: [], hasMore: false, total: 0 }
  }

  const limit = typeof options === 'number' ? options : (options.limit ?? 20)
  const offset = typeof options === 'number' ? 0 : (options.offset ?? 0)

  const url = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(
    query,
  )}&limit=${limit}&offset=${offset}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Book search failed')
  }

  const data = await response.json()
  const docs = Array.isArray(data.docs) ? data.docs : []
  const books = docs.map(normalizeSearchResult)
  const total = typeof data.numFound === 'number' ? data.numFound : books.length
  const hasMore = offset + books.length < total

  return { books, hasMore, total }
}

function parsePublishYear(work) {
  if (typeof work.first_publish_year === 'number') {
    return String(work.first_publish_year)
  }
  if (work.first_publish_date) {
    const m = String(work.first_publish_date).match(/\b(18|19|20)\d{2}\b/)
    if (m) return m[0]
  }
  return null
}

async function resolveWorkAuthors(work) {
  if (!Array.isArray(work.authors)) return []

  return Promise.all(
    work.authors.map(async (authorRef) => {
      if (!authorRef.author?.key) return 'Unknown Author'

      const authorResponse = await fetch(
        `${OPEN_LIBRARY_AUTHOR_URL}${authorRef.author.key}.json`
      )

      if (!authorResponse.ok) return 'Unknown Author'

      const authorData = await authorResponse.json()
      return authorData.name || 'Unknown Author'
    }),
  )
}

/** Best-effort Internet Archive identifier from linked editions (enables embed reader). */
async function findInternetArchiveId(workId) {
  try {
    const response = await fetch(
      `https://openlibrary.org/works/${encodeURIComponent(workId)}/editions.json?limit=40`,
    )
    if (!response.ok) return null
    const data = await response.json()
    for (const ed of data.entries || []) {
      if (ed.ocaid) return String(ed.ocaid).trim()
      const ia = ed.identifiers?.internet_archive
      if (Array.isArray(ia) && ia[0]) return String(ia[0]).trim()
      if (typeof ia === 'string' && ia.trim()) return ia.trim()
      if (ed.ia_box_id) return String(ed.ia_box_id).trim()
    }
  } catch {
    return null
  }
  return null
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

  const [authors, internetArchiveId] = await Promise.all([
    resolveWorkAuthors(work),
    findInternetArchiveId(workId),
  ])

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

    publishedYear: parsePublishYear(work),

    excerpts: Array.isArray(work.excerpts)
      ? work.excerpts
          .map((item) => item.comment || item.text)
          .filter(Boolean)
      : [],

    internetArchiveId,

    source: 'openlibrary',
  }
}

export { searchBooks, getBookDetails, getCoverImage }