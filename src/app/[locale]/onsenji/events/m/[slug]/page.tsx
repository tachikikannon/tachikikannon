import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
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
  const { data } = await supabase.from('minor_events').select('*').eq('slug', slug).eq('site', 'onsenji').single()
  const t = await getTranslations({ locale, namespace: 'onsenjiMinorEvent' })
  return { title: data ? pickLocalized(loc, data.title, data.title_en) : t('fallbackTitle') }
}

export default async function OnsenjMinorEventDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiMinorEvent')
  const tc = await getTranslations('common')
  const supabase = await createPublicSupabaseClient()
  const { data: ev } = await supabase
    .from('minor_events')
    .select('*')
    .eq('slug', slug)
    .eq('site', 'onsenji')
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

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; <Link href="/onsenji/events">{t('eventsLabel')}</Link> &gt; {title}
          </div>
        </div>

        {heroSrc && (
          <section className="relative h-64 md:h-80 overflow-hidden">
            <ZoomableImage src={heroSrc} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-onsenji via-onsenji/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center px-4">
              <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-2">{monthLabel}　{dateLabel}</p>
              <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest">{title}</h1>
              {subtitle && <p className="text-white/70 text-sm mt-3">{subtitle}</p>}
            </div>
          </section>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          {!heroSrc && (
            <div>
              <p className="text-xs text-[#7ec8a4] tracking-widest">{monthLabel}　{dateLabel}　{timeLabel}</p>
              <h1 className="font-serif text-2xl text-onsenji mt-2">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
            </div>
          )}

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{t('headingAbout')}</h2>
            </div>
            <div className="prose prose-sm max-w-none text-sm text-gray-700 leading-loose whitespace-pre-wrap">{descText}</div>
            {infoChips.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {infoChips.map(({ label, value }) => (
                  <div key={label} className="bg-onsenji/5 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-medium text-onsenji">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {schedule.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
                <h2 className="font-serif text-2xl text-onsenji">{t('headingSchedule')}</h2>
              </div>
              <ol className="relative border-l-2 border-[#7ec8a4]/40 ml-5 space-y-8">
                {schedule.map(({ time, title: itemTitle, desc }, i) => (
                  <li key={i} className="pl-8 relative">
                    <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-onsenji flex items-center justify-center shadow-md">
                      <span className="text-[#7ec8a4] text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-[#7ec8a4] font-bold text-lg tracking-wide">{time}</span>
                        <h3 className="font-serif text-onsenji text-lg">{itemTitle}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {ev.gallery_urls?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
                <h2 className="font-serif text-2xl text-onsenji">{t('headingGallery')}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ev.gallery_urls.map((url: string, i: number) => (
                  <div key={i} className="relative h-40 md:h-52 rounded-xl overflow-hidden shadow-sm">
                    <ZoomableImage src={url} alt={`${title} 写真${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
                <h2 className="font-serif text-2xl text-onsenji">{t('headingNotes')}</h2>
              </div>
              <div className="space-y-3">
                {notes.map(({ text }, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-onsenji/5 rounded-xl px-4 py-3">
                    <span className="text-[#7ec8a4] font-bold flex-shrink-0">・</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {ev.apply_url && (
            <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={ev.apply_url}
                  className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
                  {t('applyCta')}
                </Link>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/onsenji/events" className="text-onsenji text-sm hover:underline">{t('backToEvents')}</Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
