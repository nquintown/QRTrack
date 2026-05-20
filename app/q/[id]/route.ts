import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let qr
  try {
    qr = await prisma.qrCode.findUnique({ where: { shortId: id } })
  } catch (e) {
    console.error('[QRTrack] DB error:', e)
    return NextResponse.redirect(`${baseUrl}/?error=db`, { status: 302 })
  }

  if (!qr) {
    return NextResponse.redirect(`${baseUrl}/?error=notfound`, { status: 302 })
  }

  // Record scan (non-blocking — don't let it fail the redirect)
  prisma.scan.create({
    data: {
      qrCodeId: qr.id,
      userAgent: req.headers.get('user-agent') ?? undefined,
    },
  }).catch((e) => console.error('[QRTrack] Scan write error:', e))

  return NextResponse.redirect(qr.originalUrl, { status: 302 })
}
