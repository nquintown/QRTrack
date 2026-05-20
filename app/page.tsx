import { headers } from 'next/headers'
import QrForm from '@/components/QrForm'
import HeroLottie from '@/components/HeroLottie'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) {
    const headersList = await headers()
    const host = headersList.get('host') ?? 'localhost:3000'
    const proto = host.startsWith('localhost') ? 'http' : 'https'
    baseUrl = `${proto}://${host}`
  }

  return (
    <main className="min-h-screen bg-[#f5f6f7] font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <img src="/favicon.png" alt="" width={28} height={28} />
        <span className="font-semibold text-sm tracking-tight">QRTrack</span>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-16 space-y-8">

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="text-red-400 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">
                {error === 'notfound' ? 'QR code introuvable' : 'Erreur de connexion'}
              </p>
              <p className="text-xs text-red-400 mt-0.5">
                {error === 'notfound'
                  ? 'Ce QR code n\'existe pas ou a été créé sur un autre environnement.'
                  : 'Impossible de contacter la base de données. Réessayez dans quelques instants.'}
              </p>
            </div>
          </div>
        )}

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
          Pas de compte requis · Pas de cookies · Open source · Fait par Nils QUINTOWN
        </p>
      </div>
    </main>
  )
}
