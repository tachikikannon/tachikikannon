import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PrayerCodApplyForm from './PrayerCodApplyForm'
import { getLocalizedContent } from '@/lib/site-content'
import { GOODS_WEIGHTS_KEY, SHIPPING_TABLE_KEY, OFUDA_GOODS_ID_BY_PRICE, parseGoodsWeights, parseShippingTable } from '@/lib/shipping'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayerCodApply' })
  return { title: t('title') }
}

const DEFAULT_FEES = [
  { price: '5,000円', size: '高さ28㎝ 横幅10cm' }, { price: '10,000円', size: '高さ32㎝ 横幅11.5cm' },
  { price: '20,000円', size: '高さ38㎝ 横幅12cm' }, { price: '30,000円', size: '高さ42.5㎝ 横幅13cm' },
]
const DEFAULT_FEES_EN = [
  { price: '¥5,000', size: 'H28cm × W10cm' }, { price: '¥10,000', size: 'H32cm × W11.5cm' },
  { price: '¥20,000', size: 'H38cm × W12cm' }, { price: '¥30,000', size: 'H42.5cm × W13cm' },
]

// /prayer ページ・郵送申込ページ（/prayer/mail-apply）の「御祈願料（テーブル）」と
// 同じ site_content キー（prayer_fees）を共有し、管理画面（/admin/chuzenji/prayer）
// 1箇所の編集でこのフォームにも反映されるようにする。
const DEFAULTS: Record<string, string> = {
  prayer_fees: JSON.stringify(DEFAULT_FEES),
  prayer_fees_en: JSON.stringify(DEFAULT_FEES_EN),
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

export default async function PrayerCodApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const content = await getContent()
  const localizedFees = pj<typeof DEFAULT_FEES>(getLocalizedContent(content, 'prayer_fees', loc), DEFAULT_FEES)
  const goodsWeights = parseGoodsWeights(content[GOODS_WEIGHTS_KEY])
  // 重量の紐付けは常に日本語版の御祈願料テキスト（例：5,000円）をキーに引く。
  // 英語版は「¥5,000」のような別表記のため、そのままでは引けない
  // （並び順が一致している前提で）同じインデックスの日本語版の価格を使う。
  const jaFees = pj<typeof DEFAULT_FEES>(content.prayer_fees, DEFAULT_FEES)
  const fees = localizedFees.map((f, i) => ({
    price: f.price,
    size: f.size,
    weight_g: goodsWeights[OFUDA_GOODS_ID_BY_PRICE[jaFees[i]?.price ?? ''] ?? '']?.weight_g ?? 0,
  }))
  const shippingTiers = parseShippingTable(content[SHIPPING_TABLE_KEY])

  return (
    <>
      <Header />
      <PrayerCodApplyForm fees={fees} shippingTiers={shippingTiers} />
      <Footer />
    </>
  )
}
