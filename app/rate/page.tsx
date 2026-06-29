'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { DIMENSIONS } from '@/lib/dimensions'
import type { Tweet, Round } from '@/lib/types'
import PostCard from '@/components/PostCard'
import RatingControls from '@/components/RatingControls'
import ProgressBar from '@/components/ProgressBar'

export default function RatePage() {
  const router = useRouter()
  const sessionRef = useRef(getSession())
  const session = sessionRef.current

  const [round, setRound] = useState<Round | null | 'loading'>('loading')
  const [tweet, setTweet] = useState<Tweet | null>(null)
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState({ rated: 0, total: 0 })
  const [tweetLoading, setTweetLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch next tweet + progress for a given round
  const fetchNext = useCallback(async (r: Round) => {
    if (!session) return
    setTweetLoading(true)
    setError(null)
    try {
      const [nextRes, progRes] = await Promise.all([
        fetch(`/api/assignments/next?rater_id=${session.id}&round_id=${r.id}`),
        fetch(`/api/assignments/progress?rater_id=${session.id}&round_id=${r.id}`),
      ])
      const [nextData, progData] = await Promise.all([nextRes.json(), progRes.json()])
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
      setTweetLoading(false)
    }
  }, [session])

  // On mount: redirect if not logged in, otherwise fetch active round then first tweet
  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }
    fetch('/api/rounds/active')
      .then(r => r.json())
      .then(async d => {
        const activeRound: Round | null = d.round ?? null
        setRound(activeRound)
        if (activeRound) await fetchNext(activeRound)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    if (!session || !tweet || !round || round === 'loading') return

    const missing = DIMENSIONS.filter(d => !labels[d.dbColumn])
    if (missing.length > 0) {
      setError(`Please select: ${missing.map(d => d.label).join(', ')}`)
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
          round_id: round.id,
          labels,
        }),
      })
      if (!res.ok && res.status !== 409) {
        const d = await res.json()
        setError(d.error ?? 'Submit failed')
        return
      }
      await fetchNext(round)
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) return null

  const activeRound = round !== 'loading' ? round : null

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <a href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Home</a>
        <h1 className="font-semibold text-gray-900">Rate Posts</h1>
        <div className="flex-1" />
        {activeRound && (
          <span className="text-sm text-gray-500">
            Round: <span className="font-medium text-gray-700">{activeRound.name}</span>
          </span>
        )}
        <span className="text-sm text-gray-500">{session.name}</span>
      </header>

      {activeRound && (
        <div className="px-6 py-3 bg-white border-b">
          <ProgressBar rated={progress.rated} total={progress.total} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {round === 'loading' || tweetLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">Loading…</div>
        ) : !activeRound ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-lg font-semibold text-gray-600 mb-1">No active round</p>
            <p className="text-gray-400 text-sm">Ask the researcher to set a round as active in Supabase.</p>
          </div>
        ) : done ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-2xl font-semibold text-gray-700 mb-2">You&apos;re all caught up!</p>
            <p className="text-gray-500">Check back when new posts are added to this round.</p>
          </div>
        ) : tweet ? (
          <>
            <div className="w-3/5 p-6 overflow-y-auto border-r bg-gray-50">
              <PostCard tweet={tweet} />
            </div>
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
            No posts assigned to you in this round yet.
          </div>
        )}
      </div>
    </main>
  )
}
