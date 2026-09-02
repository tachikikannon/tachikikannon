import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { createPublicSupabaseClient } from '@/lib/supabase-server'
import { pickLocalized } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

type ScheduleItem = { time: string; title: string; desc: string }
type NoteItem = { text: string }

function pj<T>(s: string | undefined | null, fallback: T): T {
  if (!s) return fallback
  try { return JSON.parse(s) } catch { return fallback }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const loc = locale as Locale
  const supabase = await createPublicSupabaseClient()
  const { data } = await supabase.from('minor_events').select('*').eq('slug', slug).eq('site', 'chuzenji').single()
  const t = await getTranslations({ locale, namespace: 'minorEvent' })
  return { title: data ? pickLocalized(loc, data.title, data.title_en) : t('fallbackTitle') }
}

export default async function MinorEventDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('minorEvent')
  const tc = await getTranslations('common')
  const supabase = await createPublicSupabaseClient()
  const { data: ev } = await supabase
    .from('minor_events')
    .select('*')
    .eq('slug', slug)
    .eq('site', 'chuzenji')
    .eq('is_published', true)
    .single()

  if (!ev) notFound()

  const title = pickLocalized(loc, ev.title, ev.title_en)
  const subtitle = pickLocalized(loc, ev.subtitle ?? '', ev.subtitle_en)
  const descText = pickLocalized(loc, ev.desc_text, ev.desc_text_en)
  const monthLabel = pickLocalized(loc, ev.month_label, ev.month_label_en)
  const dateLabel = pickLocalized(loc, ev.date_label, ev.date_label_en)
  const timeLabel = pickLocalized(loc, ev.time_label ?? '', ev.time_label_en)
  const infoDate = pickLocalized(loc, ev.info_date ?? '', ev.info_date_en)
  const infoTime = pickLocalized(loc, ev.info_time ?? '', ev.info_time_en)
  const infoJoin = pickLocalized(loc, ev.info_join ?? '', ev.info_join_en)
  const heroSrc = ev.hero_url || ev.cover_url

  const schedule = pj<ScheduleItem[]>(loc === 'en' ? (ev.schedule_en || ev.schedule) : ev.schedule, [])
  const notes = pj<NoteItem[]>(loc === 'en' ? (ev.notes_en || ev.notes) : ev.notes, [])
  const infoChips = [
    { label: t('infoDateLabel'), value: infoDate },
    { label: t('infoTimeLabel'), value: infoTime },
    { label: t('infoJoinLabel'), value: infoJoin },
  ].filter(c => c.value)

  // 管理画面「ギャラリー写真の位置」（説明文の下＝below／説明文の上＝above）に応じて、
  // ギャラリーセクションをタイムスケジュールの前後どちらに表示するか切り替える。
  // 未設定（既存データ）はこれまで通り below（タイムスケジュールの後）扱い。
  const gallerySection = ev.gallery_urls?.length > 0 && (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gold rounded-full" />
        <h2 className="font-serif text-2xl text-navy">{t('headingGallery')}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ev.gallery_urls.map((url: string, i: number) => (
          <div key={i} className="relative h-40 md:h-52 rounded-xl overflow-hidden shadow-sm">
            <ZoomableImage src={url} alt={`${title} 写真${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/annual-events">{t('eventsLabel')}</Link> &gt; {title}
          </div>
        </div>

        {heroSrc && (
          <section className="relative h-64 md:h-80 overflow-hidden">
            <ZoomableImage src={heroSrc} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center px-4">
              <p className="text-gold text-xs tracking-[0.3em] mb-2">{monthLabel}　{dateLabel}</p>
              <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest">{title}</h1>
              {subtitle && <p className="text-white/70 text-sm mt-3">{subtitle}</p>}
            </div>
          </section>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          {!heroSrc && (
            <div>
              <p className="text-xs text-gold tracking-widest">{monthLabel}　{dateLabel}　{timeLabel}</p>
              <h1 className="font-serif text-2xl text-navy mt-2">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
            </div>
          )}

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{t('headingAbout')}</h2>
            </div>
            <div className="prose prose-sm max-w-none text-sm text-gray-700 leading-loose whitespace-pre-wrap">{descText}</div>
            {infoChips.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {infoChips.map(({ label, value }) => (
                  <div key={label} className="bg-cream-alt rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-medium text-navy">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {gallerySection && ev.gallery_placement === 'above' && gallerySection}

          {schedule.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gold rounded-full" />
                <h2 className="font-serif text-2xl text-navy">{t('headingSchedule')}</h2>
              </div>
              <ol className="relative border-l-2 border-gold/40 ml-5 space-y-8">
                {schedule.map(({ time, title: itemTitle, desc }, i) => (
                  <li key={i} className="pl-8 relative">
                    <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-navy flex items-center justify-center shadow-md">
                      <span className="text-gold text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-gold font-bold text-lg tracking-wide">{time}</span>
                        <h3 className="font-serif text-navy text-lg">{itemTitle}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {gallerySection && ev.gallery_placement !== 'above' && gallerySection}

          {notes.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gold rounded-full" />
                <h2 className="font-serif text-2xl text-navy">{t('headingNotes')}</h2>
              </div>
              <div className="space-y-3">
                {notes.map(({ text }, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-cream-alt rounded-xl px-4 py-3">
                    <span className="text-gold font-bold flex-shrink-0">・</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {ev.apply_url && (
            <div className="bg-navy rounded-2xl p-8 text-center text-white">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={ev.apply_url}
                  className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full hover:opacity-90 transition-colors text-sm">
                  {t('applyCta')}
                </Link>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/annual-events" className="text-navy text-sm hover:underline">{t('backToEvents')}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
