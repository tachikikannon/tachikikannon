export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '拝観案内' }

const DEFAULTS: Record<string, string> = {
  about_fee_adult: '500円',
  about_fee_child: '200円',
  about_hours_peak: '午前8時〜午後5時',
  about_hours_shoulder: '午前8時〜午後4時',
  about_hours_winter: '午前8時30分〜午後3時30分',
}

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

export default async function AboutPage() {
  const c = await getContent()

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">ホーム</Link> &gt; 拝観案内</div>
        </div>
        <section className="relative h-64 md:h-80">
          <Image src="/images/haikan.png" alt="拝観案内" fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/50 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">拝観案内</h1>
            <p className="text-white/70 text-sm mt-2">拝観時間・拝観料</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">拝観時間・拝観料</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['拝観時間', '季節により異なります（下記参照）'],
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
          </section>

          <div className="bg-cream-alt rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-1">
              <p className="font-serif text-navy text-lg mb-1">境内のご案内</p>
              <p className="text-sm text-gray-600 leading-relaxed">山門・観音堂・鐘楼・札所・天道・愛染堂・延命水など、境内各所の見どころをご紹介しています。</p>
            </div>
            <Link href="/grounds"
              className="flex-shrink-0 px-6 py-3 bg-navy text-white text-sm rounded-full hover:bg-navy/80 transition-colors">
              境内のご案内へ →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '🗺', label: 'アクセス', href: '/#access' },
              { icon: '🙏', label: '御祈願', href: '/prayer' },
              { icon: '📮', label: '御朱印', href: '/goshuin' },
              { icon: '❓', label: 'よくある質問', href: '/faq' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group">
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
