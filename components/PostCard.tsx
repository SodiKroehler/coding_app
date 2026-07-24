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

function formatQwenLabel(value: string) {
  return value.replace(/_/g, ' ')
}

function formatProb(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return null
  return value.toFixed(3)
}

export default function PostCard({ tweet }: Props) {
  const metadata = tweet.metadata ?? {}
  const hasQwen =
    tweet.political_leaning_qwen != null ||
    tweet.conspiracy_qwen != null ||
    tweet.explanation_qwen != null
  const hasAhmed =
    tweet.prob_no_conspiracy != null || tweet.prob_conspiracy != null
  const hasVulf = tweet.political_leaning_label != null

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

      {hasQwen && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex flex-col gap-2">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Model labels (Qwen)
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {tweet.conspiracy_qwen != null && (
              <span>
                <span className="font-medium text-amber-900">Conspiracy:</span>{' '}
                <span className="text-amber-950">{formatQwenLabel(tweet.conspiracy_qwen)}</span>
              </span>
            )}
            {tweet.political_leaning_qwen != null && (
              <span>
                <span className="font-medium text-amber-900">Political leaning:</span>{' '}
                <span className="text-amber-950">{formatQwenLabel(tweet.political_leaning_qwen)}</span>
              </span>
            )}
          </div>
          {tweet.explanation_qwen != null && (
            <p className="text-sm text-amber-950 leading-relaxed whitespace-pre-wrap">
              <span className="font-medium text-amber-900">Explanation: </span>
              {tweet.explanation_qwen}
            </p>
          )}
        </div>
      )}

      {hasAhmed && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex flex-col gap-2">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Ahmed&apos;s Conspiracy Classifier prediction
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {tweet.prob_conspiracy != null && (
              <span>
                <span className="font-medium text-amber-900">P(conspiracy):</span>{' '}
                <span className="text-amber-950">{formatProb(tweet.prob_conspiracy)}</span>
              </span>
            )}
            {tweet.prob_no_conspiracy != null && (
              <span>
                <span className="font-medium text-amber-900">P(no conspiracy):</span>{' '}
                <span className="text-amber-950">{formatProb(tweet.prob_no_conspiracy)}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {hasVulf && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex flex-col gap-2">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Vulf Classifier prediction
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span>
              <span className="font-medium text-amber-900">Political leaning:</span>{' '}
              <span className="text-amber-950">
                {formatQwenLabel(tweet.political_leaning_label!)}
              </span>
            </span>
          </div>
        </div>
      )}

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
