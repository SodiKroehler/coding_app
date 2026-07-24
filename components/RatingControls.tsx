'use client'

import { DIMENSIONS } from '@/lib/dimensions'

interface Props {
  values: Record<string, string>
  onChange: (col: string, val: string) => void
  note: string
  onNoteChange: (note: string) => void
}

export default function RatingControls({ values, onChange, note, onNoteChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {DIMENSIONS.map((dim) => (
        <div key={dim.id}>
          <p className="text-sm font-semibold text-gray-700 mb-2">{dim.label}</p>
          <div className="flex flex-wrap gap-2">
            {dim.options.map((opt) => {
              const selected = values[dim.dbColumn] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange(dim.dbColumn, opt.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-700'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Note <span className="font-normal text-gray-400">(optional)</span>
        </p>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Optional explanation or context for your rating…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      </div>
    </div>
  )
}
