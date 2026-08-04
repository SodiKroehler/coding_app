'use client'

import { DIMENSIONS } from '@/lib/dimensions'
import DimensionInfo from '@/components/DimensionInfo'
import {
  KNOWN_CONSPIRACIES,
  KNOWN_CONSPIRACY_OTHER,
  STANCE_OPTIONS,
  TEMPLATE_MAX_WORDS,
  wordCount,
  type Stance,
} from '@/lib/knownConspiracies'

export interface RatingExtras {
  stance: Stance
  actor: string
  action: string
  target: string
  knownConspiracy: string
  knownConspiracyOther: string
}

interface Props {
  values: Record<string, string>
  onChange: (col: string, val: string) => void
  note: string
  onNoteChange: (note: string) => void
  extras: RatingExtras
  onExtrasChange: (patch: Partial<RatingExtras>) => void
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
const selectClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white'

function TemplateField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const words = wordCount(value)
  const over = words > TEMPLATE_MAX_WORDS

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      {value.trim() && (
        <p className={`mt-1 text-xs ${over ? 'text-red-600' : 'text-gray-400'}`}>
          {words}/{TEMPLATE_MAX_WORDS} words
        </p>
      )}
    </div>
  )
}

export default function RatingControls({
  values,
  onChange,
  note,
  onNoteChange,
  extras,
  onExtrasChange,
}: Props) {
  const showOther = extras.knownConspiracy === KNOWN_CONSPIRACY_OTHER

  return (
    <div className="flex flex-col gap-6">
      {DIMENSIONS.map((dim) => (
        <div key={dim.id}>
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-sm font-semibold text-gray-700">{dim.label}</p>
            <DimensionInfo dimension={dim} />
          </div>
          {dim.control === 'select' ? (
            <select
              value={values[dim.dbColumn] ?? ''}
              onChange={(e) => onChange(dim.dbColumn, e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                Select…
              </option>
              {dim.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dim.options.map((opt) => {
                const selected = values[dim.dbColumn] === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
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
          )}
        </div>
      ))}

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Stance</p>
        <select
          value={extras.stance}
          onChange={(e) => onExtrasChange({ stance: e.target.value as Stance })}
          className={selectClass}
        >
          {STANCE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Conspiracy template{' '}
          <span className="font-normal text-gray-400">(optional)</span>
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Fill any slots that apply — e.g. who is conspiring, what they&apos;re doing, toward what goal.
        </p>
        <div className="flex flex-col gap-2">
          <TemplateField
            value={extras.actor}
            onChange={(actor) => onExtrasChange({ actor })}
            placeholder="actor"
          />
          <p className="text-sm text-gray-600 px-1">conspiring</p>
          <TemplateField
            value={extras.action}
            onChange={(action) => onExtrasChange({ action })}
            placeholder="action"
          />
          <p className="text-sm text-gray-600 px-1">to bring</p>
          <TemplateField
            value={extras.target}
            onChange={(target) => onExtrasChange({ target })}
            placeholder="goal"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Known conspiracy{' '}
          <span className="font-normal text-gray-400">(optional)</span>
        </p>
        <select
          value={extras.knownConspiracy}
          onChange={(e) => onExtrasChange({ knownConspiracy: e.target.value })}
          className={selectClass}
        >
          <option value="">— None —</option>
          {KNOWN_CONSPIRACIES.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
          <option value={KNOWN_CONSPIRACY_OTHER}>Other</option>
        </select>
        {showOther && (
          <textarea
            value={extras.knownConspiracyOther}
            onChange={(e) => onExtrasChange({ knownConspiracyOther: e.target.value })}
            rows={2}
            placeholder="Describe the conspiracy theory…"
            className={`${inputClass} mt-2 resize-y`}
          />
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Note <span className="font-normal text-gray-400">(optional)</span>
        </p>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Optional explanation or context for your rating…"
          className={`${inputClass} resize-y`}
        />
      </div>
    </div>
  )
}
