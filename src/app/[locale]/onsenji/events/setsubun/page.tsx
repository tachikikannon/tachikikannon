export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiSetsubun' })
  return {
    title: `${t('title')} | 日光山温泉寺`,
    description: '毎年1月下旬開催。新年の邪気を払い福を招く節分大祭のご案内。豆まき・護摩供。日程は年によって異なります。',
  }
}

const DEFAULT_SCHEDULE = [
  { time: '11:00', title: '節分大祭（法要）', desc: '薬師堂にて節分の法要を執り行います。ご本尊・薬師如来のご加護のもと、新年の無病息災・開運招福をお祈りいたします。' },
  { time: '11:30', title: '護摩供', desc: '護摩の炎に参拝者の願い事を記した護摩木を奉じ、薬師如来の御力で煩悩や邪気をお焚き上げいたします。' },
  { time: '終了後', title: '豆まき', desc: '「鬼は外、福は内」の声とともに豆まきを行います。参列の皆様にも豆をお配りいたします。' },
]
const DEFAULT_SCHEDULE_EN = [
  { time: '11:00', title: 'Setsubun Grand Ceremony', desc: 'A Setsubun ceremony is held at the Yakushi Hall. Under the protection of Yakushi Nyorai, we pray for good health and good fortune in the new year.' },
  { time: '11:30', title: 'Goma Fire Ritual', desc: 'Wooden goma sticks inscribed with visitors\' wishes are offered to the flames, burning away worldly desires and misfortune through the power of Yakushi Nyorai.' },
  { time: 'After the Ceremony', title: 'Bean Throwing', desc: 'Beans are thrown with the call "Oni wa soto, fuku wa uchi" ("Demons out, fortune in"). Beans are also distributed to all attendees.' },
]

const DEFAULT_NOTES = [
  { text: '参列は自由です。事前のお申し込みは不要ですが、御札をご希望の方は申し込みフォームよりお申し込みください。' },
  { text: '1月の湯元は積雪・寒冷が予想されます。防寒対策を十分にしてお越しください。' },
  { text: 'お支払いは当日・現地にてお受けいたします。' },
  { text: '日程は年によって異なります。必ず事前にお電話またはウェブサイトでご確認ください。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'Attendance is open to all — no advance registration required. If you would like an ofuda talisman, please apply via the application form.' },
  { text: 'Snow and cold weather are expected at Yumoto in January. Please dress warmly.' },
  { text: 'Payment is accepted on the day, on site.' },
  { text: 'The schedule varies by year. Please always confirm in advance by phone or on our website.' },
]

const DEFAULTS: Record<string, string> = {
  setsubun_subtitle: '毎年1月下旬　午前11時より　※日程は年によって異なります',
  setsubun_subtitle_en: 'Held every year in late January, from 11:00 AM. *Schedule varies by year.',
  setsubun_heading_about: '行事について',
  setsubun_heading_about_en: 'About the Event',
  setsubun_about: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。冬季の静けさのなか、厳かな雰囲気に包まれた温泉寺ならではの行事です。',
  setsubun_about_en: 'A Setsubun ceremony to drive away misfortune and welcome good luck for the new year. Bean-throwing and a goma fire ritual pray for the health and happiness of visitors for the year ahead. A uniquely Onsenji event, held in the quiet, solemn atmosphere of winter.',
  setsubun_info_date: '1月下旬（毎年）',
  setsubun_info_date_en: 'Late January (annually)',
  setsubun_info_time: '午前11時〜',
  setsubun_info_time_en: 'From 11:00 AM',
  setsubun_info_join: '自由（申し込み不要）',
  setsubun_info_join_en: 'Open to all (no registration needed)',
  setsubun_date_note: '📌 詳細な日程は年によって異なります。最新情報はお電話（0288-55-0013）またはお問い合わせフォームでご確認ください。',
  setsubun_date_note_en: '📌 The exact schedule varies by year. Please check the latest information by phone (0288-55-0013) or via the contact form.',
  setsubun_heading_schedule: 'タイムスケジュール',
  setsubun_heading_schedule_en: 'Schedule',
  setsubun_heading_gallery: '行事の様子',
  setsubun_heading_gallery_en: 'Photos from the Event',
  setsubun_heading_notes: 'ご参列にあたって',
  setsubun_heading_notes_en: 'Notes for Attendees',
  setsubun_cta_heading: '御札のお申し込み',
  setsubun_cta_heading_en: 'Ofuda Talisman Application',
  setsubun_cta_text: '護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。',
  setsubun_cta_text_en: 'If you would like an ofuda talisman burned in the goma fire ritual,\nplease apply via the application form.\nPayment is accepted on the day, on site.',
  setsubun_schedule: JSON.stringify(DEFAULT_SCHEDULE),
  setsubun_schedule_en: JSON.stringify(DEFAULT_SCHEDULE_EN),
  setsubun_notes: JSON.stringify(DEFAULT_NOTES),
  setsubun_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
}

const GALLERY_IMAGES = [
  '/images/onsenji/events/setsubun/onsenji-setubun (1).JPG',
  '/images/onsenji/events/setsubun/onsenji-setubun (2).JPG',
  '/images/onsenji/events/setsubun/onsenji-setubun (3).JPG',
]

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

export default async function SetsubunPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiSetsubun')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const schedule = pj<typeof DEFAULT_SCHEDULE>(g('setsubun_schedule'), DEFAULT_SCHEDULE)
  const notes    = pj<typeof DEFAULT_NOTES>(g('setsubun_notes'), DEFAULT_NOTES)
  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; <Link href="/onsenji/events">{t('eventsLabel')}</Link> &gt; {t('breadcrumb')}
          </div>
        </div>

        <section className="relative h-72 md:h-96 overflow-hidden">
          <ZoomableImage src="/images/onsenji/events/setsubun/onsenji-setubun-hiro.JPG" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-onsenji via-onsenji/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-2">{t('eraLabel')}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-3">{g('setsubun_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{g('setsubun_heading_about')}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{g('setsubun_about')}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t('infoDate'), value: g('setsubun_info_date') },
                { label: t('infoTime'), value: g('setsubun_info_time') },
                { label: t('infoJoin'), value: g('setsubun_info_join') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-onsenji/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-onsenji">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              {g('setsubun_date_note')}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{g('setsubun_heading_schedule')}</h2>
            </div>
            <ol className="relative border-l-2 border-[#7ec8a4]/40 ml-5 space-y-8">
              {schedule.map(({ time, title, desc }, i) => (
                <li key={i} className="pl-8 relative">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-onsenji flex items-center justify-center shadow-md">
                    <span className="text-[#7ec8a4] text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-[#2d6b57] font-bold text-lg tracking-wide">{time}</span>
                      <h3 className="font-serif text-onsenji text-lg">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{g('setsubun_heading_gallery')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY_IMAGES.map((src, i) => (
                <div key={src} className="relative h-40 md:h-52 rounded-xl overflow-hidden shadow-sm">
                  <ZoomableImage src={src} alt={`節分大祭の様子 ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{g('setsubun_heading_notes')}</h2>
            </div>
            <div className="space-y-3">
              {notes.map(({ text }, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-onsenji/5 rounded-xl px-4 py-3">
                  <span className="text-[#7ec8a4] font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('setsubun_cta_heading')}</p>
            <p className="text-white/70 text-sm mb-6">
              {g('setsubun_cta_text').split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/onsenji/events/setsubun/apply"
                className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
                {t('applyCta')}
              </Link>
              <Link href="/onsenji/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                {t('contactCta')}
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/onsenji/events/yakushiko"
              className="flex-1 text-center py-3 border border-onsenji/20 rounded-xl text-sm text-onsenji hover:bg-onsenji hover:text-white transition-colors">
              {t('quickYakushiko')}
            </Link>
            <Link href="/onsenji/events"
              className="flex-1 text-center py-3 border border-onsenji/20 rounded-xl text-sm text-onsenji hover:bg-onsenji hover:text-white transition-colors">
              {t('quickEvents')}
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
