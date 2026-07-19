export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '温泉寺の歴史 | 日光山温泉寺' }

const DEFAULT_TIMELINE = [
  { year: '延暦7年（788年）', title: '勝道上人による開創', text: '日光山を開いた勝道上人が、この地で温泉が湧き出ているのを発見。薬師瑠璃光如来をお祀りし、温泉寺を開創した。' },
  { year: '平安〜鎌倉時代', title: '天台宗の霊場として栄える', text: '天台宗の修験道の拠点として整備され、多くの僧侶や参拝者が訪れるようになる。' },
  { year: '江戸時代', title: '輪王寺宮の直轄寺院に', text: '輪王寺宮（法親王）の直轄寺院として保護・整備された。日光東照宮参詣とあわせた参拝が盛んとなる。' },
  { year: '昭和41年（1966年）9月', title: '台風による土砂崩れ', text: '台風で薬師堂が土砂崩れにより全壊。しかし薬師如来像は落下した大岩の上に無傷で鎮座しており、人々を驚かせた。' },
  { year: '昭和48年（1973年）', title: '現在地に温泉寺として再建', text: '現在地（日光市山内2300）に温泉寺として再建。世界遺産「日光山輪王寺」の別院として今日に至る。' },
  { year: '令和8年（2026年）4月', title: '「薬師の湯」開湯', text: '泉質：含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（71.4℃）の源泉かけ流しの湯が参拝者に開放された。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_history_subtitle: '日光山温泉寺の由緒と縁起',
  onsenji_history_heading_founding: '創建の由来',
  onsenji_history_heading_timeline: '歴史の流れ',
  onsenji_history_heading_honzon: 'ご本尊・薬師如来について',
  onsenji_history_heading_bando: '霊場としての温泉寺',
  onsenji_history_p1: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。勝道上人は日光山を開いた高僧で、この地で温泉の湧き出るのを発見し、薬師瑠璃光如来をお祀りしたのが温泉寺の起こりとされています。',
  onsenji_history_p2: 'ご本尊は薬師瑠璃光如来（医王如来）で、健康増進・延命長寿のご利益で信仰を集めてきました。江戸時代には輪王寺宮の直轄寺院として栄え、昭和48年に現在地に再建された後も、多くの参拝者に親しまれています。',
  onsenji_history_timeline: JSON.stringify(DEFAULT_TIMELINE),
  onsenji_history_honzon: '薬師瑠璃光如来（やくしるりこうにょらい）は「医王如来」とも呼ばれ、あらゆる病気や苦しみを癒す仏様として信仰されています。昭和41年の台風被害の際、薬師堂が全壊したにもかかわらず、如来像は大岩の上に無傷でご鎮座されていたという言い伝えが残り、その霊験はことのほか篤いとされています。',
  onsenji_history_bando: '温泉寺は日光山輪王寺の別院として、世界遺産「日光の社寺」エリアに位置しています。東照宮・二荒山神社・輪王寺という三つの世界遺産に囲まれた境内は、四季折々の自然とともに参拝者を静かに迎えています。',
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
          <p className="text-white/60 text-sm mt-3 relative">{c.onsenji_history_subtitle}</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{c.onsenji_history_heading_founding}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="prose prose-sm max-w-none text-gray-700 leading-loose space-y-4">
              <p>{c.onsenji_history_p1}</p>
              <p>{c.onsenji_history_p2}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{c.onsenji_history_heading_timeline}</h2>
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
            <h2 className="text-2xl font-serif text-onsenji mb-1">{c.onsenji_history_heading_honzon}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
                <Image src="/images/yakushinyorai.png" alt="薬師瑠璃光如来" fill className="object-cover" />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#7ec8a4]">
                <p className="text-sm text-gray-700 leading-loose">{c.onsenji_history_honzon}</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{c.onsenji_history_heading_bando}</h2>
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
