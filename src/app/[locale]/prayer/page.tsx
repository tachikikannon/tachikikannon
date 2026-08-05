export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayer' })
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

const DEFAULTS: Record<string, string> = {
  prayer_subtitle: '立木観音護摩祈祷',
  prayer_subtitle_en: 'Tachiki Kannon Goma Fire Ritual',
  prayer_heading_about:  '御祈願について',
  prayer_heading_about_en: 'About the Prayer Service',
  prayer_heading_hours:  '御祈願時間',
  prayer_heading_hours_en: 'Prayer Hours',
  prayer_heading_fees:   '御祈願料',
  prayer_heading_fees_en: 'Offering',
  prayer_heading_mail:   '護摩札の郵送について',
  prayer_heading_mail_en: 'Mailing of Goma Ofuda Tablets',
  prayer_heading_others: 'その他の御祈願',
  prayer_heading_others_en: 'Other Prayer Services',
  prayer_about: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。',
  prayer_about_en: 'Goma is an esoteric ritual originating in India. A priest kindles the fire of Buddhist wisdom at the goma altar according to prescribed ritual, offering various items to the flame to ward off misfortune and pray for protection.',
  prayer_hours_row_label: '通年（平日・土日祝）',
  prayer_hours_row_label_en: 'Year-round (weekdays & weekends/holidays)',
  prayer_hours: '9：00〜12：00',
  prayer_hours_en: '9:00 AM – 12:00 PM',
  prayer_hours_note1: '定時での御祈願はございません。',
  prayer_hours_note1_en: 'There is no fixed prayer time.',
  prayer_hours_note2: '予約制となりますので、事前にお申し込みをお願い致します。',
  prayer_hours_note2_en: 'Reservations are required — please apply in advance.',
  prayer_exclude_dates: '6月18日・8月4日・8月8日',
  prayer_exclude_dates_en: 'June 18, August 4, August 8',
  prayer_exclude_note: '他にも行事によっては祈祷できない日もございますので、一度お問い合わせください。',
  prayer_exclude_note_en: 'Prayer services may also be unavailable on other event days — please contact us to confirm.',
  prayer_fees_note: '原則、御札の料金にて受付しております。金額によって御札と木箱の大きさが変わります。',
  prayer_fees_note_en: 'Fees are generally based on the ofuda tablet. The size of the ofuda and wooden box varies with the amount.',
  prayer_fees: JSON.stringify(DEFAULT_FEES),
  prayer_fees_en: JSON.stringify(DEFAULT_FEES_EN),
  prayer_mail_text: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。',
  prayer_mail_text_en: 'If you are unable to attend, we can mail your ofuda tablet to you. It will be sent cash-on-delivery — please fill out the application form and send it by registered mail with cash enclosed.',
  prayer_mail_note: '※お申込み頂き御祈願後、発送させて頂きますので1〜2週間ほどお待ちください。',
  prayer_mail_note_en: '※ The ofuda will be shipped after the prayer is performed — please allow 1–2 weeks.',
  prayer_car_title: '新車祈願（車両安全祈願）',
  prayer_car_title_en: 'New Car Blessing (Traffic Safety Prayer)',
  prayer_car_desc: 'お車を新しくされた方、車両安全の御祈願をお申し込みの方',
  prayer_car_desc_en: 'For those with a new vehicle or seeking a traffic-safety prayer',
  prayer_car_fee: '5,000円〜',
  prayer_car_fee_en: 'From ¥5,000',
  prayer_car_note: '※交通安全の錫杖守りと木札が付きます。',
  prayer_car_note_en: '※ Includes a traffic-safety shakujo charm and wooden tablet.',
  prayer_birth_title: '安産祈願',
  prayer_birth_title_en: 'Safe Childbirth Prayer',
  prayer_birth_fee: '5,000円',
  prayer_birth_fee_en: '¥5,000',
  prayer_birth_note: '※腹帯の持ち込みも可能です。詳しくはお問い合わせください。',
  prayer_birth_note_en: '※ You may bring your own maternity sash — please contact us for details.',
  prayer_753_title: '七五三祈願',
  prayer_753_title_en: 'Shichi-Go-San Prayer',
  prayer_753_fee: '5,000円',
  prayer_753_fee_en: '¥5,000',
  prayer_753_note: '※三歳・五歳・七歳のお子様の健やかな成長をお祝いする御祈願です。',
  prayer_753_note_en: '※ A prayer celebrating the healthy growth of children aged three, five, and seven.',
  prayer_cta_heading: '御祈願のお申し込み',
  prayer_cta_heading_en: 'Apply for a Prayer Service',
  prayer_cta_sub: 'ご不明な点はお気軽にお問い合わせください。',
  prayer_cta_sub_en: 'Please feel free to contact us with any questions.',
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

export default async function PrayerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('prayer')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const fees = pj<typeof DEFAULT_FEES>(g('prayer_fees'), DEFAULT_FEES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="relative h-64 md:h-80">
          <Image src="/images/gokigan-hiro.png" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Gokigan</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/60 text-sm mt-3">{g('prayer_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('prayer_heading_about')}</h2>
            <div className="mt-4 rounded-xl overflow-hidden shadow-sm">
              <img src="/images/goma.png" alt="御護摩" className="w-full h-auto" />
            </div>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-gold leading-relaxed text-gray-700">{g('prayer_about')}</div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('prayer_heading_hours')}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border border-gray-200">
                    <th className="bg-navy text-white text-left px-4 py-3 font-medium whitespace-nowrap">{g('prayer_hours_row_label')}</th>
                    <td className="px-4 py-3 bg-white">{g('prayer_hours')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-white rounded-lg p-4 text-sm text-gray-700 border border-gray-200 space-y-1">
              <p>{g('prayer_hours_note1')}</p>
              <p>{g('prayer_hours_note2')}</p>
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700 space-y-1">
              <p className="font-bold text-amber-700 text-xs">{t('excludeNoteLabel')}</p>
              <p>{g('prayer_exclude_dates')}</p>
              <p className="text-xs text-gray-500">{g('prayer_exclude_note')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('prayer_heading_fees')}</h2>
            <p className="text-sm text-gray-600 mt-3 mb-4">{g('prayer_fees_note')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="px-5 py-3 text-left font-medium">{t('tableFeeHeader')}</th>
                    <th className="px-5 py-3 text-left font-medium">{t('tableSizeHeader')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fees.map(({ price, size }, i) => (
                    <tr key={i} className="bg-white even:bg-gray-50">
                      <td className="px-5 py-3 font-bold text-navy">{price}</td>
                      <td className="px-5 py-3 text-gray-700">{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('prayer_heading_mail')}</h2>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-gold text-sm text-gray-700 leading-relaxed space-y-2">
              <p>{g('prayer_mail_text')}</p>
              <p className="text-xs text-gray-500">{g('prayer_mail_note')}</p>
              <Link href="/prayer/mail-apply" className="inline-block mt-2 text-sm text-navy font-medium border-b border-navy/40 hover:border-navy transition-colors">
                {t('mailCta')} →
              </Link>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('prayer_heading_others')}</h2>
            <div className="mt-4 space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-navy pl-3 border-l-3 border-gold mb-2">{g('prayer_car_title')}</h3>
                <p className="text-xs text-gray-500 mb-3">{g('prayer_car_desc')}</p>
                <table className="w-full text-sm border-collapse mb-2">
                  <tbody>
                    <tr className="border border-gray-100">
                      <td className="px-4 py-2 text-gray-500 bg-gray-50 w-32">{t('perCar')}</td>
                      <td className="px-4 py-2 font-bold text-navy">{g('prayer_car_fee')}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400">{g('prayer_car_note')}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-navy pl-3 border-l-3 border-gold mb-2">{g('prayer_birth_title')}</h3>
                <table className="w-full text-sm border-collapse mb-2">
                  <tbody>
                    <tr className="border border-gray-100">
                      <td className="px-4 py-2 text-gray-500 bg-gray-50 w-32">{t('perPerson')}</td>
                      <td className="px-4 py-2 font-bold text-navy">{g('prayer_birth_fee')}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400">{g('prayer_birth_note')}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-navy pl-3 border-l-3 border-gold mb-2">{g('prayer_753_title')}</h3>
                <table className="w-full text-sm border-collapse mb-2">
                  <tbody>
                    <tr className="border border-gray-100">
                      <td className="px-4 py-2 text-gray-500 bg-gray-50 w-32">{t('perChild')}</td>
                      <td className="px-4 py-2 font-bold text-navy">{g('prayer_753_fee')}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400">{g('prayer_753_note')}</p>
              </div>
            </div>
          </section>
          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('prayer_cta_heading')}</p>
            <p className="text-white/70 text-sm mb-6">{g('prayer_cta_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">{t('reserveCta')}</Link>
              <Link href="/prayer/mail-apply" className="btn-outline">{t('mailCta')}</Link>
              <Link href="/contact" className="btn-outline">{t('contactCta')}</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
