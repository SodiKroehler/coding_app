'use client'

import { useEffect, useState } from 'react'
import { DIMENSIONS } from '@/lib/dimensions'
import type { CodebookExample } from '@/lib/types'
import PlatformBadge from '@/components/PlatformBadge'

interface CodebookNote {
  id: string
  content: string
  updated_at: string
}

export default function CodesPage() {
  const [examples, setExamples] = useState<CodebookExample[]>([])
  const [notes, setNotes] = useState<CodebookNote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/codebook')
      .then(r => r.json())
      .then(d => {
        setExamples(d.examples ?? [])
        setNotes(d.notes ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const examplesByCode = DIMENSIONS.reduce<Record<string, CodebookExample[]>>((acc, dim) => {
    acc[dim.id] = examples.filter(e => e.code === dim.id)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <a href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Home</a>
        <h1 className="font-semibold text-gray-900">Codebook</h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-12">
        {/* Codes section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Coding Dimensions</h2>
          <div className="flex flex-col gap-8">
            {DIMENSIONS.map(dim => (
              <div key={dim.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dim.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{dim.description}</p>
                <div className="flex flex-col gap-2">
                  {dim.options.map(opt => (
                    <div key={opt.value} className="flex items-start gap-3">
                      <span className="inline-block bg-indigo-100 text-indigo-700 rounded px-2 py-0.5 text-xs font-mono font-bold mt-0.5 shrink-0">
                        {opt.value}
                      </span>
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Examples section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Examples</h2>
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <div className="flex flex-col gap-8">
              {DIMENSIONS.map(dim => {
                const dimExamples = examplesByCode[dim.id] ?? []
                return (
                  <div key={dim.id}>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">{dim.label}</h3>
                    {dimExamples.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No examples added yet.</p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {dimExamples.map(ex => (
                          <div key={ex.id} className="bg-white rounded-xl border border-gray-200 p-5">
                            {ex.tweet && (
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <PlatformBadge platform={ex.tweet.platform} />
                                  {ex.tweet.author && (
                                    <span className="text-xs text-gray-500">@{ex.tweet.author}</span>
                                  )}
                                </div>
                                <p className="text-gray-800 text-sm leading-relaxed bg-gray-50 rounded p-3 border whitespace-pre-wrap">
                                  {ex.tweet.content}
                                </p>
                              </div>
                            )}
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Justification</p>
                              <p className="text-sm text-gray-700">{ex.justification}</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Added by: {ex.added_by}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Notes section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : notes ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{notes.content}</p>
              <p className="text-xs text-gray-400 mt-4">
                Last updated: {new Date(notes.updated_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No notes yet.</p>
          )}
        </section>
      </div>
    </main>
  )
}
