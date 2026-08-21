export const dynamic = 'force-dynamic'

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
  const t = await getTranslations({ locale, namespace: 'kannonko' })
  return {
    title: `${t('title')}（6月18日） | 日光山中禅寺 立木観音`,
    description: '毎年6月18日開催。観音講・大護摩供・地蔵流しのご案内。午前10時より執り行います。',
  }
}

const DEFAULT_SCHEDULE = [
  { time: '10:00', title: '観音講（法要）', desc: '18日は観音様の縁日です。大慈大悲の観音様の慈悲にすがり、日光の観音浄土といわれますここ中禅寺におきまして、ご参列頂きました皆様のご先祖様のご供養を執り行います。' },
  { time: '11:15', title: '波之利大黒天 大護摩供', desc: '波之利大黒天の大護摩供を厳修いたします。家内安全・商売繁盛・交通安全・湖上安全・開運・厄除け・安産など、皆様の願いをご祈願いたします。' },
  { time: '午後', title: '地蔵流し', desc: '遊覧船に乗り、中禅寺湖上にて「地蔵流し」を行います。「地蔵流し」とは、お地蔵様の絵姿のある御札を１枚ずつ湖に投じて、ご先祖様の冥福を祈る、大変珍しい行事です。' },
]
const DEFAULT_SCHEDULE_EN = [
  { time: '10:00', title: 'Kannon-ko (Ceremony)', desc: 'The 18th is Kannon\'s sacred day. Calling upon the great compassion of Kannon, we perform memorial rites for the ancestors of all who attend, here at Chuzenji, said to be Nikko\'s pure land of Kannon.' },
  { time: '11:15', title: 'Hashiri-Daikokuten Grand Goma Ritual', desc: 'A grand goma fire ritual is solemnly held for Hashiri-Daikokuten. We pray for the wishes of all who attend — household safety, business prosperity, traffic safety, safety on the lake, good fortune, protection from misfortune, and safe childbirth.' },
  { time: 'Afternoon', title: 'Jizo-nagashi (Jizo Release)', desc: 'We board a sightseeing boat and perform "Jizo-nagashi" on Lake Chuzenji. In this rare and unique ceremony, ofuda bearing the image of Jizo are cast into the lake one by one, praying for the repose of ancestors.' },
]

const DEFAULT_NOTES = [
  { text: '事前のお申し込みが必要です。ご希望の方は申し込みフォームよりお申し込みください。' },
  { text: '動きやすい服装でお越しください。中禅寺湖周辺は天候が変わりやすいため、羽織るものをお持ちいただくことをお勧めします。' },
  { text: 'お支払いは当日・現地にてお受けいたします。' },
  { text: '詳細・変更がある場合は当サイトにてお知らせいたします。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'Advance application is required. Please apply via the application form if you wish to attend.' },
  { text: 'Please wear comfortable, easy-to-move-in clothing. Weather around Lake Chuzenji can change quickly, so we recommend bringing something to layer on top.' },
  { text: 'Payment is accepted on the day, on site.' },
  { text: 'Any details or changes will be announced on this website.' },
]

const DEFAULTS: Record<string, string> = {
  kannonko_subtitle: '毎年6月18日　午前10時より',
  kannonko_subtitle_en: 'Held every year on June 18th, from 10:00 AM.',
  kannonko_heading_about: '行事について',
  kannonko_heading_about_en: 'About the Event',
  kannonko_about: '毎年6月18日、日光山中禅寺 立木観音では、ご信徒・一般参拝者の皆様をお迎えして年に一度の大法要を執り行います。観音講・大護摩供・地蔵流しと三つの行事が続き、中禅寺湖の豊かな自然のなかで千二百余年の祈りが受け継がれます。',
  kannonko_about_en: 'Every year on June 18th, Chuzenji Tachiki Kannon welcomes devotees and visitors for its once-a-year grand ceremony. Three rites follow in succession — Kannon-ko, the Grand Goma Ritual, and Jizo-nagashi — carrying on twelve hundred years of prayer amid the rich nature of Lake Chuzenji.',
  kannonko_info_date: '6月18日（毎年）',
  kannonko_info_date_en: 'June 18th (annually)',
  kannonko_info_time: '午前10時〜',
  kannonko_info_time_en: 'From 10:00 AM',
  kannonko_info_join: '申込者のみ',
  kannonko_info_join_en: 'Advance application required',
  kannonko_heading_schedule: 'タイムスケジュール',
  kannonko_heading_schedule_en: 'Schedule',
  kannonko_heading_gallery: '行事の様子',
  kannonko_heading_gallery_en: 'Photos from the Event',
  kannonko_heading_notes: 'ご参列にあたって',
  kannonko_heading_notes_en: 'Notes for Attendees',
  kannonko_cta_heading: '御札のお申し込み',
  kannonko_cta_heading_en: 'Ofuda Talisman Application',
  kannonko_cta_text: '大護摩供にて祈願する御札をご希望の方は\n事前に申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。',
  kannonko_cta_text_en: 'If you would like an ofuda talisman prayed over in the grand goma fire ritual,\nplease apply in advance via the application form.\nPayment is accepted on the day, on site.',
  kannonko_schedule: JSON.stringify(DEFAULT_SCHEDULE),
  kannonko_schedule_en: JSON.stringify(DEFAULT_SCHEDULE_EN),
  kannonko_notes: JSON.stringify(DEFAULT_NOTES),
  kannonko_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
}

const GALLERY_IMAGES = [
  '/images/chuzenji/events/kannonko/1.kannonkou.JPEG',
  '/images/chuzenji/events/kannonko/2.kannonkou.JPEG',
  '/images/chuzenji/events/kannonko/3.kannonkou.JPEG',
  '/images/chuzenji/events/kannonko/4.kannonkou.JPEG',
  '/images/chuzenji/events/kannonko/kannonkou-5.JPEG',
  '/images/chuzenji/events/kannonko/kannonkou-6.JPEG',
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

export default async function KannonkoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('kannonko')
  const tc = await getTranslations('common')
  const tAE = await getTranslations('annualEvents')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const schedule = pj<typeof DEFAULT_SCHEDULE>(g('kannonko_schedule'), DEFAULT_SCHEDULE)
  const notes    = pj<typeof DEFAULT_NOTES>(g('kannonko_notes'), DEFAULT_NOTES)

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
          <ZoomableImage src="/images/chuzenji/events/gyouji.JPEG" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-2">{t('eraLabel')}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-3">{g('kannonko_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('kannonko_heading_about')}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{g('kannonko_about')}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t('infoDate'), value: g('kannonko_info_date') },
                { label: t('infoTime'), value: g('kannonko_info_time') },
                { label: t('infoJoin'), value: g('kannonko_info_join') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cream-alt rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-navy">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('kannonko_heading_schedule')}</h2>
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

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('kannonko_heading_gallery')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY_IMAGES.map((src, i) => (
                <div key={src} className="relative h-40 md:h-52 rounded-xl overflow-hidden shadow-sm">
                  <ZoomableImage src={src} alt={`観音講・大護摩供・地蔵流しの様子 ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('kannonko_heading_notes')}</h2>
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
            <p className="font-serif text-xl mb-2">{g('kannonko_cta_heading')}</p>
            <p className="text-white/70 text-sm mb-6">
              {g('kannonko_cta_text').split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/kannonko/apply"
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
            <Link href="/annual-events/funazento"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              {t('quickFunazento')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
