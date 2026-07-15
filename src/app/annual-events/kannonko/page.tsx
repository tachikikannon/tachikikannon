export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '観音講・大護摩供・地蔵流し（6月18日） | 日光山中禅寺 立木観音',
  description: '毎年6月18日開催。観音講・大護摩供・地蔵流しのご案内。午前10時より執り行います。',
}

const DEFAULT_SCHEDULE = [
  { time: '10:00', title: '観音講', desc: '五大堂にて、ご信徒の皆様とともに観音経をお唱えし、立木観音様へのご供養を執り行います。' },
  { time: '11:15', title: '大護摩供', desc: '波之利大黒天堂にて採灯大護摩供を厳修いたします。護摩の炎にてご参列の皆様の願い事をお焚き上げします。' },
  { time: '13:00', title: '地蔵流し', desc: '中禅寺湖の湖上にてお地蔵様をお流しする伝統行事です。水面に浮かぶお地蔵様が、湖の彼方へとご縁をお運びします。' },
]

const DEFAULT_NOTES = [
  { text: '参列は自由です。事前のお申し込みは不要ですが、お願い事の御札をご希望の方は申し込みフォームよりお申し込みください。' },
  { text: '動きやすい服装でお越しください。中禅寺湖周辺は天候が変わりやすいため、羽織るものをお持ちいただくことをお勧めします。' },
  { text: 'お支払いは当日・現地にてお受けいたします。' },
  { text: '詳細・変更がある場合は当サイトにてお知らせいたします。' },
]

const DEFAULTS: Record<string, string> = {
  kannonko_about: '毎年6月18日、日光山中禅寺 立木観音では、ご信徒・一般参拝者の皆様をお迎えして年に一度の大法要を執り行います。観音講・大護摩供・地蔵流しと三つの行事が続き、中禅寺湖の豊かな自然のなかで千二百余年の祈りが受け継がれます。',
  kannonko_schedule: JSON.stringify(DEFAULT_SCHEDULE),
  kannonko_notes: JSON.stringify(DEFAULT_NOTES),
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

export default async function KannonkoPage() {
  const c = await getContent()
  const schedule = pj<typeof DEFAULT_SCHEDULE>(c.kannonko_schedule, DEFAULT_SCHEDULE)
  const notes    = pj<typeof DEFAULT_NOTES>(c.kannonko_notes, DEFAULT_NOTES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/annual-events">年間行事</Link> &gt; 観音講・大護摩供・地蔵流し
          </div>
        </div>

        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image src="/images/gyouji.JPEG" alt="観音講・大護摩供・地蔵流し" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-2">June 18th  Annual Event</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">観音講・大護摩供・地蔵流し</h1>
            <p className="text-white/70 text-sm mt-3">毎年6月18日　午前10時より</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">行事について</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{c.kannonko_about}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '開催日', value: '6月18日（毎年）' },
                { label: '開始時間', value: '午前10時〜' },
                { label: '参列', value: '自由（申し込み不要）' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cream-alt rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-navy">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">タイムスケジュール</h2>
            </div>
            <ol className="relative border-l-2 border-gold/40 ml-5 space-y-8">
              {schedule.map(({ time, title, desc }, i) => (
                <li key={i} className="pl-8 relative">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-navy flex items-center justify-center shadow-md">
                    <span className="text-gold text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-gold font-bold text-lg tracking-wide">{time}</span>
                      <h3 className="font-serif text-navy text-lg">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">行事の様子</h2>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/gyouji.JPEG" alt="大護摩供・地蔵流し" fill className="object-cover" />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">ご参列にあたって</h2>
            </div>
            <div className="space-y-3">
              {notes.map(({ text }, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-cream-alt rounded-xl px-4 py-3">
                  <span className="text-gold font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">御札のお申し込み</p>
            <p className="text-white/70 text-sm mb-6">
              大護摩供にてお焚き上げする御札をご希望の方は<br className="hidden sm:block" />
              事前に申し込みフォームよりお申し込みください。<br />
              お支払いは当日・現地にて。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/kannonko/apply"
                className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full hover:opacity-90 transition-colors text-sm">
                申し込みフォームへ
              </Link>
              <Link href="/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/annual-events"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              ← 年間行事一覧
            </Link>
            <Link href="/annual-events/funazento"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              8月4日 船禅頂 →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
