export const revalidate = 60

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shogatsu' })
  return {
    title: `${t('title')}（1月1日）`,
    description: '毎年1月1日開催。新しい年の始まりに一年の無病息災・家内安全・開運招福を祈願する特別護摩祈祷。事前申し込み必要、最大5名まで同時申込可。',
  }
}

const DEFAULT_SCHEDULE: { time: string; title: string; desc: string }[] = []
const DEFAULT_SCHEDULE_EN: { time: string; title: string; desc: string }[] = []

const DEFAULT_NOTES = [
  { text: '事前の申し込みが必要です。1回のお申し込みで最大5名様までまとめてお申し込みいただけます。' },
  { text: '御札は5,000円（28㎝）・10,000円（32㎝）・20,000円（38㎝）・30,000円（42.5㎝）よりお選びいただけます。' },
  { text: 'お申し込みは、申し込みフォーム内の代金引換（代引き）またはECサイトよりお選びいただけます。代引きの場合、送料・手数料は別途ご負担いただきます。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'Advance application is required. A single application can cover up to 5 people.' },
  { text: 'Ofuda talismans are available in 4 sizes: ¥5,000 (28cm), ¥10,000 (32cm), ¥20,000 (38cm), and ¥30,000 (42.5cm).' },
  { text: 'You may apply via cash on delivery or the online shop within the application form. For cash on delivery, shipping and handling fees are charged separately.' },
]

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝' },
  { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' },
  { price: '30,000円', size: '42.5㎝' },
]

const DEFAULTS: Record<string, string> = {
  shogatsu_subtitle: '毎年1月1日　午前0時より　※事前申し込み必要',
  shogatsu_subtitle_en: 'Held every year on January 1st, from 12:00 AM. *Advance application required.',
  shogatsu_heading_about: '行事について',
  shogatsu_heading_about_en: 'About the Event',
  shogatsu_about: '正月元旦特別護摩祈願は、新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・開運招福を祈願する特別な護摩祈祷です。元日、僧侶による厳かな護摩焚きとともに、新年の平安と幸福をお祈りいたします。御札は4種類の中からお選びいただき、お申し込み時にお願い事を2つまでお選びいただけます。',
  shogatsu_about_en: 'The New Year\'s Day Special Goma Prayer Ritual is a special fire ritual marking the start of the new year, praying for everyone\'s good health, household safety, and good fortune throughout the year. On New Year\'s Day, priests solemnly light the goma fire as we pray for peace and happiness in the new year. Ofuda talismans come in 4 sizes, and you may choose up to 2 wishes when applying.',
  shogatsu_info_date: '1月1日（毎年）',
  shogatsu_info_date_en: 'January 1st (annually)',
  shogatsu_info_time: '午前0時〜',
  shogatsu_info_time_en: 'From 12:00 AM',
  shogatsu_info_join: '事前申し込み必要（最大5名まで）',
  shogatsu_info_join_en: 'Advance application required (up to 5 people)',
  shogatsu_heading_schedule: 'タイムスケジュール',
  shogatsu_heading_schedule_en: 'Schedule',
  shogatsu_heading_fees: '御札の種類',
  shogatsu_heading_fees_en: 'Ofuda Sizes',
  shogatsu_heading_notes: 'ご参加にあたって',
  shogatsu_heading_notes_en: 'Notes for Participants',
  shogatsu_cta_heading: '正月元旦特別護摩祈願 お申し込み',
  shogatsu_cta_heading_en: 'New Year\'s Day Special Goma Prayer Ritual Application',
  shogatsu_cta_text: '最大5名まで同時にお申し込みいただけます。\n代金引換（代引き）・ECサイトのいずれからもお申し込みいただけます。',
  shogatsu_cta_text_en: 'Up to 5 people can apply together in a single application.\nYou may apply by cash on delivery or through the online shop.',
  shogatsu_notes: JSON.stringify(DEFAULT_NOTES),
  shogatsu_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
  shogatsu_fees: JSON.stringify(DEFAULT_FEES),
  shogatsu_fees_en: JSON.stringify(DEFAULT_FEES),
  shogatsu_schedule: JSON.stringify(DEFAULT_SCHEDULE),
  shogatsu_schedule_en: JSON.stringify(DEFAULT_SCHEDULE_EN),
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

export default async function ShogatsuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('shogatsu')
  const tc = await getTranslations('common')
  const tAE = await getTranslations('annualEvents')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const notes = pj<typeof DEFAULT_NOTES>(g('shogatsu_notes'), DEFAULT_NOTES)
  const fees  = pj<typeof DEFAULT_FEES>(g('shogatsu_fees'), DEFAULT_FEES)
  const schedule = pj<typeof DEFAULT_SCHEDULE>(g('shogatsu_schedule'), DEFAULT_SCHEDULE)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/annual-events">{tAE('title')}</Link> &gt; {t('breadcrumb')}
          </div>
        </div>

        <section className="relative h-72 md:h-96 overflow-hidden">
          <ZoomableImage src="/images/chuzenji/events/shogatsu/ganjitsu-goma-2.jpg" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-2">{t('eraLabel')}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-3">{g('shogatsu_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('shogatsu_heading_about')}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{g('shogatsu_about')}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t('infoDate'), value: g('shogatsu_info_date') },
                { label: t('infoTime'), value: g('shogatsu_info_time') },
                { label: t('infoJoin'), value: g('shogatsu_info_join') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cream-alt rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-navy">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {schedule.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gold rounded-full" />
                <h2 className="font-serif text-2xl text-navy">{g('shogatsu_heading_schedule')}</h2>
              </div>
              <ol className="relative border-l-2 border-gold/40 ml-5 space-y-8">
                {schedule.map(({ time, title, desc }, i) => (
                  <li key={i} className="pl-8 relative">
                    <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-navy flex items-center justify-center shadow-md">
                      <span className="text-gold text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-gold font-bold text-lg tracking-wide">{time}</span>
                        <h3 className="font-serif text-navy text-lg">{title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('shogatsu_heading_fees')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="px-5 py-3 text-left font-medium">{t('feeTableHeaderPrice')}</th>
                    <th className="px-5 py-3 text-left font-medium">{t('feeTableHeaderSize')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(({ price, size }) => (
                    <tr key={price} className="border border-gray-200">
                      <td className="px-5 py-3 font-bold text-navy bg-cream-alt">{price}</td>
                      <td className="px-5 py-3">{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('shogatsu_heading_notes')}</h2>
            </div>
            <div className="space-y-3">
              {notes.map(({ text }, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-cream-alt rounded-xl px-4 py-3">
                  <span className="text-gold font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('shogatsu_cta_heading')}</p>
            <p className="text-white/70 text-sm mb-6">
              {g('shogatsu_cta_text').split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/shogatsu/apply"
                className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full hover:opacity-90 transition-colors text-sm">
                {t('applyCta')}
              </Link>
              <Link href="/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                {t('contactCta')}
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/annual-events"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              {t('quickEventsList')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
