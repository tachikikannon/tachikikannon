import { NextResponse } from 'next/server'
import type { GoodsItem } from '@/types'

const EC_URL = 'https://chuzenji.official.ec/'

// BASE（chuzenji.official.ec）の商品一覧ページから商品名・価格をその都度取得する。
// BASE公式APIは利用登録が必要なため、公開ストアページのHTMLを軽量にパースしている。
// サーバー側で数分キャッシュし、EC側への負荷とアクセス集中時の応答遅延を抑える。
export async function GET() {
  try {
    const res = await fetch(EC_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ChuzenjiSiteBot/1.0)' },
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`EC site responded ${res.status}`)
    const html = await res.text()

    const anchorRe = /<a[^>]*href="https:\/\/chuzenji\.official\.ec\/items\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g
    const items: GoodsItem[] = []
    let m: RegExpExecArray | null
    while ((m = anchorRe.exec(html)) !== null) {
      const id = m[1]
      const block = m[2]
      const titleM = block.match(/itemTitleText[^"]*"[^>]*>([^<]+)</)
      const priceM = block.match(/>\s*¥([\d,]+)\s*</)
      if (!titleM || !priceM) continue
      const name = titleM[1].trim()
      const price = Number(priceM[1].replace(/,/g, ''))
      if (!name || !Number.isFinite(price)) continue
      // 同じ商品が複数箇所（おすすめ表示など）に出ることがあるため重複除去
      if (items.some(it => it.id === id)) continue
      items.push({ id, name, price })
    }

    if (items.length === 0) throw new Error('no items parsed')

    return NextResponse.json({ ok: true, items })
  } catch (err) {
    console.error('goods/list error:', err)
    return NextResponse.json({ ok: false, items: [] as GoodsItem[] }, { status: 502 })
  }
}
