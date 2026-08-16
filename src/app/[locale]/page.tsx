export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RecordsCarousel from '@/components/RecordsCarousel'
import ChuzenjiGallery from '@/components/ChuzenjiGallery'
import YouTubeAutoplay from '@/components/YouTubeAutoplay'
import HeroReveal from '@/components/HeroReveal'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getLocalizedContent, pickLocalized } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'
import type { News, Event, Post } from '@/types'

const DEFAULT_ABOUT_CARDS = [
  { label: '立木観音の歴史', desc: '歴史と縁起' },
  { label: '拝観料金',       desc: '拝観料・各種料金' },
  { label: '境内のご案内',   desc: '見どころ・境内マップ' },
  { label: '花ごよみ',       desc: '四季折々の花' },
  { label: '年間行事',       desc: '法要・行事のご案内' },
]
const DEFAULT_ABOUT_CARDS_EN = [
  { label: 'History of Tachiki Kannon', desc: 'History & origins' },
  { label: 'Admission Fees',            desc: 'Admission & other fees' },
  { label: 'Grounds Guide',             desc: 'Highlights & temple map' },
  { label: 'Flower Calendar',           desc: 'Seasonal flowers' },
  { label: 'Annual Events',             desc: 'Services & event information' },
]
const DEFAULT_EXPERIENCE_CARDS = [
  { label: '御祈願',        sub: '御祈願料：5,000円〜' },
  { label: '数珠づくり体験', sub: '2,000円〜' },
  { label: '写経体験',      sub: '約15分 / 1,000円' },
  { label: '写仏体験',      sub: '1,000円' },
  { label: '坐禅体験',      sub: '20分 / 2,000円' },
]
const DEFAULT_EXPERIENCE_CARDS_EN = [
  { label: 'Prayer Service',           sub: 'From ¥5,000' },
  { label: 'Juzu Bracelet Making',     sub: 'From ¥2,000' },
  { label: 'Sutra Copying',            sub: 'Approx. 15 min / ¥1,000' },
  { label: 'Buddhist Image Tracing',   sub: '¥1,000' },
  { label: 'Zazen Meditation',         sub: '20 min / ¥2,000' },
]
const DEFAULT_SERVICE_CARDS = [
  { title: '御朱印',       text: '中禅寺ならではの御朱印をお受けいただけます。書き入れのほか書き置きもございます。', info: '御朱印代：500円〜' },
  { title: '授与品・通販', text: 'お守り・お札など各種授与品をご用意しております。通販サイトのほか、代金引換でもお求めいただけます。', info: '通販サイト／代金引換からお選びいただけます' },
]
const DEFAULT_SERVICE_CARDS_EN = [
  { title: 'Goshuin Stamps',    text: "Receive Chuzenji's own goshuin stamp, either hand-written or pre-inscribed.", info: 'From ¥500' },
  { title: 'Amulets & Mail Order', text: 'Omamori charms, ofuda tablets, and other items are available online or by cash-on-delivery order.', info: 'Choose online shop or cash-on-delivery' },
]
const DEFAULT_GALLERY_SLIDES = [
  { src: '/images/chuzenji/common/godaido.jpg', alt: '五大堂', month: '',
    caption_ja: '五大堂 — 中禅寺湖を望む舞台', caption_en: 'Godaido Hall — overlooking Lake Chuzenji' },
  { src: '/images/chuzenji/common/dragon.jpg', alt: '立木観音 境内', month: '',
    caption_ja: '本堂を包む新緑', caption_en: 'Fresh greenery around the main hall' },
  { src: '/images/chuzenji/gallery/yakan-sanpai.jpg', alt: '夜間参拝', month: '10月',
    caption_ja: '夜間参拝 — 灯りに浮かぶ本堂', caption_en: 'Night visiting — the hall lit after dark' },
  { src: '/images/chuzenji/gallery/ongakusai.jpg', alt: '音楽祭', month: '5月',
    caption_ja: '音楽祭 — 天井の龍の下で', caption_en: 'Music Festival beneath the dragon ceiling' },
  { src: '/images/chuzenji/gallery/yoga.jpg', alt: 'YOGA IN 五大堂', month: '6月',
    caption_ja: 'YOGA IN 五大堂', caption_en: 'YOGA IN Godaido' },
  { src: '/images/chuzenji/gallery/classical-music.jpg', alt: 'クラシックコンサート', month: '5月',
    caption_ja: '湖を望むピアノコンサート', caption_en: 'A piano recital overlooking the lake' },
]

const DEFAULT_CONTENT: Record<string, string> = {
  hero_en:        'Nikkozan Chuzenji Temple',
  hero_title:     '中禅寺湖畔に佇む、\n祈りと巡礼の寺',
  hero_title_en:  'A temple of prayer and pilgrimage\non the shore of Lake Chuzenji',
  access_address: '〒321-1661\n栃木県日光市中宮祠2578',
  access_address_en: '2578 Chugushi, Nikko, Tochigi 321-1661, Japan',
  access_car:     '日光宇都宮道路 日光ICより約40分\n（いろは坂経由）',
  access_car_en:  'Approx. 40 min from Nikko IC on the Nikko-Utsunomiya Road\n(via Irohazaka)',
  access_bus:     '東武日光駅よりバスで約50分\n「中禅寺温泉」バス停より徒歩3分',
  access_bus_en:  'Approx. 50 min by bus from Tobu-Nikko Station\n3 min walk from "Chuzenji-Onsen" bus stop',
  top_sns_heading:      '公式SNSでも最新情報を発信中',
  top_sns_heading_en:   'Follow us on social media for the latest updates',
  top_heading_news:       'お知らせ',
  top_heading_news_en:    'News',
  top_heading_about:      '立木観音について',
  top_heading_about_en:   'About Tachiki Kannon',
  top_heading_events:     '近日の行事',
  top_heading_events_en:  'Upcoming Events',
  top_heading_service:    '受ける',
  top_heading_service_en: 'Receive',
  top_heading_records:    '過去の実績',
  top_heading_records_en: 'Past Events',
  top_heading_access:     'アクセス',
  top_heading_access_en:  'Access',
  top_about_cards:      JSON.stringify(DEFAULT_ABOUT_CARDS),
  top_about_cards_en:   JSON.stringify(DEFAULT_ABOUT_CARDS_EN),
  top_experience_cards: JSON.stringify(DEFAULT_EXPERIENCE_CARDS),
  top_experience_cards_en: JSON.stringify(DEFAULT_EXPERIENCE_CARDS_EN),
  top_service_cards:    JSON.stringify(DEFAULT_SERVICE_CARDS),
  top_service_cards_en: JSON.stringify(DEFAULT_SERVICE_CARDS_EN),
  top_gallery_slides:   JSON.stringify(DEFAULT_GALLERY_SLIDES),
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('home')
  const supabase = await createServerSupabaseClient()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const siteContentRes = await fetch(`${supabaseUrl}/rest/v1/site_content?select=key,value`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    cache: 'no-store',
  })
  const siteContentRows: { key: string; value: string }[] = siteContentRes.ok ? await siteContentRes.json() : []
  const content: Record<string, string> = { ...DEFAULT_CONTENT }
  siteContentRows.forEach(row => { if (row.value) content[row.key] = row.value })
  const aboutCards      = pj<typeof DEFAULT_ABOUT_CARDS>(getLocalizedContent(content, 'top_about_cards', loc), DEFAULT_ABOUT_CARDS)
  const experienceCardsDefault = loc === 'en' ? DEFAULT_EXPERIENCE_CARDS_EN : DEFAULT_EXPERIENCE_CARDS
  const experienceCardsRaw = pj<typeof DEFAULT_EXPERIENCE_CARDS>(getLocalizedContent(content, 'top_experience_cards', loc), experienceCardsDefault)
  // 保存済みの内容が古い件数のままの場合（新しい体験カードをコード側に追加した直後など）に備え、
  // 不足分は最新のデフォルト値で補う。管理画面で保存し直せば正式な内容に置き換わる。
  // 配列の先頭（御祈願）は「祈る」の大きなカード、残り（数珠づくり・写経・写仏・坐禅）は
  // 「体験する」の一覧カードとして、それぞれ別セクションに分けて表示する。
  const experienceCardsAll = experienceCardsDefault.map((d, i) => experienceCardsRaw[i] ?? d)
  const prayerCard = experienceCardsAll[0]
  const experienceCards = experienceCardsAll.slice(1)
  const serviceCards    = pj<typeof DEFAULT_SERVICE_CARDS>(getLocalizedContent(content, 'top_service_cards', loc), DEFAULT_SERVICE_CARDS)

  const { data: newsList } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .eq('site', 'chuzenji')
    .order('published_at', { ascending: false })
    .limit(5)

  const { data: pastRecords } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_url, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  const today = new Date().toISOString().split('T')[0]
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', today)
    .order('start_date')
    .limit(4)

  const heroEn = getLocalizedContent(content, 'hero_en', loc)
  const heroTitle = getLocalizedContent(content, 'hero_title', loc)
  const accessAddress = getLocalizedContent(content, 'access_address', loc)
  const accessCar = getLocalizedContent(content, 'access_car', loc)
  const accessBus = getLocalizedContent(content, 'access_bus', loc)
  const headingSns = getLocalizedContent(content, 'top_sns_heading', loc)
  const headingNews = getLocalizedContent(content, 'top_heading_news', loc)
  const headingAbout = getLocalizedContent(content, 'top_heading_about', loc)
  const headingEvents = getLocalizedContent(content, 'top_heading_events', loc)
  const headingService = getLocalizedContent(content, 'top_heading_service', loc)
  const headingRecords = getLocalizedContent(content, 'top_heading_records', loc)
  const headingAccess = getLocalizedContent(content, 'top_heading_access', loc)

  // 管理画面「中禅寺ギャラリー」（/admin/chuzenji/gallery）で編集可能。
  // 日英でsrcが分かれないよう、1つのJSONにcaption_ja/caption_enを両方持たせている。
  const gallerySlidesRaw = pj<{ src: string; alt: string; month?: string; caption_ja: string; caption_en: string }[]>(
    content['top_gallery_slides'], DEFAULT_GALLERY_SLIDES
  )
  const gallerySlides = gallerySlidesRaw.map(s => ({
    src: s.src, alt: s.alt, month: s.month, caption: loc === 'en' ? (s.caption_en || s.caption_ja) : s.caption_ja,
  }))

  return (
    <>
      <Header />
      <main>
        {/* ヒーロー */}
        <HeroReveal
          className="min-h-[calc(var(--vh,1svh)*100)]"
          bottomLiftPx={60}
          staggerChildren
          eyebrow={heroEn}
          heading={heroTitle.replace(/\\n/g, '\n')}
          subheading={loc === 'en' ? undefined : '日光山中禅寺立木観音'}
          crestSrc="/images/chuzenji/common/jimon-navy-mask.png"
          darkColor="#1a2a4a"
          lightColor="#ffffff"
          eyebrowDarkColor="#c8a96e"
          eyebrowLightColor="#c8a96e"
          background={
            <Image src="/images/chuzenji/common/main2.png" alt="中禅寺 立木観音" fill className="object-cover" priority />
          }
        >
          <div className="hero-pop-buttons flex flex-wrap gap-3 justify-center">
            <Link href="/about" className="btn-gold">{t('ctaAbout')}</Link>
            <Link href="/prayer" className="btn-outline bg-white/15 backdrop-blur-sm">{t('ctaPrayer')}</Link>
            <Link href="/#access" className="btn-outline bg-white/15 backdrop-blur-sm">{t('ctaAccess')}</Link>
          </div>
        </HeroReveal>

        {/* SNSバナー */}
        <section className="bg-navy py-6">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-white/60 text-xs text-center tracking-widest mb-4">{headingSns}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { href:'https://www.instagram.com/tachikikannon/', label:'Instagram', id:'@tachikikannon', bg:'bg-gradient-to-br from-pink-500 to-purple-600' },
                { href:'https://x.com/tachikikannon13', label:'X', id:'@tachikikannon13', bg:'bg-black' },
                { href:'https://www.youtube.com/channel/UCAgVoWanU8Yetmnk6bpXCww', label:'YouTube', id:'@中禅寺立木観音', bg:'bg-red-600' },
                { href:'https://www.tiktok.com/@tachikikannon', label:'TikTok', id:'@tachikikannon', bg:'bg-gray-900' },
                { href:'https://line.me/R/ti/p/@201diwas', label:'LINE', id:'@201diwas', bg:'bg-[#06C755]' },
              ].map(({ href, label, id, bg }) => (
                <a key={label} href={href} target="_blank" rel="noopener"
                  className={`${bg} rounded-lg p-4 text-white text-center hover:opacity-90 transition-opacity`}>
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-[10px] opacity-70 mt-1">{id}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* お知らせ */}
        <section className="py-16 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-title">{headingNews}</h2>
            <div className="section-divider" />
            {newsList && newsList.length > 0 ? (
              <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                {(newsList as News[]).map((n) => {
                  const title = pickLocalized(loc, n.title, n.title_en)
                  const excerpt = pickLocalized(loc, n.excerpt ?? '', n.excerpt_en)
                  return (
                  <li key={n.id}>
                    <Link href={`/news/${n.id}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-4 hover:bg-cream-alt transition-colors group">
                      <span className="text-xs text-gray-400 whitespace-nowrap sm:w-24 sm:flex-shrink-0">
                        {new Date(n.published_at ?? n.created_at).toLocaleDateString('ja-JP')}
                      </span>
                      <span className="sm:w-32 sm:flex-shrink-0">
                        <span className="badge bg-navy/10 text-navy text-[13px] whitespace-nowrap">{n.category}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base leading-relaxed group-hover:text-gold transition-colors truncate">{title}</span>
                        {excerpt && <span className="hidden sm:block text-xs text-gray-400 mt-0.5 line-clamp-1">{excerpt}</span>}
                      </span>
                    </Link>
                  </li>
                  )
                })}
              </ul>
            ) : (
              <div className="bg-white rounded-lg shadow-sm px-5 py-8 text-center text-gray-400 text-sm">
                {t('newsEmpty')}
              </div>
            )}
            <div className="text-center mt-6">
              <Link href="/news" className="text-navy text-sm border-b border-navy pb-0.5 hover:text-gold hover:border-gold transition-colors">
                {t('newsMore')}
              </Link>
            </div>
          </div>
        </section>

        {/* 立木観音について */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{headingAbout}</h2>
            <div className="section-divider" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { img: '/images/chuzenji/common/dragon.jpg',   href: '/history' },
                { img: '/images/chuzenji/common/haikan.png',   href: '/about#hours' },
                { img: '/images/chuzenji/common/godaido.jpg',  href: '/grounds' },
                { img: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587020117-abdchotygni.JPG', href: '/flower-calendar' },
                { img: '/images/chuzenji/events/gyouji.JPEG',  href: '/annual-events' },
              ].map(({ img, href }, i, arr) => (
                <a key={href} href={href}
                  className={`relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-sm group block ${i === arr.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <img src={img} alt={aboutCards[i]?.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="font-serif text-white font-medium text-sm leading-snug min-h-[2.6em] flex items-end group-hover:text-gold transition-colors">{aboutCards[i]?.label}</p>
                    <p className="text-[11px] text-white/70 mt-0.5">{aboutCards[i]?.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 行事カレンダー（直近） */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="section-title">{headingEvents}</h2>
              <div className="section-divider" />
              <div className="grid md:grid-cols-2 gap-4">
                {(upcomingEvents as Event[]).map((ev) => (
                  <div key={ev.id} className="card p-4 flex gap-4 items-start">
                    <div className="bg-navy text-white text-center rounded px-3 py-2 min-w-[56px]">
                      <p className="text-[10px] opacity-70">{new Date(ev.start_date).toLocaleDateString('ja-JP',{month:'short'})}</p>
                      <p className="text-2xl font-serif leading-none">{new Date(ev.start_date).getDate()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-navy text-sm">{ev.title}</p>
                      {ev.description && <p className="text-xs text-gray-500 mt-1">{ev.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/events" className="text-navy text-sm border-b border-navy pb-0.5 hover:text-gold hover:border-gold transition-colors">
                  {t('eventsMore')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 祈る */}
        <section id="prayer" className="relative h-80 md:h-[28rem] overflow-hidden group">
          <img src="/images/chuzenji/hero/goma-card.png" alt={prayerCard?.label}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/10" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-4">PRAYER</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wider mb-4">{prayerCard?.label}</h2>
            <p className="text-white/70 text-sm mb-8">{prayerCard?.sub}</p>
            <Link href="/prayer" className="btn-gold">{t('seeMore')}</Link>
          </div>
        </section>

        {/* 体験する */}
        <section id="experience" className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{t('experienceHeading')}</h2>
            <div className="section-divider" />
            <div className="grid gap-3 h-[420px] md:h-[380px]" style={{ gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: 'repeat(3, 1fr)' }}>
              {[
                { src:'/images/chuzenji/hero/jyuzu-card.png',   href:'/experience/jyuzu' },
                { src:'/images/chuzenji/hero/syakyou-card.png', href:'/experience/shakyou' },
                { src:'/images/chuzenji/hero/syabutu-card.png', href:'/experience/shabutu' },
                { src:'/images/chuzenji/experience/zazen/zazen-card-monk.png', href:'/experience/zazen' },
              ].map(({ src, href }, i) => (
                <Link key={href} href={href}
                  className="relative rounded-lg overflow-hidden shadow-sm group block"
                  style={i === 0 ? { gridRow: '1 / span 3' } : undefined}>
                  <img src={src} alt={experienceCards[i]?.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <div className={`absolute inset-x-0 bottom-0 ${i === 0 ? 'p-5' : 'p-2.5'}`}>
                    <p className={`font-medium text-white ${i === 0 ? 'text-base mb-1' : 'text-xs'}`}>{experienceCards[i]?.label}</p>
                    <p className={`text-white/75 ${i === 0 ? 'text-xs' : 'text-[10px]'}`}>{experienceCards[i]?.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 受ける */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="section-title">{headingService}</h2>
            <div className="section-divider" />
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="/goshuin" className="card card-selectable p-6 text-center block">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img src="/images/chuzenji/common/gosyuin-main.png" alt={serviceCards[0]?.title} className="w-full h-full object-cover scale-125" />
                </div>
                <h3 className="font-serif text-navy text-lg mb-2">{serviceCards[0]?.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{serviceCards[0]?.text}</p>
                <p className="text-xs text-gold font-medium mb-4">{serviceCards[0]?.info}</p>
                <span className="btn-primary text-sm px-4 py-2">{t('seeMore')}</span>
              </Link>

              <div className="card p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img src="/images/chuzenji/hero/jyuyohin-main.png" alt={serviceCards[1]?.title} className="w-full h-full object-cover scale-125" />
                </div>
                <h3 className="font-serif text-navy text-lg mb-2">{serviceCards[1]?.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{serviceCards[1]?.text}</p>
                <p className="text-xs text-gold font-medium mb-4">{serviceCards[1]?.info}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="https://chuzenji.official.ec/" target="_blank" rel="noopener"
                    className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
                    {t('shopLink')}
                  </a>
                  <Link href="/order/cod"
                    className="inline-block border-2 border-navy text-navy text-sm px-4 py-2 rounded font-medium tracking-wider hover:bg-navy hover:text-white transition-colors whitespace-nowrap">
                    {t('codLink')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 中禅寺ギャラリー */}
        <section className="py-16 bg-cream-alt">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{t('galleryHeading')}</h2>
            <div className="section-divider" />
            <div className="rounded-xl overflow-hidden shadow-sm mb-4 aspect-video">
              <YouTubeAutoplay videoId="LkCwCjWsjUM" alt={t('galleryHeading')} className="h-full" />
            </div>
            <ChuzenjiGallery slides={gallerySlides} />
          </div>
        </section>

        {/* 過去の実績 */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{headingRecords}</h2>
            <div className="section-divider" />
            {pastRecords && pastRecords.length > 0 ? (
              <>
                <RecordsCarousel posts={pastRecords as Post[]} noImageLabel={t('noImage')} />
                <div className="text-center mt-6">
                  <Link href="/blog" className="text-navy text-sm border-b border-navy pb-0.5 hover:text-gold hover:border-gold transition-colors">
                    {t('recordsMore')}
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm px-5 py-8 text-center text-gray-400 text-sm">
                {t('recordsEmpty')}
              </div>
            )}
          </div>
        </section>

        {/* アクセス */}
        <section id="access" className="py-16 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-title">{headingAccess}</h2>
            <div className="section-divider" />
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=栃木県日光市中宮祠2578+中禅寺立木観音&output=embed&hl=ja&z=16"
                width="100%"
                height="256"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6 grid md:grid-cols-3 gap-4">
                {[
                  { icon:'📍', title: t('accessAddressLabel'), body: accessAddress },
                  { icon:'🚗', title: t('accessCarLabel'), body: accessCar },
                  { icon:'🚌', title: t('accessBusLabel'), body: accessBus },
                ].map(({ icon, title, body }) => (
                  <div key={title}>
                    <p className="font-medium text-navy text-sm mb-1">{icon} {title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
