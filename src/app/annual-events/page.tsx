export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import type { MinorEvent } from '@/types'

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
  {
    month: '1月',
    date: '1月1日',
    time: '午前0時〜',
    name: '正月元旦特別護摩祈願',
    desc: '新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・開運招福を祈願する特別な護摩祈祷です。御札は5,000円〜30,000円よりお選びいただけます。事前申し込み・最大5名まで同時申込可。',
  },
]
const EVENT_IMAGES = ['/images/gyouji.JPEG', '/images/mizuumi.jpg', '/images/ganjitsu-goma-1920.jpg']
const EVENT_ALTS = ['観音講・大護摩供・地蔵流し', '中禅寺湖・船禅頂', '正月元旦特別護摩祈願']
const EVENT_HREFS = ['/annual-events/kannonko', '/annual-events/funazento', '/annual-events/shogatsu']
const EVENT_APPLIES = ['/annual-events/kannonko/apply', '/annual-events/funazento/apply', '/annual-events/shogatsu/apply']

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

async function getMinorEvents(): Promise<MinorEvent[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(
      `${url}/rest/v1/minor_events?site=eq.chuzenji&is_published=eq.true&select=*&order=sort_order.asc,created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store' }
    )
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

type EventCard = {
  key: string
  monthNum: number
  monthLabel: string
  dateLabel: string
  timeLabel: string
  name: string
  desc: string
  image: string
  alt: string
  href: string
  applyHref: string | null
}

function monthNumOf(label: string): number {
  if (label.includes('毎月')) return 0
  const n = parseInt(label, 10)
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : 13
}

export default async function AnnualEventsPage() {
  const [c, minorEvents] = await Promise.all([getContent(), getMinorEvents()])
  const events = pj<typeof DEFAULT_EVENTS>(c.annual_events_list, DEFAULT_EVENTS)

  const cards: EventCard[] = [
    ...events.map((ev, i): EventCard => ({
      key: `fixed-${ev.date}`,
      monthNum: monthNumOf(ev.month),
      monthLabel: ev.month,
      dateLabel: ev.date,
      timeLabel: ev.time,
      name: ev.name,
      desc: ev.desc,
      image: EVENT_IMAGES[i] ?? '/images/gyouji.JPEG',
      alt: EVENT_ALTS[i] ?? ev.name,
      href: EVENT_HREFS[i] ?? '/annual-events',
      applyHref: EVENT_APPLIES[i] ?? '/contact',
    })),
    ...minorEvents.map((ev): EventCard => ({
      key: `minor-${ev.id}`,
      monthNum: monthNumOf(ev.month_label),
      monthLabel: ev.month_label,
      dateLabel: ev.date_label,
      timeLabel: ev.time_label ?? '',
      name: ev.title,
      desc: ev.desc_text,
      image: ev.cover_url ?? '/images/gyouji.JPEG',
      alt: ev.title,
      href: `/annual-events/m/${ev.slug}`,
      applyHref: ev.apply_url,
    })),
  ]

  const monthGroups = Array.from({ length: 13 }, (_, i) => i)
    .map(m => ({ month: m, cards: cards.filter(c => c.monthNum === m) }))
    .filter(g => g.cards.length > 0)

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

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">
          {monthGroups.map(group => (
            <section key={group.month}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-serif text-2xl text-navy whitespace-nowrap">{group.month === 0 ? '毎月' : `${group.month}月`}</h2>
                <div className="h-px flex-1 bg-gold/30" />
              </div>
              <div className="space-y-10">
                {group.cards.map(ev => (
                  <article key={ev.key} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="relative h-56 md:h-72">
                      <ZoomableImage src={ev.image} alt={ev.alt} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <p className="text-gold text-xs tracking-widest mb-1">{ev.dateLabel}　{ev.timeLabel}</p>
                        <h3 className="font-serif text-2xl text-white">{ev.name}</h3>
                      </div>
                      <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-navy/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-gold text-sm font-medium">{ev.monthLabel}</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-gray-700 leading-loose">{ev.desc}</p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link href={ev.href}
                          className="flex-1 text-center px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-full hover:bg-navy/80 transition-colors">
                          詳細を見る
                        </Link>
                        {ev.applyHref && (
                          <Link href={ev.applyHref}
                            className="flex-1 text-center px-6 py-2.5 bg-gold text-navy text-sm font-medium rounded-full hover:opacity-90 transition-colors">
                            申し込みフォーム
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
