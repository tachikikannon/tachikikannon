export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { News, Event } from '@/types'

const DEFAULT_ABOUT_CARDS = [
  { label: '立木観音の歴史', desc: '歴史と縁起' },
  { label: '拝観料金',       desc: '拝観料・各種料金' },
  { label: '境内のご案内',   desc: '見どころ・境内マップ' },
  { label: '年間行事',       desc: '法要・行事のご案内' },
]
const DEFAULT_EXPERIENCE_CARDS = [
  { label: '御祈願',        sub: '御祈願料：5,000円〜' },
  { label: '数珠づくり体験', sub: '2,000円〜' },
  { label: '写経体験',      sub: '約15分 / 1,000円' },
  { label: '写仏体験',      sub: '1,000円' },
]
const DEFAULT_SERVICE_CARDS = [
  { title: '御朱印',       text: '中禅寺ならではの御朱印をお受けいただけます。書き入れのほか書き置きもございます。', info: '御朱印代：500円〜' },
  { title: '授与品・通販', text: 'お守り・お札など各種授与品をご用意しております。一部通販でもお求めいただけます。', info: '通販サイトでもご購入いただけます' },
]

const DEFAULT_CONTENT: Record<string, string> = {
  hero_en:        'Nikkozan Chuzenji Temple',
  hero_title:     '中禅寺湖畔に佇む、\n祈りと巡礼の寺',
  access_address: '〒321-1661\n栃木県日光市中宮祠2578',
  access_car:     '日光宇都宮道路 日光ICより約40分\n（いろは坂経由）',
  access_bus:     '東武日光駅よりバスで約50分\n「中禅寺温泉」バス停より徒歩3分',
  top_sns_heading:      '公式SNSでも最新情報を発信中',
  top_heading_news:       'お知らせ',
  top_heading_about:      '立木観音について',
  top_heading_events:     '近日の行事',
  top_heading_experience: '祈る・体験する',
  top_heading_service:    '受ける',
  top_heading_access:     'アクセス',
  top_about_cards:      JSON.stringify(DEFAULT_ABOUT_CARDS),
  top_experience_cards: JSON.stringify(DEFAULT_EXPERIENCE_CARDS),
  top_service_cards:    JSON.stringify(DEFAULT_SERVICE_CARDS),
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

export default async function HomePage() {
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
  const aboutCards      = pj<typeof DEFAULT_ABOUT_CARDS>(content.top_about_cards, DEFAULT_ABOUT_CARDS)
  const experienceCards = pj<typeof DEFAULT_EXPERIENCE_CARDS>(content.top_experience_cards, DEFAULT_EXPERIENCE_CARDS)
  const serviceCards    = pj<typeof DEFAULT_SERVICE_CARDS>(content.top_service_cards, DEFAULT_SERVICE_CARDS)

  const { data: newsList } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(5)

  const today = new Date().toISOString().split('T')[0]
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', today)
    .order('start_date')
    .limit(4)

  return (
    <>
      <Header />
      <main>
        {/* ヒーロー */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <ZoomableImage src="/images/main2.png" alt="中禅寺 立木観音" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-navy/50" />
          <div className="relative text-center text-white px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-4">{content.hero_en}</p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-wider leading-snug mb-6">
              {content.hero_title.split('\\n').map((line, i) => (
                <span key={i}>{line}{i < content.hero_title.split('\\n').length - 1 && <br />}</span>
              ))}
            </h1>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/about" className="btn-gold">参拝のご案内</Link>
              <Link href="/prayer" className="btn-outline">御祈願を見る</Link>
              <Link href="/#access" className="btn-outline">アクセスを見る</Link>
            </div>
          </div>
        </section>

        {/* SNSバナー */}
        <section className="bg-navy py-6">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-white/60 text-xs text-center tracking-widest mb-4">{content.top_sns_heading}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { href:'https://www.instagram.com/tachikikannon/', label:'Instagram', id:'@tachikikannon', bg:'bg-gradient-to-br from-pink-500 to-purple-600' },
                { href:'https://x.com/tachikikannon13', label:'X', id:'@tachikikannon13', bg:'bg-black' },
                { href:'https://www.youtube.com/@tachikikannon', label:'YouTube', id:'@tachikikannon', bg:'bg-red-600' },
                { href:'#', label:'TikTok', id:'@tachikikannon', bg:'bg-gray-900' },
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
            <h2 className="section-title">{content.top_heading_news}</h2>
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
                現在お知らせはありません
              </div>
            )}
            <div className="text-center mt-6">
              <Link href="/news" className="text-navy text-sm border-b border-navy pb-0.5 hover:text-gold hover:border-gold transition-colors">
                お知らせ一覧を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 立木観音について */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">{content.top_heading_about}</h2>
            <div className="section-divider" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { img: '/images/dragon.jpg',  href: '/history' },
                { img: '/images/haikan.png',  href: '/about#hours' },
                { img: '/images/godaido.jpg', href: '/grounds' },
                { img: '/images/gyouji.JPEG', href: '/annual-events' },
              ].map(({ img, href }, i) => (
                <a key={href} href={href}
                  className="card overflow-hidden flex flex-col group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={img} alt={aboutCards[i]?.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/20 transition-colors" />
                  </div>
                  <div className="p-3 text-center flex flex-col items-center gap-1 flex-1">
                    <p className="font-serif text-navy font-medium text-sm group-hover:text-gold transition-colors">{aboutCards[i]?.label}</p>
                    <p className="text-xs text-gray-500">{aboutCards[i]?.desc}</p>
                    <span className="mt-auto inline-block text-xs bg-navy text-white rounded px-3 py-1.5">詳しく見る</span>
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
              <h2 className="section-title">{content.top_heading_events}</h2>
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
                  行事カレンダーをすべて見る →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 祈る・体験する */}
        <section id="experience" className="py-16 bg-cream-alt">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="section-title">祈る・体験する</h2>
            <div className="section-divider" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { src:'/images/gogigan.JPG', href:'/prayer' },
                { src:'/images/jyuzu.png',   href:'/experience/jyuzu' },
                { src:'/images/syakyou.JPG', href:'/experience/shakyou' },
                { src:'/images/syabutu.png', href:'/experience/shabutu' },
              ].map(({ src, href }, i) => (
                <div key={href} className="card overflow-hidden flex flex-col">
                  <div className="relative h-40">
                    <ZoomableImage src={src} alt={experienceCards[i]?.label} fill className="object-cover" />
                  </div>
                  <div className="p-3 text-center flex flex-col items-center gap-1 flex-1">
                    <p className="font-medium text-navy text-sm">{experienceCards[i]?.label}</p>
                    <p className="text-xs text-gray-500">{experienceCards[i]?.sub}</p>
                    <Link href={href} className="mt-auto inline-block text-xs bg-navy text-white rounded px-3 py-1.5 hover:bg-navy/80 transition-colors">
                      詳しく見る
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 受ける */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="section-title">{content.top_heading_service}</h2>
            <div className="section-divider" />
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { icon:'📜', href:'/goshuin', cta:'詳しく見る', external:false },
                { icon:'🎁', href:'https://chuzenji.official.ec/', cta:'通販サイトへ', external:true },
              ].map(({ icon, href, cta, external }, i) => (
                <div key={href} className="card p-6 text-center">
                  <p className="text-4xl mb-4">{icon}</p>
                  <h3 className="font-serif text-navy text-lg mb-2">{serviceCards[i]?.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{serviceCards[i]?.text}</p>
                  <p className="text-xs text-gold font-medium mb-4">{serviceCards[i]?.info}</p>
                  {external
                    ? <a href={href} target="_blank" rel="noopener" className="btn-primary text-sm px-4 py-2">{cta}</a>
                    : <Link href={href} className="btn-primary text-sm px-4 py-2">{cta}</Link>
                  }
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* アクセス */}
        <section id="access" className="py-16 bg-cream-alt">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-title">{content.top_heading_access}</h2>
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
                  { icon:'📍', title:'住所', body: content.access_address },
                  { icon:'🚗', title:'車でのアクセス', body: content.access_car },
                  { icon:'🚌', title:'電車・バスでのアクセス', body: content.access_bus },
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
