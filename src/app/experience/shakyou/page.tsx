export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '写経体験' }

const DEFAULT_CONTENTS = [
  { icon: '📜', title: '延命十句観音経', desc: '観音様のお力を借り、長寿・安全を祈るお経。十六文字を丁寧にお写しいただきます。' },
  { icon: '✍️', title: '懺悔文', desc: '過去の罪業を懺悔し、心を清めるお経。金紙特別御朱印（大日如来）とセットです。' },
]
const DEFAULT_ITEMS = [
  { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
  { text: '汚れてもよい服装でお越しいただくとより安心です。' },
  { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
]

const DEFAULTS: Record<string, string> = {
  shakyou_about_p1: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。',
  shakyou_about_p2: '立木観音では、十六文字のお経（延命十句観音経・懺悔文）をお写しいただきます。短いお経のため、筆を持ったことのない方でも約15分でお写しいただけます。',
  shakyou_fee:  '1,000円（特別御朱印込み）',
  shakyou_time: '約15分',
  shakyou_cta_sub: '事前予約をおすすめします。当日受付も空きがあれば対応します。',
  shakyou_contents: JSON.stringify(DEFAULT_CONTENTS),
  shakyou_items: JSON.stringify(DEFAULT_ITEMS),
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

export default async function ShakyouPage() {
  const c = await getContent()
  const contents = pj<typeof DEFAULT_CONTENTS>(c.shakyou_contents, DEFAULT_CONTENTS)
  const items    = pj<typeof DEFAULT_ITEMS>(c.shakyou_items, DEFAULT_ITEMS)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/reserve">体験予約</Link> &gt; 写経体験
          </div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Shakyou</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">写経体験</h1>
          <p className="text-white/60 text-sm mt-3 relative">心を静め、お経の文字を丁寧にお写しいただきます</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">写経とは</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>{c.shakyou_about_p1}</p>
              <p className="mt-3">{c.shakyou_about_p2}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">体験内容</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {contents.map(({ icon, title, desc }, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-gold">
                  <p className="text-2xl mb-3">{icon}</p>
                  <h3 className="font-medium text-navy mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">料金・所要時間</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['体験料', c.shakyou_fee],
                    ['所要時間', c.shakyou_time],
                    ['対象', 'どなたでも（筆が初めての方も歓迎）'],
                    ['受付場所', '寺務所 体験受付窓口'],
                    ['受付時間', '拝観時間内（閉門1時間前まで）'],
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

          <section className="bg-cream-alt -mx-4 px-4 py-10 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">写経体験 特別御朱印</h2>
            <div className="space-y-4">
              {[
                { title: '金紙特別朱印 立木大悲殿', sub: '延命十句観音経をお写しいただいた方にお授けします。', badge: '延命十句観音経' },
                { title: '金紙特別御朱印 大日如来', sub: '懺悔文をお写しいただいた方にお授けします。', badge: '懺悔文' },
              ].map(({ title, sub, badge }) => (
                <div key={title} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
                  <span className="flex-shrink-0 bg-navy text-gold text-xs font-bold px-2 py-1 rounded mt-0.5">{badge}</span>
                  <div>
                    <p className="font-medium text-navy">{title}</p>
                    <p className="text-sm text-gray-600 mt-1">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">※特別御朱印は体験料に含まれています。別途購入はできません。</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">持ち物・服装</h2>
            <ul className="space-y-2">
              {items.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">写経体験のご予約</p>
            <p className="text-white/60 text-sm mb-6">{c.shakyou_cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">オンライン予約はこちら</Link>
              <Link href="/contact" className="btn-outline">お問い合わせ</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">写仏体験</span>
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
