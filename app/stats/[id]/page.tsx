import { notFound } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import CopyButton from '@/components/CopyButton'

export const dynamic = 'force-dynamic'

export default async function StatsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const qr = await prisma.qrCode.findUnique({
    where: { shortId: id },
    include: { scans: { orderBy: { scannedAt: 'desc' } } },
  })

  if (!qr) notFound()

  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) {
    const headersList = await headers()
    const host = headersList.get('host') ?? 'localhost:3000'
    const proto = host.startsWith('localhost') ? 'http' : 'https'
    baseUrl = `${proto}://${host}`
  }
  const trackingUrl = `${baseUrl}/q/${qr.shortId}`

  return (
    <main className="min-h-screen bg-[#f5f6f7] font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-70 transition-opacity">
          <img src="/favicon.png" alt="" width={28} height={28} />
          <span className="font-semibold text-sm tracking-tight">QRTrack</span>
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-500">Statistiques</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">QR Code</p>
          <h1 className="text-2xl font-bold text-gray-900 break-all mb-1">{qr.originalUrl}</h1>
          <p className="text-sm text-gray-400">
            Créé le{' '}
            {new Date(qr.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Total scans</p>
            <p className="text-5xl font-bold text-gray-900">{qr.scans.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Dernier scan</p>
            <p className="text-lg font-semibold text-gray-900">
              {qr.scans.length > 0
                ? new Date(qr.scans[0].scannedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">URL de tracking</p>
            <p className="text-sm font-mono text-gray-700 break-all">{trackingUrl}</p>
          </div>
        </div>

        {/* Tracking URL */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Lien de redirection</p>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-sm font-mono text-gray-700 flex-1 break-all">{trackingUrl}</span>
            <CopyButton text={trackingUrl} />
          </div>
        </div>

        {/* Scan history */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Historique des scans</p>

          {qr.scans.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">Aucun scan pour le moment.</p>
              <p className="text-gray-300 text-xs mt-1">Scannez le QR code pour voir les statistiques apparaître ici.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {qr.scans.map((scan, i) => (
                <div key={scan.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 w-6 text-right">#{qr.scans.length - i}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(scan.scannedAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        <span className="text-gray-400 font-normal">
                          {new Date(scan.scannedAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                      {scan.userAgent && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{scan.userAgent}</p>
                      )}
                    </div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Scan
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Créer un nouveau QR code
          </Link>
        </div>
      </div>
    </main>
  )
}
