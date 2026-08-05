import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = { title: '行事カレンダー' }

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

export default async function EventsPage() {
  const supabase = await createServerClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('start_date', new Date().toISOString().split('T')[0])
    .order('start_date', { ascending: true })
    .limit(50)

  const grouped: Record<string, typeof events> = {}
  events?.forEach(ev => {
    const key = ev.start_date.slice(0, 7)
    if (!grouped[key]) grouped[key] = []
    grouped[key]!.push(ev)
  })

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">ホーム</Link> &gt; 行事カレンダー</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">行事カレンダー</h1>
        </section>

        {/* 年間行事バナー */}
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <Link href="/annual-events"
            className="flex items-center justify-between bg-navy text-white rounded-xl px-6 py-4 hover:bg-navy/90 transition-colors shadow-sm">
            <div>
              <p className="text-gold text-xs tracking-widest mb-0.5">Annual Events</p>
              <p className="font-serif text-lg">年間行事（6月18日・8月4日）</p>
              <p className="text-white/60 text-xs mt-0.5">大法要・大護摩供・地蔵流し、船禅頂のご案内</p>
            </div>
            <span className="text-gold text-xl">›</span>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          {Object.keys(grouped).length > 0 ? (
            <div className="space-y-10">
              {Object.entries(grouped).map(([ym, evs]) => {
                const [y, m] = ym.split('-')
                return (
                  <section key={ym}>
                    <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">
                      {y}年 {MONTHS[parseInt(m) - 1]}
                    </h2>
                    <div className="space-y-3">
                      {evs?.map(ev => {
                        const start = new Date(ev.start_date)
                        const end = ev.end_date ? new Date(ev.end_date) : null
                        const isSameDay = end && ev.start_date === ev.end_date
                        return (
                          <div key={ev.id} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                            <div className="flex-shrink-0 text-center w-12">
                              <p className="text-2xl font-bold text-navy leading-none">{start.getDate()}</p>
                              <p className="text-xs text-gray-400">{['日','月','火','水','木','金','土'][start.getDay()]}</p>
                            </div>
                            <div>
                              <p className="font-medium text-navy">{ev.title}</p>
                              {!isSameDay && end && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  〜 {end.getMonth() + 1}月{end.getDate()}日
                                </p>
                              )}
                              {ev.description && (
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{ev.description}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">現在予定されている行事はありません</p>
              <p className="text-sm">行事が登録されるとここに表示されます。</p>
            </div>
          )}

          <div className="mt-12 bg-cream-alt rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">行事についてのお問い合わせはこちら</p>
            <Link href="/contact" className="btn-primary text-sm">お問い合わせ</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
