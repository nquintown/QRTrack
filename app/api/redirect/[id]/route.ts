import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const qr = await prisma.qrCode.findUnique({ where: { shortId: id } })
    if (!qr) return NextResponse.json({ error: 'notfound' }, { status: 404 })

    prisma.scan.create({
      data: {
        qrCodeId: qr.id,
        userAgent: req.headers.get('user-agent') ?? undefined,
      },
    }).catch(() => {})

    return NextResponse.json({ url: qr.originalUrl })
  } catch {
    return NextResponse.json({ error: 'db' }, { status: 500 })
  }
}
