export interface Round {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface Rater {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Tweet {
  id: string
  platform: 'twitter' | 'bluesky' | 'reddit' | 'youtube' | 'tiktok'
  content: string
  author: string | null
  posted_at: string | null
  metadata: Record<string, unknown> | null
  added_at: string
}

export interface Assignment {
  id: string
  tweet_id: string
  rater_id: string
  round_id: string
  assigned_at: string
}

export interface Rating {
  id: string
  tweet_id: string
  rater_id: string
  round_id: string
  conspiracy_label: string | null
  polarity_label: string | null
  created_at: string
}

export interface CodebookExample {
  id: string
  code: string
  tweet_id: string | null
  justification: string
  added_by: string
  added_at: string
  tweet?: Tweet
}

// Explorer view: a tweet enriched with all rater labels
export interface ExplorerRow {
  tweet: Tweet
  raterLabels: {
    rater_id: string
    rater_name: string
    conspiracy_label: string | null
    polarity_label: string | null
  }[]
  hasDisagreement: boolean
  totalAssigned: number
  totalRated: number
}
