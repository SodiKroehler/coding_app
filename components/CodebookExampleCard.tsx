'use client'

import type { CodebookExampleCard, CodebookVerdict } from '@/lib/codebook/icwsm24'

const VERDICT_CLASS: Record<CodebookVerdict, string> = {
  CT: 'bg-rose-100 text-rose-800',
  nonCT: 'bg-emerald-100 text-emerald-800',
  borderline: 'bg-amber-100 text-amber-900',
}

const VERDICT_LABEL: Record<CodebookVerdict, string> = {
  CT: 'CT',
  nonCT: 'Not CT',
  borderline: 'Borderline',
}

export default function CodebookExampleCardView({
  example,
}: {
  example: CodebookExampleCard
}) {
  const hasSlots = Boolean(example.actor || example.action || example.objective)

  return (
    <article
      id={`example-${example.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden scroll-mt-24"
    >
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-900">
          Example {example.exampleNumber}
        </h4>
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${VERDICT_CLASS[example.verdict]}`}
        >
          {VERDICT_LABEL[example.verdict]}
        </span>
      </div>

      <div className="px-5 py-4 border-b">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Example
        </p>
        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border">
          {example.postText}
        </p>
        {example.originalUrl && (
          <a
            href={example.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-indigo-600 hover:underline break-all"
          >
            Original post
          </a>
        )}
      </div>

      <div className="px-5 py-4 border-b">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Justification
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{example.justification}</p>
      </div>

      {hasSlots && (
        <div className="px-5 py-4 grid sm:grid-cols-3 gap-3 bg-indigo-50/40">
          {example.actor && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Actor
              </p>
              <p className="text-sm text-gray-800">{example.actor}</p>
            </div>
          )}
          {example.action && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Action
              </p>
              <p className="text-sm text-gray-800">{example.action}</p>
            </div>
          )}
          {example.objective && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Objective
              </p>
              <p className="text-sm text-gray-800">{example.objective}</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
