const COLORS: Record<string, string> = {
  twitter: 'bg-sky-100 text-sky-800',
  bluesky: 'bg-blue-100 text-blue-800',
  reddit: 'bg-orange-100 text-orange-800',
  youtube: 'bg-red-100 text-red-800',
  tiktok: 'bg-pink-100 text-pink-800',
}

const LABELS: Record<string, string> = {
  twitter: 'Twitter/X',
  bluesky: 'Bluesky',
  reddit: 'Reddit',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export default function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${COLORS[platform] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {LABELS[platform] ?? platform}
    </span>
  )
}
