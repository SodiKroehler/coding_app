'use client'

import { useEffect, useState } from 'react'
import type { ExplorerRow, Round } from '@/lib/types'
import { DIMENSIONS } from '@/lib/dimensions'
import PlatformBadge from '@/components/PlatformBadge'
import PostDetailDrawer from '@/components/PostDetailDrawer'

type Filter = 'all' | 'disagreement' | 'incomplete'

function truncate(text: string, max = 120) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ExplorerPage() {
  const [rows, setRows] = useState<ExplorerRow[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedRoundId, setSelectedRoundId] = useState<string>('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<ExplorerRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rounds').then(r => r.json()).then(d => {
      setRounds(d.rounds ?? [])
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = selectedRoundId
      ? `/api/explorer?round_id=${selectedRoundId}`
      : '/api/explorer'
    fetch(url)
      .then(r => r.json())
      .then(d => setRows(d.rows ?? []))
      .finally(() => setLoading(false))
  }, [selectedRoundId])

  const filtered = rows.filter(row => {
    if (filter === 'disagreement') return row.hasDisagreement
    if (filter === 'incomplete') return row.totalRated < row.totalAssigned
    return true
  })

  // Collect all unique rater names across all rows
  const allRaterNames = [...new Set(rows.flatMap(r => r.raterLabels.map(rl => rl.rater_name)))]

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 flex-wrap">
        <a href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Home</a>
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
        <div className="flex gap-1">
          {(['all', 'disagreement', 'incomplete'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'disagreement' ? 'Disagreements' : 'Incomplete'}
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

                return (
                  <tr
                    key={row.tweet.id}
                    className={`${bg} border-b cursor-pointer transition-colors`}
                    onClick={() => setSelected(row)}
                  >
                    <td className="px-4 py-3 text-center">
                      {row.hasDisagreement && <span title="Disagreement" className="text-red-500 font-bold">!</span>}
                    </td>
                    <td className="px-4 py-3">
                      <PlatformBadge platform={row.tweet.platform} />
                    </td>
                    <td className="px-4 py-3 max-w-xs text-gray-700">{truncate(row.tweet.content)}</td>
                    <td className="px-4 py-3 text-gray-500">{row.tweet.author ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(row.tweet.posted_at)}</td>
                    {allRaterNames.map(name => {
                      const rl = row.raterLabels.find(r => r.rater_name === name)
                      return (
                        <td key={name} className="px-4 py-3">
                          {rl ? (
                            <div className="flex flex-col gap-0.5">
                              {DIMENSIONS.map(d => {
                                const val = d.dbColumn === 'conspiracy_label' ? rl.conspiracy_label : rl.polarity_label
                                return val ? (
                                  <span key={d.id} className="inline-block bg-indigo-100 text-indigo-700 rounded px-1.5 py-0.5 text-xs font-medium">
                                    {val}
                                  </span>
                                ) : null
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {row.totalRated}/{row.totalAssigned}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <PostDetailDrawer row={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
