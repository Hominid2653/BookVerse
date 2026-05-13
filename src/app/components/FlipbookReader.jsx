import { forwardRef, useEffect, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { PLACEHOLDER_COVER_URL } from '../../services/bookApi'

const FlipPage = forwardRef(function FlipPage({ density = 'soft', children }, ref) {
  return (
    <div
      ref={ref}
      data-density={density}
      className="flex h-full w-full flex-col overflow-hidden rounded-sm border border-amber-900/20 bg-[#faf7f0] shadow-[inset_0_0_32px_rgba(0,0,0,0.04)]"
    >
      {children}
    </div>
  )
})

FlipPage.displayName = 'FlipPage'

function useFlipbookSize() {
  const [dims, setDims] = useState({ w: 320, h: 448 })

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const w = Math.min(440, Math.max(260, vw - 48))
      const h = Math.round(w * 1.42)
      setDims({ w, h })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return dims
}

/**
 * @param {{ type: 'cover'|'text', src?: string, alt?: string, text?: string, label?: string }[]} pages
 * @param {string} [bookTitle]
 */
export default function FlipbookReader({ pages, bookTitle = '' }) {
  const [mounted, setMounted] = useState(false)
  const { w, h } = useFlipbookSize()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !pages?.length) {
    return (
      <div
        className="mx-auto flex max-w-md items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-500"
        style={{ minHeight: h }}
        aria-busy="true"
      >
        Loading flipbook…
      </div>
    )
  }

  const last = pages.length - 1

  return (
    <div className="mx-auto w-full max-w-[min(100%,520px)]">
      <HTMLFlipBook
        width={w}
        height={h}
        minWidth={240}
        maxWidth={480}
        minHeight={340}
        maxHeight={680}
        size="stretch"
        maxShadowOpacity={0.35}
        showCover
        mobileScrollSupport
        drawShadow
        flippingTime={650}
        usePortrait
        className="mx-auto drop-shadow-xl"
        style={{ margin: '0 auto' }}
      >
        {pages.map((page, index) => {
          const density = index === 0 || index === last ? 'hard' : 'soft'
          if (page.type === 'cover') {
            return (
              <FlipPage key={`p-${index}`} density={density}>
                <div className="flex h-full flex-col bg-gradient-to-br from-amber-950/90 to-slate-900 p-3">
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100/90">
                    BookVerse preview
                  </p>
                  <div className="mt-2 flex flex-1 items-center justify-center">
                    <img
                      src={page.src || PLACEHOLDER_COVER_URL}
                      alt={page.alt || ''}
                      className="max-h-full max-w-full rounded object-contain shadow-lg"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_COVER_URL
                      }}
                    />
                  </div>
                  {bookTitle && (
                    <p className="mt-2 line-clamp-3 text-center text-xs font-medium text-amber-50/95">
                      {bookTitle}
                    </p>
                  )}
                </div>
              </FlipPage>
            )
          }

          return (
            <FlipPage key={`p-${index}`} density={density}>
              <div className="flex h-full flex-col p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Sample {page.label ? `· ${page.label}` : ''}
                </p>
                <div className="mt-3 flex-1 overflow-hidden">
                  <p className="text-left text-sm leading-relaxed text-slate-800 sm:text-[0.95rem]">
                    {page.text}
                  </p>
                </div>
                <p className="mt-3 text-center text-[10px] text-slate-400">Drag a corner to turn the page</p>
              </div>
            </FlipPage>
          )
        })}
      </HTMLFlipBook>
    </div>
  )
}
