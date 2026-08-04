'use client'

import { useEffect, useId, useState } from 'react'
import type { Dimension } from '@/lib/dimensions'

interface Props {
  dimension: Dimension
}

export default function DimensionInfo({ dimension }: Props) {
  const [open, setOpen] = useState(false)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`About ${dimension.label}`}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-[10px] font-semibold text-gray-500 hover:border-indigo-500 hover:text-indigo-600 leading-none"
      >
        i
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 id={titleId} className="text-base font-semibold text-gray-900">
                {dimension.label}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">{dimension.infoIntro}</p>

            {dimension.infoLink && (
              <p className="text-sm mb-4">
                <a
                  href={dimension.infoLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {dimension.infoLink.label}
                </a>
              </p>
            )}

            {dimension.infoQuote && (
              <blockquote className="text-sm text-gray-800 leading-relaxed border-l-2 border-indigo-300 pl-3 mb-4 italic">
                “{dimension.infoQuote}”
              </blockquote>
            )}

            <ul className="flex flex-col gap-3">
              {dimension.options.map((opt) => (
                <li key={opt.value}>
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{opt.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
