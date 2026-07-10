export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '御朱印' }

const DEFAULT_NOTES = [
  { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
  { text: '受付時間は閉門30分前に終了いたします。余裕をもってお越しください。' },
  { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
  { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
]

const DEFAULTS: Record<string, string> = {
  goshuin_fee_note: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。',
  goshuin_notes: JSON.stringify(DEFAULT_NOTES),
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

const regular = [
  { title: '立木大悲殿', src: '/images/tachiki.syuin.png' },
  { title: 'ご詠歌',     src: null },
  { title: '波之利大黒天', src: '/images/daikokuten.png' },
  { title: '金剛閣',     src: '/images/kongoukaku.png' },
]

const special = [
  { label: '写経', title: '金紙特別朱印', sub: '立木大悲殿', desc: '十六文字写経（延命十句観音経）をお書きいただいた方にお授けします。', src: '/images/sakyou.tatiki.png' },
  { label: '写経', title: '金紙特別御朱印', sub: '大日如来', desc: '十六文字写経（懺悔文）をお書きいただいた方にお授けします。', src: null },
  { label: '写仏', title: '銀紙特別朱印', sub: '立木観世音', desc: '写仏をお書きいただいた方にお授けします。', src: '/images/syabutu.tatiki.png' },
]

export default async function GoshuinPage() {
  const c = await getContent()
  const notes = pj<typeof DEFAULT_NOTES>(c.goshuin_notes, DEFAULT_NOTES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/">ホーム</Link> &gt; 御朱印</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Goshuin</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">御朱印</h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="section-title">御朱印</h2>
            <div className="section-divider" />
            <p className="text-center text-sm text-gray-500 mb-8">
              御朱印は御朱印所・本堂・五大堂の各所にてお受けいただけます。<br />場所によって授与しているものが異なります。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {regular.map(({ title, src }) => (
                <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-52 bg-cream flex items-center justify-center p-2">
                    {src
                      ? <Image src={src} alt={title} width={200} height={200} className="object-contain h-full w-full" />
                      : <span className="text-gray-300 text-xs">写真準備中</span>
                    }
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-medium text-navy text-sm">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">受付場所：御朱印所</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-cream-alt rounded-lg p-4 border-l-4 border-gold text-sm text-gray-700 space-y-1 whitespace-pre-line">
              <p><strong>{c.goshuin_fee_note.split('\n')[0]}</strong></p>
              <p>{c.goshuin_fee_note.split('\n').slice(1).join('\n')}</p>
            </div>
          </section>

          <section className="bg-cream-alt -mx-4 px-4 py-12 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="section-title">写経・写仏体験 特別御朱印</h2>
            <div className="section-divider" />
            <p className="text-center text-sm text-gray-500 mb-2">写経・写仏体験とセットでお受けいただける特別な御朱印です。</p>
            <p className="text-center text-gold font-medium mb-8">体験料込み 各1,000円</p>
            <div className="space-y-4">
              {special.map(({ label, title, sub, desc, src }) => (
                <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-navy px-4 py-1.5 inline-block">
                    <span className="text-gold text-xs font-bold tracking-wider">{label}</span>
                  </div>
                  <div className="flex items-center gap-5 p-5">
                    <div className="w-32 h-36 flex-shrink-0 bg-cream rounded-lg flex items-center justify-center p-1">
                      {src
                        ? <Image src={src} alt={title} width={128} height={144} className="object-contain h-full w-full" />
                        : <span className="text-gray-300 text-xs text-center">写真準備中</span>
                      }
                    </div>
                    <div>
                      <p className="font-serif font-bold text-navy">{title}
                        <span className="text-gold text-sm font-normal ml-2">{sub}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-gold text-sm text-gray-700 space-y-1">
              <p>受付場所：寺務所 体験受付窓口</p>
              <p>写経・写仏体験のお申し込みは<Link href="/reserve" className="text-navy underline">体験予約ページ</Link>よりご確認ください。</p>
              <p className="text-xs text-gray-400">※特別御朱印の種類は今後追加される場合があります。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">御朱印についてのご注意</h2>
            <ul className="mt-4 space-y-3">
              {notes.map(({ text }, i) => (
                <li key={i} className="bg-white rounded-lg px-4 py-3 border-l-4 border-gold text-sm text-gray-700 shadow-sm">{text}</li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon:'⛩', label:'参拝について', href:'/about' },
              { icon:'🙏', label:'御祈願', href:'/prayer' },
              { icon:'📝', label:'写経・写仏体験', href:'/reserve' },
              { icon:'🎁', label:'授与品・通販', href:'https://chuzenji.official.ec/' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-navy group-hover:text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
