export const revalidate = 60

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'zazen' })
  return { title: t('title') }
}

const DEFAULT_FLOW = [
  { title: '受付', text: '本堂体験受付窓口にてお申し込みください。体験料をお納めいただきます。\n本堂、五大堂お参りの後、座禅体験となります（会場は五大堂、お座の間）' },
  { title: '作法のご説明', text: '姿勢の整え方・呼吸法など、坐禅の基本作法を僧侶が丁寧にご説明します。' },
  { title: '坐禅', text: '静寂の中、20分間坐禅を行います。' },
  { title: '終了・退堂', text: '終了の合図とともに、静かに退堂いたします。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception', text: 'Please apply at the Main Hall experience reception counter and pay the experience fee.\nAfter visiting the Main Hall and Godaido Hall, the zazen session begins (held in the Oza-no-ma room of Godaido Hall).' },
  { title: 'Guidance on Form', text: 'A priest will carefully explain the basic posture and breathing method of zazen.' },
  { title: 'Zazen', text: 'Sit in silent meditation for 20 minutes.' },
  { title: 'Closing', text: 'At the closing signal, quietly leave the hall.' },
]
const DEFAULT_ITEMS = [
  { text: '動きやすい服装でお越しください（きつい服装は避けてください）。' },
  { text: '携帯電話の電源はお切りいただくか、マナーモードにしてください。' },
  { text: '正座・あぐらでの着座が難しい方は椅子坐禅にも対応しますので、受付にご相談ください。' },
]
const DEFAULT_ITEMS_EN = [
  { text: 'Please wear comfortable, loose-fitting clothing.' },
  { text: 'Please turn off your phone or set it to silent mode.' },
  { text: 'If sitting on the floor is difficult, chair-based zazen is also available — please ask at reception.' },
]

const DEFAULTS: Record<string, string> = {
  zazen_subtitle: '静寂の中で心を調える、坐禅のひとときをお過ごしください',
  zazen_subtitle_en: 'Settle your mind in stillness with a moment of zazen meditation',
  zazen_heading_about: '坐禅とは',
  zazen_heading_about_en: 'What is Zazen?',
  zazen_about_p1: '坐禅とは、静かに座り呼吸を整えながら心を調える、伝統的な修行法です。姿勢と呼吸を整えることで、日々の雑念から離れ、静かなひとときを過ごすことができます。',
  zazen_about_p1_en: 'Zazen is a traditional Zen practice of sitting quietly while regulating your breath and settling your mind. By steadying your posture and breathing, you can step away from daily distractions and spend a quiet moment.',
  zazen_about_p2: '中禅寺の坐禅体験では、初めての方にも僧侶が丁寧に作法をご指導しますので、どなたでも安心してご参加いただけます。',
  zazen_about_p2_en: 'In Tachiki Kannon\'s zazen experience, a priest carefully guides first-time visitors through the proper form, so anyone can join with confidence.',
  zazen_heading_fees: '料金・所要時間',
  zazen_heading_fees_en: 'Fee & Duration',
  zazen_fee: '2,000円',
  zazen_fee_en: '¥2,000',
  zazen_time: '30~40分',
  zazen_time_en: '30~40 minutes',
  zazen_target: '小学生以上（小学生は保護者同伴）',
  zazen_target_en: 'Elementary school age and up (children must be accompanied by a guardian)',
  zazen_capacity: '2〜10名',
  zazen_capacity_en: '2–10 people',
  zazen_place: '本堂 体験受付窓口',
  zazen_place_en: 'Main Hall Experience Counter',
  zazen_hours_peak: '4月〜10月：13:00〜14:00',
  zazen_hours_peak_en: 'April–October: 1:00 PM–2:00 PM',
  zazen_hours_shoulder: '3月・11月：13:00〜14:00',
  zazen_hours_shoulder_en: 'March & November: 1:00 PM–2:00 PM',
  zazen_hours_winter: '12月〜2月：13:00',
  zazen_hours_winter_en: 'December–February: 1:00 PM',
  zazen_heading_flow: '体験の流れ',
  zazen_heading_flow_en: 'Experience Flow',
  zazen_heading_items: 'ご注意・持ち物',
  zazen_heading_items_en: 'Notes & What to Bring',
  zazen_heading_gallery: '坐禅体験の様子',
  zazen_heading_gallery_en: 'Scenes from the Zazen Experience',
  zazen_cta_heading: '坐禅体験のご予約',
  zazen_cta_heading_en: 'Reservations for the Zazen Experience',
  zazen_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  zazen_cta_sub_en: 'Advance reservation is recommended. Same-day reception is also available if space permits.',
  zazen_flow: JSON.stringify(DEFAULT_FLOW),
  zazen_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
  zazen_items: JSON.stringify(DEFAULT_ITEMS),
  zazen_items_en: JSON.stringify(DEFAULT_ITEMS_EN),
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

export default async function ZazenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('zazen')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const flow  = pj<typeof DEFAULT_FLOW>(g('zazen_flow'), DEFAULT_FLOW)
  const items = pj<typeof DEFAULT_ITEMS>(g('zazen_items'), DEFAULT_ITEMS)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/reserve">{t('breadcrumbReserve')}</Link> &gt; {t('title')}
          </div>
        </div>

        <section className="relative h-64 md:h-80">
          <Image src="/images/chuzenji/experience/zazen/zazen-hero-abstract-v2.png" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Zazen</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/60 text-sm mt-3">{g('zazen_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('zazen_heading_about')}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{g('zazen_about_p1')}</p>
              <p className="mt-3">{g('zazen_about_p2')}</p>
            </div>
            <div className="relative h-56 sm:h-72 rounded-xl overflow-hidden shadow-sm mt-4">
              <ZoomableImage src="/images/zazen(2).png" alt={t('title')} fill className="object-cover" />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('zazen_heading_fees')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('zazen_fee')],
                    [t('tableTime'), g('zazen_time')],
                    [t('tableTarget'), g('zazen_target')],
                    [t('tableCapacity'), g('zazen_capacity')],
                    [t('tablePlace'), g('zazen_place')],
                    [t('tableHours'), `${g('zazen_hours_peak')}\n${g('zazen_hours_shoulder')}\n${g('zazen_hours_winter')}`],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap align-top">{k}</th>
                      <td className="px-4 py-3 bg-white whitespace-pre-line">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('zazen_heading_flow')}</h2>
            <ol className="relative border-l-2 border-gold ml-4 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('zazen_heading_items')}</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('zazen_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('zazen_cta_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve?type=zazen" className="btn-gold">{t('reserveCta')}</Link>
              <Link href="/contact" className="btn-outline">{t('contactCta')}</Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickShakyou')}</span>
            </Link>
            <Link href="/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickShabutu')}</span>
            </Link>
            <Link href="/experience/jyuzu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📿</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickJyuzu')}</span>
            </Link>
          </div>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('zazen_heading_gallery')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                '/images/chuzenji/experience/zazen/zazen (3).jpg',
                '/images/chuzenji/experience/zazen/zazen (4).jpg',
              ].map((src) => (
                <div key={src} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                  <ZoomableImage src={src} alt={t('title')} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
