'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { ExplorerRaterRating, ExplorerRow, Round } from '@/lib/types'
import { DIMENSIONS, labelForValue } from '@/lib/dimensions'
import { getSession, type RaterSession } from '@/lib/auth'
import PlatformBadge from '@/components/PlatformBadge'
import PostDetailDrawer from '@/components/PostDetailDrawer'
import RatingEditorOverlay, {
  type RatingEditorMode,
} from '@/components/RatingEditorOverlay'

type Filter = 'all' | 'disagreement' | 'incomplete' | 'needs_consensus' | 'mine'

type EditorState = {
  mode: RatingEditorMode
  source: ExplorerRaterRating
  tweet: ExplorerRow['tweet']
  nonce: number
}

function truncate(text: string, max = 120) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ExplorerPage() {
  const [session, setSession] = useState<RaterSession | null>(null)
  const [rows, setRows] = useState<ExplorerRow[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedRoundId, setSelectedRoundId] = useState<string>('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<ExplorerRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [headerError, setHeaderError] = useState<string | null>(null)

  useEffect(() => {
    // Session lives in localStorage; read after mount to avoid hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only session
    setSession(getSession())
  }, [])

  useEffect(() => {
    fetch('/api/rounds').then(r => r.json()).then(d => {
      setRounds(d.rounds ?? [])
    })
  }, [])

  const loadRows = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true)
    const url = selectedRoundId
      ? `/api/explorer?round_id=${selectedRoundId}`
      : '/api/explorer'
    try {
      const d = await fetch(url).then(r => r.json())
      const nextRows: ExplorerRow[] = d.rows ?? []
      setRows(nextRows)
      setSelected(prev => {
        if (!prev) return null
        return nextRows.find(r => r.tweet.id === prev.tweet.id) ?? null
      })
    } finally {
      if (!opts?.silent) setLoading(false)
    }
  }, [selectedRoundId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch rows when round filter changes
    void loadRows()
  }, [loadRows])

  const filtered = rows.filter(row => {
    if (filter === 'disagreement') return row.hasDisagreement
    if (filter === 'incomplete') return row.totalRated < row.totalAssigned
    if (filter === 'needs_consensus') return row.hasDisagreement && !row.hasConsensus
    if (filter === 'mine') {
      if (!session) return false
      return row.raterLabels.some(rl => rl.rater_id === session.id)
    }
    return true
  })

  const allRaterNames = [...new Set(rows.flatMap(r => r.raterLabels.map(rl => rl.rater_name)))]

  function openEditor(mode: RatingEditorMode, source: ExplorerRaterRating, row: ExplorerRow) {
    setHeaderError(null)
    setSelected(row)
    setEditor({ mode, source, tweet: row.tweet, nonce: Date.now() })
  }

  function handlePencil() {
    if (!session) {
      setHeaderError('Log in to edit your ratings.')
      return
    }
    if (!selected) return
    const mine = selected.raterLabels.find(rl => rl.rater_id === session.id)
    if (!mine) {
      setHeaderError('You have no rating on this post.')
      return
    }
    openEditor('edit-mine', mine, selected)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 flex-wrap">
        <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Home</Link>
        <h1 className="font-semibold text-gray-900">Explorer</h1>
        <div className="flex-1" />
        <select
          value={selectedRoundId}
          onChange={e => setSelectedRoundId(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">All rounds</option>
          {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div className="flex gap-1 flex-wrap">
          {([
            ['all', 'All'],
            ['disagreement', 'Disagreements'],
            ['incomplete', 'Incomplete'],
            ['needs_consensus', 'Needs consensus'],
            ['mine', 'Mine'],
          ] as const).map(([f, label]) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              disabled={f === 'mine' && !session}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-40 ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">No posts match this filter.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-white sticky top-0 z-10 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-8"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Platform</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Post</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                {allRaterNames.map(name => (
                  <th key={name} className="text-left px-4 py-3 font-medium text-gray-500">
                    {name}
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-medium text-gray-500">Rated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const bg = row.hasDisagreement
                  ? 'bg-red-50 hover:bg-red-100'
                  : row.totalRated < row.totalAssigned
                  ? 'bg-amber-50 hover:bg-amber-100'
                  : 'bg-white hover:bg-gray-50'
                const isSelected = selected?.tweet.id === row.tweet.id

                return (
                  <tr
                    key={row.tweet.id}
                    className={`${bg} border-b cursor-pointer transition-colors ${
                      isSelected ? 'ring-2 ring-inset ring-indigo-400' : ''
                    }`}
                    onClick={() => {
                      setHeaderError(null)
                      setSelected(row)
                    }}
                  >
                    <td className="px-4 py-3 text-center">
                      {row.hasDisagreement && <span title="Disagreement" className="text-red-500 font-bold">!</span>}
                    </td>
                    <td className="px-4 py-3">
                      <PlatformBadge platform={row.tweet.platform} />
                    </td>
                    <td className="px-4 py-3 max-w-md text-gray-700">
                      {truncate(
                        row.tweet.content?.trim()
                        || (row.tweet.metadata?.title != null ? String(row.tweet.metadata.title) : '')
                        || '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{row.tweet.author ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(row.tweet.posted_at)}</td>
                    {allRaterNames.map(name => {
                      const rl = row.raterLabels.find(r => r.rater_name === name)
                      return (
                        <td key={name} className="px-4 py-3">
                          {rl ? (
                            <div className="flex flex-col gap-0.5 items-start">
                              {DIMENSIONS.map((d) => {
                                const val = rl[d.dbColumn as keyof typeof rl]
                                return typeof val === 'string' && val ? (
                                  <span
                                    key={d.id}
                                    className="inline-block bg-indigo-100 text-indigo-700 rounded px-1.5 py-0.5 text-xs font-medium"
                                  >
                                    {labelForValue(d.dbColumn, val)}
                                  </span>
                                ) : null
                              })}
                              {session && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openEditor('set-consensus', rl, row)
                                  }}
                                  className="mt-1 text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline"
                                >
                                  Mark as consensus
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {row.totalRated}/{row.totalAssigned}
                      {row.hasConsensus && (
                        <span className="ml-1 text-emerald-700" title="Consensus set">✓</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <PostDetailDrawer
        row={selected}
        onClose={() => { setSelected(null); setHeaderError(null) }}
        ignoreEscape={!!editor}
        onEditMine={session ? handlePencil : undefined}
        editError={headerError}
      />

      {editor && session && (
        <RatingEditorOverlay
          key={editor.nonce}
          tweet={editor.tweet}
          source={editor.source}
          mode={editor.mode}
          raterId={session.id}
          onClose={() => setEditor(null)}
          onSaved={async () => {
            setEditor(null)
            await loadRows({ silent: true })
          }}
        />
      )}
    </main>
  )
}
