import { headers } from 'next/headers'
import QrForm from '@/components/QrForm'

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') ? 'http' : 'https'
  const baseUrl = `${proto}://${host}`

  return (
    <main className="min-h-screen bg-[#f5f6f7] font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="12" height="12" rx="2" fill="#111827" />
          <rect x="16" width="12" height="12" rx="2" fill="#111827" />
          <rect y="16" width="12" height="12" rx="2" fill="#111827" />
          <rect x="16" y="16" width="5" height="5" rx="1" fill="#111827" />
          <rect x="23" y="16" width="5" height="5" rx="1" fill="#111827" />
          <rect x="16" y="23" width="5" height="5" rx="1" fill="#111827" />
        </svg>
        <span className="font-semibold text-sm tracking-tight">QRTrack</span>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-16 space-y-8">

        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            QR codes avec<br />statistiques de scans
          </h1>
          <p className="text-gray-500 text-base">
            Entrez une URL, obtenez un QR code traçable.<br />
            Suivez chaque scan en temps réel.
          </p>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', label: 'Instantané', desc: 'QR code généré en un clic' },
            { icon: '📊', label: 'Statistiques', desc: 'Historique de chaque scan' },
            { icon: '🔗', label: 'URL courte', desc: 'Lien de tracking intégré' },
          ].map((f) => (
            <div key={f.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-semibold text-gray-800">{f.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
            </div>
          ))}
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
