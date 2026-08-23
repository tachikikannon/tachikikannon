import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'events' })
  return { title: t('title') }
}

export default async function EventsPage() {
  const t = await getTranslations('events')
  const tc = await getTranslations('common')
  const MONTHS = t('months').split(',')
  const WEEKDAYS = t('weekdays').split(',')
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
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>

        {/* 年間行事バナー */}
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <Link href="/annual-events"
            className="flex items-center justify-between bg-navy text-white rounded-xl px-6 py-4 hover:bg-navy/90 transition-colors shadow-sm">
            <div>
              <p className="text-gold text-xs tracking-widest mb-0.5">Annual Events</p>
              <p className="font-serif text-lg">{t('bannerTitle')}</p>
              <p className="text-white/60 text-xs mt-0.5">{t('bannerSub')}</p>
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
                      {t('yearMonth', { year: y, month: MONTHS[parseInt(m) - 1] })}
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
                              <p className="text-xs text-gray-400">{WEEKDAYS[start.getDay()]}</p>
                            </div>
                            <div>
                              <p className="font-medium text-navy">{ev.title}</p>
                              {!isSameDay && end && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {t('toDate', { month: MONTHS[end.getMonth()], day: end.getDate() })}
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
              <p className="text-lg mb-2">{t('emptyTitle')}</p>
              <p className="text-sm">{t('emptyText')}</p>
            </div>
          )}

          <div className="mt-12 bg-cream-alt rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">{t('contactPrompt')}</p>
            <Link href="/contact" className="btn-primary text-sm">{t('contactCta')}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
