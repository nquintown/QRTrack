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

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qrtrack-${shortId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

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

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl px-4 py-3 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Télécharger PNG
          </button>
          <Link
            href={`/stats/${shortId}`}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-xl px-4 py-3 border border-gray-200 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="9" width="3" height="6" rx="1" fill="currentColor" />
              <rect x="6" y="5" width="3" height="10" rx="1" fill="currentColor" />
              <rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor" />
            </svg>
            Voir les stats
          </Link>
        </div>
      </div>
    </div>
  )
}
