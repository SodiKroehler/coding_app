'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { DIMENSIONS } from '@/lib/dimensions'
import type { Tweet, Round } from '@/lib/types'
import PostCard from '@/components/PostCard'
import RatingControls from '@/components/RatingControls'
import ProgressBar from '@/components/ProgressBar'

export default function RatePage() {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedRound, setSelectedRound] = useState<Round | null>(null)
  const [tweet, setTweet] = useState<Tweet | null>(null)
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState({ rated: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    fetch('/api/rounds').then(r => r.json()).then(d => {
      setRounds(d.rounds ?? [])
      if (d.rounds?.length > 0) setSelectedRound(d.rounds[0])
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNext = useCallback(async (round: Round) => {
    if (!session) return
    setLoading(true)
    setError(null)
    try {
      const [nextRes, progRes] = await Promise.all([
        fetch(`/api/assignments/next?rater_id=${session.id}&round_id=${round.id}`),
        fetch(`/api/assignments/progress?rater_id=${session.id}&round_id=${round.id}`),
      ])
      const nextData = await nextRes.json()
      const progData = await progRes.json()
      setProgress({ rated: progData.rated ?? 0, total: progData.total ?? 0 })
      if (!nextData.tweet) {
        setDone(true)
        setTweet(null)
      } else {
        setTweet(nextData.tweet)
        setDone(false)
        setLabels({})
      }
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (selectedRound) fetchNext(selectedRound)
  }, [selectedRound, fetchNext])

  async function handleSubmit() {
    if (!session || !tweet || !selectedRound) return

    const missing = DIMENSIONS.filter(d => !labels[d.dbColumn])
    if (missing.length > 0) {
      setError(`Please select a value for: ${missing.map(d => d.label).join(', ')}`)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tweet_id: tweet.id,
          rater_id: session.id,
          round_id: selectedRound.id,
          labels,
        }),
      })
      if (!res.ok && res.status !== 409) {
        const d = await res.json()
        setError(d.error ?? 'Submit failed')
        return
      }
      // Move to next
      await fetchNext(selectedRound)
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) return null

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 flex-wrap">
        <a href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Home</a>
        <h1 className="font-semibold text-gray-900">Rate Posts</h1>
        <div className="flex-1" />
        {rounds.length > 1 && (
          <select
            value={selectedRound?.id ?? ''}
            onChange={e => setSelectedRound(rounds.find(r => r.id === e.target.value) ?? null)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        )}
        {selectedRound && rounds.length === 1 && (
          <span className="text-sm text-gray-500">Round: <span className="font-medium">{selectedRound.name}</span></span>
        )}
        <span className="text-sm text-gray-500">{session.name}</span>
      </header>

      {/* Progress */}
      {selectedRound && (
        <div className="px-6 py-3 bg-white border-b">
          <ProgressBar rated={progress.rated} total={progress.total} />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">Loading…</div>
        ) : done ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-2xl font-semibold text-gray-700 mb-2">You&apos;re all caught up!</p>
            <p className="text-gray-500">Check back when new posts are added to this round.</p>
          </div>
        ) : tweet ? (
          <>
            {/* Left: post */}
            <div className="w-3/5 p-6 overflow-y-auto border-r bg-gray-50">
              <PostCard tweet={tweet} />
            </div>

            {/* Right: controls */}
            <div className="w-2/5 p-6 flex flex-col gap-6 overflow-y-auto bg-white">
              <RatingControls
                values={labels}
                onChange={(col, val) => setLabels(prev => ({ ...prev, [col]: val }))}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Submit & Next →'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {selectedRound ? 'No posts assigned yet.' : 'Select a round to begin.'}
          </div>
        )}
      </div>
    </main>
  )
}
