export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '境内のご案内 | 日光山温泉寺' }

const DEFAULT_SPOTS = [
  { num: '①', name: '山門', desc: '境内への入口。拝観受付はこちらで行います。' },
  { num: '②', name: '本堂（薬師堂）', desc: 'ご本尊・薬師如来をお祀りする本堂。病気平癒・健康長寿の御加護をお授けいただけます。' },
  { num: '③', name: '薬師の湯', desc: '中禅寺湖から湧き出る温泉。参拝後にご利用いただける足湯・手湯があります。' },
  { num: '④', name: '御朱印所', desc: '御朱印・お守りをお受けいただけます。' },
  { num: '⑤', name: '鐘楼', desc: '境内に響き渡る鐘の音。早朝には特に厳かな雰囲気を味わえます。' },
  { num: '⑥', name: '湖畔展望台', desc: '中禅寺湖と男体山を一望できる展望スポット。四季折々の絶景が広がります。' },
]
const DEFAULT_FLOW = [
  { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
  { title: '本堂参拝', text: 'ご本尊・薬師如来（医王如来）にお参りください。' },
  { title: '薬師の湯', text: '参拝後は境内の温泉（薬師の湯）をご利用いただけます。足湯・手湯があります。' },
  { title: '御朱印所', text: '御朱印やお守りをお受けいただけます。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_grounds_spots: JSON.stringify(DEFAULT_SPOTS),
  onsenji_grounds_onsen_text: '温泉寺の境内には、中禅寺湖から湧き出る天然温泉を利用した「薬師の湯」があります。参拝者はお参りの後、この温泉で心身を清めることができます。薬師如来の御加護と温泉の癒しを同時にいただける、温泉寺ならではの体験です。',
  onsenji_grounds_flow: JSON.stringify(DEFAULT_FLOW),
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

export default async function OnsenjGroundsPage() {
  const c = await getContent()
  const spots = pj<typeof DEFAULT_SPOTS>(c.onsenji_grounds_spots, DEFAULT_SPOTS)
  const flow  = pj<typeof DEFAULT_FLOW>(c.onsenji_grounds_flow, DEFAULT_FLOW)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 境内のご案内
          </div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Grounds</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">境内のご案内</h1>
          <p className="text-white/60 text-sm mt-3 relative">見どころ・薬師の湯・境内マップ</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">主な見どころ</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="grid md:grid-cols-2 gap-4">
              {spots.map(({ num, name, desc }, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <span className="text-[#7ec8a4] font-serif text-2xl leading-none flex-shrink-0">{num}</span>
                  <div>
                    <p className="font-medium text-onsenji text-sm">{name}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">薬師の湯（温泉）</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="bg-onsenji/10 rounded-2xl p-6 border-l-4 border-[#7ec8a4]">
              <p className="text-sm text-gray-700 leading-loose">{c.onsenji_grounds_onsen_text}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">参拝の流れ</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <ol className="relative border-l-2 border-[#7ec8a4] ml-4 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-onsenji text-white flex items-center justify-center text-sm font-serif font-bold">{i + 1}</div>
                  <h3 className="font-medium text-onsenji mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/onsenji/about" className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">拝観時間・料金</Link>
            <Link href="/onsenji/history" className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">温泉寺の歴史</Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
