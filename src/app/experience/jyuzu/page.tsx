export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '数珠づくり体験' }

const DEFAULT_FLOW = [
  { icon: '📿', title: '好きな珠を選ぶ', text: '天然石・天然木をご自由に組み合わせてお選びいただけます。', image: '/images/jyuzu-flow-choose.jpg' },
  { icon: '🤲', title: '数珠を作る', text: 'スタッフが丁寧にサポートしますので、どなたでも簡単にお作りいただけます。', image: '/images/jyuzu-flow-make.jpg' },
  { icon: '🙏', title: 'ご祈祷', text: '僧侶がご祈祷し、お守りとして当日お持ち帰りいただけます。', image: '/images/jyuzu-flow-pray.jpg' },
]
const DEFAULT_MATERIALS = [
  { name: '天然木', desc: '軽くて使いやすい木の珠。温かみのある手触りが特徴です。' },
  { name: '天然石', desc: '色とりどりの天然石の珠。お好みの色でお選びいただけます。' },
]
const DEFAULT_SAMPLES = [
  { course: 'Aコース', price: '2,000円', desc: '天然木で作るスタンダードな数珠' },
  { course: 'Bコース', price: '4,000円', desc: '天然石と天然木の個性あふれる数珠' },
  { course: 'Cコース', price: '6,000円', desc: '天然石のみで作る特別な数珠' },
]
const COURSE_IMAGES = ['/images/a-nennjyu.png', '/images/b-nennjyu.png', '/images/c-nennjyu.png']
const REAL_SAMPLE_IMAGES = ['/images/jyuzu-real-a.png', '/images/jyuzu-real-b.png', '/images/jyuzu-real-c.png']
const DEFAULT_NOTES = [
  { text: '数珠はすべてブレスレットタイプです。' },
  { text: '参拝料（拝観料）は別途お求めください。' },
  { text: '僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。僧侶が不在の場合、後日ご祈祷後郵送いたします（郵送料は当寺負担）。' },
  { text: '団体でお越しの際は事前にお電話ください。' },
]
const STONE_SWATCHES = [
  { name: '水晶', image: '/images/swatches/stone-suisho.png' },
  { name: '紅水晶', image: '/images/swatches/stone-benisuisho.png' },
  { name: 'ヒスイ', image: '/images/swatches/stone-hisui.png' },
  { name: 'ラピスラズリ', image: '/images/swatches/stone-lapis.png' },
  { name: 'アメジスト', image: '/images/swatches/stone-amethyst.png' },
  { name: 'メノウ', image: '/images/swatches/stone-menou.png' },
  { name: 'ピンクタイガーアイ', image: '/images/swatches/stone-pinktiger.png' },
  { name: 'ゴールドシルバータイガーアイ', image: '/images/swatches/stone-goldtiger.png' },
]
const WOOD_SWATCHES = [
  { name: 'けやき', image: '/images/swatches/wood-keyaki.png' },
  { name: '黒檀', image: '/images/swatches/wood-kokutan.png' },
  { name: '紫檀', image: '/images/swatches/wood-shitan.png' },
  { name: '星月菩提樹', image: '/images/swatches/wood-hoshizuki.png' },
  { name: '梅', image: '/images/swatches/wood-ume.png' },
  { name: 'つげ', image: '/images/swatches/wood-tsuge.png' },
  { name: '緑壇', image: '/images/swatches/wood-ryokutan.png' },
  { name: '鉄刀木', image: '/images/swatches/wood-tagayasan.png' },
]

const DEFAULTS: Record<string, string> = {
  jyuzu_about_p1: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。当山の数珠づくり体験では、天然石・天然木の珠からご自由に組み合わせを選び、世界にひとつだけのオリジナル数珠（ブレスレット）をお作りいただけます。',
  jyuzu_about_p2: '職員が丁寧にご説明しますので、どなたでも簡単にお作りいただけます。僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。',
  jyuzu_days: '毎日開催（法要時は中止となる場合があります）',
  jyuzu_hours_summer: '4月〜10月：9:00〜15:00',
  jyuzu_hours_winter: '11月〜3月：9:00〜14:00',
  jyuzu_fee:  '2,000円〜（使用素材により異なります）',
  jyuzu_time: '約30分',
  jyuzu_price_note: 'お選びいただく珠の素材・組み合わせによって料金が異なります。詳しくは下記コース説明をご覧ください。',
  jyuzu_cta_sub: '毎日開催しております。団体でお越しの際は事前にお電話ください。',
  jyuzu_flow: JSON.stringify(DEFAULT_FLOW),
  jyuzu_samples: JSON.stringify(DEFAULT_SAMPLES),
  jyuzu_materials: JSON.stringify(DEFAULT_MATERIALS),
  jyuzu_notes: JSON.stringify(DEFAULT_NOTES),
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

export default async function JyuzuPage() {
  const c = await getContent()
  const flowRaw   = pj<{ title: string; text: string }[]>(c.jyuzu_flow, DEFAULT_FLOW)
  const flow      = flowRaw.map((f, i) => ({ ...DEFAULT_FLOW[i], ...f }))
  const samples   = pj<typeof DEFAULT_SAMPLES>(c.jyuzu_samples, DEFAULT_SAMPLES)
  const materials = pj<typeof DEFAULT_MATERIALS>(c.jyuzu_materials, DEFAULT_MATERIALS)
  const notes     = pj<typeof DEFAULT_NOTES>(c.jyuzu_notes, DEFAULT_NOTES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/reserve">体験予約</Link> &gt; 数珠づくり体験
          </div>
        </div>

        {/* ヒーロー */}
        <section className="relative h-80 md:h-[28rem]">
          <Image src="/images/jyuzu-hero.jpg" alt="数珠づくり体験" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-navy/20 flex flex-col justify-center px-6 md:px-16">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Juzu Making</p>
            <h1 className="font-serif text-3xl md:text-5xl text-white tracking-widest mb-3">数珠づくり体験</h1>
            <p className="text-white/80 text-sm md:text-base mb-6">世界にひとつだけ。祈りを込めた、自分だけの数珠を。</p>
            <div>
              <Link href="/reserve" className="btn-gold">体験を予約する →</Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-16">
          {/* 数珠づくりとは */}
          <section className="grid md:grid-cols-2 gap-6 items-center">
            <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-sm">
              <Image src="/images/jyuzu-hero.jpg" alt="数珠づくりとは" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">数珠づくりとは</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{c.jyuzu_about_p1}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{c.jyuzu_about_p2}</p>
            </div>
          </section>

          {/* 体験の流れ */}
          <section>
            <h2 className="text-xl font-serif text-navy text-center mb-1">体験の流れ</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mb-8" />
            <div className="grid md:grid-cols-3 gap-6 md:gap-4">
              {flow.map(({ icon, title, text, image }, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center text-sm font-serif font-bold flex-shrink-0">{i + 1}</span>
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-medium text-navy">{title}</h3>
                    {i < flow.length - 1 && (
                      <span className="hidden md:block ml-auto text-gold text-xl">→</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{text}</p>
                  {image && (
                    <div className="relative h-40 rounded-xl overflow-hidden shadow-sm">
                      <Image src={image} alt={title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 開催日・料金 */}
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">開催日・料金</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['開催日', c.jyuzu_days],
                    ['体験時間', `${c.jyuzu_hours_summer}　${c.jyuzu_hours_winter}`],
                    ['所要時間', c.jyuzu_time],
                    ['体験料', c.jyuzu_fee],
                    ['対象', '小学生以上（小学生は保護者同伴）'],
                    ['受付場所', '寺務所 体験受付窓口'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white whitespace-pre-line">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-bold text-amber-700 text-xs mb-1">料金について</p>
              <p>{c.jyuzu_price_note}</p>
            </div>
          </section>

          {/* 料金カード（実物サンプル） */}
          <section>
            <h2 className="text-xl font-serif text-navy text-center mb-1">料金</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mb-2" />
            <p className="text-sm text-gray-600 text-center mb-8">ご自由に組み合わせて作れます。素材により、料金の目安は以下の通りです。</p>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {samples.map(({ course, price, desc }, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm text-center">
                  <div className="relative aspect-square bg-cream-alt">
                    <Image src={REAL_SAMPLE_IMAGES[i] ?? '/images/jyuzu.png'} alt={`${course} 完成例`} fill className="object-contain p-3" />
                  </div>
                  <div className="p-3 md:p-5">
                    <p className="font-serif text-navy text-lg md:text-2xl font-bold">{price}〜</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">※料金は使用する素材によって異なります。</p>
          </section>

          {/* コース説明（組成図） */}
          <section id="course">
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">コース説明</h2>
            <p className="text-sm text-gray-600 mb-5">天然石・天然木の組成は、コースごとに以下のようになります。</p>
            <div className="grid grid-cols-3 gap-3">
              {samples.map(({ course, price, desc }, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm text-center border-t-4 border-gold">
                  <div className="relative aspect-square bg-cream-alt">
                    <Image src={COURSE_IMAGES[i] ?? '/images/jyuzu.png'} alt={desc} fill className="object-contain p-2" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gold font-medium tracking-wide">{course}</p>
                    <p className="font-serif text-navy font-bold">{price}</p>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 選べる珠 */}
          <section id="materials" className="bg-cream-alt -mx-4 px-4 py-10 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="text-xl font-serif text-navy text-center mb-1">選べる珠</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mb-8" />

            <p className="text-sm font-medium text-navy mb-3">天然石</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
              {STONE_SWATCHES.map(({ name, image }) => (
                <div key={name} className="text-center">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden shadow-sm border-2 border-white ring-1 ring-gray-200">
                    <Image src={image} alt={name} fill className="object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">{name}</p>
                </div>
              ))}
            </div>
            <div className="text-center mb-10">
              <a href="#course" className="text-xs text-navy border-b border-navy/40 hover:border-navy transition-colors">すべての天然石を見る →</a>
            </div>

            <p className="text-sm font-medium text-navy mb-3">天然木</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
              {WOOD_SWATCHES.map(({ name, image }) => (
                <div key={name} className="text-center">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden shadow-sm border-2 border-white ring-1 ring-gray-200">
                    <Image src={image} alt={name} fill className="object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">{name}</p>
                </div>
              ))}
            </div>
            <div className="text-center mb-10">
              <a href="#course" className="text-xs text-navy border-b border-navy/40 hover:border-navy transition-colors">すべての天然木を見る →</a>
            </div>

            <p className="text-sm text-gray-600 mb-5 text-center">珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。</p>
            <div className="grid grid-cols-2 gap-4">
              {materials.map(({ name, desc }, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-navy mb-1">{name}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">ご注意・持ち物</h2>
            <ul className="space-y-2">
              {notes.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">数珠づくり体験のご予約</p>
            <p className="text-white/60 text-sm mb-6">{c.jyuzu_cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">オンライン予約はこちら</Link>
              <Link href="/contact" className="btn-outline">お問い合わせ</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">写経体験</span>
            </Link>
            <Link href="/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">写仏体験</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
