export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '写経体験 | 日光山温泉寺' }

const DEFAULT_ITEMS = [
  { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
  { text: '汚れてもよい服装でお越しいただくとより安心です。' },
  { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
]

const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: '筆・硯・お経の手本をご用意します。すべて貸し出しですので手ぶらでお越しください。' },
  { title: 'お写しいただきます', text: 'お経の手本に沿って、一文字一文字丁寧にお写しください。係の者がご説明いたします。' },
  { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_shakyou_subtitle: '心を静め、お経の文字を丁寧にお写しいただきます',
  onsenji_shakyou_heading_about: '写経とは',
  onsenji_shakyou_about_p1: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。',
  onsenji_shakyou_about_p2: '温泉寺では薬師如来に縁の深いお経をお写しいただきます。体験後は特別御朱印をお授けします。毎日開催していますので、参拝の際にお気軽にお申し付けください。',
  onsenji_shakyou_heading_fees: '料金・所要時間',
  onsenji_shakyou_fee:  '1,000円（特別御朱印授与込み）',
  onsenji_shakyou_time: '約15分',
  onsenji_shakyou_target: 'どなたでも（筆が初めての方も歓迎）',
  onsenji_shakyou_place: '寺務所 体験受付窓口',
  onsenji_shakyou_hours: '拝観時間内（閉門1時間前まで）',
  onsenji_shakyou_heading_flow: '体験の流れ',
  onsenji_shakyou_heading_items: '持ち物・服装',
  onsenji_shakyou_cta_heading: '写経体験のご予約・お問い合わせ',
  onsenji_shakyou_cta_sub: '予約不要・毎日実施。参拝受付時にお申し付けください。',
  onsenji_shakyou_items: JSON.stringify(DEFAULT_ITEMS),
  onsenji_shakyou_flow: JSON.stringify(DEFAULT_FLOW),
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

export default async function OnsenjShakyouPage() {
  const c = await getContent()
  const items = pj<typeof DEFAULT_ITEMS>(c.onsenji_shakyou_items, DEFAULT_ITEMS)
  const flow  = pj<typeof DEFAULT_FLOW>(c.onsenji_shakyou_flow, DEFAULT_FLOW)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 写経体験
          </div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Shakyou</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">写経体験</h1>
          <p className="text-white/60 text-sm mt-3 relative">{c.onsenji_shakyou_subtitle}</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shakyou_heading_about}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{c.onsenji_shakyou_about_p1}</p>
              <p className="mt-3">{c.onsenji_shakyou_about_p2}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shakyou_heading_fees}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['体験料', c.onsenji_shakyou_fee],
                    ['所要時間', c.onsenji_shakyou_time],
                    ['対象', c.onsenji_shakyou_target],
                    ['受付場所', c.onsenji_shakyou_place],
                    ['受付時間', c.onsenji_shakyou_hours],
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
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shakyou_heading_flow}</h2>
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
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shakyou_heading_items}</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-[#7ec8a4]">{text}</li>
              ))}
            </ul>
          </section>
          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{c.onsenji_shakyou_cta_heading}</p>
            <p className="text-white/60 text-sm mb-6">{c.onsenji_shakyou_cta_sub}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              お問い合わせ
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
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
