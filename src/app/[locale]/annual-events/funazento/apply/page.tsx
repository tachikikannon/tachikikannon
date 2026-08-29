export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FunazentoApplyForm from './FunazentoApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'funazento' })
  return { title: `${t('title')} 申し込み` }
}

export const NOTICE_DEFAULTS: Record<string, string> = {
  funazento_apply_notice_ofuda: 'お申し込みの方には御札をお授けいたします。',
  funazento_apply_notice_ofuda_en: 'Applicants will receive an ofuda talisman.',
  funazento_apply_notice_fee: '参加費は大人（中学生以上）御札付き5,000円、子供（小学生以下）御札付き4,000円です。当日ご参加されない場合は、お札のみ3,000円を頂戴いたします。',
  funazento_apply_notice_fee_en: 'The participation fee is ¥5,000 for adults (junior high school age and older, ofuda included) and ¥4,000 for children (elementary school age and younger, ofuda included). If you do not attend in person, an ofuda-only fee of ¥3,000 applies.',
  funazento_apply_notice_shipping: '当日ご参加されない方のお札は代金引換（代引き）にて郵送いたします。代表者様のご住所へまとめて発送する場合、送料は1〜5件で1,000円（6件以上は5件ごとに1,000円加算）。代表者様以外のご住所へ発送する場合は、1件につき1,000円です。',
  funazento_apply_notice_shipping_en: 'For those not attending in person, the ofuda talisman is shipped by cash on delivery. When shipped together to the representative’s address, shipping is ¥1,000 for 1–5 items (an additional ¥1,000 per every 5 items beyond that). Shipping to an address other than the representative’s is ¥1,000 per item.',
  funazento_apply_notice_payment: 'お支払いは当日・現地でのお支払いとなります。事前のお振込みは不要です。',
  funazento_apply_notice_payment_en: 'Payment is due on the day, on site. No advance bank transfer is needed.',
  funazento_apply_notice_capacity: '定員になり次第締め切ります。お早めにお申し込みください。',
  funazento_apply_notice_capacity_en: 'Applications close once capacity is reached. Please apply early.',
  funazento_apply_notice_family: 'ご家族・団体でお申し込みの場合は、代表者様の情報に加えて申込者①〜⑩に人数分ご記入ください。',
  funazento_apply_notice_family_en: "If applying as a family or group, please fill in applicants ①–⑩ in addition to the representative's information.",
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

export default async function FunazentoApplyPage() {
  const content = await getContent()
  return (
    <>
      <Header />
      <FunazentoApplyForm content={content} />
      <Footer />
    </>
  )
}
