import crypto from 'crypto'
import { NextResponse } from 'next/server'

// このルートは middleware.ts の matcher(/admin/:path*) の対象外＝完全に公開のため、
// 署名検証を必ず自前で行う。LINEプラットフォーム以外からのリクエストは401で拒否する。
export const runtime = 'nodejs'

type LineEvent = {
  type: string
  source?: { type: string; groupId?: string; roomId?: string; userId?: string }
}

function isValidSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('base64')
  const expectedBuf = Buffer.from(expected)
  const actualBuf = Buffer.from(signature)
  if (expectedBuf.length !== actualBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, actualBuf)
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-line-signature')

  if (!isValidSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { events } = JSON.parse(rawBody) as { events: LineEvent[] }

  for (const event of events ?? []) {
    // Botがグループ/ルームに参加した時にgroupId/roomIdをログへ出力。
    // Vercelのログ（Dashboard > Deployments > Logs）で確認し、
    // LINE_RESERVATION_GROUP_ID 環境変数に設定してください。
    if (event.type === 'join' && event.source) {
      console.log('[LINE] joined:', event.source.type, event.source.groupId ?? event.source.roomId)
    }
  }

  return NextResponse.json({ ok: true })
}
