export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { News, Event } from '@/types'

const DEFAULT_CONTENT: Record<string, string> = {
  hero_en:        'Nikkozan Chuzenji Temple',
  hero_title:     '中禅寺湖畔に佇む、\n祈りと巡礼の寺',
  access_address: '〒321-1661\n栃木県日光市中宮祠2578',
  access_car:     '日光宇都宮道路 日光ICより約40分\n（いろは坂経由）',
  access_bus:     '東武日光駅よりバスで約50分\n「中禅寺温泉」バス停より徒歩3分',
}

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
  siteContentRows.forEach(row => { content[row.key] = row.value })

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
          <Image src="/images/main2.png" alt="中禅寺 立木観音" fill className="object-cover" priority />
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
            <p className="text-white/60 text-xs text-center tracking-widest mb-4">公式SNSでも最新情報を発信中</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { href:'https://www.instagram.com/tachikikannon/', label:'Instagram', id:'@tachikikannon', bg:'bg-gradient-to-br from-pink-500 to-purple-600' },
                { href:'https://x.com/tachikikannon13', label:'X', id:'@tachikikannon13', bg:'bg-black' },
                { href:'https://www.youtube.com/@tachikikannon', label:'YouTube', id:'@tachikikannon', bg:'bg-red-600' },
                { href:'#', label:'TikTok', id:'@tachikikannon', bg:'bg-gray-900' },
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
            <h2 className="section-title">お知らせ</h2>
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
            <h2 className="section-title">立木観音について</h2>
            <div className="section-divider" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { img: '/images/dragon.jpg',  label: '立木観音の歴史', desc: '歴史と縁起', href: '/history' },
                { img: '/images/haikan.png',  label: '拝観料金',       desc: '拝観料・各種料金', href: '/about#hours' },
                { img: '/images/godaido.jpg', label: '境内のご案内',   desc: '見どころ・境内マップ', href: '/grounds' },
                { img: '/images/gyouji.JPEG', label: '年間行事',       desc: '法要・行事のご案内', href: '/annual-events' },
              ].map(({ img, label, desc, href }) => (
                <a key={label} href={href}
                  className="card overflow-hidden flex flex-col group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/20 transition-colors" />
                  </div>
                  <div className="p-3 text-center flex flex-col items-center gap-1 flex-1">
                    <p className="font-serif text-navy font-medium text-sm group-hover:text-gold transition-colors">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
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
              <h2 className="section-title">近日の行事</h2>
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
                { src:'/images/gyouji.JPEG', label:'御祈願',      sub:'御祈願料：5,000円〜', href:'/prayer' },
                { src:'/images/jyuzu.png',   label:'数珠づくり体験', sub:'2,000円〜', href:'/experience/jyuzu' },
                { src:'/images/syakyou.JPG', label:'写経体験',    sub:'約15分 / 1,000円', href:'/experience/shakyou' },
                { src:'/images/syabutu.png', label:'写仏体験',    sub:'1,000円', href:'/experience/shabutu' },
              ].map(({ src, label, sub, href }) => (
                <div key={label} className="card overflow-hidden flex flex-col">
                  <div className="relative h-40">
                    <Image src={src} alt={label} fill className="object-cover" />
                  </div>
                  <div className="p-3 text-center flex flex-col items-center gap-1 flex-1">
                    <p className="font-medium text-navy text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
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
            <h2 className="section-title">受ける</h2>
            <div className="section-divider" />
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { icon:'📜', title:'御朱印', text:'中禅寺ならではの御朱印をお受けいただけます。書き入れのほか書き置きもございます。', info:'御朱印代：500円〜', href:'/goshuin', cta:'詳しく見る', external:false },
                { icon:'🎁', title:'授与品・通販', text:'お守り・お札など各種授与品をご用意しております。一部通販でもお求めいただけます。', info:'通販サイトでもご購入いただけます', href:'https://chuzenji.official.ec/', cta:'通販サイトへ', external:true },
              ].map(({ icon, title, text, info, href, cta, external }) => (
                <div key={title} className="card p-6 text-center">
                  <p className="text-4xl mb-4">{icon}</p>
                  <h3 className="font-serif text-navy text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{text}</p>
                  <p className="text-xs text-gold font-medium mb-4">{info}</p>
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
            <h2 className="section-title">アクセス</h2>
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
