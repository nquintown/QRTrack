'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditUrlFormProps {
  shortId: string
  currentUrl: string
}

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2.5 8.5l4 4 7-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export default function EditUrlForm({ shortId, currentUrl }: EditUrlFormProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleCancel() {
    setValue(currentUrl)
    setError('')
    setEditing(false)
  }

  async function handleSave() {
    setError('')
    if (!value.trim() || !/^https?:\/\/.+/.test(value.trim())) {
      setError('L\'URL doit commencer par http:// ou https://')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/qr/${shortId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value.trim() }),
      })
      if (res.ok) {
        setEditing(false)
        router.refresh()
      } else {
        setError('Erreur lors de la mise à jour')
      }
    } catch {
      setError('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-start gap-2 group">
        <h1 className="text-2xl font-bold text-gray-900 break-all mb-1 flex-1">
          {currentUrl}
        </h1>
        <button
          onClick={() => setEditing(true)}
          title="Modifier l'URL"
          className="mt-1 flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <PencilIcon />
        </button>
      </div>
    )
  }

  return (
    <div className="mb-1">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError('') }}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          className="flex-1 text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
          placeholder="https://..."
        />
        <button
          onClick={handleSave}
          disabled={loading}
          title="Enregistrer"
          className="flex-shrink-0 p-2 rounded-xl bg-gray-900 hover:bg-gray-700 text-white transition-colors disabled:opacity-50"
        >
          <CheckIcon />
        </button>
        <button
          onClick={handleCancel}
          title="Annuler"
          className="flex-shrink-0 p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-500 border border-gray-200 transition-colors"
        >
          <XIcon />
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>
      )}
    </div>
  )
}
