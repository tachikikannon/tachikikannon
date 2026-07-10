export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '拝観案内 | 日光山温泉寺' }

const DEFAULT_FLOW = [
  { title: '拝観受付', text: '入口にて志納金をお納めください。大人500円・小人300円。受付は参篭終了1時間前に終了いたします。' },
  { title: '本堂参拝', text: 'ご本尊・薬師瑠璃光如来（医王如来）にお参りください。健康増進・延命長寿をお祈りいただけます。' },
  { title: '薬師の湯', text: '参拝後は「薬師の湯」（令和8年4月開湯）をご利用いただけます。志納金に含まれています。タオルをご持参ください。' },
  { title: '御朱印・写経体験', text: '御朱印（500円）・写経体験（1,000円・特別御朱印授与）はお気軽にお申し付けください。' },
]
const DEFAULT_NOTES = [
  { text: '境内では静粛にお過ごしください。' },
  { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
  { text: 'ペットの同伴は境内に限り可能です。堂内へのお連れ込みはご遠慮ください。' },
  { text: '薬師の湯（足湯・手湯）はご参拝の方がご利用いただけます。' },
  { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_about_fee_adult: '500円',
  onsenji_about_fee_child: '300円',
  onsenji_about_hours_peak: '午前8時〜午後5時（受付：午前8時〜午後4時）',
  onsenji_about_hours_shoulder: '午前8時〜午後4時（受付：午前8時〜午後3時）',
  onsenji_about_hours_winter: '午前8時〜午後3時（受付：午前8時〜午後2時）',
  onsenji_about_flow: JSON.stringify(DEFAULT_FLOW),
  onsenji_about_onsen_note: '「薬師の湯」は令和8年4月11日より開湯しました。泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（泉温71.4℃）の完全かけ流し。加水すると乳白色に変わる神秘的な湯です。タオルをご持参ください。',
  onsenji_about_notes: JSON.stringify(DEFAULT_NOTES),
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

export default async function OnsenjAboutPage() {
  const c = await getContent()
  const flow  = pj<typeof DEFAULT_FLOW>(c.onsenji_about_flow, DEFAULT_FLOW)
  const notes = pj<typeof DEFAULT_NOTES>(c.onsenji_about_notes, DEFAULT_NOTES)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">ホーム</Link> &gt; 拝観案内</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">About</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">拝観案内</h1>
          <p className="text-white/60 text-sm mt-3 relative">拝観時間・拝観料・薬師の湯のご案内</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">
          <section id="hours">
            <h2 className="text-2xl font-serif text-onsenji mb-1">拝観時間・拝観料</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['参篭時間', '季節により異なります（下記参照）\n受付終了は参篭終了の1時間前'],
                    ['志納金', `大人：${c.onsenji_about_fee_adult}　小人：${c.onsenji_about_fee_child}`],
                    ['定休日', '年中無休'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-onsenji text-white text-left px-4 py-3 w-32 text-sm font-medium">{k}</th>
                      <td className="px-4 py-3 whitespace-pre-line bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { period: '春〜秋（4月〜10月）', time: c.onsenji_about_hours_peak },
                { period: '秋〜冬（11月・3月）', time: c.onsenji_about_hours_shoulder },
                { period: '冬期（12月〜2月）', time: c.onsenji_about_hours_winter },
              ].map(({ period, time }) => (
                <div key={period} className="bg-white rounded-xl p-5 text-center shadow-sm border-t-4 border-[#7ec8a4]">
                  <p className="font-serif text-onsenji font-medium mb-2">{period}</p>
                  <p className="text-sm text-gray-700">{time}</p>
                </div>
              ))}
            </div>
          </section>
          <section id="onsen">
            <h2 className="text-2xl font-serif text-onsenji mb-1">薬師の湯について</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="bg-onsenji/10 rounded-xl p-6 border-l-4 border-[#7ec8a4]">
              <p className="text-sm text-gray-700 leading-loose">♨️ {c.onsenji_about_onsen_note}</p>
            </div>
            <div className="mt-4 text-right">
              <a href="/onsenji/onsen" className="inline-block text-sm text-onsenji border-b border-onsenji/40 hover:border-onsenji transition-colors">
                薬師の湯（温泉）の詳細ページへ →
              </a>
            </div>
          </section>
          <section id="flow">
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
          <section id="notes">
            <h2 className="text-2xl font-serif text-onsenji mb-1">ご参拝の注意事項</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <ul className="space-y-3">
              {notes.map(({ text }, i) => (
                <li key={i} className="flex gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-[#7ec8a4] text-sm text-gray-700 leading-relaxed">{text}</li>
              ))}
            </ul>
          </section>
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🙏', label: '御祈願', href: '/onsenji/prayer' },
                { icon: '📜', label: '御朱印', href: '/onsenji/goshuin' },
                { icon: '🏯', label: '境内のご案内', href: '/onsenji/grounds' },
                { icon: '❓', label: 'よくある質問', href: '/onsenji/faq' },
              ].map(({ icon, label, href }) => (
                <Link key={href} href={href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm font-medium text-onsenji group-hover:text-white">{label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
