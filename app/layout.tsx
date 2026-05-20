import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QRTrack — QR codes avec statistiques de scans',
  description:
    'Créez des QR codes traçables et consultez le nombre de scans en temps réel.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#f5f6f7] font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
