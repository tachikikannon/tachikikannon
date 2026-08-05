export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '数珠づくり体験 | 日光山温泉寺' }

const DEFAULT_FLOW = [
  { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
  { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
  { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
  { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
]
const DEFAULT_MATERIALS = [
  { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
  { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
  { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_jyuzu_subtitle: '世界にひとつだけの数珠を、自分の手でつくります',
  onsenji_jyuzu_heading_about: '数珠づくりとは',
  onsenji_jyuzu_about_p1: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。温泉寺の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。',
  onsenji_jyuzu_about_p2: '完成した数珠は薬師如来の前でご祈願いただいた後にお持ち帰りいただけます。参拝・法要などさまざまな場面でお使いいただけます。',
  onsenji_jyuzu_heading_fees: '料金・所要時間',
  onsenji_jyuzu_fee: '2,000円〜（珠の素材・組み合わせにより異なります）',
  onsenji_jyuzu_time: '約60〜90分',
  onsenji_jyuzu_target: '小学生以上（小学生は保護者同伴）',
  onsenji_jyuzu_place: '寺務所 体験受付窓口',
  onsenji_jyuzu_hours: '拝観時間内（閉門1時間30分前まで）',
  onsenji_jyuzu_price_note_label: '料金について',
  onsenji_jyuzu_price_note: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。',
  onsenji_jyuzu_heading_flow: '体験の流れ',
  onsenji_jyuzu_heading_materials: '珠の素材について',
  onsenji_jyuzu_materials_note: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。',
  onsenji_jyuzu_cta_heading: '数珠づくり体験のご予約・お問い合わせ',
  onsenji_jyuzu_cta_sub: '材料の準備がありますので、事前のご予約をお願いします。',
  onsenji_jyuzu_flow: JSON.stringify(DEFAULT_FLOW),
  onsenji_jyuzu_materials: JSON.stringify(DEFAULT_MATERIALS),
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

export default async function OnsenjJyuzuPage() {
  const c = await getContent()
  const flow      = pj<typeof DEFAULT_FLOW>(c.onsenji_jyuzu_flow, DEFAULT_FLOW)
  const materials = pj<typeof DEFAULT_MATERIALS>(c.onsenji_jyuzu_materials, DEFAULT_MATERIALS)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 数珠づくり体験
          </div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Juzu Making</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">数珠づくり体験</h1>
          <p className="text-white/60 text-sm mt-3 relative">{c.onsenji_jyuzu_subtitle}</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_jyuzu_heading_about}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{c.onsenji_jyuzu_about_p1}</p>
              <p className="mt-3">{c.onsenji_jyuzu_about_p2}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_jyuzu_heading_fees}</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['体験料', c.onsenji_jyuzu_fee],
                    ['所要時間', c.onsenji_jyuzu_time],
                    ['対象', c.onsenji_jyuzu_target],
                    ['受付場所', c.onsenji_jyuzu_place],
                    ['受付時間', c.onsenji_jyuzu_hours],
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
              <p className="font-bold text-amber-700 text-xs mb-1">{c.onsenji_jyuzu_price_note_label}</p>
              <p>{c.onsenji_jyuzu_price_note}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_jyuzu_heading_flow}</h2>
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
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_jyuzu_heading_materials}</h2>
            <p className="text-sm text-gray-600 mb-5">{c.onsenji_jyuzu_materials_note}</p>
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
            <p className="font-serif text-xl mb-2">{c.onsenji_jyuzu_cta_heading}</p>
            <p className="text-white/60 text-sm mb-6">{c.onsenji_jyuzu_cta_sub}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              お問い合わせ
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/onsenji/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-onsenji group-hover:text-white">写経体験</span>
            </Link>
            <Link href="/onsenji/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-onsenji group-hover:text-white">写仏体験</span>
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
