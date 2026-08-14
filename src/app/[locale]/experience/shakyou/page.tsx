export const dynamic = 'force-dynamic'

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
  const t = await getTranslations({ locale, namespace: 'shakyou' })
  return { title: t('title') }
}

const DEFAULT_CONTENTS = [
  { icon: '📜', title: '延命十句観音経', desc: '観音様のお力を借り、長寿・安全を祈るお経。十六文字を丁寧にお写しいただきます。' },
  { icon: '✍️', title: '懺悔文', desc: '過去の罪業を懺悔し、心を清めるお経。金紙特別御朱印（大日如来）とセットです。' },
]
const DEFAULT_CONTENTS_EN = [
  { icon: '📜', title: 'Enmei Jikku Kannon Sutra', desc: 'A sutra invoking Kannon\'s power to pray for longevity and safety. You will carefully copy its 16 characters.' },
  { icon: '✍️', title: 'Repentance Sutra', desc: 'A sutra to repent past wrongdoing and purify the heart, paired with a gold-paper special goshuin (Dainichi Nyorai).' },
]
const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所体験窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: '写経用紙の入ったクリアファイルと筆をご用意しますので、お教室にそのままお持ちください。' },
  { title: '体験', text: '一文字一文字丁寧に、薄墨になっているところをお書入れください。' },
  { title: '特別朱印のお授け', text: '体験終了後、三宝（木の台）に写経を収め、クリアファイルと筆を寺務所にお返しください。引き換えに御朱印をお授けします。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception', text: 'Please apply at the Temple Office experience counter and pay the experience fee.' },
  { title: 'Preparing Materials', text: 'A clear folder with a sutra sheet and a brush will be prepared — please bring them as is to the copying room.' },
  { title: 'Copying', text: 'Carefully trace over the light-gray printed characters, one by one.' },
  { title: 'Receiving the Special Goshuin', text: 'After finishing, place your sutra on the wooden offering stand and return the clear folder and brush to the Temple Office. You will receive a goshuin stamp in exchange.' },
]
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
const GOSHUIN_IMAGES = [
  { src: '/images/chuzenji/goshuin/goshuin-enmei.png', w: 772, h: 1200 },
  { src: '/images/chuzenji/goshuin/goshuin-sangemon.png', w: 742, h: 1192 },
]
const CONTENT_IMAGES = ['/images/chuzenji/experience/shakyou/enmeijyuku.jpg', '/images/chuzenji/experience/shakyou/sanngemon.jpg']

const DEFAULTS: Record<string, string> = {
  shakyou_subtitle: '心を静め、お経の文字を丁寧にお写しいただきます',
  shakyou_subtitle_en: 'Quiet your mind and carefully copy the characters of the sutra',
  shakyou_heading_about: '写経とは',
  shakyou_heading_about_en: 'What is Shakyou?',
  shakyou_about_p1: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。',
  shakyou_about_p1_en: 'Shakyou is a practice of carefully copying the characters of a sutra, one by one. Writing is said to clear the mind of distraction, purify the heart, and form a bond with the Buddha.',
  shakyou_about_p2: '立木観音では、十六文字のお経（延命十句観音経・懺悔文）をお写しいただきます。短いお経のため、筆を持ったことのない方でも約15分でお写しいただけます。',
  shakyou_about_p2_en: 'At Tachiki Kannon, you will copy a 16-character sutra (either the Enmei Jikku Kannon Sutra or the Repentance Sutra). Because it is short, even those who have never held a brush can complete it in about 15 minutes.',
  shakyou_heading_contents: '体験内容',
  shakyou_heading_contents_en: 'Experience Details',
  shakyou_heading_flow: '体験の流れ',
  shakyou_heading_flow_en: 'Experience Flow',
  shakyou_heading_fees: '料金・所要時間',
  shakyou_heading_fees_en: 'Fee & Duration',
  shakyou_fee:  '1,000円（特別御朱印込み）',
  shakyou_fee_en: '¥1,000 (includes special goshuin stamp)',
  shakyou_time: '約15分',
  shakyou_time_en: 'Approx. 15 minutes',
  shakyou_target: 'どなたでも（筆が初めての方も歓迎）',
  shakyou_target_en: 'Anyone welcome (first-time brush users too)',
  shakyou_place:  '寺務所 体験受付窓口',
  shakyou_place_en: 'Temple Office Experience Counter',
  shakyou_hours:  '拝観時間内（閉門1時間前まで）',
  shakyou_hours_en: 'During visiting hours (until 1 hour before closing)',
  shakyou_goshuin_note: '※特別御朱印は体験料に含まれています。別途購入はできません。',
  shakyou_goshuin_note_en: '*The special goshuin is included in the experience fee and cannot be purchased separately.',
  shakyou_heading_items: '持ち物・服装',
  shakyou_heading_items_en: 'What to Bring & Wear',
  shakyou_cta_heading: '写経体験のご予約',
  shakyou_cta_heading_en: 'Reservations for the Sutra Copying Experience',
  shakyou_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  shakyou_cta_sub_en: 'Advance reservation is recommended. Same-day reception is also available if space permits.',
  shakyou_contents: JSON.stringify(DEFAULT_CONTENTS),
  shakyou_contents_en: JSON.stringify(DEFAULT_CONTENTS_EN),
  shakyou_flow: JSON.stringify(DEFAULT_FLOW),
  shakyou_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
  shakyou_items: JSON.stringify(DEFAULT_ITEMS),
  shakyou_items_en: JSON.stringify(DEFAULT_ITEMS_EN),
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

export default async function ShakyouPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('shakyou')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const contents = pj<typeof DEFAULT_CONTENTS>(g('shakyou_contents'), DEFAULT_CONTENTS)
  const flowRaw  = pj<{ title: string; text: string }[]>(g('shakyou_flow'), DEFAULT_FLOW)
  const flowDefault = loc === 'en' ? DEFAULT_FLOW_EN : DEFAULT_FLOW
  const flow     = flowRaw.map((f, i) => ({ ...flowDefault[i], ...f }))
  const items    = pj<typeof DEFAULT_ITEMS>(g('shakyou_items'), DEFAULT_ITEMS)

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
          <Image src="/images/common/syakyou-hiro.png" alt={t('title')} fill priority className="object-cover object-top" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Shakyou</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/60 text-sm mt-3">{g('shakyou_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shakyou_heading_about')}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{g('shakyou_about_p1')}</p>
              <p className="mt-3">{g('shakyou_about_p2')}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/chuzenji/experience/shakyou/shakyou-room.jpg" alt="写経体験の会場" fill className="object-cover" />
              </div>
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/chuzenji/experience/shakyou/shakyou-altar.jpg" alt="写経体験の御本尊" fill className="object-cover" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shakyou_heading_contents')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {contents.map(({ title, desc }, i) => {
                const gimg = GOSHUIN_IMAGES[i] ?? GOSHUIN_IMAGES[0]
                return (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border-t-4 border-gold">
                    <div className="grid grid-cols-2">
                      <div>
                        <div className="relative h-56 bg-cream-alt">
                          <ZoomableImage src={CONTENT_IMAGES[i] ?? CONTENT_IMAGES[0]} alt={title} fill className="object-contain p-2" />
                        </div>
                        <p className="text-center text-[11px] text-gray-400 py-1.5">{t('sheetLabel')}</p>
                      </div>
                      <div className="border-l border-gray-100">
                        <div className="relative h-56 bg-cream-alt">
                          <ZoomableImage src={gimg.src} alt={`${title}${t('goshuinLabelSuffix')}`} fill className="object-contain p-2" />
                        </div>
                        <p className="text-center text-[11px] text-gray-400 py-1.5">{title}{t('goshuinLabelSuffix')}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-medium text-navy mb-2">{title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4">{g('shakyou_goshuin_note')}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shakyou_heading_fees')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('shakyou_fee')],
                    [t('tableTime'), g('shakyou_time')],
                    [t('tableTarget'), g('shakyou_target')],
                    [t('tablePlace'), g('shakyou_place')],
                    [t('tableHours'), g('shakyou_hours')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shakyou_heading_flow')}</h2>
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
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shakyou_heading_items')}</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('shakyou_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('shakyou_cta_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">{t('reserveCta')}</Link>
              <Link href="/contact" className="btn-outline">{t('contactCta')}</Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickShabutu')}</span>
            </Link>
            <Link href="/experience/jyuzu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📿</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickJyuzu')}</span>
            </Link>
            <Link href="/experience/zazen" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🧘</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickZazen')}</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
