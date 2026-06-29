'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setSession } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Login failed')
        return
      }
      setSession({ id: data.id, name: data.name, email: data.email })
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </main>
  )
}
