import { headers } from 'next/headers'
import QrForm from '@/components/QrForm'
import HeroLottie from '@/components/HeroLottie'

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') ? 'http' : 'https'
  const baseUrl = `${proto}://${host}`

  return (
    <main className="min-h-screen bg-[#f5f6f7] font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <img src="/favicon.png" alt="" width={28} height={28} />
        <span className="font-semibold text-sm tracking-tight">QRTrack</span>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-16 space-y-8">

        {/* Hero */}
        <div className="text-center space-y-3">
          <HeroLottie />
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            QR codes avec<br />statistiques de scans
          </h1>
          <p className="text-gray-500 text-base">
            Entrez une URL, obtenez un QR code traçable.<br />
            Suivez chaque scan en temps réel.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <QrForm baseUrl={baseUrl} />
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-300">
          Pas de compte requis · Pas de cookies · Open source
        </p>
      </div>
    </main>
  )
}
