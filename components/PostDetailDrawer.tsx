'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { ExplorerRaterRating, ExplorerRow } from '@/lib/types'
import { DIMENSIONS, labelForValue } from '@/lib/dimensions'
import {
  ACTOR_POLITICAL_LEANING_OPTIONS,
  KNOWN_CONSPIRACY_OTHER,
  knownConspiracyByLabel,
} from '@/lib/knownConspiracies'
import PlatformBadge from './PlatformBadge'

interface Props {
  row: ExplorerRow | null
  onClose: () => void
  ignoreEscape?: boolean
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function displayOrDash(value: string | null | undefined): ReactNode {
  if (value == null || value.trim() === '') {
    return <span className="text-gray-300">—</span>
  }
  return value
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-gray-900 leading-relaxed">{children}</div>
    </div>
  )
}

function actorLeanLabel(value: string | null) {
  if (!value) return null
  const opt = ACTOR_POLITICAL_LEANING_OPTIONS.find((o) => o.value === value)
  return opt ? `${opt.short} — ${opt.label}` : value
}

function knownConspiracyDisplay(rl: ExplorerRaterRating) {
  if (!rl.known_conspiracy) return null
  if (rl.known_conspiracy === KNOWN_CONSPIRACY_OTHER) {
    return rl.known_conspiracy_other?.trim()
      ? `Other: ${rl.known_conspiracy_other.trim()}`
      : 'Other'
  }
  const known = knownConspiracyByLabel(rl.known_conspiracy)
  return known ? `${known.number}. ${known.label}` : rl.known_conspiracy
}

function RaterRatingCard({
  rating,
  emphasis,
  defaultOpen = false,
}: {
  rating: ExplorerRaterRating
  emphasis?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const summary = DIMENSIONS.map((d) => {
    const val = rating[d.dbColumn as keyof ExplorerRaterRating] as string | null
    return val ? labelForValue(d.dbColumn, val) : null
  })
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        emphasis ? 'border-emerald-300 bg-emerald-50/40' : 'border-gray-200 bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{rating.rater_name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {summary || 'No labels'}
            {rating.created_at ? ` · ${formatDate(rating.created_at)}` : ''}
          </p>
        </div>
        <span className="text-gray-400 shrink-0 text-sm" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {DIMENSIONS.map((d) => {
              const val = rating[d.dbColumn as keyof ExplorerRaterRating] as string | null
              return (
                <Field key={d.id} label={d.label}>
                  {val ? labelForValue(d.dbColumn, val) : displayOrDash(null)}
                </Field>
              )
            })}
            <Field label="Stance">{displayOrDash(rating.stance)}</Field>
            <Field label="Actor political leaning">
              {displayOrDash(actorLeanLabel(rating.actor_political_leaning))}
            </Field>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Conspiracy template
            </p>
            <div className="rounded-lg border bg-gray-50 p-3 flex flex-col gap-2 text-sm text-gray-900">
              <p>
                <span className="text-gray-500">Actor:</span> {displayOrDash(rating.actor)}
              </p>
              <p>
                <span className="text-gray-500">Action:</span> {displayOrDash(rating.action)}
              </p>
              <p>
                <span className="text-gray-500">Goal:</span> {displayOrDash(rating.target)}
              </p>
            </div>
          </div>

          <Field label="Known conspiracy">
            {displayOrDash(knownConspiracyDisplay(rating))}
          </Field>

          <Field label="Note">
            {rating.note?.trim() ? (
              <p className="whitespace-pre-wrap bg-amber-50 border border-amber-100 rounded-lg p-3">
                {rating.note}
              </p>
            ) : (
              displayOrDash(null)
            )}
          </Field>
        </div>
      )}
    </div>
  )
}

export default function PostDetailDrawer({ row, onClose, ignoreEscape }: Props) {
  useEffect(() => {
    if (!row || ignoreEscape) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [row, onClose, ignoreEscape])

  if (!row) return null

  const { tweet, raterLabels, consensusRatings } = row
  const consensusCards = consensusRatings ?? []
  const metadata = tweet.metadata ?? {}
  const title =
    metadata.title != null && String(metadata.title).trim()
      ? String(metadata.title).trim()
      : null
  const sourceUrl =
    metadata.source_url != null && String(metadata.source_url).trim()
      ? String(metadata.source_url).trim()
      : null
  const body = (tweet.content ?? '').trim()
  const titleEqualsBody = Boolean(title && body && title === body)
  const showTitleBlock = Boolean(title && !titleEqualsBody)
  const textToShow = (() => {
    if (!body && title) return title
    if (!body) return null
    if (title && body.startsWith(title) && body.length > title.length) {
      return body.slice(title.length).replace(/^\s*\n+/, '').trim() || body
    }
    return body
  })()

  const otherMeta = Object.entries(metadata).filter(
    ([k]) => k !== 'title' && k !== 'source_url'
  )

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30" />
      <div
        className="w-full max-w-2xl bg-white shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <PlatformBadge platform={tweet.platform} />
            {tweet.author && (
              <span className="font-semibold text-gray-800">@{tweet.author}</span>
            )}
            {tweet.posted_at && (
              <span className="text-xs text-gray-500">{formatDate(tweet.posted_at)}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {showTitleBlock && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Title
              </p>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug">{title}</h2>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Text
            </p>
            {textToShow ? (
              <div className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border">
                {textToShow}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No text content.</p>
            )}
          </div>

          {sourceUrl && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Source
              </p>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline break-all"
              >
                {sourceUrl}
              </a>
            </div>
          )}

          {otherMeta.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Metadata
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                {otherMeta.map(([k, v]) => (
                  <span key={k}>
                    <span className="font-medium">{k}:</span> {String(v)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Ratings
            </p>
            {raterLabels.length === 0 && consensusCards.length === 0 ? (
              <p className="text-sm text-gray-400">No ratings yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {raterLabels.map((rl) => (
                  <RaterRatingCard key={`${rl.rater_id}-${rl.round_id}`} rating={rl} />
                ))}
                {consensusCards.map((rl) => (
                  <RaterRatingCard
                    key={`${rl.rater_id}-${rl.round_id}`}
                    rating={rl}
                    emphasis
                    defaultOpen
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400 font-mono">ID: {tweet.id}</div>
        </div>
      </div>
    </div>
  )
}
