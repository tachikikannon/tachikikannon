export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '温泉寺の歴史 | 日光山温泉寺' }

const DEFAULT_TIMELINE = [
  { year: '784年（延暦3年）', title: '勝道上人による開山', text: '勝道上人が中禅寺湖畔に温泉寺を開創。湖から湧き出る温泉を発見し、薬師如来を本尊として安置した。' },
  { year: '平安時代', title: '天台宗の霊場として発展', text: '天台宗の修験道の拠点として整備され、多くの僧侶や参拝者が訪れるようになる。' },
  { year: '江戸時代', title: '徳川家の保護のもとで整備', text: '江戸幕府の庇護のもと、堂宇が整備される。日光東照宮参詣とあわせた参拝が盛んになる。' },
  { year: '明治時代', title: '中禅寺湖の国際的な避暑地として', text: '各国外交官が中禅寺湖畔に別荘を構えるようになり、温泉寺も国際的に知られるようになる。' },
  { year: '現在', title: '癒しと祈りの霊場', text: '病気平癒・健康長寿の霊場として多くの参拝者が訪れる。温泉浴（薬師の湯）は今も参拝者に親しまれている。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_history_p1: '日光山温泉寺は、784年（延暦3年）に勝道上人によって開かれました。勝道上人は日光山を開いた高僧であり、中禅寺湖畔を歩いていた際に温泉が湧き出ているのを発見し、その温泉の霊力に感銘を受けてこの地に寺を建立しました。',
  onsenji_history_p2: 'ご本尊は薬師如来（医王如来）で、病気を癒し健康を司る仏様として信仰を集めてきました。温泉と薬師如来の組み合わせは「心身ともに癒される霊場」として、多くの参拝者に親しまれています。',
  onsenji_history_timeline: JSON.stringify(DEFAULT_TIMELINE),
  onsenji_history_honzon: 'ご本尊の薬師如来は「医王如来」とも呼ばれ、あらゆる病気や苦しみを癒す仏様として信仰されています。温泉寺では薬師如来の前で祈願した後、境内の温泉（薬師の湯）につかることで、御加護をより深くいただくことができるとされています。',
  onsenji_history_bando: '温泉寺は坂東三十三観音霊場や関東各地の霊場巡礼の参詣地としても知られています。中禅寺湖の豊かな自然に囲まれた境内は、四季折々の美しさとともに参拝者を迎えています。',
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

export default async function OnsenjHistoryPage() {
  const c = await getContent()
  const timeline = pj<typeof DEFAULT_TIMELINE>(c.onsenji_history_timeline, DEFAULT_TIMELINE)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 温泉寺の歴史
          </div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">History</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">温泉寺の歴史</h1>
          <p className="text-white/60 text-sm mt-3 relative">日光山温泉寺の由緒と縁起</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">創建の由来</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="prose prose-sm max-w-none text-gray-700 leading-loose space-y-4">
              <p>{c.onsenji_history_p1}</p>
              <p>{c.onsenji_history_p2}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">歴史の流れ</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <ol className="relative border-l-2 border-[#7ec8a4] ml-4 space-y-8">
              {timeline.map(({ year, title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-onsenji text-white flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <p className="text-xs text-[#2d6b57] font-medium mb-0.5">{year}</p>
                  <h3 className="font-medium text-onsenji mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">ご本尊・薬師如来について</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#7ec8a4]">
              <p className="text-sm text-gray-700 leading-loose">{c.onsenji_history_honzon}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">霊場としての温泉寺</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <p className="text-sm text-gray-700 leading-loose">{c.onsenji_history_bando}</p>
          </section>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/onsenji/about" className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">参拝について</Link>
            <Link href="/onsenji/grounds" className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">境内のご案内</Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
