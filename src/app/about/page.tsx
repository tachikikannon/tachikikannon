export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '参拝について' }

const DEFAULTS: Record<string, string> = {
  about_fee_adult:      '500円',
  about_fee_child:      '200円',
  about_hours_peak:     '午前8時〜午後5時',
  about_hours_shoulder: '午前8時〜午後4時',
  about_hours_winter:   '午前8時30分〜午後3時30分',
}

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
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

export default async function AboutPage() {
  const c = await getContent()

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-5xl mx-auto">
            <Link href="/">ホーム</Link> &gt; 参拝について
          </div>
        </div>

        <section className="relative h-64 md:h-80">
          <Image src="/images/haikan.png" alt="参拝について" fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/50 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">参拝について</h1>
            <p className="text-white/70 text-sm mt-2">拝観時間・拝観料・境内のご案内</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">

          <section id="hours">
            <h2 className="text-2xl font-serif text-navy mb-1">拝観時間・拝観料</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['拝観時間', '季節により異なります（下記参照）\n※拝観受付はいずれも閉門30分前に終了'],
                    ['拝観料', `大人：${c.about_fee_adult}　子供：${c.about_fee_child}`],
                    ['定休日', '年中無休'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium">{k}</th>
                      <td className="px-4 py-3 whitespace-pre-line bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { period: '4月〜10月', time: c.about_hours_peak },
                { period: '11月・3月', time: c.about_hours_shoulder },
                { period: '12月〜2月', time: c.about_hours_winter },
              ].map(({ period, time }) => (
                <div key={period} className="bg-white rounded-xl p-5 text-center shadow-sm border-t-4 border-gold">
                  <p className="font-serif text-navy font-medium mb-2">{period}</p>
                  <p className="text-sm text-gray-700">{time}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">※拝観受付はいずれも閉門30分前に終了いたします。</p>
          </section>

          <section id="map">
            <h2 className="text-2xl font-serif text-navy mb-1">境内のご案内</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="bg-gray-100 rounded-xl h-52 flex items-center justify-center text-gray-400 text-sm mb-6">
              ［境内図 — 本番で差し替え］
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { num: '①', name: '山門', desc: '境内への入口。拝観受付はこちらで行います。' },
                { num: '②', name: '御朱印受付', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。' },
                { num: '③', name: '本堂（立木観音）', desc: '勝道上人が桂の立木に直接刻んだと伝わる千手観世音菩薩をお祀りする本堂。' },
                { num: '④', name: '五大堂', desc: '中禅寺湖を一望できる展望堂。天井に描かれた龍の墨絵でも有名です。' },
              ].map(({ num, name, desc }) => (
                <div key={num} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <span className="text-gold font-serif text-2xl leading-none flex-shrink-0">{num}</span>
                  <div>
                    <p className="font-medium text-navy text-sm">{name}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="flow">
            <h2 className="text-2xl font-serif text-navy mb-1">参拝の流れ</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <ol className="relative border-l-2 border-gold ml-4 space-y-6">
              {[
                { title: '拝観受付', text: `入口にて拝観料をお納めください。大人${c.about_fee_adult}・子供${c.about_fee_child}。受付は閉門30分前に終了いたします。` },
                { title: '山門をくぐる', text: '山門をくぐり、境内へお進みください。' },
                { title: '御朱印受付', text: '山門をくぐってすぐの御朱印所にて、御朱印やお守りをお受けいただけます。場所によって授与しているお守りが異なります。' },
                { title: '本堂参拝', text: 'ご本尊・立木観音（千手観世音菩薩）にお参りください。本堂でも一部の授与品をお受けいただけます。' },
                { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井に描かれた龍の墨絵も必見です。' },
              ].map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-serif font-bold">{i + 1}</div>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 bg-cream-alt rounded-xl p-5 border-l-4 border-gold">
              <h3 className="font-medium text-navy mb-2">授与品について</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                お守り・御朱印などの授与品は、<strong>御朱印所・五大堂・本堂</strong>の3か所でお受けいただけます。場所によって授与しているお守りが異なりますので、各所でぜひご覧ください。
              </p>
            </div>
          </section>

          <section id="notes">
            <h2 className="text-2xl font-serif text-navy mb-1">ご参拝の注意事項</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <ul className="space-y-3">
              {[
                '境内では静粛にお過ごしください。',
                '撮影は外観のみ可能です。本堂内は撮影禁止となっております。',
                'ペットの同伴は境内に限り可能です。本堂・五大堂などの堂内へのお連れ込みはご遠慮ください。',
                '境内での飲食はご遠慮ください。',
                '足元が不安定な箇所があります。歩きやすい靴でお越しください。',
                '混雑時はご参拝にお時間をいただく場合があります。',
              ].map((item) => (
                <li key={item} className="flex gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold text-sm text-gray-700 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">関連ページ</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🗺', label: 'アクセス', href: '/#access' },
                { icon: '🙏', label: '御祈願', href: '/prayer' },
                { icon: '📜', label: '御朱印', href: '/goshuin' },
                { icon: '❓', label: 'よくある質問', href: '/faq' },
              ].map(({ icon, label, href }) => (
                <Link key={href} href={href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm font-medium text-navy group-hover:text-white">{label}</span>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
