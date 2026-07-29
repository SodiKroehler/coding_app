'use client'

import type { ExplorerRow } from '@/lib/types'
import { DIMENSIONS } from '@/lib/dimensions'
import PlatformBadge from './PlatformBadge'

interface Props {
  row: ExplorerRow | null
  onClose: () => void
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function PostDetailDrawer({ row, onClose }: Props) {
  if (!row) return null

  const { tweet, raterLabels } = row
  const metadata = tweet.metadata ?? {}
  const title = metadata.title != null && String(metadata.title).trim()
    ? String(metadata.title).trim()
    : null
  const sourceUrl = metadata.source_url != null && String(metadata.source_url).trim()
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
            {tweet.author && <span className="font-semibold text-gray-800">@{tweet.author}</span>}
            {tweet.posted_at && (
              <span className="text-xs text-gray-500">{formatDate(tweet.posted_at)}</span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {showTitleBlock && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Title</p>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug">{title}</h2>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Text</p>
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Source</p>
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Metadata</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                {otherMeta.map(([k, v]) => (
                  <span key={k}><span className="font-medium">{k}:</span> {String(v)}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Ratings</p>
            {raterLabels.length === 0 ? (
              <p className="text-sm text-gray-400">No ratings yet.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-1 pr-4 font-medium">Rater</th>
                    {DIMENSIONS.map((d) => (
                      <th key={d.id} className="py-1 pr-4 font-medium">{d.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {raterLabels.map((rl) => (
                    <tr key={rl.rater_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-semibold text-gray-700">{rl.rater_name}</td>
                      <td className="py-2 pr-4">{rl.conspiracy_label ?? <span className="text-gray-300">—</span>}</td>
                      <td className="py-2 pr-4">{rl.polarity_label ?? <span className="text-gray-300">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-xs text-gray-400 font-mono">ID: {tweet.id}</div>
        </div>
      </div>
    </div>
  )
}
