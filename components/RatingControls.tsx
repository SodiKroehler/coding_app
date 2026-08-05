'use client'

import { DIMENSIONS } from '@/lib/dimensions'
import DimensionInfo from '@/components/DimensionInfo'
import KnownConspiracySelect from '@/components/KnownConspiracySelect'
import {
  KNOWN_CONSPIRACY_OTHER,
  ACTOR_POLITICAL_LEANING_OPTIONS,
  STANCE_OPTIONS,
  TEMPLATE_MAX_WORDS,
  wordCount,
  type ActorPoliticalLeaning,
  type Stance,
} from '@/lib/knownConspiracies'

export interface RatingExtras {
  stance: Stance
  actor: string
  actorPoliticalLeaning: ActorPoliticalLeaning | ''
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
          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <TemplateField
                value={extras.actor}
                onChange={(actor) => onExtrasChange({ actor })}
                placeholder="actor"
              />
            </div>
            <div className="w-[9.5rem] shrink-0">
              <label className="block text-[10px] font-medium text-gray-500 mb-1 leading-tight">
                Actor political leaning
              </label>
              <select
                value={extras.actorPoliticalLeaning}
                onChange={(e) =>
                  onExtrasChange({
                    actorPoliticalLeaning: e.target.value as ActorPoliticalLeaning | '',
                  })
                }
                className={selectClass}
              >
                <option value="">—</option>
                {ACTOR_POLITICAL_LEANING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.short} — {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
        <p className="text-xs text-gray-500 mb-2">
          Highlight = ideology lean {' '}
          <span className="inline-block px-1.5 rounded bg-blue-100 text-blue-950">left</span>{' '}
          <span className="inline-block px-1.5 rounded bg-red-100 text-red-950">right</span>{' '}
          <span className="inline-block px-1.5 rounded bg-amber-100 text-amber-950">center</span>{' '}
          <span className="inline-block px-1.5 rounded bg-white border border-gray-200 text-gray-700">unclear</span>
        </p>
        <KnownConspiracySelect
          value={extras.knownConspiracy}
          onChange={(knownConspiracy) => onExtrasChange({ knownConspiracy })}
        />
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
