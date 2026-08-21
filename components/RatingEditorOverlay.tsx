'use client'

import { useEffect, useState } from 'react'
import PostCard from '@/components/PostCard'
import RatingControls from '@/components/RatingControls'
import {
  formFromRating,
  ratingRequestPayload,
  validateRatingForm,
} from '@/lib/ratingForm'
import type { ExplorerRaterRating, Tweet } from '@/lib/types'

export type RatingEditorMode = 'edit-mine' | 'set-consensus'

interface Props {
  tweet: Tweet
  source: ExplorerRaterRating
  mode: RatingEditorMode
  raterId: string
  onClose: () => void
  onSaved: () => void
}

export default function RatingEditorOverlay({
  tweet,
  source,
  mode,
  raterId,
  onClose,
  onSaved,
}: Props) {
  const initial = formFromRating(source)
  const [labels, setLabels] = useState(initial.labels)
  const [note, setNote] = useState(initial.note)
  const [extras, setExtras] = useState(initial.extras)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit() {
    const validationError = validateRatingForm(labels, extras)
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const isConsensus = mode === 'set-consensus'
      const res = await fetch(isConsensus ? '/api/ratings/consensus' : '/api/ratings', {
        method: isConsensus ? 'PUT' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          ratingRequestPayload({
            tweet_id: tweet.id,
            round_id: source.round_id,
            rater_id: isConsensus ? undefined : raterId,
            labels,
            note,
            extras,
          })
        ),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error ?? 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSubmitting(false)
    }
  }

  const title = mode === 'edit-mine' ? 'Edit your rating' : 'Set consensus'
  const submitLabel = mode === 'edit-mine' ? 'Save rating' : 'Save consensus'

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-sm"
        >
          ← Back
        </button>
        <h1 className="font-semibold text-gray-900">{title}</h1>
        {mode === 'set-consensus' && (
          <span className="text-sm text-gray-500">
            Prefilled from <span className="font-medium text-gray-700">{source.rater_name}</span>
          </span>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/5 p-6 overflow-y-auto border-r bg-gray-50">
          <PostCard tweet={tweet} />
        </div>
        <div className="w-2/5 p-6 flex flex-col gap-6 overflow-y-auto bg-white">
          <RatingControls
            values={labels}
            onChange={(col, val) => setLabels((prev) => ({ ...prev, [col]: val }))}
            note={note}
            onNoteChange={setNote}
            extras={extras}
            onExtrasChange={(patch) => setExtras((prev) => ({ ...prev, ...patch }))}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
