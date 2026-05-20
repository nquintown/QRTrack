import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { url } = await req.json()

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
  }

  try {
    const qr = await prisma.qrCode.update({
      where: { shortId: id },
      data: { originalUrl: url },
    })
    return NextResponse.json({ ok: true, url: qr.originalUrl })
  } catch {
    return NextResponse.json({ error: 'notfound' }, { status: 404 })
  }
}
