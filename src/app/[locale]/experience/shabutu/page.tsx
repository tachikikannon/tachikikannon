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
  const t = await getTranslations({ locale, namespace: 'shabutu' })
  return { title: t('title') }
}

const DEFAULT_CONTENTS = [
  { title: '立木観世音菩薩', desc: '下絵に沿って、立木観音のご本尊・立木観世音菩薩のお姿をお描きいただきます。完成後は銀紙特別朱印（立木観世音）とセットでお授けします。' },
]
const DEFAULT_CONTENTS_EN = [
  { title: 'Tachiki Kanzeon Bodhisattva', desc: 'Following the template, you will trace the figure of the principal image, Tachiki Kanzeon Bodhisattva. A silver-paper special stamp (Tachiki Kanzeon) is given together upon completion.' },
]
const CONTENT_IMAGES = ['/images/chuzenji/experience/shabutu/shabutu-template.jpg']
const GOSHUIN_IMAGES = ['/images/chuzenji/experience/shabutu/goshuin-shabutu.jpg']
const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: 'すべて貸し出しですので手ぶらでお越しいただけます。' },
  { title: 'お描きいただきます', text: '下絵に沿って、立木観世音菩薩のお姿をゆっくりお描きください。係の者がご説明いたします。' },
  { title: '特別御朱印のお授け', text: '完成後、銀紙特別朱印（立木観世音）をお授けします。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
  { title: 'Preparing Materials', text: 'A template, brush, ink, and other materials are provided — all on loan, so you may come empty-handed.' },
  { title: 'Tracing the Image', text: 'Following the template, slowly trace the figure of Tachiki Kanzeon Bodhisattva. Our staff will guide you.' },
  { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a silver-paper special stamp (Tachiki Kanzeon).' },
]
const DEFAULT_ITEMS = [
  { text: '手ぶらでお越しください。' },
]
const DEFAULT_ITEMS_EN = [
  { text: 'Please come empty-handed.' },
]

const DEFAULTS: Record<string, string> = {
  shabutu_subtitle: '仏様のお姿を一筆一筆、心を込めてお描きいただきます',
  shabutu_subtitle_en: 'Trace the figure of the Buddha, stroke by stroke, with a mindful heart',
  shabutu_heading_about: '写仏とは',
  shabutu_heading_about_en: 'What is Shabutu?',
  shabutu_about_p1: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。',
  shabutu_about_p1_en: 'Shabutu is a practice of carefully tracing the figure of a Buddha following a template. Alongside sutra copying, it is one of the traditional Buddhist practices — as you draw, you receive the Buddha\'s merit and settle your mind.',
  shabutu_about_p2: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。',
  shabutu_about_p2_en: 'In Tachiki Kannon\'s shabutsu experience, you will trace the image of Tachiki Kanzeon Bodhisattva. Since you trace along a printed outline, anyone can enjoy it, even those who are not confident in their drawing.',
  shabutu_heading_contents: '体験内容',
  shabutu_heading_contents_en: 'Experience Details',
  shabutu_heading_fees: '料金・所要時間',
  shabutu_heading_fees_en: 'Fee & Duration',
  shabutu_fee:  '1,000円（特別御朱印込み）',
  shabutu_fee_en: '¥1,000 (includes special goshuin stamp)',
  shabutu_time: '約15〜20分（個人差があります）',
  shabutu_time_en: 'Approx. 15–20 minutes (varies by person)',
  shabutu_target: 'どなたでも（絵が苦手な方も歓迎）',
  shabutu_target_en: 'Anyone welcome (even if drawing is not your strength)',
  shabutu_place:  '寺務所 体験受付窓口',
  shabutu_place_en: 'Temple Office Experience Counter',
  shabutu_hours:  '拝観時間内（閉門1時間前まで）',
  shabutu_hours_en: 'During visiting hours (until 1 hour before closing)',
  shabutu_heading_flow: '体験の流れ',
  shabutu_heading_flow_en: 'Experience Flow',
  shabutu_goshuin_note: '※特別御朱印は体験料に含まれています。別途購入はできません。',
  shabutu_goshuin_note_en: '*The special goshuin is included in the experience fee and cannot be purchased separately.',
  shabutu_heading_items: '持ち物・服装',
  shabutu_heading_items_en: 'What to Bring & Wear',
  shabutu_cta_heading: '写仏体験のご予約',
  shabutu_cta_heading_en: 'Reservations for the Buddhist Image Tracing Experience',
  shabutu_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  shabutu_cta_sub_en: 'Advance reservation is recommended. Same-day reception is also available if space permits.',
  shabutu_contents: JSON.stringify(DEFAULT_CONTENTS),
  shabutu_contents_en: JSON.stringify(DEFAULT_CONTENTS_EN),
  shabutu_flow: JSON.stringify(DEFAULT_FLOW),
  shabutu_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
  shabutu_items: JSON.stringify(DEFAULT_ITEMS),
  shabutu_items_en: JSON.stringify(DEFAULT_ITEMS_EN),
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

export default async function ShabutuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('shabutu')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const contents = pj<typeof DEFAULT_CONTENTS>(g('shabutu_contents'), DEFAULT_CONTENTS)
  const flow  = pj<typeof DEFAULT_FLOW>(g('shabutu_flow'), DEFAULT_FLOW)
  const items = pj<typeof DEFAULT_ITEMS>(g('shabutu_items'), DEFAULT_ITEMS)

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
          <Image src="/images/common/syabutu-hiro.png" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Shabutu</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/60 text-sm mt-3">{g('shabutu_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shabutu_heading_about')}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{g('shabutu_about_p1')}</p>
              <p className="mt-3">{g('shabutu_about_p2')}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/chuzenji/experience/shakyou/shakyou-room.jpg" alt="写仏体験の会場" fill className="object-cover" />
              </div>
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/chuzenji/experience/shakyou/shakyou-altar.jpg" alt="写仏体験の御本尊" fill className="object-cover" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shabutu_heading_contents')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {contents.map(({ title, desc }, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border-t-4 border-gold max-w-[360px] mx-auto sm:max-w-none sm:mx-0">
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="relative h-56 bg-cream-alt">
                        <ZoomableImage src={CONTENT_IMAGES[i] ?? CONTENT_IMAGES[0]} alt={title} fill className="object-contain p-2" />
                      </div>
                      <p className="text-center text-[11px] text-gray-400 py-1.5">{t('sheetLabel')}</p>
                    </div>
                    <div className="border-l border-gray-100">
                      <div className="relative h-56 bg-cream-alt">
                        <ZoomableImage src={GOSHUIN_IMAGES[i] ?? GOSHUIN_IMAGES[0]} alt={`${title}${t('goshuinLabelSuffix')}`} fill className="object-contain p-2" />
                      </div>
                      <p className="text-center text-[11px] text-gray-400 py-1.5">{title}{t('goshuinLabelSuffix')}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-navy mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">{g('shabutu_goshuin_note')}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shabutu_heading_fees')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('shabutu_fee')],
                    [t('tableTime'), g('shabutu_time')],
                    [t('tableTarget'), g('shabutu_target')],
                    [t('tablePlace'), g('shabutu_place')],
                    [t('tableHours'), g('shabutu_hours')],
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
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shabutu_heading_flow')}</h2>
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
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('shabutu_heading_items')}</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('shabutu_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('shabutu_cta_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve?type=shabutu" className="btn-gold">{t('reserveCta')}</Link>
              <Link href="/contact" className="btn-outline">{t('contactCta')}</Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickShakyou')}</span>
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
