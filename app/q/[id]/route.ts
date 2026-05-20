import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://qr-track-nu.vercel.app'

function redirect(url: string, status = 302) {
  return new Response(null, { status, headers: { Location: url } })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let qr
  try {
    qr = await prisma.qrCode.findUnique({ where: { shortId: id } })
  } catch (e) {
    console.error('[QRTrack] DB error on scan:', e)
    return redirect(`${baseUrl}/?error=db`)
  }

  if (!qr) {
    return redirect(`${baseUrl}/?error=notfound`)
  }

  // Record scan — fire and forget, never blocks the redirect
  prisma.scan.create({
    data: {
      qrCodeId: qr.id,
      userAgent: req.headers.get('user-agent') ?? undefined,
    },
  }).catch((e) => console.error('[QRTrack] Scan write failed:', e))

  return redirect(qr.originalUrl)
}
