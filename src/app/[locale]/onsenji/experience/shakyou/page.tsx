export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiShakyou' })
  return { title: `${t('title')} | 日光山温泉寺` }
}

const DEFAULT_ITEMS = [
  { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
  { text: '汚れてもよい服装でお越しいただくとより安心です。' },
  { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
]
const DEFAULT_ITEMS_EN = [
  { text: 'Brushes, inkstones, and sutra templates are all provided. Please come empty-handed.' },
  { text: "It's reassuring to wear clothing you don't mind getting ink on." },
  { text: "Don't worry about making mistakes — our staff will guide you carefully." },
]

const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: '筆・硯・お経の手本をご用意します。すべて貸し出しですので手ぶらでお越しください。' },
  { title: 'お写しいただきます', text: 'お経の手本に沿って、一文字一文字丁寧にお写しください。係の者がご説明いたします。' },
  { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
  { title: 'Preparing Materials', text: 'Brush, inkstone, and a sutra template are provided — all on loan, so please come empty-handed.' },
  { title: 'Copying the Sutra', text: 'Following the template, carefully copy each character one by one. Our staff will guide you.' },
  { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a special goshuin stamp.' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_shakyou_subtitle: '心を静め、お経の文字を丁寧にお写しいただきます',
  onsenji_shakyou_subtitle_en: 'Quiet your mind and carefully copy the characters of the sutra',
  onsenji_shakyou_heading_about: '写経とは',
  onsenji_shakyou_heading_about_en: 'What is Shakyou?',
  onsenji_shakyou_about_p1: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。',
  onsenji_shakyou_about_p1_en: 'Shakyou is a practice of carefully copying the characters of a sutra, one by one. Writing is said to clear the mind of distraction, purify the heart, and form a bond with the Buddha.',
  onsenji_shakyou_about_p2: '温泉寺では薬師如来に縁の深いお経をお写しいただきます。体験後は特別御朱印をお授けします。毎日開催していますので、参拝の際にお気軽にお申し付けください。',
  onsenji_shakyou_about_p2_en: 'At Onsenji, you will copy a sutra closely connected to Yakushi Nyorai. A special goshuin stamp is given after the experience. It is held daily, so please feel free to ask during your visit.',
  onsenji_shakyou_heading_contents: '体験内容',
  onsenji_shakyou_heading_contents_en: 'Experience Details',
  onsenji_shakyou_content_title: '薬師経',
  onsenji_shakyou_content_title_en: 'The Yakushi Sutra',
  onsenji_shakyou_content_desc: 'ご本尊・薬師如来に縁の深い薬師経をお写しいただきます。お写しいただいた方には特別御朱印をお授けします。',
  onsenji_shakyou_content_desc_en: 'You will copy the Yakushi Sutra, closely connected to the principal image, Yakushi Nyorai. Those who complete it receive a special goshuin stamp.',
  onsenji_shakyou_heading_fees: '料金・所要時間',
  onsenji_shakyou_heading_fees_en: 'Fee & Duration',
  onsenji_shakyou_fee:  '1,000円（特別御朱印授与込み）',
  onsenji_shakyou_fee_en: '¥1,000 (includes special goshuin stamp)',
  onsenji_shakyou_time: '約15分',
  onsenji_shakyou_time_en: 'Approx. 15 minutes',
  onsenji_shakyou_target: 'どなたでも（筆が初めての方も歓迎）',
  onsenji_shakyou_target_en: 'Anyone welcome (first-time brush users too)',
  onsenji_shakyou_place: '寺務所 体験受付窓口',
  onsenji_shakyou_place_en: 'Temple Office Experience Counter',
  onsenji_shakyou_hours: '拝観時間内（閉門1時間前まで）',
  onsenji_shakyou_hours_en: 'During visiting hours (until 1 hour before closing)',
  onsenji_shakyou_heading_flow: '体験の流れ',
  onsenji_shakyou_heading_flow_en: 'Experience Flow',
  onsenji_shakyou_heading_items: '持ち物・服装',
  onsenji_shakyou_heading_items_en: 'What to Bring & Wear',
  onsenji_shakyou_cta_heading: '写経体験のご予約・お問い合わせ',
  onsenji_shakyou_cta_heading_en: 'Reservations & Inquiries for the Sutra Copying Experience',
  onsenji_shakyou_cta_sub: '予約不要・毎日実施。参拝受付時にお申し付けください。',
  onsenji_shakyou_cta_sub_en: 'No reservation needed — held daily. Please ask at reception during your visit.',
  onsenji_shakyou_items: JSON.stringify(DEFAULT_ITEMS),
  onsenji_shakyou_items_en: JSON.stringify(DEFAULT_ITEMS_EN),
  onsenji_shakyou_flow: JSON.stringify(DEFAULT_FLOW),
  onsenji_shakyou_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
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

export default async function OnsenjShakyouPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiShakyou')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const items = pj<typeof DEFAULT_ITEMS>(g('onsenji_shakyou_items'), DEFAULT_ITEMS)
  const flow  = pj<typeof DEFAULT_FLOW>(g('onsenji_shakyou_flow'), DEFAULT_FLOW)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}
          </div>
        </div>
        <section className="relative h-64 md:h-80">
          <Image src="/images/syakyou-hiro.png" alt={t('title')} fill priority className="object-cover object-top" />
          <div className="absolute inset-0 bg-onsenji/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3">Shakyou</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/60 text-sm mt-3">{g('onsenji_shakyou_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shakyou_heading_about')}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{g('onsenji_shakyou_about_p1')}</p>
              <p className="mt-3">{g('onsenji_shakyou_about_p2')}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsen-kyousitu.png" alt="写経体験の本堂" fill className="object-cover" />
              </div>
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsensyakyou.png" alt="写経体験の会場" fill className="object-cover" />
              </div>
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsen-syakyou1.png" alt="写経をお書きいただく様子" fill className="object-cover" />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shakyou_heading_contents')}</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border-t-4 border-[#7ec8a4] max-w-md mx-auto">
              <div className="grid grid-cols-2">
                <div>
                  <div className="relative h-56 bg-cream-alt">
                    <ZoomableImage src="/images/onsen-syakyou.png" alt="薬師経 写経用紙" fill className="object-contain p-2" />
                  </div>
                  <p className="text-center text-[11px] text-gray-400 py-1.5">写経用紙</p>
                </div>
                <div className="border-l border-gray-100">
                  <div className="relative h-56 bg-cream-alt">
                    <ZoomableImage src="/images/onsenji-goshuin-shakyou.png" alt="薬師経の特別御朱印" fill className="object-contain p-2" />
                  </div>
                  <p className="text-center text-[11px] text-gray-400 py-1.5">薬師経の特別御朱印</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-onsenji mb-2">{g('onsenji_shakyou_content_title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{g('onsenji_shakyou_content_desc')}</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shakyou_heading_fees')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('onsenji_shakyou_fee')],
                    [t('tableTime'), g('onsenji_shakyou_time')],
                    [t('tableTarget'), g('onsenji_shakyou_target')],
                    [t('tablePlace'), g('onsenji_shakyou_place')],
                    [t('tableHours'), g('onsenji_shakyou_hours')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-onsenji text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shakyou_heading_flow')}</h2>
            <ol className="relative border-l-2 border-[#7ec8a4]/40 ml-5 space-y-8">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-8 relative">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-onsenji flex items-center justify-center shadow-md">
                    <span className="text-[#7ec8a4] text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-serif text-onsenji text-base mb-1">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shakyou_heading_items')}</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-[#7ec8a4]">{text}</li>
              ))}
            </ul>
          </section>
          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('onsenji_shakyou_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('onsenji_shakyou_cta_sub')}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              {t('contactCta')}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/onsenji/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-onsenji group-hover:text-white">{t('quickShabutu')}</span>
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
