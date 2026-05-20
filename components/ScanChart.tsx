'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

type Range = '24h' | '7j' | '30j'

interface DataPoint {
  label: string
  count: number
  fullLabel: string
}

interface ScanChartProps {
  scanTimestamps: string[]
}

function buildData(scanTimestamps: string[], range: Range): DataPoint[] {
  const now = new Date()

  if (range === '24h') {
    return Array.from({ length: 24 }, (_, i) => {
      const bucketStart = new Date(now)
      bucketStart.setHours(now.getHours() - (23 - i), 0, 0, 0)
      const bucketEnd = new Date(bucketStart)
      bucketEnd.setHours(bucketStart.getHours() + 1)

      const count = scanTimestamps.filter(iso => {
        const d = new Date(iso)
        return d >= bucketStart && d < bucketEnd
      }).length

      const h = bucketStart.getHours()
      return {
        label: `${h}h`,
        fullLabel: `${bucketStart.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} · ${h}h–${h + 1}h`,
        count,
      }
    })
  }

  const days = range === '7j' ? 7 : 30
  return Array.from({ length: days }, (_, i) => {
    const bucketStart = new Date(now)
    bucketStart.setDate(now.getDate() - (days - 1 - i))
    bucketStart.setHours(0, 0, 0, 0)
    const bucketEnd = new Date(bucketStart)
    bucketEnd.setDate(bucketStart.getDate() + 1)

    const count = scanTimestamps.filter(iso => {
      const d = new Date(iso)
      return d >= bucketStart && d < bucketEnd
    }).length

    const label = range === '7j'
      ? bucketStart.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' })
      : `${bucketStart.getDate()}`

    return {
      label,
      fullLabel: bucketStart.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' }),
      count,
    }
  })
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload as DataPoint
  return (
    <div style={{
      background: '#111827',
      color: '#fff',
      borderRadius: 10,
      padding: '8px 14px',
      fontSize: 13,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <p style={{ margin: 0, fontWeight: 600 }}>{point.fullLabel}</p>
      <p style={{ margin: '2px 0 0', color: '#d1d5db', fontSize: 12 }}>
        {point.count} scan{point.count !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

const RANGES: { key: Range; label: string }[] = [
  { key: '24h', label: '24h' },
  { key: '7j', label: '7 jours' },
  { key: '30j', label: '30 jours' },
]

const EMPTY_LABELS: Record<Range, string> = {
  '24h': 'Aucun scan dans les dernières 24h',
  '7j': 'Aucun scan dans les 7 derniers jours',
  '30j': 'Aucun scan dans les 30 derniers jours',
}

export default function ScanChart({ scanTimestamps }: ScanChartProps) {
  const [range, setRange] = useState<Range>('24h')
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    setData(buildData(scanTimestamps, range))
  }, [scanTimestamps, range])

  const max = Math.max(...data.map(d => d.count), 1)
  const hasData = data.some(d => d.count > 0)

  // Show every Nth label to avoid overlap
  const xInterval = range === '24h' ? 2 : range === '7j' ? 0 : 4

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Scans · {range === '24h' ? '24 dernières heures' : range === '7j' ? '7 derniers jours' : '30 derniers jours'}
        </p>
        <div style={{ display: 'flex', gap: 4 }}>
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: range === r.key ? '#111827' : 'transparent',
                color: range === r.key ? '#fff' : '#9ca3af',
                borderColor: range === r.key ? '#111827' : '#e5e7eb',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 200 }}>
        {!hasData ? (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <p style={{ color: '#d1d5db', fontSize: 13, margin: 0 }}>{EMPTY_LABELS[range]}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={xInterval}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickCount={Math.min(max + 1, 6)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 4 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.count > 0 ? '#111827' : '#f3f4f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
