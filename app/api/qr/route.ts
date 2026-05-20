import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateShortId } from '@/lib/generateId'

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
  }

  let shortId = generateShortId()
  // Ensure uniqueness
  while (await prisma.qrCode.findUnique({ where: { shortId } })) {
    shortId = generateShortId()
  }

  const qr = await prisma.qrCode.create({
    data: { shortId, originalUrl: url },
  })

  return NextResponse.json({ id: qr.shortId })
}
