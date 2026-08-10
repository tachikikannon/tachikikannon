export const dynamic = 'force-dynamic'

import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import RecordsCarousel from '@/components/RecordsCarousel'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'
import type { News, Event, Post } from '@/types'

const DEFAULT_ABOUT_CARDS = [
  { label: '立木観音の歴史', desc: '歴史と縁起' },
  { label: '拝観料金',       desc: '拝観料・各種料金' },
  { label: '境内のご案内',   desc: '見どころ・境内マップ' },
  { label: '年間行事',       desc: '法要・行事のご案内' },
]
const DEFAULT_ABOUT_CARDS_EN = [
  { label: 'History of Tachiki Kannon', desc: 'History & origins' },
  { label: 'Admission Fees',            desc: 'Admission & other fees' },
  { label: 'Grounds Guide',             desc: 'Highlights & temple map' },
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
  top_heading_experience: '祈る・体験する',
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

  return (
    <>
      <Header />
      <main>
        {/* ヒーロー */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <ZoomableImage src="/images/main2.png" alt="中禅寺 立木観音" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-navy/50" />
          <div className="relative text-center text-white px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-4 opacity-0 motion-reduce:opacity-100 [animation:fade-up_1.1s_ease-out_0.15s_forwards] motion-reduce:[animation:none]">{heroEn}</p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-wider leading-snug mb-6 opacity-0 motion-reduce:opacity-100 [animation:fade-up_1.3s_ease-out_0.5s_forwards] motion-reduce:[animation:none]">
              {heroTitle.split('\\n').map((line, i) => (
                <span key={i}>{line}{i < heroTitle.split('\\n').length - 1 && <br />}</span>
              ))}
            </h1>
            <div className="flex flex-wrap gap-3 justify-center opacity-0 motion-reduce:opacity-100 [animation:fade-up_1.1s_ease-out_1.05s_forwards] motion-reduce:[animation:none]">
              <Link href="/about" className="btn-gold">{t('ctaAbout')}</Link>
              <Link href="/prayer" className="btn-outline">{t('ctaPrayer')}</Link>
              <Link href="/#access" className="btn-outline">{t('ctaAccess')}</Link>
            </div>
          </div>
        </section>

        {/* SNSバナー */}
        <section className="bg-navy py-6">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-white/60 text-xs text-center tracking-widest mb-4">{headingSns}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { href:'https://www.instagram.com/tachikikannon/', label:'Instagram', id:'@tachikikannon', bg:'bg-gradient-to-br from-pink-500 to-purple-600' },
                { href:'https://x.com/tachikikannon13', label:'X', id:'@tachikikannon13', bg:'bg-black' },
                { href:'https://www.youtube.com/@tachikikannon', label:'YouTube', id:'@tachikikannon', bg:'bg-red-600' },
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
                {(newsList as News[]).map((n) => (
                  <li key={n.id}>
                    <Link href={`/news/${n.id}`} className="flex items-start gap-4 px-5 py-4 hover:bg-cream-alt transition-colors group">
                      <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5 w-24 flex-shrink-0">
                        {new Date(n.published_at ?? n.created_at).toLocaleDateString('ja-JP')}
                      </span>
                      <span className="badge bg-navy/10 text-navy text-[10px] flex-shrink-0">{n.category}</span>
                      <span className="text-sm leading-relaxed group-hover:text-gold transition-colors">{n.title}</span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { img: '/images/dragon.jpg',  href: '/history' },
                { img: '/images/haikan.png',  href: '/about#hours' },
                { img: '/images/godaido.jpg', href: '/grounds' },
                { img: '/images/gyouji.JPEG', href: '/annual-events' },
              ].map(({ img, href }, i) => (
                <a key={href} href={href}
                  className="relative h-40 rounded-lg overflow-hidden shadow-sm group block">
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
        <section id="prayer" className="py-16 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-title">{t('prayerHeading')}</h2>
            <div className="section-divider" />
            <Link href="/prayer" className="block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img src="/images/goma-card.png" alt={prayerCard?.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-navy text-lg md:text-xl mb-1">{prayerCard?.label}</h3>
                  <p className="text-sm text-gray-600">{prayerCard?.sub}</p>
                </div>
                <span className="inline-block text-sm bg-navy text-white rounded-full px-6 py-2.5 group-hover:bg-navy/80 transition-colors flex-shrink-0">
                  {t('seeMore')}
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 体験する */}
        <section id="experience" className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{t('experienceHeading')}</h2>
            <div className="section-divider" />
            <div className="grid gap-3 h-[420px] md:h-[380px]" style={{ gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: 'repeat(3, 1fr)' }}>
              {[
                { src:'/images/jyuzu-card.png',   href:'/experience/jyuzu' },
                { src:'/images/syakyou-card.png', href:'/experience/shakyou' },
                { src:'/images/syabutu-card.png', href:'/experience/shabutu' },
                { src:'/images/zazen.png',        href:'/experience/zazen' },
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

        {/* 季節の中禅寺 */}
        <section className="py-16 bg-cream-alt">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{t('seasonalHeading')}</h2>
            <div className="section-divider" />
            <div className="grid grid-cols-2 gap-1">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <ZoomableImage src="/images/godaido.jpg" alt={t('seasonalCaption1')} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent pointer-events-none" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs tracking-wide">{t('seasonalCaption1')}</p>
              </div>
              <div className="relative h-64 md:h-80 overflow-hidden">
                <ZoomableImage src="/images/dragon.jpg" alt={t('seasonalCaption2')} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent pointer-events-none" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs tracking-wide">{t('seasonalCaption2')}</p>
              </div>
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
                  <img src="/images/gosyuin-main.png" alt={serviceCards[0]?.title} className="w-full h-full object-cover scale-125" />
                </div>
                <h3 className="font-serif text-navy text-lg mb-2">{serviceCards[0]?.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{serviceCards[0]?.text}</p>
                <p className="text-xs text-gold font-medium mb-4">{serviceCards[0]?.info}</p>
                <span className="btn-primary text-sm px-4 py-2">{t('seeMore')}</span>
              </Link>

              <div className="card p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img src="/images/jyuyohin-main.png" alt={serviceCards[1]?.title} className="w-full h-full object-cover scale-125" />
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
