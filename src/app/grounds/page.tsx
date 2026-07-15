export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '境内のご案内' }

const DEFAULT_SPOTS = [
  { name: '山門', image: '/images/sanmon.png', desc: '境内への入口。拝観受付はこちらで行います。' },
  { name: '観音堂（本堂）', image: '/images/main2.png', desc: '勝道上人が桂の立木に直接刻んだと伝わる千手観世音菩薩をお祀りする本堂。根を張ったままの立木が今も残ります。' },
  { name: '鐘楼', image: '/images/toiawase.jpg', desc: '境内に響く梵鐘。時を告げる鐘の音が静かな山の霊気とともに境内に広がります。' },
  { name: '札所', image: '/images/hudasyo.png', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。坂東三十三観音霊場の第十八番札所です。' },
  { name: '天道', image: '/images/tendou.png', desc: '天へと続く石段と境内の小道。四季の草木に囲まれた参道の趣を感じながらお進みください。' },
  { name: '愛染堂', image: '/images/aizendou.png', desc: '愛染明王をお祀りする堂。縁結び・恋愛成就・家庭円満のご利益で知られます。' },
  { name: '延命水', image: '/images/enmeisui.png', desc: '境内に湧き出る清水。飲むと長寿・延命のご利益があると伝わり、古くから参拝者に親しまれています。' },
]
const DEFAULT_FLOW = [
  { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
  { title: '御朱印受付', text: '山門をくぐってすぐの御朱印所にて、御朱印やお守りをお受けいただけます。' },
  { title: '本堂参拝', text: 'ご本尊・立木観音（千手観世音菩薩）にお参りください。' },
  { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井の龍の墨絵も必見です。' },
]

const DEFAULTS: Record<string, string> = {
  grounds_spots: JSON.stringify(DEFAULT_SPOTS),
  grounds_godaido_text: '五大堂の大窓からは、中禅寺湖と男体山を一望することができます。四季折々の景色は訪れる人々を魅了し、特に紅葉の季節には多くの参拝者が訪れます。また、天井に描かれた龍の大墨絵も必見です。',
  grounds_flow: JSON.stringify(DEFAULT_FLOW),
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

export default async function GroundsPage() {
  const c = await getContent()
  const rawSpots = pj<{ name?: string; image?: string; desc?: string; num?: string }[]>(c.grounds_spots, DEFAULT_SPOTS)
  // 旧フォーマット（imageなし）の場合はDEFAULT_SPOTSを使用
  const spots = rawSpots.some(s => s.image) ? rawSpots as typeof DEFAULT_SPOTS : DEFAULT_SPOTS
  const flow  = pj<typeof DEFAULT_FLOW>(c.grounds_flow, DEFAULT_FLOW)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">ホーム</Link> &gt; 境内のご案内</div>
        </div>
        <section className="relative h-64 md:h-80">
          <Image src="/images/godaido.jpg" alt="境内のご案内" fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/50 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">境内のご案内</h1>
            <p className="text-white/70 text-sm mt-2">見どころ・境内マップ</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">境内マップ</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="rounded-xl overflow-hidden shadow-sm">
              <Image src="/images/keidainotizu.png" alt="境内案内図" width={800} height={600} className="w-full h-auto" />
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">主な見どころ</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {spots.map(({ name, image, desc }, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  {image && (
                    <div className="relative h-44">
                      <Image src={image} alt={name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-serif font-medium text-navy text-sm mb-1">{name}</p>
                    {desc && <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">五大堂からの眺望</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="relative h-56 rounded-xl overflow-hidden mb-4">
              <Image src="/images/haikan.png" alt="五大堂からの眺め" fill className="object-cover" />
            </div>
            <p className="text-sm text-gray-700 leading-loose">{c.grounds_godaido_text}</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">参拝の流れ</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <ol className="relative border-l-2 border-gold ml-4 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-serif font-bold">{i + 1}</div>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/about" className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white transition-all text-sm font-medium text-navy">拝観時間・料金</Link>
            <Link href="/history" className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white transition-all text-sm font-medium text-navy">立木観音の歴史</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
