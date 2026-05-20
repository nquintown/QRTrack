'use client'

import { useState } from 'react'
import QrDisplay from './QrDisplay'

export default function QrForm({ baseUrl }: { baseUrl: string }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [shortId, setShortId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function validate(value: string): boolean {
    return /^https?:\/\/.+/.test(value.trim())
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!validate(url)) {
      setError("L'URL doit commencer par http:// ou https://")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
      setShortId(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setShortId(null)
    setUrl('')
    setError('')
  }

  if (shortId) {
    return (
      <div className="space-y-4">
        <QrDisplay shortId={shortId} baseUrl={baseUrl} />
        <div className="text-center">
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Créer un autre QR code
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
          URL de destination
        </label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError('')
          }}
          placeholder="https://exemple.com/ma-page"
          className={`w-full rounded-xl border px-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 4v3M6 8.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !url}
        className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
            Génération...
          </>
        ) : (
          'Créer mon QR code'
        )}
      </button>
    </form>
  )
}
