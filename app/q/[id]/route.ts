import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const qr = await prisma.qrCode.findUnique({ where: { shortId: id } })

  if (!qr) {
    return NextResponse.json({ error: 'QR code introuvable' }, { status: 404 })
  }

  await prisma.scan.create({
    data: {
      qrCodeId: qr.id,
      userAgent: req.headers.get('user-agent') ?? undefined,
    },
  })

  return NextResponse.redirect(qr.originalUrl, { status: 302 })
}
