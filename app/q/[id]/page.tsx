import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://qr-track-nu.vercel.app'

// This inner component does the DB work — streamed after the spinner renders
async function Redirector({ id }: { id: string }) {
  let originalUrl: string | null = null

  try {
    const qr = await prisma.qrCode.findUnique({ where: { shortId: id } })

    if (qr) {
      prisma.scan.create({
        data: {
          qrCodeId: qr.id,
          userAgent: (await headers()).get('user-agent') ?? undefined,
        },
      }).catch(() => {})

      originalUrl = qr.originalUrl
    }
  } catch {
    // DB error — show error UI below
  }

  if (originalUrl) {
    redirect(originalUrl)
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>🔍</p>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>QR code introuvable</h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem' }}>Ce QR code n&apos;existe pas ou a expiré.</p>
      <a href={base} style={{ fontSize: '0.875rem', color: '#374151', textDecoration: 'underline' }}>← Créer un nouveau QR code</a>
    </div>
  )
}

// Loading spinner — shown immediately while DB wakes up
function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{
        width: 40, height: 40, margin: '0 auto 1rem',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #111827',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Redirection en cours…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirection — QRTrack</title>
      </head>
      <body style={{
        margin: 0, fontFamily: 'system-ui, sans-serif',
        background: '#f5f6f7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <Suspense fallback={<Spinner />}>
          <Redirector id={id} />
        </Suspense>
      </body>
    </html>
  )
}
