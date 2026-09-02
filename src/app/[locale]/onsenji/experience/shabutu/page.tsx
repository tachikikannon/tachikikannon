export const revalidate = 60

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
  return { title: `${t('title')}` }
}

const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所体験窓口にてお申込みください。体験料を収めていただきます。' },
  { title: '用具の準備', text: '写仏用紙の入ったクリアファイルと筆をご用意しますので、お教室にそのままお持ちください。' },
  { title: '体験', text: '下絵に沿って、薬師瑠璃光如来のお姿をゆっくりお描きください。' },
  { title: '特別御朱印のお授け', text: '体験終了後、三宝（木の台）に写仏を収め、クリアファイルと筆を寺務所にお返しください。引き換えに御朱印をお授けします。' },
  { title: '描き終えた写仏について', text: '納められた写仏は、御本尊 薬師如来に奉じ8月8日に行われる【温泉寺薬師講『採灯大護摩供』】にてお焚き上げされます。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception', text: 'Please apply at the Temple Office experience counter and pay the experience fee.' },
  { title: 'Preparing Materials', text: 'We will provide a clear file containing the tracing paper and a brush — please bring them with you to the drawing room.' },
  { title: 'The Experience', text: 'Following the printed outline, slowly trace the image of Yakushi Rurikou Nyorai.' },
  { title: 'Receiving the Special Goshuin', text: 'When you finish, place your tracing on the sanbo (wooden offering stand) and return the clear file and brush to the Temple Office. You will receive a goshuin stamp in exchange.' },
  { title: 'About Your Completed Tracing', text: 'Tracings you leave with us are offered to Yakushi Nyorai, the principal image, and ritually burned on August 8 at the "Onsenji Yakushi-ko Saito Grand Goma Ceremony."' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_shabutu_subtitle: '仏様のお姿を一筆一筆、心を込めてお描きいただきます',
  onsenji_shabutu_subtitle_en: 'Trace the figure of the Buddha, stroke by stroke, with a mindful heart',
  onsenji_shabutu_heading_about: '写仏とは',
  onsenji_shabutu_heading_about_en: 'What is Shabutu?',
  onsenji_shabutu_about_p1: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。',
  onsenji_shabutu_about_p1_en: 'Shabutu is a practice of carefully tracing the figure of a Buddha following a template. Alongside sutra copying, it is one of the traditional Buddhist practices — as you draw, you receive the Buddha\'s merit and settle your mind.',
  onsenji_shabutu_about_p2: '温泉寺の写仏体験では、ご本尊・薬師如来のお姿をお描きいただきます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。',
  onsenji_shabutu_about_p2_en: "In Onsenji's shabutsu experience, you will trace the image of Yakushi Nyorai, the principal image. Since you trace along a printed outline, anyone can enjoy it, even those who are not confident in their drawing.",
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
  onsenji_shabutu_time: '約20〜30分（個人差があります）',
  onsenji_shabutu_time_en: 'Approx. 20–30 minutes (varies by person)',
  onsenji_shabutu_target: 'どなたでも（絵が苦手な方も歓迎）',
  onsenji_shabutu_target_en: 'Anyone welcome (even if drawing is not your strength)',
  onsenji_shabutu_place: '玄関にて係にお申し付けください。',
  onsenji_shabutu_place_en: 'Please ask staff at the entrance.',
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
      headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 },
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
          <Image src="/images/common/syabutu-hiro.png" alt={t('title')} fill priority className="object-cover" />
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
                <ZoomableImage src="/images/onsenji/experience/onsen-kyousitu.png" alt="写仏体験の本堂" fill className="object-cover" />
              </div>
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsenji/experience/onsensyakyou.png" alt="写仏体験の会場" fill className="object-cover" />
              </div>
              <div className="relative h-32 sm:h-44 rounded-xl overflow-hidden shadow-sm">
                <ZoomableImage src="/images/onsenji/experience/onsen-syakyou1.png" alt="お書きいただく様子" fill className="object-cover" />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_shabutu_heading_contents')}</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border-t-4 border-[#7ec8a4] max-w-md mx-auto">
              <div className="grid grid-cols-2">
                <div>
                  <div className="relative h-56 bg-cream-alt">
                    <ZoomableImage src="/images/onsenji/experience/shabutu/onsenji-goshuin-shabutu.jpg" alt="写仏体験の下絵" fill className="object-contain p-2" />
                  </div>
                  <p className="text-center text-[11px] text-gray-400 py-1.5">下絵</p>
                </div>
                <div className="border-l border-gray-100">
                  <div className="relative h-56 bg-cream-alt">
                    <ZoomableImage src="/images/onsenji/experience/shabutu/onsenji-shabutu-template.png" alt="写仏体験の特別御朱印" fill className="object-contain p-2" />
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
