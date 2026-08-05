'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  KNOWN_CONSPIRACIES,
  KNOWN_CONSPIRACY_OTHER,
  LEAN_OPTION_CLASS,
  leanForKnownConspiracy,
  type ConspiracyLean,
} from '@/lib/knownConspiracies'

interface Props {
  value: string
  onChange: (value: string) => void
}

function optionClass(lean: ConspiracyLean | null | undefined, selected: boolean) {
  const base = lean ? LEAN_OPTION_CLASS[lean] : 'bg-white text-gray-900'
  return `${base} ${selected ? 'ring-2 ring-indigo-500 ring-inset' : ''} hover:brightness-95`
}

export default function KnownConspiracySelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selectedLean =
    value === KNOWN_CONSPIRACY_OTHER ? null : leanForKnownConspiracy(value)
  const displayLabel =
    value === ''
      ? '— None —'
      : value === KNOWN_CONSPIRACY_OTHER
        ? 'Other'
        : value

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          value
            ? optionClass(selectedLean, false)
            : 'bg-white text-gray-500'
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <span className="text-gray-400 shrink-0" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-300 shadow-lg"
        >
          <li role="option" aria-selected={value === ''}>
            <button
              type="button"
              className={`w-full text-left px-3 py-2 text-sm bg-white text-gray-500 hover:bg-gray-50 ${
                value === '' ? 'ring-2 ring-indigo-500 ring-inset' : ''
              }`}
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              — None —
            </button>
          </li>
          {KNOWN_CONSPIRACIES.map((item) => {
            const selected = value === item.label
            return (
              <li key={item.label} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm ${optionClass(item.lean, selected)}`}
                  onClick={() => {
                    onChange(item.label)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
          <li role="option" aria-selected={value === KNOWN_CONSPIRACY_OTHER}>
            <button
              type="button"
              className={`w-full text-left px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50 ${
                value === KNOWN_CONSPIRACY_OTHER ? 'ring-2 ring-indigo-500 ring-inset' : ''
              }`}
              onClick={() => {
                onChange(KNOWN_CONSPIRACY_OTHER)
                setOpen(false)
              }}
            >
              Other
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
