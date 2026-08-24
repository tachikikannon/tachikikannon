import { NextResponse } from 'next/server'
import type { GoodsItem } from '@/types'

// BASE（chuzenji.official.ec）の商品を、BASEのストア画面自体が「もっと見る」で
// 使っている非公開の内部エンドポイント（load_items/{page}）から取得する。
// 以前はトップページのHTMLを正規表現でパースしていたが、トップページ自体が
// 最初の1ページ分（24件）しか含んでおらず、2ページ目以降（「もっと見る」で
// 追加読み込みされる分）を取りこぼしていた。このエンドポイントは1ページ24件で、
// 空配列が返るまでページを進めれば全件取得できる（実測: 3ページ・53件）。
// BASE公式APIは利用登録が必要なため使っていない（従来からの方針を踏襲）。
const LOAD_ITEMS_URL = (page: number) => `https://chuzenji.official.ec/load_items/${page}?response_type=json`
const MAX_PAGES = 20 // 想定より商品数が増えても際限なくリクエストし続けないための安全弁

export const maxDuration = 30

type BaseItem = { id: string; title: string; price: string; on_sale?: boolean }

export async function GET() {
  try {
    const items: GoodsItem[] = []
    const seen = new Set<string>()

    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(LOAD_ITEMS_URL(page), {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ChuzenjiSiteBot/1.0)' },
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) break
      const data: unknown = await res.json()
      const pageItems: BaseItem[] = Array.isArray(data) ? data : []
      if (pageItems.length === 0) break

      for (const it of pageItems) {
        if (it.on_sale === false) continue
        if (seen.has(it.id)) continue
        const price = Number(it.price)
        if (!it.title || !Number.isFinite(price)) continue
        seen.add(it.id)
        items.push({ id: it.id, name: it.title, price })
      }
    }

    if (items.length === 0) throw new Error('no items parsed')

    return NextResponse.json({ ok: true, items })
  } catch (err) {
    console.error('goods/list error:', err)
    return NextResponse.json({ ok: false, items: [] as GoodsItem[] }, { status: 502 })
  }
}
