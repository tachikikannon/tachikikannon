import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShogatsuApplyForm from './ShogatsuApplyForm'
import { getLocalizedContent } from '@/lib/site-content'
import { GOODS_WEIGHTS_KEY, SHIPPING_TABLE_KEY, parseGoodsWeights, parseShippingTable } from '@/lib/shipping'
import type { Locale } from '@/i18n/routing'

// 御札の重量は新規に管理項目を作らず、BASE商品「御札 小/中/大/特大」に対して
// 「商品重量設定」（/admin/mail-order/weights）で既に登録されている重量をそのまま使う。
// 御祈願料（price）は商品価格と完全に一致し、変わることがまず無いためこれをキーにする。
// BASE側でこの4商品が削除・作り直しされてIDが変わった場合はここも更新が必要。
const OFUDA_GOODS_ID_BY_PRICE: Record<string, string> = {
  '5,000円': '46991730',  // 御札 小（28cm）
  '10,000円': '81452564', // 御札 中（32cm）
  '20,000円': '46991593', // 御札 大（38cm）
  '30,000円': '46940868', // 御札 特大（42.5cm）
}

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
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
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
  const fees = localizedFees.map(f => ({
    price: f.price,
    size: f.size,
    weight_g: goodsWeights[OFUDA_GOODS_ID_BY_PRICE[f.price] ?? '']?.weight_g ?? 0,
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
