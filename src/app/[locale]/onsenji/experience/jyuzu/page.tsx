export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiJyuzu' })
  return { title: `${t('title')}` }
}

const DEFAULT_FLOW = [
  { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
  { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
  { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
  { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception & Design Selection', text: 'Please apply at the Temple Office experience reception counter. Choose your preferred bead material and color combination.' },
  { title: 'Confirming the Beads', text: 'We will confirm your chosen beads and guide you to the workstation.' },
  { title: 'Making the Bracelet', text: 'Following staff instructions, string the beads onto the cord. We will also guide you through the knotting.' },
  { title: 'Completion & Take-Home', text: 'Take your finished bracelet home right away, presented in a dedicated pouch.' },
]
const DEFAULT_MATERIALS = [
  { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
  { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
  { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
]
const DEFAULT_MATERIALS_EN = [
  { name: 'Crystal', desc: 'Known as a clarifying stone that wards off negative energy, with a translucent beauty.' },
  { name: 'Jade', desc: 'A beautiful green stone believed to bring longevity, health, and protection from misfortune.' },
  { name: 'Wooden Beads', desc: 'A lightweight, easy-to-wear traditional bead, known for its warm texture.' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_jyuzu_subtitle: '世界にひとつだけの数珠を、自分の手でつくります',
  onsenji_jyuzu_subtitle_en: 'Create a one-of-a-kind juzu bracelet with your own hands',
  onsenji_jyuzu_heading_about: '数珠づくりとは',
  onsenji_jyuzu_heading_about_en: 'About Juzu Making',
  onsenji_jyuzu_about_p1: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。温泉寺の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。',
  onsenji_jyuzu_about_p1_en: 'A juzu is a Buddhist prayer implement held in hand while worshipping. In Onsenji\'s juzu-making experience, you choose your preferred combination from several types of beads to create your own original bracelet.',
  onsenji_jyuzu_about_p2: '完成した数珠は薬師如来の前でご祈願いただいた後にお持ち帰りいただけます。参拝・法要などさまざまな場面でお使いいただけます。',
  onsenji_jyuzu_about_p2_en: 'Your finished juzu is blessed before Yakushi Nyorai before you take it home. It can be used on many occasions, including worship and ceremonies.',
  onsenji_jyuzu_heading_fees: '料金・所要時間',
  onsenji_jyuzu_heading_fees_en: 'Fee & Duration',
  onsenji_jyuzu_fee: '2,000円〜（珠の素材・組み合わせにより異なります）',
  onsenji_jyuzu_fee_en: 'From ¥2,000 (varies by bead material and combination)',
  onsenji_jyuzu_time: '約60〜90分',
  onsenji_jyuzu_time_en: 'Approx. 60–90 minutes',
  onsenji_jyuzu_target: '小学生以上（小学生は保護者同伴）',
  onsenji_jyuzu_target_en: 'Elementary school age and up (children must be accompanied by a guardian)',
  onsenji_jyuzu_place: '寺務所 体験受付窓口',
  onsenji_jyuzu_place_en: 'Temple Office Experience Counter',
  onsenji_jyuzu_hours: '拝観時間内（閉門1時間30分前まで）',
  onsenji_jyuzu_hours_en: 'During visiting hours (until 1.5 hours before closing)',
  onsenji_jyuzu_price_note_label: '料金について',
  onsenji_jyuzu_price_note_label_en: 'About Pricing',
  onsenji_jyuzu_price_note: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。',
  onsenji_jyuzu_price_note_en: 'The fee varies depending on the bead material, count, and combination you choose. Please check with our reception counter or the contact form for details.',
  onsenji_jyuzu_heading_flow: '体験の流れ',
  onsenji_jyuzu_heading_flow_en: 'Experience Flow',
  onsenji_jyuzu_heading_materials: '珠の素材について',
  onsenji_jyuzu_heading_materials_en: 'About Bead Materials',
  onsenji_jyuzu_materials_note: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。',
  onsenji_jyuzu_materials_note_en: 'Available bead types vary by season and stock. Please check at the reception counter on the day.',
  onsenji_jyuzu_cta_heading: '数珠づくり体験のご予約・お問い合わせ',
  onsenji_jyuzu_cta_heading_en: 'Reservations & Inquiries for the Juzu Making Experience',
  onsenji_jyuzu_cta_sub: '材料の準備がありますので、事前のご予約をお願いします。',
  onsenji_jyuzu_cta_sub_en: 'As materials must be prepared in advance, a reservation is required.',
  onsenji_jyuzu_flow: JSON.stringify(DEFAULT_FLOW),
  onsenji_jyuzu_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
  onsenji_jyuzu_materials: JSON.stringify(DEFAULT_MATERIALS),
  onsenji_jyuzu_materials_en: JSON.stringify(DEFAULT_MATERIALS_EN),
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

export default async function OnsenjJyuzuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiJyuzu')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const flow      = pj<typeof DEFAULT_FLOW>(g('onsenji_jyuzu_flow'), DEFAULT_FLOW)
  const materials = pj<typeof DEFAULT_MATERIALS>(g('onsenji_jyuzu_materials'), DEFAULT_MATERIALS)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}
          </div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Juzu Making</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
          <p className="text-white/60 text-sm mt-3 relative">{g('onsenji_jyuzu_subtitle')}</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_jyuzu_heading_about')}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{g('onsenji_jyuzu_about_p1')}</p>
              <p className="mt-3">{g('onsenji_jyuzu_about_p2')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_jyuzu_heading_fees')}</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('onsenji_jyuzu_fee')],
                    [t('tableTime'), g('onsenji_jyuzu_time')],
                    [t('tableTarget'), g('onsenji_jyuzu_target')],
                    [t('tablePlace'), g('onsenji_jyuzu_place')],
                    [t('tableHours'), g('onsenji_jyuzu_hours')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-onsenji text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-bold text-amber-700 text-xs mb-1">{g('onsenji_jyuzu_price_note_label')}</p>
              <p>{g('onsenji_jyuzu_price_note')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_jyuzu_heading_flow')}</h2>
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
          <section className="bg-onsenji/5 -mx-4 px-4 py-10 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{g('onsenji_jyuzu_heading_materials')}</h2>
            <p className="text-sm text-gray-600 mb-5">{g('onsenji_jyuzu_materials_note')}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {materials.map(({ name, desc }, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-onsenji mb-1">{name}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>
          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('onsenji_jyuzu_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('onsenji_jyuzu_cta_sub')}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              {t('contactCta')}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/onsenji/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-onsenji group-hover:text-white">{t('quickShakyou')}</span>
            </Link>
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
