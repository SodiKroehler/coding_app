'use client'

import { useEffect, useState } from 'react'
import { DIMENSIONS } from '@/lib/dimensions'
import {
  ICWSM_EXAMPLES,
  ICWSM_GUIDELINES,
  ICWSM_SOURCE,
  ICWSM_WORKING_DEFINITIONS,
  exampleById,
} from '@/lib/codebook/icwsm24'
import { PEW_TYPOLOGY_EXTENDED, PEW_TYPOLOGY_SOURCE } from '@/lib/pewTypology'
import { KNOWN_CONSPIRACIES } from '@/lib/knownConspiracies'
import type { CodebookExample } from '@/lib/types'
import PlatformBadge from '@/components/PlatformBadge'
import CodebookExampleCardView from '@/components/CodebookExampleCard'

interface CodebookNote {
  id: string
  content: string
  updated_at: string
}

const TOC = [
  { href: '#dimensions', label: 'Coding dimensions' },
  { href: '#definitions', label: 'Working definitions' },
  { href: '#guidelines', label: 'Additional guidelines' },
  { href: '#icwsm-examples', label: 'ICWSM examples' },
  { href: '#pew-extended', label: 'Pew extended definitions' },
  { href: '#known-cts', label: 'Known conspiracy list' },
  { href: '#custom-examples', label: 'Custom examples' },
  { href: '#notes', label: 'Notes' },
]

export default function CodesPage() {
  const [examples, setExamples] = useState<CodebookExample[]>([])
  const [notes, setNotes] = useState<CodebookNote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/codebook')
      .then((r) => r.json())
      .then((d) => {
        setExamples(d.examples ?? [])
        setNotes(d.notes ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const customExamples = examples.filter(
    (e) => !(e.added_by ?? '').includes('ICWSM24')
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <a href="/" className="text-gray-400 hover:text-gray-700 text-sm">
          ← Home
        </a>
        <h1 className="font-semibold text-gray-900">Codebook</h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-12">
        <nav
          aria-label="Table of contents"
          className="bg-white rounded-xl border border-gray-200 p-5 sticky top-0 z-20 shadow-sm"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            On this page
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {TOC.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-indigo-600 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            Source PDF:{' '}
            <a
              href={ICWSM_SOURCE.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {ICWSM_SOURCE.title}
            </a>
          </p>
        </nav>

        <section id="dimensions" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Coding Dimensions</h2>
          <div className="flex flex-col gap-8">
            {DIMENSIONS.map((dim) => (
              <div
                key={dim.id}
                id={dim.codebookAnchor}
                className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-28"
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{dim.label}</h3>
                  {!dim.required && (
                    <span className="text-xs text-gray-400 font-medium">Optional</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{dim.infoIntro}</p>
                {dim.infoLink && (
                  <p className="text-sm mb-3">
                    <a
                      href={dim.infoLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {dim.infoLink.label}
                    </a>
                  </p>
                )}
                {dim.infoQuote && (
                  <blockquote className="text-sm text-gray-800 leading-relaxed border-l-2 border-indigo-300 pl-3 mb-4 italic">
                    “{dim.infoQuote}”
                  </blockquote>
                )}
                <div className="flex flex-col gap-3">
                  {dim.options.map((opt) => (
                    <div key={opt.value} className="flex items-start gap-3">
                      <span className="inline-block bg-indigo-100 text-indigo-700 rounded px-2 py-0.5 text-xs font-mono font-bold mt-0.5 shrink-0">
                        {opt.value}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                        <p className="text-sm text-gray-600">{opt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="definitions" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Working definitions</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Theoretical
              </p>
              <blockquote className="text-sm text-gray-800 leading-relaxed border-l-2 border-indigo-300 pl-3 italic">
                “{ICWSM_WORKING_DEFINITIONS.theoretical}”
              </blockquote>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Operational
              </p>
              <blockquote className="text-sm text-gray-800 leading-relaxed border-l-2 border-indigo-300 pl-3 italic">
                “{ICWSM_WORKING_DEFINITIONS.operational}”
              </blockquote>
            </div>
          </div>
        </section>

        <section id="guidelines" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Additional guidelines</h2>
          <p className="text-sm text-gray-600 mb-6">
            From {ICWSM_SOURCE.title}. Each guideline lists the examples that illustrate it.
          </p>
          <div className="flex flex-col gap-6">
            {ICWSM_GUIDELINES.map((g) => (
              <div
                key={g.id}
                id={`guideline-${g.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-28"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{g.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{g.body}</p>
                {g.note && (
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">{g.note}</p>
                )}
                <div className="mt-4 flex flex-col gap-4">
                  {g.exampleIds.map((eid) => {
                    const ex = exampleById(eid)
                    return ex ? <CodebookExampleCardView key={eid} example={ex} /> : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="icwsm-examples" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-2">ICWSM examples (all)</h2>
          <p className="text-sm text-gray-600 mb-6">
            Full set of coded examples from the guideline PDF.
          </p>
          <div className="flex flex-col gap-6">
            {ICWSM_EXAMPLES.map((ex) => (
              <CodebookExampleCardView key={ex.id} example={ex} />
            ))}
          </div>
        </section>

        <section id="pew-extended" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Extended definitions</h2>
          <p className="text-sm text-gray-600 mb-1">
            Detailed coder guidance for Poster&apos;s political leaning, drawn from Pew&apos;s
            political typology.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Source:{' '}
            <a
              href={PEW_TYPOLOGY_SOURCE.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {PEW_TYPOLOGY_SOURCE.label}
            </a>{' '}
            ({PEW_TYPOLOGY_SOURCE.citation}).
          </p>
          <div className="flex flex-col gap-6">
            {PEW_TYPOLOGY_EXTENDED.map((group) => (
              <article
                key={group.value}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {group.title}{' '}
                  <span className="font-normal text-gray-500">— {group.share}</span>
                </h3>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{group.summary}</p>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-gray-700 leading-relaxed">
                  <li>
                    <span className="font-semibold text-gray-900">Values:</span> {group.values}
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900">Rejects:</span> {group.rejects}
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900">Tell:</span> {group.tell}
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="known-cts" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Known conspiracy list</h2>
          <p className="text-sm text-gray-600 mb-6">
            Numbered alphabetically for the rating dropdown. Color lean is from the
            ideology/partisanship forest plot; original app-only items are unclear.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 divide-y">
            {KNOWN_CONSPIRACIES.map((c) => (
              <div key={c.label} id={`known-ct-${c.number}`} className="px-5 py-3 scroll-mt-28">
                <p className="text-sm font-semibold text-gray-900">
                  {c.number}. {c.label}{' '}
                  <span className="font-normal text-gray-400">({c.lean})</span>
                </p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="custom-examples" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Custom examples</h2>
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : customExamples.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No custom examples in the database.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {customExamples.map((ex) => (
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
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Justification
                  </p>
                  <p className="text-sm text-gray-700">{ex.justification}</p>
                  <p className="text-xs text-gray-400 mt-2">Added by: {ex.added_by}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="notes" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : notes ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {notes.content}
              </p>
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
