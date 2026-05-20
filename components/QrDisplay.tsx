'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import CopyButton from './CopyButton'
import Link from 'next/link'

interface QrDisplayProps {
  shortId: string
  baseUrl: string
}

export default function QrDisplay({ shortId, baseUrl }: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trackingUrl = `${baseUrl}/q/${shortId}`

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, trackingUrl, {
      width: 260,
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
        light: '#00000000', // transparent background
      },
    })
    const link = document.createElement('a')
    link.download = `qrtrack-${shortId}-${variant}.png`
    link.href = offscreen.toDataURL('image/png')
    link.click()
  }

  const DownloadIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-6">
      <div className="rounded-2xl overflow-hidden border border-gray-100 p-3 bg-white shadow-sm">
        <canvas ref={canvasRef} className="block" />
      </div>

      <div className="w-full space-y-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">URL de tracking</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <span className="text-sm font-mono text-gray-700 flex-1 break-all">{trackingUrl}</span>
            <CopyButton text={trackingUrl} />
          </div>
        </div>

        {/* Download row */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">Télécharger</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDownload('black')}
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl px-4 py-3 transition-colors text-center"
            >
              Noir transparent
            </button>
            <button
              onClick={() => handleDownload('white')}
              className="bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-xl px-4 py-3 border border-gray-200 transition-colors text-center"
            >
              Blanc transparent
            </button>
          </div>
        </div>

        <Link
          href={`/stats/${shortId}`}
          className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl px-4 py-3 border border-gray-100 transition-colors w-full"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="9" width="3" height="6" rx="1" fill="currentColor" />
            <rect x="6" y="5" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor" />
          </svg>
          Voir les statistiques
        </Link>
      </div>
    </div>
  )
}
