import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShogatsuApplyForm from './ShogatsuApplyForm'
import { getLocalizedContent } from '@/lib/site-content'
import { SHIPPING_TABLE_KEY, parseShippingTable } from '@/lib/shipping'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shogatsu' })
  return { title: `${t('title')} 申し込み` }
}

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝', weight_g: '' },
  { price: '10,000円', size: '32㎝', weight_g: '' },
  { price: '20,000円', size: '38㎝', weight_g: '' },
  { price: '30,000円', size: '42.5㎝', weight_g: '' },
]

// /annual-events/shogatsu ページの「御札の種類（テーブル）」と同じ site_content キーを共有し、
// 管理画面（/admin/chuzenji/events/shogatsu）の1箇所の編集でこの申し込みフォームにも反映されるようにする。
// 重量（weight_g）は日本語版の一覧の値のみを使う（英語版は翻訳目的のみで、送料計算には使わない）。
const DEFAULTS: Record<string, string> = {
  shogatsu_fees: JSON.stringify(DEFAULT_FEES),
  shogatsu_fees_en: JSON.stringify(DEFAULT_FEES),
  [SHIPPING_TABLE_KEY]: '[]',
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
  // 重量は常に日本語版の一覧（表示言語に関わらず content.shogatsu_fees）から、同じ並び順のインデックスで拾う
  const jaFees = pj<typeof DEFAULT_FEES>(content.shogatsu_fees, DEFAULT_FEES)
  const fees = localizedFees.map((f, i) => ({
    price: f.price,
    size: f.size,
    weight_g: Number(jaFees[i]?.weight_g) || 0,
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
