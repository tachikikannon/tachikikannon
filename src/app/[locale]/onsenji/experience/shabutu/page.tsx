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
  const t = await getTranslations({ locale, namespace: 'onsenjiShabutu' })
  return { title: `${t('title')} | 日光山温泉寺` }
}

const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
  { title: 'お描きいただきます', text: '下絵に沿って、薬師如来のお姿をゆっくりお描きください。係の者がご説明いたします。' },
  { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
  { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
  { title: 'Preparing Materials', text: 'A template, brush, ink, and other materials are provided — all on loan, so you may come empty-handed.' },
  { title: 'Tracing the Image', text: "Following the template, slowly trace the figure of Yakushi Nyorai. Our staff will guide you." },
  { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a special goshuin stamp.' },
  { title: 'Taking It Home', text: 'You may take your completed tracing home. Please display it with care.' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_shabutu_subtitle: '仏様のお姿を一筆一筆、心を込めてお描きいただきます',
  onsenji_shabutu_subtitle_en: 'Trace the figure of the Buddha, stroke by stroke, with a mindful heart',
  onsenji_shabutu_heading_about: '写仏とは',
  onsenji_shabutu_heading_about_en: 'What is Shabutu?',
  onsenji_shabutu_about_p1: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。',
  onsenji_shabutu_about_p1_en: 'Shabutu is a practice of carefully tracing the figure of a Buddha following a template. Alongside sutra copying, it is one of the traditional Buddhist practices — as you draw, you receive the Buddha\'s merit and settle your mind.',
  onsenji_shabutu_about_p2: '温泉寺の写仏体験では、ご本尊・薬師如来のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。',
  onsenji_shabutu_about_p2_en: 'In Onsenji\'s Buddhist image tracing experience, you will trace the figure of the principal image, Yakushi Nyorai. You may take your completed tracing home as a keepsake. Since you trace along a template, anyone can enjoy it, even those who find drawing difficult.',
  onsenji_shabutu_heading_contents: '体験内容',
  onsenji_shabutu_heading_contents_en: 'Experience Details',
  onsenji_shabutu_content_title: '薬師如来',
  onsenji_shabutu_content_title_en: 'Yakushi Nyorai',
  onsenji_shabutu_content_desc: '下絵に沿って、ご本尊・薬師如来のお姿をお描きいただきます。完成後は特別御朱印とセットでお授けします。',
  onsenji_shabutu_content_desc_en: 'Following the template, you will trace the figure of the principal image, Yakushi Nyorai. A special goshuin stamp is given together upon completion.',
  onsenji_shabutu_heading_fees: '料金・所要時間',
  onsenji_shabutu_heading_fees_en: 'Fee & Duration',
  onsenji_shabutu_fee:  '1,000円（御朱印込み）',
  onsenji_shabutu_fee_en: '¥1,000 (includes goshuin stamp)',
  onsenji_shabutu_time: '約30〜60分（個人差があります）',
  onsenji_shabutu_time_en: 'Approx. 30–60 minutes (varies by individual)',
  onsenji_shabutu_target: 'どなたでも（絵が苦手な方も歓迎）',
  onsenji_shabutu_target_en: 'Anyone welcome (even if drawing is not your strength)',
  onsenji_shabutu_place: '寺務所 体験受付窓口',
  onsenji_shabutu_place_en: 'Temple Office Experience Counter',
  onsenji_shabutu_hours: '拝観時間内（閉門1時間前まで）',
  onsenji_shabutu_hours_en: 'During visiting hours (until 1 hour before closing)',
  onsenji_shabutu_heading_flow: '体験の流れ',
  onsenji_shabutu_heading_flow_en: 'Experience Flow',
  onsenji_shabutu_cta_heading: '写仏体験のご予約・お問い合わせ',
  onsenji_shabutu_cta_heading_en: 'Reservations & Inquiries for the Buddhist Image Tracing Experience',
  onsenji_shabutu_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  onsenji_shabutu_cta_sub_en: 'Advance reservation is recommended. Same-day reception is also available if space permits.',
  onsenji_shabutu_flow: JSON.stringify(DEFAULT_FLOW),
  onsenji_shabutu_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
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

export default async function OnsenjShabutuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiShabutu')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const flow = pj<typeof DEFAULT_FLOW>(g('onsenji_shabutu_flow'), DEFAULT_FLOW)

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
          <Image src="/images/syabutu-hiro.png" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-onsenji/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3">Shabutu</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/60 text-sm mt-3">{g('onsenji_shabutu_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shabutu_heading_about')}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{g('onsenji_shabutu_about_p1')}</p>
              <p className="mt-3">{g('onsenji_shabutu_about_p2')}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsen-kyousitu.png" alt="写仏体験の本堂" fill className="object-cover" />
              </div>
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsensyakyou.png" alt="写仏体験の会場" fill className="object-cover" />
              </div>
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsen-syakyou1.png" alt="お書きいただく様子" fill className="object-cover" />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shabutu_heading_contents')}</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border-t-4 border-[#7ec8a4] max-w-md mx-auto">
              <div className="grid grid-cols-2">
                <div>
                  <div className="relative h-56 bg-cream-alt">
                    <ZoomableImage src="/images/onsenji-goshuin-shabutu.jpg" alt="写仏体験の下絵" fill className="object-contain p-2" />
                  </div>
                  <p className="text-center text-[11px] text-gray-400 py-1.5">下絵</p>
                </div>
                <div className="border-l border-gray-100">
                  <div className="relative h-56 bg-cream-alt">
                    <ZoomableImage src="/images/onsenji-shabutu-template.png" alt="写仏体験の特別御朱印" fill className="object-contain p-2" />
                  </div>
                  <p className="text-center text-[11px] text-gray-400 py-1.5">特別御朱印</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-onsenji mb-2">{g('onsenji_shabutu_content_title')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{g('onsenji_shabutu_content_desc')}</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shabutu_heading_fees')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('onsenji_shabutu_fee')],
                    [t('tableTime'), g('onsenji_shabutu_time')],
                    [t('tableTarget'), g('onsenji_shabutu_target')],
                    [t('tablePlace'), g('onsenji_shabutu_place')],
                    [t('tableHours'), g('onsenji_shabutu_hours')],
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
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shabutu_heading_flow')}</h2>
            <ol className="relative border-l-2 border-[#7ec8a4] ml-4 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-onsenji text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <h3 className="font-medium text-onsenji mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('onsenji_shabutu_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('onsenji_shabutu_cta_sub')}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              {t('contactCta')}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/onsenji/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-onsenji group-hover:text-white">{t('quickShakyou')}</span>
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
