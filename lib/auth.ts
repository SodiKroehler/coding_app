'use client'

export interface RaterSession {
  id: string
  name: string
  email: string
}

const SESSION_KEY = 'rater_session'

export function getSession(): RaterSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as RaterSession) : null
  } catch {
    return null
  }
}

export function setSession(rater: RaterSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(rater))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
