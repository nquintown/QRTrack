'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface DownloadQrProps {
  shortId: string
  trackingUrl: string
}

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function DownloadQr({ shortId, trackingUrl }: DownloadQrProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, trackingUrl, {
      width: 160,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })
  }, [trackingUrl])

  async function handleDownload(variant: 'black' | 'white') {
    const offscreen = document.createElement('canvas')
    await QRCode.toCanvas(offscreen, trackingUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: variant === 'black' ? '#111827' : '#ffffff',
        light: '#00000000',
      },
    })
    const link = document.createElement('a')
    link.download = `qrtrack-${shortId}-${variant}.png`
    link.href = offscreen.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex items-center gap-6">
      {/* QR preview */}
      <div className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 p-2 bg-white shadow-sm">
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Download buttons */}
      <div className="flex-1 space-y-2">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Télécharger</p>
        <button
          onClick={() => handleDownload('black')}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl px-4 py-3 transition-colors"
        >
          <DownloadIcon />
          Noir transparent
        </button>
        <button
          onClick={() => handleDownload('white')}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-xl px-4 py-3 border border-gray-200 transition-colors"
        >
          <DownloadIcon />
          Blanc transparent
        </button>
      </div>
    </div>
  )
}
