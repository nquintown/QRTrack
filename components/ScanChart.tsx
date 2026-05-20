'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

interface DataPoint {
  label: string
  count: number
  fullLabel: string
}

interface ScanChartProps {
  data: DataPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
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

export default function ScanChart({ data }: ScanChartProps) {
  const max = Math.max(...data.map(d => d.count), 1)
  const hasData = data.some(d => d.count > 0)

  return (
    <div style={{ width: '100%', height: 200 }}>
      {!hasData ? (
        <div style={{
          height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 8,
        }}>
          <p style={{ color: '#d1d5db', fontSize: 13, margin: 0 }}>Aucun scan dans les dernières 24h</p>
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
              interval={2}
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
  )
}
