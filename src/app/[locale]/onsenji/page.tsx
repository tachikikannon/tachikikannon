export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import { createServerClient } from '@/lib/supabase-server'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'
import type { News } from '@/types'

export const metadata: Metadata = {
  title: '日光山 温泉寺',
  description: '中禅寺湖畔に佇む、癒しと祈りの霊場 日光山温泉寺',
}

const DEFAULT_ABOUT_CARDS = [
  { label: '温泉寺の歴史', desc: '歴史と縁起' },
  { label: '拝観料金',     desc: '拝観料・各種料金' },
  { label: '境内のご案内', desc: '見どころ・境内マップ' },
  { label: '年間行事',     desc: '法要・行事のご案内' },
]
const DEFAULT_ABOUT_CARDS_EN = [
  { label: 'History of Onsenji', desc: 'History & origins' },
  { label: 'Admission Fees',     desc: 'Admission & other fees' },
  { label: 'Grounds Guide',      desc: 'Highlights & temple map' },
  { label: 'Annual Events',      desc: 'Services & event information' },
]
const DEFAULT_GORYAKU_CARDS = [
  { icon: '🌿', title: '病気平癒', desc: '薬師瑠璃光如来の御力で病気の回復をお祈りします' },
  { icon: '💧', title: '健康増進', desc: '大地から湧く温泉と仏縁で心身ともに清まります' },
  { icon: '⏳', title: '延命長寿', desc: '医王如来とも呼ばれる薬師如来の御加護を' },
  { icon: '✨', title: '開運招福', desc: '千二百余年の祈りが積み重なる霊場のご加護を' },
]
const DEFAULT_GORYAKU_CARDS_EN = [
  { icon: '🌿', title: 'Healing from Illness', desc: 'Prayers for recovery through the power of Yakushi Nyorai' },
  { icon: '💧', title: 'Better Health',        desc: 'Purify body and mind with the hot spring and Buddhist blessings' },
  { icon: '⏳', title: 'Longevity',            desc: 'The protection of Yakushi Nyorai, the "King of Medicine Buddha"' },
  { icon: '✨', title: 'Good Fortune',         desc: 'Over 1,200 years of accumulated prayer at this sacred site' },
]
const DEFAULT_MENU_CARDS = [
  { title: '薬師の湯', desc: '令和8年4月開湯。含硫黄泉の完全かけ流し。参拝の後、心身を清めるひとときを。' },
  { title: '写経体験', desc: '1,000円・約15分・毎日実施。特別御朱印授与。心を静めてお経をお写しいただけます。' },
  { title: '写仏体験', desc: '1,000円・約30〜60分。薬師瑠璃光如来をお描きいただき、特別御朱印をお授けします。' },
]
const DEFAULT_MENU_CARDS_EN = [
  { title: 'Yakushi-no-Yu Hot Spring', desc: 'Opened April 2026. Fully sourced, sulfur-rich spring water. A moment to purify body and mind after worship.' },
  { title: 'Sutra Copying',            desc: '¥1,000 · approx. 15 min · daily. Includes a special goshuin stamp. Quiet your mind while copying sutras.' },
  { title: 'Buddhist Image Tracing',   desc: '¥1,000 · approx. 30–60 min. Trace the image of Yakushi Nyorai and receive a special goshuin stamp.' },
]

const DEFAULT_CONTENT: Record<string, string> = {
  onsenji_hero_en:    'Nikkozan Onsenji Temple',
  onsenji_hero_title: '千二百余年の祈りを宿す\n薬師の霊場',
  onsenji_hero_title_en: 'A sacred site of the Medicine Buddha,\ncarrying over 1,200 years of prayer',
  onsenji_hero_sub:   '世界遺産・日光山輪王寺の別院。薬師瑠璃光如来のご加護と、大地から湧く温泉の癒しを',
  onsenji_hero_sub_en: 'A branch temple of the World Heritage site Nikkozan Rinnoji. The protection of Yakushi Nyorai, and the healing of hot spring water from the earth.',
  onsenji_onsen_status_enabled: 'true',
  onsenji_onsen_status_closed: 'false',
  onsenji_onsen_status_event_name: '法要',
  onsenji_onsen_status_event_name_en: 'a temple service',
  onsenji_onsen_status_hours: '9:00〜16:00まで入浴可',
  onsenji_onsen_status_hours_en: 'Bathing available 9:00 AM–4:00 PM',
  onsenji_heading_news: 'お知らせ',
  onsenji_heading_news_en: 'News',
  onsenji_about_title: '温泉寺について',
  onsenji_about_title_en: 'About Onsenji',
  onsenji_about_cards: JSON.stringify(DEFAULT_ABOUT_CARDS),
  onsenji_about_cards_en: JSON.stringify(DEFAULT_ABOUT_CARDS_EN),
  onsenji_heading_goryaku: '主なご利益',
  onsenji_heading_goryaku_en: 'Blessings',
  onsenji_heading_menu:    '温泉・体験メニュー',
  onsenji_heading_menu_en: 'Hot Spring & Experiences',
  onsenji_heading_goshuin: '御朱印',
  onsenji_heading_goshuin_en: 'Goshuin Stamps',
  onsenji_goshuin_desc: '温泉寺の御朱印は境内にてお受けいただけます。写経体験では特別御朱印をお授けします。',
  onsenji_goshuin_desc_en: 'Goshuin stamps can be received on the temple grounds. A special stamp is given for the sutra copying experience.',
  onsenji_heading_access: 'アクセス',
  onsenji_heading_access_en: 'Access',
  onsenji_access_address: '栃木県日光市湯元2559',
  onsenji_access_address_en: '2559 Yumoto, Nikko, Tochigi, Japan',
  onsenji_access_car:  '日光宇都宮道路 日光ICより約10分\n境内周辺に有料駐車場あり',
  onsenji_access_car_en: 'Approx. 10 min from Nikko IC on the Nikko-Utsunomiya Road\nPaid parking available near the grounds',
  onsenji_access_bus:  '東武日光駅・JR日光駅よりバスで「西参道」バス停下車、徒歩約10分\nまたは「表参道」バス停より徒歩約15分',
  onsenji_access_bus_en: 'By bus from Tobu-Nikko or JR Nikko Station, get off at "Nishi-Sando" and walk approx. 10 min\nor walk approx. 15 min from "Omote-Sando" bus stop',
  onsenji_goryaku_cards: JSON.stringify(DEFAULT_GORYAKU_CARDS),
  onsenji_goryaku_cards_en: JSON.stringify(DEFAULT_GORYAKU_CARDS_EN),
  onsenji_menu_cards:    JSON.stringify(DEFAULT_MENU_CARDS),
  onsenji_menu_cards_en: JSON.stringify(DEFAULT_MENU_CARDS_EN),
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

async function getContent(): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return DEFAULT_CONTENT
  try {
    const keys = Object.keys(DEFAULT_CONTENT).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return DEFAULT_CONTENT
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULT_CONTENT }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch {
    return DEFAULT_CONTENT
  }
}

export default async function OnsenjPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiHome')
  const c = await getContent()
  const aboutCards   = pj<typeof DEFAULT_ABOUT_CARDS>(getLocalizedContent(c, 'onsenji_about_cards', loc), DEFAULT_ABOUT_CARDS)
  const goryakuCards = pj<typeof DEFAULT_GORYAKU_CARDS>(getLocalizedContent(c, 'onsenji_goryaku_cards', loc), DEFAULT_GORYAKU_CARDS)
  const menuCards    = pj<typeof DEFAULT_MENU_CARDS>(getLocalizedContent(c, 'onsenji_menu_cards', loc), DEFAULT_MENU_CARDS)

  const heroTitle = getLocalizedContent(c, 'onsenji_hero_title', loc)
  const heroSub = getLocalizedContent(c, 'onsenji_hero_sub', loc)
  const onsenStatusEnabled = c['onsenji_onsen_status_enabled'] !== 'false'
  const onsenStatusClosed = c['onsenji_onsen_status_closed'] === 'true'
  const onsenStatusEventName = getLocalizedContent(c, 'onsenji_onsen_status_event_name', loc)
  const onsenStatusHours = getLocalizedContent(c, 'onsenji_onsen_status_hours', loc)
  const todayLabel = loc === 'en'
    ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    : `${new Date().getMonth() + 1}月${new Date().getDate()}日`
  const headingNews = getLocalizedContent(c, 'onsenji_heading_news', loc)
  const aboutTitle = getLocalizedContent(c, 'onsenji_about_title', loc)
  const headingGoryaku = getLocalizedContent(c, 'onsenji_heading_goryaku', loc)
  const headingMenu = getLocalizedContent(c, 'onsenji_heading_menu', loc)
  const headingGoshuin = getLocalizedContent(c, 'onsenji_heading_goshuin', loc)
  const goshuinDesc = getLocalizedContent(c, 'onsenji_goshuin_desc', loc)
  const headingAccess = getLocalizedContent(c, 'onsenji_heading_access', loc)
  const accessAddress = getLocalizedContent(c, 'onsenji_access_address', loc)
  const accessCar = getLocalizedContent(c, 'onsenji_access_car', loc)
  const accessBus = getLocalizedContent(c, 'onsenji_access_bus', loc)

  const supabase = await createServerClient()
  const { data: newsList } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .eq('site', 'onsenji')
    .order('published_at', { ascending: false })
    .limit(5)
  const news = (newsList ?? []) as News[]

  return (
    <>
      <HeaderOnsenji />
      <main>
        {/* ヒーロー */}
        <section className="relative h-[calc(var(--vh,1svh)*85)] min-h-[500px] flex items-center justify-center overflow-hidden bg-onsenji">
          <div className="absolute inset-0 opacity-30">
            <ZoomableImage src="/images/onsenji/hero/onsenji-main.png" alt="温泉寺" fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-onsenji/60 via-onsenji/30 to-onsenji/80" />
          <div className="relative text-center px-4 text-white">
            <p className="text-[#7ec8a4] text-xs tracking-[0.4em] mb-4">{c.onsenji_hero_en}</p>
            <h1 className="font-serif text-3xl md:text-5xl tracking-widest whitespace-pre-line leading-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {heroSub}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onsenji/about"
                className="px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm tracking-wide">
                {t('ctaAbout')}
              </Link>
              <Link href="/onsenji/onsen"
                className="px-8 py-3 border border-white/60 text-white rounded-full hover:bg-white/10 transition-colors text-sm tracking-wide">
                {t('ctaOnsen')}
              </Link>
            </div>
            {onsenStatusEnabled && (
              <div className="mt-8 flex justify-center">
                {onsenStatusClosed ? (
                  <div className="inline-flex items-center gap-3 bg-[#c0524a] text-white px-6 py-4 rounded-2xl shadow-xl">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <p className="text-sm md:text-base font-bold leading-snug text-left">
                      {loc === 'en'
                        ? `Bathing is unavailable today due to ${onsenStatusEventName}.`
                        : `本日　${onsenStatusEventName}の為、ご入浴できません`}
                    </p>
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-center gap-1.5 bg-white text-onsenji px-8 py-5 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7ec8a4] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3f8c68]" />
                      </span>
                      <p className="text-lg md:text-2xl font-bold tracking-wide whitespace-nowrap">
                        {todayLabel}　{loc === 'en' ? 'Hot Spring Open Today' : '温泉営業中'}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-onsenji/70">{onsenStatusHours}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs tracking-widest">SCROLL</span>
            <span className="block w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </section>

        {/* お知らせ */}
        <section className="py-14" style={{backgroundColor: 'rgba(126,200,164,0.08)'}}>
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">News</p>
              <h2 className="font-serif text-2xl text-onsenji tracking-widest">{headingNews}</h2>
              <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
            </div>
            {news.length > 0 ? (
              <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                {news.map(n => (
                  <li key={n.id}>
                    <Link href={`/onsenji/news/${n.id}`} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-5 py-4 hover:bg-onsenji/5 transition-colors group">
                      <span className="text-xs text-gray-400 whitespace-nowrap sm:pt-0.5 sm:w-24 sm:flex-shrink-0">
                        {new Date(n.published_at ?? n.created_at).toLocaleDateString('ja-JP')}
                      </span>
                      <span className="badge bg-onsenji/10 text-onsenji text-[10px] flex-shrink-0 w-fit">{n.category}</span>
                      <span className="text-sm leading-relaxed group-hover:text-[#2d6b57] transition-colors truncate">{n.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-white rounded-lg shadow-sm px-5 py-8 text-center text-gray-400 text-sm">
                {t('newsEmpty')}
              </div>
            )}
            <div className="text-center mt-6">
              <Link href="/onsenji/news" className="text-onsenji text-sm border-b border-onsenji/40 hover:border-[#2d6b57] hover:text-[#2d6b57] transition-colors pb-0.5">
                {t('newsMore')}
              </Link>
            </div>
          </div>
        </section>

        {/* 温泉寺について */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">About</p>
              <h2 className="font-serif text-2xl md:text-3xl text-onsenji tracking-widest">{aboutTitle}</h2>
              <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { img: '/images/onsenji/hero/yakusido.png', href: '/onsenji/history' },
                { img: '/images/onsenji/hero/onsenmado.png', href: '/onsenji/about#hours' },
                { img: '/images/onsenji/common/onsenji-gaikan.png', href: '/onsenji/grounds' },
                { img: '/images/onsenji/events/yakushiko/saitougoma-onsen.JPEG', href: '/onsenji/events' },
              ].map(({ img, href }, i) => (
                <a key={href} href={href}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col group">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={img} alt={aboutCards[i]?.label ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-onsenji/30 group-hover:bg-onsenji/5 transition-colors" />
                  </div>
                  <div className="p-3 text-center flex flex-col items-center gap-1 flex-1">
                    <p className="font-serif text-onsenji font-medium text-sm group-hover:text-[#2d6b57] transition-colors">{aboutCards[i]?.label}</p>
                    <p className="text-xs text-gray-500">{aboutCards[i]?.desc}</p>
                    <span className="mt-auto inline-block text-xs bg-onsenji text-white rounded px-3 py-1.5">{t('seeMore')}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 主なご利益 */}
        <section className="py-16" style={{backgroundColor: 'rgba(26,74,58,0.05)'}}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">Goryaku</p>
              <h2 className="font-serif text-2xl text-onsenji tracking-widest">{headingGoryaku}</h2>
              <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {goryakuCards.map(({ icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 text-center shadow-sm border-t-4 border-[#7ec8a4]">
                  <p className="text-3xl mb-3">{icon}</p>
                  <p className="font-serif text-onsenji font-medium mb-2 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 温泉・体験メニュー */}
        <section id="experience" className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">Menu</p>
            <h2 className="font-serif text-2xl text-onsenji tracking-widest">{headingMenu}</h2>
            <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { src: '/images/onsenji/common/onsen.png', sub: 'Onsen', href: '/onsenji/onsen' },
              { src: '/images/onsenji/hero/onsenji-shakyou-card-wide.png', sub: 'Shakyou', href: '/onsenji/experience/shakyou' },
              { src: '/images/onsenji/hero/onsenji-shabutu-card-wide.png', sub: 'Shabutu', href: '/onsenji/experience/shabutu' },
            ].map(({ src, sub, href }, i) => (
              <Link key={href} href={href}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="relative h-40">
                  <Image src={src} alt={menuCards[i]?.title || sub} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">{sub}</p>
                  <h3 className="font-serif text-onsenji font-medium mb-2">{menuCards[i]?.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{menuCards[i]?.desc}</p>
                  <p className="text-onsenji text-xs mt-3 group-hover:underline">{t('seeMore')} →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 御朱印 */}
        <section className="py-16" style={{backgroundColor: 'rgba(26,74,58,0.05)'}}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">Goshuin</p>
              <h2 className="font-serif text-2xl text-onsenji tracking-widest">{headingGoshuin}</h2>
              <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
            </div>
            <div className="max-w-xl mx-auto">
              <Link href="/onsenji/goshuin"
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-6 p-6">
                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl" style={{backgroundColor: 'rgba(26,74,58,0.1)'}}>
                  <span className="text-4xl">📜</span>
                </div>
                <div>
                  <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">Goshuin</p>
                  <h3 className="font-serif text-onsenji font-medium mb-2">{headingGoshuin}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{goshuinDesc}</p>
                  <p className="text-onsenji text-xs mt-2 group-hover:underline">{t('seeMore')} →</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* アクセス */}
        <section id="access" className="py-16" style={{backgroundColor: 'rgba(126,200,164,0.08)'}}>
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">Access</p>
              <h2 className="font-serif text-2xl text-onsenji tracking-widest">{headingAccess}</h2>
              <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=日光山温泉寺+栃木県日光市湯元2559&output=embed&hl=ja&z=16"
                width="100%"
                height="256"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="日光山温泉寺 地図"
              />
              <div className="p-6 grid md:grid-cols-3 gap-4">
                {[
                  { icon: '📍', title: t('accessAddressLabel'), body: accessAddress },
                  { icon: '🚗', title: t('accessCarLabel'), body: accessCar },
                  { icon: '🚌', title: t('accessBusLabel'), body: accessBus },
                ].map(({ icon, title, body }) => (
                  <div key={title}>
                    <p className="font-medium text-onsenji text-sm mb-1">{icon} {title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterOnsenji />
    </>
  )
}
