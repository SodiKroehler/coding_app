'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSession, clearSession } from '@/lib/auth'
import type { RaterSession } from '@/lib/auth'

const NAV_ITEMS = [
  { href: '/rate', label: 'Rate Posts', description: 'Label posts one at a time' },
  { href: '/explorer', label: 'Explorer', description: 'Browse all posts and see disagreements at a glance' },
  { href: '/codes', label: 'Codebook', description: 'Coding guidelines, examples, and notes' },
]

export default function HomePage() {
  const [session, setSession] = useState<RaterSession | null>(null)

  useEffect(() => {
    setSession(getSession())
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rating App</h1>
          {session ? (
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <span>Hello, <span className="font-semibold text-indigo-700">{session.name}</span></span>
              <button
                onClick={() => { clearSession(); setSession(null) }}
                className="text-xs text-gray-400 hover:text-red-500 underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <p className="text-gray-500">
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">Log in</Link> to start rating
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-indigo-700">{item.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 text-xl">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
