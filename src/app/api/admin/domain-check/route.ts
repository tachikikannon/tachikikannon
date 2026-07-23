import { NextResponse } from 'next/server'

// DNSレコード確認用の一時的なデバッグエンドポイント。確認が終わったら削除すること。
export async function GET() {
  const key = process.env.RESEND_API_KEY
  const listRes = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${key}` },
  })
  const list = await listRes.json()
  const domain = list.data?.find((d: { name: string }) => d.name === 'rinnoji.or.jp')
  if (!domain) return NextResponse.json({ error: 'domain not found', list })

  const detailRes = await fetch(`https://api.resend.com/domains/${domain.id}`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  const detail = await detailRes.json()
  return NextResponse.json(detail)
}
