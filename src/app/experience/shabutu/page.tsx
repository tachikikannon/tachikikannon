export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'

export const metadata: Metadata = { title: '写仏体験' }

const DEFAULT_FLOW = [
  { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
  { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
  { title: 'お描きいただきます', text: '下絵に沿って、立木観世音菩薩のお姿をゆっくりお描きください。係の者がご説明いたします。' },
  { title: '特別御朱印のお授け', text: '完成後、銀紙特別朱印（立木観世音）をお授けします。' },
  { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
]
const DEFAULT_ITEMS = [
  { text: '下絵・筆・墨・硯はすべてご用意しています。手ぶらでお越しください。' },
  { text: '墨が衣服につく場合がありますので、汚れてもよい服装でお越しください。' },
  { text: '完成した作品はお持ち帰りいただけます。筒状にお渡しします。' },
]

const DEFAULTS: Record<string, string> = {
  shabutu_subtitle: '仏様のお姿を一筆一筆、心を込めてお描きいただきます',
  shabutu_heading_about: '写仏とは',
  shabutu_about_p1: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。',
  shabutu_about_p2: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。',
  shabutu_heading_fees: '料金・所要時間',
  shabutu_fee:  '1,000円（特別御朱印込み）',
  shabutu_time: '約30〜60分（個人差があります）',
  shabutu_target: 'どなたでも（絵が苦手な方も歓迎）',
  shabutu_place:  '寺務所 体験受付窓口',
  shabutu_hours:  '拝観時間内（閉門1時間前まで）',
  shabutu_heading_flow: '体験の流れ',
  shabutu_heading_goshuin: '写仏体験 特別御朱印',
  shabutu_goshuin_badge: '写仏',
  shabutu_goshuin_title: '銀紙特別朱印 立木観世音',
  shabutu_goshuin_desc:  '写仏をお描きいただいた方にお授けします。体験料に含まれています。',
  shabutu_goshuin_note: '※特別御朱印は体験料に含まれています。別途購入はできません。',
  shabutu_heading_items: '持ち物・服装',
  shabutu_cta_heading: '写仏体験のご予約',
  shabutu_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  shabutu_flow: JSON.stringify(DEFAULT_FLOW),
  shabutu_items: JSON.stringify(DEFAULT_ITEMS),
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

export default async function ShabutuPage() {
  const c = await getContent()
  const flow  = pj<typeof DEFAULT_FLOW>(c.shabutu_flow, DEFAULT_FLOW)
  const items = pj<typeof DEFAULT_ITEMS>(c.shabutu_items, DEFAULT_ITEMS)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/reserve">体験予約</Link> &gt; 写仏体験
          </div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Shabutu</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">写仏体験</h1>
          <p className="text-white/60 text-sm mt-3 relative">{c.shabutu_subtitle}</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{c.shabutu_heading_about}</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{c.shabutu_about_p1}</p>
              <p className="mt-3">{c.shabutu_about_p2}</p>
            </div>
            <div className="max-w-[220px] mx-auto mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <ZoomableImage src="/images/shabutu-template.jpg" alt="写仏体験の下絵" width={835} height={1200} className="w-full h-auto" />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{c.shabutu_heading_fees}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['体験料', c.shabutu_fee],
                    ['所要時間', c.shabutu_time],
                    ['対象', c.shabutu_target],
                    ['受付場所', c.shabutu_place],
                    ['受付時間', c.shabutu_hours],
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
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{c.shabutu_heading_flow}</h2>
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

          <section className="bg-cream-alt -mx-4 px-4 py-10 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{c.shabutu_heading_goshuin}</h2>
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-20 sm:w-24 flex-shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <ZoomableImage src="/images/goshuin-shabutu.jpg" alt={c.shabutu_goshuin_title} width={799} height={1200} className="w-full h-auto" />
              </div>
              <div>
                <span className="inline-block bg-navy text-gold text-xs font-bold px-2 py-1 rounded mb-1">{c.shabutu_goshuin_badge}</span>
                <p className="font-medium text-navy">{c.shabutu_goshuin_title}</p>
                <p className="text-sm text-gray-600 mt-1">{c.shabutu_goshuin_desc}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">{c.shabutu_goshuin_note}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{c.shabutu_heading_items}</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{c.shabutu_cta_heading}</p>
            <p className="text-white/60 text-sm mb-6">{c.shabutu_cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">オンライン予約はこちら</Link>
              <Link href="/contact" className="btn-outline">お問い合わせ</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">写経体験</span>
            </Link>
            <Link href="/experience/jyuzu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📿</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">数珠づくり体験</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
