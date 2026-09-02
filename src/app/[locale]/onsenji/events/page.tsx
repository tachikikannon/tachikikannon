export const revalidate = 60

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent, pickLocalized } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'
import type { MinorEvent } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiEvents' })
  return {
    title: `${t('title')}`,
    description: '日光山温泉寺の年間行事・法要のご案内。8月8日 薬師講大祭・採灯大護摩供、1月下旬 節分大祭。',
  }
}

const DEFAULT_EVENTS = [
  {
    month: '8月',
    date: '8月8日',
    time: '午前11時〜',
    name: '薬師講大祭・採灯大護摩供',
    desc: '薬師堂にてご本尊・薬師瑠璃光如来への法要を執り行います。又、湯の湖畔では、山伏によって採灯大護摩供が行われます。写経などが御本尊に奉じられ、護摩の炎で焚き上げられる、温泉寺最大の法要です。',
  },
  {
    month: '1月',
    date: '1月下旬',
    time: '午前11時〜',
    name: '温泉寺 節分大祭',
    desc: '新年の邪気を払い、福を招く節分の法要です。参拝者の一年の健康と幸福をお祈りします。',
  },
]
const DEFAULT_EVENTS_EN = [
  {
    month: 'August',
    date: 'August 8',
    time: 'From 11:00 AM',
    name: 'Yakushiko Grand Festival & Saito Goma Fire Ritual',
    desc: 'A memorial service to the principal image, Yakushi Rurikou Nyorai, is held at the Yakushi Hall. Mountain ascetics (yamabushi) also perform the Saito Goma fire ritual on the shore of Lake Yunoko. Copied sutras and other offerings are presented to the principal image and burned in the goma flames — the largest ceremony of the year at Onsenji.',
  },
  {
    month: 'January',
    date: 'Late January',
    time: 'From 11:00 AM',
    name: 'Onsenji Setsubun Grand Festival',
    desc: 'A Setsubun ceremony to drive away misfortune and welcome good luck for the new year, praying for the health and happiness of all visitors in the year ahead.',
  },
]
const EVENT_IMAGES = ['/images/onsenji/events/yakushiko/saitougoma-onsen.JPEG', '/images/onsenji/events/setsubun/onsenji-setubun-hiro.JPG']
const EVENT_ALTS = ['薬師講大祭・採灯大護摩供', '節分大祭']
const EVENT_HREFS = ['/onsenji/events/yakushiko', '/onsenji/events/setsubun']
const EVENT_APPLIES = ['/onsenji/events/yakushiko/apply', '/onsenji/events/setsubun/apply']

const DEFAULTS: Record<string, string> = {
  onsenji_events_subtitle: '温泉寺の法要・行事のご案内',
  onsenji_events_subtitle_en: 'Onsenji Ceremonies & Events',
  onsenji_events_list: JSON.stringify(DEFAULT_EVENTS),
  onsenji_events_list_en: JSON.stringify(DEFAULT_EVENTS_EN),
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

async function getMinorEvents(): Promise<MinorEvent[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(
      `${url}/rest/v1/minor_events?site=eq.onsenji&is_published=eq.true&select=*&order=sort_order.asc,created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } }
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

const MONTH_NAMES_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default async function OnsenjEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiEvents')
  const tc = await getTranslations('common')
  const [c, minorEvents] = await Promise.all([getContent(), getMinorEvents()])
  const g = (key: string) => getLocalizedContent(c, key, loc)
  const events = pj<typeof DEFAULT_EVENTS>(g('onsenji_events_list'), DEFAULT_EVENTS)

  const cards: EventCard[] = [
    ...events.map((ev, i): EventCard => ({
      key: `fixed-${i}`,
      monthNum: monthNumOf(DEFAULT_EVENTS[i]?.month ?? ev.month),
      monthLabel: ev.month,
      dateLabel: ev.date,
      timeLabel: ev.time,
      name: ev.name,
      desc: ev.desc,
      image: EVENT_IMAGES[i] ?? '/images/chuzenji/events/gyouji.JPEG',
      alt: EVENT_ALTS[i] ?? ev.name,
      href: EVENT_HREFS[i] ?? '/onsenji/events',
      applyHref: EVENT_APPLIES[i] ?? '/onsenji/contact',
    })),
    ...minorEvents.map((ev): EventCard => ({
      key: `minor-${ev.id}`,
      monthNum: monthNumOf(ev.month_label),
      monthLabel: pickLocalized(loc, ev.month_label, ev.month_label_en),
      dateLabel: pickLocalized(loc, ev.date_label, ev.date_label_en),
      timeLabel: pickLocalized(loc, ev.time_label ?? '', ev.time_label_en),
      name: pickLocalized(loc, ev.title, ev.title_en),
      desc: pickLocalized(loc, ev.desc_text, ev.desc_text_en),
      image: ev.cover_url ?? '/images/chuzenji/events/gyouji.JPEG',
      alt: ev.title,
      href: `/onsenji/events/m/${ev.slug}`,
      applyHref: ev.apply_url,
    })),
  ]

  const monthGroups = [...Array.from({ length: 12 }, (_, i) => i + 1), 0]
    .map(m => ({ month: m, cards: cards.filter(c => c.monthNum === m) }))
    .filter(g => g.cards.length > 0)

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
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Annual Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
          <p className="text-white/60 text-sm mt-3 relative">{g('onsenji_events_subtitle')}</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">
          {monthGroups.map(group => (
            <section key={group.month}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-serif text-2xl text-onsenji whitespace-nowrap">
                  {group.month === 0 ? t('everyMonth') : (loc === 'en' ? MONTH_NAMES_EN[group.month] : `${group.month}月`)}
                </h2>
                <div className="h-px flex-1 bg-[#7ec8a4]/30" />
              </div>
              <div className="space-y-10">
                {group.cards.map(ev => (
                  <article key={ev.key} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="relative h-56 md:h-72">
                      <ZoomableImage src={ev.image} alt={ev.alt} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-onsenji/80 via-onsenji/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">{ev.dateLabel}　{ev.timeLabel}</p>
                        <h3 className="font-serif text-2xl text-white">{ev.name}</h3>
                      </div>
                      <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-onsenji/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-[#7ec8a4] text-sm font-medium">{ev.monthLabel}</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-gray-700 leading-loose">{ev.desc}</p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link href={ev.href}
                          className="flex-1 text-center px-6 py-2.5 bg-onsenji text-white text-sm font-medium rounded-full hover:bg-onsenji/80 transition-colors">
                          {t('detailCta')}
                        </Link>
                        {ev.applyHref && (
                          <Link href={ev.applyHref}
                            className="flex-1 text-center px-6 py-2.5 bg-[#7ec8a4] text-onsenji text-sm font-medium rounded-full hover:bg-[#a0d8bc] transition-colors">
                            {t('applyCta')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <div className="bg-onsenji/5 border border-onsenji/10 rounded-2xl p-6 text-center text-sm text-gray-600">
            {t('contactPrefix')}<a href="tel:0288-55-0013" className="text-onsenji font-medium">0288-55-0013</a>{t('contactSuffix')}
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
