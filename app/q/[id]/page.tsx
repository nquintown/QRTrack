'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function RedirectPage() {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000) // 8s max

    fetch(`/api/redirect/${id}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url
        } else {
          window.location.href = '/?error=notfound'
        }
      })
      .catch(() => {
        window.location.href = '/?error=db'
      })
      .finally(() => clearTimeout(timeout))
  }, [id])

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirection — QRTrack</title>
      </head>
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, sans-serif',
        background: '#f5f6f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: 40,
            height: 40,
            margin: '0 auto 1rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #111827',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Redirection en cours…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </body>
    </html>
  )
}
