import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lightweight keepalive — called every ~4 min by cron-job.org
// Prevents Neon free tier from suspending (auto-suspend after 5 min idle)
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
