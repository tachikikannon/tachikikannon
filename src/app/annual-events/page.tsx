export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '年間行事 | 日光山中禅寺 立木観音',
  description: '日光山中禅寺 立木観音の年間行事。6月18日 観音講・大護摩供・地蔵流し、8月4日 船禅頂（ふなぜんじょう）。',
}

const DEFAULT_EVENTS = [
  {
    month: '6月',
    date: '6月18日',
    time: '午前10時〜',
    name: '観音講・大護摩供・地蔵流し',
    desc: '毎年6月18日に、ご信徒の皆様にご参列いただいての大法要を執り行います。観音講・波之利大黒天堂大護摩供に続き、中禅寺湖にてお地蔵様を湖上に流す「地蔵流し」を行います。',
  },
  {
    month: '8月',
    date: '8月4日',
    time: '午前10時〜',
    name: '船禅頂（ふなぜんじょう）',
    desc: '日光開山 勝道上人の霊跡を船で巡拝する伝統行事です。中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。',
  },
]
const EVENT_IMAGES = ['/images/gyouji.JPEG', '/images/mizuumi.jpg']
const EVENT_ALTS = ['観音講・大護摩供・地蔵流し', '中禅寺湖・船禅頂']
const EVENT_HREFS = ['/annual-events/kannonko', '/annual-events/funazento']
const EVENT_APPLIES = ['/annual-events/kannonko/apply', '/annual-events/funazento/apply']

const DEFAULTS: Record<string, string> = {
  annual_events_subtitle: '毎年恒例の法要・行事のご案内',
  annual_events_list: JSON.stringify(DEFAULT_EVENTS),
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

export default async function AnnualEventsPage() {
  const c = await getContent()
  const events = pj<typeof DEFAULT_EVENTS>(c.annual_events_list, DEFAULT_EVENTS)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/events">行事カレンダー</Link> &gt; 年間行事
          </div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Annual Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">年間行事</h1>
          <p className="text-white/60 text-sm mt-3 relative">{c.annual_events_subtitle}</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">
          {events.map((ev, i) => (
            <article key={ev.date} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-56 md:h-72">
                <Image src={EVENT_IMAGES[i] ?? '/images/gyouji.JPEG'} alt={EVENT_ALTS[i] ?? ev.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-gold text-xs tracking-widest mb-1">{ev.date}　{ev.time}</p>
                  <h2 className="font-serif text-2xl text-white">{ev.name}</h2>
                </div>
                <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-navy/80 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-gold text-sm font-medium">{ev.month}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-loose">{ev.desc}</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href={EVENT_HREFS[i] ?? '/annual-events'}
                    className="flex-1 text-center px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-full hover:bg-navy/80 transition-colors">
                    詳細を見る
                  </Link>
                  <Link href={EVENT_APPLIES[i] ?? '/contact'}
                    className="flex-1 text-center px-6 py-2.5 bg-gold text-navy text-sm font-medium rounded-full hover:opacity-90 transition-colors">
                    申し込みフォーム
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <div className="bg-cream-alt rounded-2xl p-6 text-center text-sm text-gray-600">
            ご不明な点はお電話（<a href="tel:0288-55-0013" className="text-navy font-medium">0288-55-0013</a>）またはお問い合わせフォームにてお気軽にお問い合わせください。
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
