export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import KannonkoApplyForm from './KannonkoApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'kannonko' })
  return { title: `${t('title')} 申し込み` }
}

export const NOTICE_DEFAULTS: Record<string, string> = {
  kannonko_apply_notice_ofuda: 'お申し込みの方には御祈祷したお札をお授けします。参加費はお一人様3,000円（お札代込み）です。',
  kannonko_apply_notice_ofuda_en: 'Applicants will receive a blessed ofuda talisman. The participation fee is ¥3,000 per person (includes the ofuda talisman).',
  kannonko_apply_notice_shipping: '代金引換をご希望の場合、お札は郵送いたします。送料は送り先1件につき1,000円です。',
  kannonko_apply_notice_shipping_en: 'If you choose cash on delivery, the ofuda talisman will be shipped. Shipping is ¥1,000 per destination.',
  kannonko_apply_notice_payment: 'お支払いは当日・現地でのお支払い、または代金引換（郵送）からお選びいただけます。',
  kannonko_apply_notice_payment_en: 'Payment can be made on the day, on site, or by cash on delivery (shipped).',
  kannonko_apply_notice_family: 'ご家族・団体でお申し込みの場合は、代表者様の情報に加えて申込者①〜⑩に人数分ご記入ください。',
  kannonko_apply_notice_family_en: "If applying as a family or group, please fill in applicants ①–⑩ in addition to the representative's information.",
}

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(NOTICE_DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return NOTICE_DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...NOTICE_DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return NOTICE_DEFAULTS }
}

export default async function KannonkoApplyPage() {
  const content = await getContent()
  return (
    <>
      <Header />
      <KannonkoApplyForm content={content} />
      <Footer />
    </>
  )
}
