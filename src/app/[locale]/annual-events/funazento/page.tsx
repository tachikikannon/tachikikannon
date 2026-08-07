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
  const t = await getTranslations({ locale, namespace: 'funazento' })
  return {
    title: `${t('title')}（8月4日） | 日光山中禅寺 立木観音`,
    description: '毎年8月4日開催。日光開山 勝道上人の霊跡を船で巡拝する伝統行事「船禅頂（ふなぜんじょう）」のご案内。事前申し込み必要。',
  }
}

const DEFAULT_NOTES = [
  { text: '事前の申し込みが必要です。定員になり次第締め切りますので、お早めにお申し込みください。' },
  { text: '御札をお授けいたします。お支払いは当日・現地にてお受けいたします。' },
  { text: '動きやすく濡れても構わない服装でお越しください。湖上は気温が低い場合がありますので、上に羽織るものをご持参ください。' },
  { text: '天候・状況により内容が変更・中止となる場合がございます。詳細はお電話にてご確認ください。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'Advance application is required. Applications close once capacity is reached, so please apply early.' },
  { text: 'You will receive an ofuda talisman. Payment is accepted on the day, on site.' },
  { text: 'Please wear clothing you can move in easily and that can get wet. Temperatures on the lake can be cool, so please bring something to layer on top.' },
  { text: 'Content may change or be cancelled depending on weather and conditions. Please call for details.' },
]

const DEFAULTS: Record<string, string> = {
  funazento_subtitle: '毎年8月4日　午前10時より　※事前申し込み必要',
  funazento_subtitle_en: 'Held every year on August 4th, from 10:00 AM. *Advance application required.',
  funazento_heading_about: '行事について',
  funazento_heading_about_en: 'About the Event',
  funazento_about: '船禅頂（ふなぜんじょう）は、日光山を開いた勝道上人（737〜817）が中禅寺湖を舟で渡り、湖上から霊峰・男体山を遙拝したという故事に由来する伝統行事です。毎年8月4日、中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。',
  funazento_about_en: 'Funazenjyo is a traditional ceremony originating from the story of Shodo Shonin (737–817), who founded Nikkozan, crossing Lake Chuzenji by boat and worshipping the sacred Mount Nantai from the water. Every year on August 4th, we retrace by boat the ascetic path he opened, set against Lake Chuzenji. Viewing Mount Nantai and Chuzenji from the lake is a special experience, evoking twelve hundred years of history.',
  funazento_info_date: '8月4日（毎年）',
  funazento_info_date_en: 'August 4th (annually)',
  funazento_info_time: '午前10時〜',
  funazento_info_time_en: 'From 10:00 AM',
  funazento_info_join: '事前申し込み必要',
  funazento_info_join_en: 'Advance application required',
  funazento_heading_map: '船禅頂ルール・ルート図',
  funazento_heading_map_en: 'Funazenjyo Rules & Route Map',
  funazento_heading_gallery: '行事の様子',
  funazento_heading_gallery_en: 'Photos from the Event',
  funazento_heading_notes: 'ご参加にあたって',
  funazento_heading_notes_en: 'Notes for Participants',
  funazento_cta_heading: '船禅頂 お申し込み',
  funazento_cta_heading_en: 'Funazenjyo Application',
  funazento_cta_text: '定員になり次第締め切ります。\n御札授与あり・お支払いは当日現地にて。',
  funazento_cta_text_en: 'Applications close once capacity is reached.\nAn ofuda talisman is included — payment is accepted on the day, on site.',
  funazento_notes: JSON.stringify(DEFAULT_NOTES),
  funazento_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
}

const GALLERY_IMAGES = [
  '/images/船禅頂/hunazenjyou-1.png',
  '/images/船禅頂/hunazenjyou-2.JPEG',
  '/images/船禅頂/hunazenjyou-3.JPEG',
  '/images/船禅頂/hunazenjyou-4.JPEG',
  '/images/船禅頂/hunazenjyou-5.png',
  '/images/船禅頂/hunazenjyou-6.JPEG',
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

export default async function FunazentoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('funazento')
  const tc = await getTranslations('common')
  const tAE = await getTranslations('annualEvents')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const notes = pj<typeof DEFAULT_NOTES>(g('funazento_notes'), DEFAULT_NOTES)

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
          <ZoomableImage src="/images/mizuumi.jpg" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-2">{t('eraLabel')}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/80 text-base mt-1 font-serif">{t('reading')}</p>
            <p className="text-white/70 text-sm mt-3">{g('funazento_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('funazento_heading_about')}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{g('funazento_about')}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t('infoDate'), value: g('funazento_info_date') },
                { label: t('infoTime'), value: g('funazento_info_time') },
                { label: t('infoJoin'), value: g('funazento_info_join') },
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
              <h2 className="font-serif text-2xl text-navy">{g('funazento_heading_map')}</h2>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white" style={{ aspectRatio: '842 / 595' }}>
              <ZoomableImage src="/images/hunazenjyo-ruto.png" alt={g('funazento_heading_map')} fill className="object-contain" />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('funazento_heading_gallery')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY_IMAGES.map((src, i) => (
                <div key={src} className="relative h-40 md:h-52 rounded-xl overflow-hidden shadow-sm">
                  <ZoomableImage src={src} alt={`船禅頂の様子 ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{g('funazento_heading_notes')}</h2>
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
            <p className="font-serif text-xl mb-2">{g('funazento_cta_heading')}</p>
            <p className="text-white/70 text-sm mb-6">
              {g('funazento_cta_text').split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/funazento/apply"
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
            <Link href="/annual-events/kannonko"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              {t('quickKannonko')}
            </Link>
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
