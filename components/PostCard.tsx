import type { Tweet } from '@/lib/types'
import PlatformBadge from './PlatformBadge'

interface Props {
  tweet: Tweet
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

export default function PostCard({ tweet }: Props) {
  const metadata = tweet.metadata ?? {}

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 flex-wrap">
        <PlatformBadge platform={tweet.platform} />
        {tweet.author && (
          <span className="text-sm font-semibold text-gray-800">@{tweet.author}</span>
        )}
        {tweet.posted_at && (
          <span className="text-xs text-gray-500">{formatDate(tweet.posted_at)}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg bg-white border border-gray-200 p-4 text-gray-900 text-base leading-relaxed whitespace-pre-wrap">
        {tweet.content}
      </div>

      {/* Metadata extras */}
      {Object.keys(metadata).length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {Object.entries(metadata).map(([k, v]) => (
            <span key={k}>
              <span className="font-medium text-gray-600">{k}:</span>{' '}
              {String(v)}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 font-mono">ID: {tweet.id}</div>
    </div>
  )
}
