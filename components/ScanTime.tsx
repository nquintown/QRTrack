'use client'

// Formats scan dates client-side so the browser's local timezone is used.
// Server-side formatting (Vercel = UTC) would show wrong hours for non-UTC users.
export default function ScanTime({ iso }: { iso: string }) {
  const d = new Date(iso)
  return (
    <>
      {d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
      {' '}
      <span className="text-gray-400 font-normal">
        {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </>
  )
}
