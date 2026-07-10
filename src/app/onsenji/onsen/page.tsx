export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = {
  title: '薬師の湯（温泉） | 日光山温泉寺',
  description: '令和8年4月開湯。含硫黄泉の完全かけ流し。日光山温泉寺の薬師の湯をご案内します。',
}

const DEFAULTS: Record<string, string> = {
  onsenji_onsen_about:     '「薬師の湯」は延暦7年（788年）の開創以来、薬師瑠璃光如来のご加護のもと守り続けられてきた霊泉です。令和8年4月11日に参拝者への開放が始まりました。薬師如来の御加護と温泉の癒しを同時にいただける、温泉寺ならではの体験です。',
  onsenji_onsen_quality:   '含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉',
  onsenji_onsen_temp:      '71.4℃',
  onsenji_onsen_flow:      '完全かけ流し（加水あり）',
  onsenji_onsen_color:     '加水すると乳白色に変わります',
  onsenji_onsen_hours:     '参篭時間内（受付終了の1時間前まで）',
  onsenji_onsen_fee_note:  '志納金（大人500円・小人300円）に含まれます。別途料金はかかりません。',
  onsenji_onsen_note:      'タオルをご持参ください。貸し出しは行っておりません。',
}

async function getContent(): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return DEFAULTS
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
  } catch {
    return DEFAULTS
  }
}

export default async function OnsenjOnsenPage() {
  const c = await getContent()

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 薬師の湯（温泉）
          </div>
        </div>

        {/* ページヒーロー */}
        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image
            src="/images/onsen.png"
            alt="薬師の湯"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onsenji/50 to-onsenji/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3">Yakushi-no-Yu</p>
            <h1 className="font-serif text-4xl tracking-widest mb-2">薬師の湯</h1>
            <p className="text-white/70 text-sm">令和8年4月11日 開湯</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">

          {/* 概要 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">薬師の湯について</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <p className="text-gray-700 text-sm leading-loose">{c.onsenji_onsen_about}</p>
          </section>

          {/* 写真2枚 */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/onsen.png" alt="薬師の湯" fill className="object-cover" />
            </div>
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/onsenmado.png" alt="温泉の窓" fill className="object-cover" />
            </div>
          </section>

          {/* 泉質・料金 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">泉質・料金</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['泉質',     c.onsenji_onsen_quality],
                    ['泉温',     c.onsenji_onsen_temp],
                    ['湯の種類', c.onsenji_onsen_flow],
                    ['湯の色',   c.onsenji_onsen_color],
                    ['利用時間', c.onsenji_onsen_hours],
                    ['料金',     c.onsenji_onsen_fee_note],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-onsenji text-white text-left px-4 py-3 w-28 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white leading-relaxed">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ご注意 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">ご利用の注意</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
              <p>♨️ {c.onsenji_onsen_note}</p>
            </div>
          </section>

          {/* 関連リンク */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/onsenji/about"
              className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">
              拝観時間・料金
            </Link>
            <Link href="/onsenji/faq"
              className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">
              よくある質問
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
