import { buildPreviewPages, chunkLongText } from '../utils/buildPreviewPages'

test('chunkLongText returns clean page-sized chunks', () => {
  const chunks = chunkLongText('  first   second third fourth  ', 13)

  // The helper normalizes whitespace before splitting text into readable pages.
  expect(chunks).toEqual(['first second', 'third fourth'])
})

test('chunkLongText returns an empty array for blank text', () => {
  expect(chunkLongText('   ')).toEqual([])
})

test('buildPreviewPages includes a cover and labeled text pages', () => {
  const pages = buildPreviewPages({
    title: 'Dune',
    description: 'A desert planet with a dangerous political future.',
    excerpts: ['Fear is the mind-killer.'],
    coverImages: ['https://example.com/dune.jpg'],
  })

  // The first preview page should be the cover when a cover image exists.
  expect(pages[0]).toEqual({
    type: 'cover',
    src: 'https://example.com/dune.jpg',
    alt: 'Dune',
  })
  // Description and excerpts are merged into text pages after the cover.
  expect(pages[1]).toMatchObject({
    type: 'text',
    label: '1',
  })
  expect(pages[1].text).toContain('A desert planet')
  expect(pages[1].text).toContain('Fear is the mind-killer.')
})

test('buildPreviewPages creates fallback pages when no preview data exists', () => {
  const pages = buildPreviewPages({})

  // Empty preview data still produces readable fallback pages for the flipbook.
  expect(pages).toHaveLength(2)
  expect(pages[0]).toMatchObject({
    type: 'text',
    text: 'No preview text is available for this title yet.',
  })
})
