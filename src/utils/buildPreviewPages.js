const MAX_TEXT_PAGES = 22

/**
 * Split long prose into page-sized chunks for the flipbook.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string[]}
 */

// Split on paragraph breaks and avoid cutting sentences in half, -Not perfect. 
//The goal is just to create reasonably sized chunks of text for the flipbook pages.
export function chunkLongText(text, maxLen = 440) {
  const t = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return []

  const out = []
  let rest = t
  while (rest.length > 0 && out.length < MAX_TEXT_PAGES) {
    if (rest.length <= maxLen) {
      out.push(rest)
      break
    }
    let cut = rest.lastIndexOf(' ', maxLen)
    if (cut < maxLen * 0.42) cut = maxLen
    out.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  return out
}

/**
 * Build flipbook page descriptors from Open Library work fields.
 * @param {{ title?: string, description?: string, excerpts?: string[], coverImages?: string[] }} book
 */

// The flipbook preview is a mix of description, excerpts, and cover images. The text is chunked into pages with a max length, and we include the cover as the first page when available. 
// If there are no text fields, we show a default message. 
// We also add a final page to encourage users to explore more titles or view the full record.
export function buildPreviewPages(book) {
  const pages = []
  const cover = book.coverImages?.[0]
  if (cover) {
    pages.push({ type: 'cover', src: cover, alt: book.title || 'Cover' })
  }
// We merge the description and excerpts, then chunk it into pages. 
// This way we can show a mix of description and excerpts without worrying about how many of each there are.
  const merged = [book.description, ...(Array.isArray(book.excerpts) ? book.excerpts : [])]
    .filter(Boolean)
    .join('\n\n')

  const chunks = chunkLongText(merged, 440)
  chunks.forEach((text, i) => {
    pages.push({ type: 'text', text, label: String(i + 1) })
  })

  if (pages.length === 0) {
    pages.push({
      type: 'text',
      text: 'No preview text is available for this title yet.',
    })
  }

  if (pages.length < 2) {
    pages.push({
      type: 'text',
      text: 'Turn the corner to explore more titles on BookVerse, or open the full book record for links and metadata.',
    })
  }

  return pages.slice(0, MAX_TEXT_PAGES + 2)
}
