import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShogatsuApplyForm from './ShogatsuApplyForm'
import { getLocalizedContent } from '@/lib/site-content'
import { GOODS_WEIGHTS_KEY, SHIPPING_TABLE_KEY, OFUDA_GOODS_ID_BY_PRICE, parseGoodsWeights, parseShippingTable } from '@/lib/shipping'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shogatsu' })
  return { title: `${t('title')} 申し込み` }
}

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝' },
  { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' },
  { price: '30,000円', size: '42.5㎝' },
]

// /annual-events/shogatsu ページの「御札の種類（テーブル）」と同じ site_content キーを共有し、
// 管理画面（/admin/chuzenji/events/shogatsu）の1箇所の編集でこの申し込みフォームにも反映されるようにする。
const DEFAULTS: Record<string, string> = {
  shogatsu_fees: JSON.stringify(DEFAULT_FEES),
  shogatsu_fees_en: JSON.stringify(DEFAULT_FEES),
  [SHIPPING_TABLE_KEY]: '[]',
  [GOODS_WEIGHTS_KEY]: '{}',
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 },
    })
    if (!res.ok) return DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return DEFAULTS }
}

export default async function ShogatsuApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const content = await getContent()
  const localizedFees = pj<typeof DEFAULT_FEES>(getLocalizedContent(content, 'shogatsu_fees', loc), DEFAULT_FEES)
  const goodsWeights = parseGoodsWeights(content[GOODS_WEIGHTS_KEY])
  // 重量の紐付けは常に日本語版の御祈願料テキスト（例：5,000円）をキーに引く。
  // 英語版は表記が「¥5,000」等に変わっていることがあり、その文字列では引けないため
  // （並び順が一致している前提で）同じインデックスの日本語版の価格を使う。
  const jaFees = pj<typeof DEFAULT_FEES>(content.shogatsu_fees, DEFAULT_FEES)
  const fees = localizedFees.map((f, i) => ({
    price: f.price,
    size: f.size,
    weight_g: goodsWeights[OFUDA_GOODS_ID_BY_PRICE[jaFees[i]?.price ?? ''] ?? '']?.weight_g ?? 0,
  }))
  const shippingTiers = parseShippingTable(content[SHIPPING_TABLE_KEY])

  return (
    <>
      <Header />
      <ShogatsuApplyForm fees={fees} shippingTiers={shippingTiers} />
      <Footer />
    </>
  )
}
