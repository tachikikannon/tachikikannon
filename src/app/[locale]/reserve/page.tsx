import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReserveForm from './ReserveForm'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'
import type { ReservationType } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reserve' })
  return { title: t('title') }
}

const DEFAULT_PRAYER_FEES = [
  { price: '5,000円', size: '高さ28㎝ 横幅10cm' }, { price: '10,000円', size: '高さ32㎝ 横幅11.5cm' },
  { price: '20,000円', size: '高さ38㎝ 横幅12cm' }, { price: '30,000円', size: '高さ42.5㎝ 横幅13cm' },
]
const DEFAULT_PRAYER_FEES_EN = [
  { price: '¥5,000', size: 'H28cm × W10cm' }, { price: '¥10,000', size: 'H32cm × W11.5cm' },
  { price: '¥20,000', size: 'H38cm × W12cm' }, { price: '¥30,000', size: 'H42.5cm × W13cm' },
]

// 各種別カードの料金は、御祈願・写経・写仏・数珠づくり・坐禅それぞれの
// 管理画面編集内容（site_content）と一致させる。
const DEFAULTS: Record<string, string> = {
  prayer_fees: JSON.stringify(DEFAULT_PRAYER_FEES),
  prayer_fees_en: JSON.stringify(DEFAULT_PRAYER_FEES_EN),
  shakyou_fee: '1,000円（特別御朱印込み）',
  shakyou_fee_en: '¥1,000 (includes special goshuin stamp)',
  shabutu_fee: '1,000円（特別御朱印込み）',
  shabutu_fee_en: '¥1,000 (includes special goshuin stamp)',
  jyuzu_fee: '2,000円〜（使用素材により異なります）',
  jyuzu_fee_en: 'From ¥2,000 (varies by material used)',
  zazen_fee: '2,000円',
  zazen_fee_en: '¥2,000',
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

export default async function ReservePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const prayerFees = pj<typeof DEFAULT_PRAYER_FEES>(g('prayer_fees'), DEFAULT_PRAYER_FEES)
  const cheapestPrayerFee = prayerFees[0]?.price ?? DEFAULT_PRAYER_FEES[0].price
  const fees: Record<ReservationType, string> = {
    prayer: loc === 'en' ? `From ${cheapestPrayerFee}` : `${cheapestPrayerFee}〜`,
    shakyou: g('shakyou_fee'),
    shabutu: g('shabutu_fee'),
    jyuzu: g('jyuzu_fee'),
    zazen: g('zazen_fee'),
  }

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ReserveForm fees={fees} />
      </Suspense>
      <Footer />
    </>
  )
}
