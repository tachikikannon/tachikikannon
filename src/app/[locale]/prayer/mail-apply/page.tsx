import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MailApplyContent from './MailApplyContent'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayerMailApply' })
  return { title: t('title') }
}

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝' }, { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' }, { price: '30,000円', size: '42.5㎝' },
]
const DEFAULT_FEES_EN = [
  { price: '¥5,000', size: '28cm' }, { price: '¥10,000', size: '32cm' },
  { price: '¥20,000', size: '38cm' }, { price: '¥30,000', size: '42.5cm' },
]

// 御祈願ページ（/prayer）の「御祈願料（テーブル）」と同じ site_content キーを共有し、
// 管理画面（/admin/chuzenji/prayer）の1箇所の編集でこのページにも反映されるようにする。
const DEFAULTS: Record<string, string> = {
  prayer_fees: JSON.stringify(DEFAULT_FEES),
  prayer_fees_en: JSON.stringify(DEFAULT_FEES_EN),
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

export default async function PrayerMailApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const content = await getContent()
  const fees = pj<typeof DEFAULT_FEES>(getLocalizedContent(content, 'prayer_fees', loc), DEFAULT_FEES)

  return (
    <>
      <Header />
      <MailApplyContent fees={fees} />
      <Footer />
    </>
  )
}
