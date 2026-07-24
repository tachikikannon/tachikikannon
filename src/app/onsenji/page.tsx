export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'

export const metadata: Metadata = {
  title: '日光山 温泉寺',
  description: '中禅寺湖畔に佇む、癒しと祈りの霊場 日光山温泉寺',
}

const DEFAULT_GORYAKU_CARDS = [
  { icon: '🌿', title: '病気平癒', desc: '薬師瑠璃光如来の御力で病気の回復をお祈りします' },
  { icon: '💧', title: '健康増進', desc: '大地から湧く温泉と仏縁で心身ともに清まります' },
  { icon: '⏳', title: '延命長寿', desc: '医王如来とも呼ばれる薬師如来の御加護を' },
  { icon: '✨', title: '開運招福', desc: '千二百余年の祈りが積み重なる霊場のご加護を' },
]
const DEFAULT_MENU_CARDS = [
  { title: '薬師の湯', desc: '令和8年4月開湯。含硫黄泉の完全かけ流し。参拝の後、心身を清めるひとときを。' },
  { title: '写経体験', desc: '1,000円・約15分・毎日実施。特別御朱印授与。心を静めてお経をお写しいただけます。' },
  { title: '写仏体験', desc: '1,000円・約30〜60分。薬師瑠璃光如来をお描きいただき、特別御朱印をお授けします。' },
]

const DEFAULT_CONTENT: Record<string, string> = {
  onsenji_hero_en:    'Nikkozan Onsenji Temple',
  onsenji_hero_title: '千二百余年の祈りを宿す\n薬師の霊場',
  onsenji_hero_sub:   '世界遺産・日光山輪王寺の別院。薬師瑠璃光如来のご加護と、大地から湧く温泉の癒しを',
  onsenji_notice_bar: '令和8年4月11日より「薬師の湯」開湯。泉質：含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（71.4℃）完全かけ流し。',
  onsenji_about_title: '温泉寺について',
  onsenji_about_body: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。ご本尊は薬師瑠璃光如来で、健康増進・延命長寿のご利益で知られています。江戸時代には輪王寺宮の直轄寺院として栄え、現在も多くの参拝者が訪れます。',
  onsenji_heading_goryaku: '主なご利益',
  onsenji_heading_menu:    '温泉・体験メニュー',
  onsenji_heading_goshuin: '御朱印',
  onsenji_goshuin_desc: '温泉寺の御朱印は境内にてお受けいただけます。写経体験では特別御朱印をお授けします。',
  onsenji_history_label: '温泉寺の歴史',
  onsenji_grounds_label: '境内のご案内',
  onsenji_heading_access: 'アクセス',
  onsenji_access_address: '栃木県日光市湯元2559',
  onsenji_access_car:  '日光宇都宮道路 日光ICより約10分\n境内周辺に有料駐車場あり',
  onsenji_access_bus:  '東武日光駅・JR日光駅よりバスで「西参道」バス停下車、徒歩約10分\nまたは「表参道」バス停より徒歩約15分',
  onsenji_goryaku_cards: JSON.stringify(DEFAULT_GORYAKU_CARDS),
  onsenji_menu_cards:    JSON.stringify(DEFAULT_MENU_CARDS),
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

export default async function OnsenjPage() {
  const c = await getContent()
  const goryakuCards = pj<typeof DEFAULT_GORYAKU_CARDS>(c.onsenji_goryaku_cards, DEFAULT_GORYAKU_CARDS)
  const menuCards    = pj<typeof DEFAULT_MENU_CARDS>(c.onsenji_menu_cards, DEFAULT_MENU_CARDS)

  return (
    <>
      <HeaderOnsenji />
      <main>
        {/* ヒーロー */}
        <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-onsenji">
          <div className="absolute inset-0 opacity-30">
            <ZoomableImage src="/images/onsenji-main.png" alt="温泉寺" fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-onsenji/60 via-onsenji/30 to-onsenji/80" />
          <div className="relative text-center px-4 text-white">
            <p className="text-[#7ec8a4] text-xs tracking-[0.4em] mb-4">{c.onsenji_hero_en}</p>
            <h1 className="font-serif text-3xl md:text-5xl tracking-widest whitespace-pre-line leading-tight mb-6">
              {c.onsenji_hero_title}
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {c.onsenji_hero_sub}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onsenji/about"
                className="px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm tracking-wide">
                拝観について
              </Link>
              <Link href="/onsenji/onsen"
                className="px-8 py-3 border border-white/60 text-white rounded-full hover:bg-white/10 transition-colors text-sm tracking-wide">
                温泉のご案内
              </Link>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs tracking-widest">SCROLL</span>
            <span className="block w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </section>

        {/* お知らせバー */}
        <div className="bg-[#7ec8a4]/20 border-y border-[#7ec8a4]/30 py-3 px-4">
          <div className="max-w-4xl mx-auto text-center text-sm text-onsenji">
            {c.onsenji_notice_bar}
          </div>
        </div>

        {/* 温泉寺について */}
        <section className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">About</p>
            <h2 className="font-serif text-3xl text-onsenji tracking-widest">{c.onsenji_about_title}</h2>
            <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <ZoomableImage src="/images/yakusido.png" alt="薬師堂" fill className="object-cover" />
            </div>
            <div>
              <p className="text-gray-700 leading-loose text-sm">{c.onsenji_about_body}</p>
              <Link href="/onsenji/history"
                className="inline-block mt-6 text-onsenji text-sm border-b border-onsenji/40 hover:border-onsenji transition-colors">
                詳しい歴史・由来 →
              </Link>
            </div>
          </div>
        </section>

        {/* 主なご利益 */}
        <section className="py-16" style={{backgroundColor: 'rgba(26,74,58,0.05)'}}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">Goryaku</p>
              <h2 className="font-serif text-2xl text-onsenji tracking-widest">{c.onsenji_heading_goryaku}</h2>
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
            <h2 className="font-serif text-2xl text-onsenji tracking-widest">{c.onsenji_heading_menu}</h2>
            <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { src: '/images/onsen.png', sub: 'Onsen', href: '/onsenji/onsen' },
              { src: '/images/onsenji-shakyou-room.jpg', sub: 'Shakyou', href: '/onsenji/experience/shakyou' },
              { src: '/images/onsenji-shabutu-template.png', sub: 'Shabutu', href: '/onsenji/experience/shabutu' },
            ].map(({ src, sub, href }, i) => (
              <Link key={href} href={href}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="relative h-32">
                  <Image src={src} alt={menuCards[i]?.title || sub} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">{sub}</p>
                  <h3 className="font-serif text-onsenji font-medium mb-2">{menuCards[i]?.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{menuCards[i]?.desc}</p>
                  <p className="text-onsenji text-xs mt-3 group-hover:underline">詳しく見る →</p>
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
              <h2 className="font-serif text-2xl text-onsenji tracking-widest">{c.onsenji_heading_goshuin}</h2>
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
                  <h3 className="font-serif text-onsenji font-medium mb-2">{c.onsenji_heading_goshuin}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.onsenji_goshuin_desc}</p>
                  <p className="text-onsenji text-xs mt-2 group-hover:underline">詳しく見る →</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 境内・歴史 */}
        <section className="bg-onsenji py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/onsenji/history"
                className="group relative rounded-2xl overflow-hidden h-48 bg-onsenji-light flex items-end p-6 hover:opacity-90 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative">
                  <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">History</p>
                  <p className="text-white font-serif text-lg">{c.onsenji_history_label}</p>
                </div>
              </Link>
              <Link href="/onsenji/grounds"
                className="group relative rounded-2xl overflow-hidden h-48 bg-onsenji-light flex items-end p-6 hover:opacity-90 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative">
                  <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">Grounds</p>
                  <p className="text-white font-serif text-lg">{c.onsenji_grounds_label}</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* アクセス */}
        <section id="access" className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-[#2d6b57] text-xs tracking-[0.3em] mb-2">Access</p>
            <h2 className="font-serif text-2xl text-onsenji tracking-widest">{c.onsenji_heading_access}</h2>
            <div className="w-12 h-0.5 bg-[#7ec8a4] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#7ec8a4]">
                <p className="text-xs text-[#2d6b57] tracking-widest mb-2">所在地</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{c.onsenji_access_address}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#7ec8a4]">
                <p className="text-xs text-[#2d6b57] tracking-widest mb-2">お車でお越しの方</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{c.onsenji_access_car}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#7ec8a4]">
                <p className="text-xs text-[#2d6b57] tracking-widest mb-2">バスでお越しの方</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{c.onsenji_access_bus}</p>
              </div>
            </div>
            <div className="rounded-2xl h-64 flex items-center justify-center text-gray-400 text-sm" style={{backgroundColor: 'rgba(26,74,58,0.1)'}}>
              地図表示エリア
            </div>
          </div>
        </section>
      </main>
      <FooterOnsenji />
    </>
  )
}
