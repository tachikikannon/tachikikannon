export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '写仏体験 | 日光山温泉寺' }

const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
  { title: 'お描きいただきます', text: '下絵に沿って、薬師如来のお姿をゆっくりお描きください。係の者がご説明いたします。' },
  { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
  { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_shabutu_subtitle: '仏様のお姿を一筆一筆、心を込めてお描きいただきます',
  onsenji_shabutu_heading_about: '写仏とは',
  onsenji_shabutu_about_p1: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。',
  onsenji_shabutu_about_p2: '温泉寺の写仏体験では、ご本尊・薬師如来のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。',
  onsenji_shabutu_heading_fees: '料金・所要時間',
  onsenji_shabutu_fee:  '1,000円（御朱印込み）',
  onsenji_shabutu_time: '約30〜60分（個人差があります）',
  onsenji_shabutu_target: 'どなたでも（絵が苦手な方も歓迎）',
  onsenji_shabutu_place: '寺務所 体験受付窓口',
  onsenji_shabutu_hours: '拝観時間内（閉門1時間前まで）',
  onsenji_shabutu_heading_flow: '体験の流れ',
  onsenji_shabutu_cta_heading: '写仏体験のご予約・お問い合わせ',
  onsenji_shabutu_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  onsenji_shabutu_flow: JSON.stringify(DEFAULT_FLOW),
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

export default async function OnsenjShabutuPage() {
  const c = await getContent()
  const flow = pj<typeof DEFAULT_FLOW>(c.onsenji_shabutu_flow, DEFAULT_FLOW)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 写仏体験
          </div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Shabutu</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">写仏体験</h1>
          <p className="text-white/60 text-sm mt-3 relative">{c.onsenji_shabutu_subtitle}</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shabutu_heading_about}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{c.onsenji_shabutu_about_p1}</p>
              <p className="mt-3">{c.onsenji_shabutu_about_p2}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shabutu_heading_fees}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['体験料', c.onsenji_shabutu_fee],
                    ['所要時間', c.onsenji_shabutu_time],
                    ['対象', c.onsenji_shabutu_target],
                    ['受付場所', c.onsenji_shabutu_place],
                    ['受付時間', c.onsenji_shabutu_hours],
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
            <h2 className="text-xl font-serif text-onsenji pl-3 border-l-4 border-[#7ec8a4] mb-4">{c.onsenji_shabutu_heading_flow}</h2>
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
            <p className="font-serif text-xl mb-2">{c.onsenji_shabutu_cta_heading}</p>
            <p className="text-white/60 text-sm mb-6">{c.onsenji_shabutu_cta_sub}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              お問い合わせ
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/onsenji/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-onsenji group-hover:text-white">写経体験</span>
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
