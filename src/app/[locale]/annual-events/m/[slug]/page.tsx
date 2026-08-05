import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { createServerClient } from '@/lib/supabase-server'
import { pickLocalized } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const loc = locale as Locale
  const supabase = await createServerClient()
  const { data } = await supabase.from('minor_events').select('*').eq('slug', slug).eq('site', 'chuzenji').single()
  return { title: data ? pickLocalized(loc, data.title, data.title_en) : '年間行事' }
}

export default async function MinorEventDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const loc = locale as Locale
  const supabase = await createServerClient()
  const { data: ev } = await supabase
    .from('minor_events')
    .select('*')
    .eq('slug', slug)
    .eq('site', 'chuzenji')
    .eq('is_published', true)
    .single()

  if (!ev) notFound()

  const title = pickLocalized(loc, ev.title, ev.title_en)
  const descText = pickLocalized(loc, ev.desc_text, ev.desc_text_en)
  const monthLabel = pickLocalized(loc, ev.month_label, ev.month_label_en)
  const dateLabel = pickLocalized(loc, ev.date_label, ev.date_label_en)
  const timeLabel = pickLocalized(loc, ev.time_label ?? '', ev.time_label_en)
  const heroSrc = ev.hero_url || ev.cover_url

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/annual-events">年間行事</Link> &gt; {title}
          </div>
        </div>

        {heroSrc && (
          <div className="relative h-64 md:h-80">
            <ZoomableImage src={heroSrc} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-navy/30" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-xs text-gold tracking-widest">{monthLabel}　{dateLabel}　{timeLabel}</p>
            <h1 className="font-serif text-2xl text-navy mt-2 mb-6 leading-relaxed">{title}</h1>

            {ev.gallery_placement === 'above' && ev.gallery_urls?.length > 0 && (
              <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ev.gallery_urls.map((url: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <ZoomableImage src={url} alt={`${title} 写真${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {descText}
            </div>

            {ev.gallery_placement !== 'above' && ev.gallery_urls?.length > 0 && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ev.gallery_urls.map((url: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <ZoomableImage src={url} alt={`${title} 写真${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {ev.apply_url && (
              <div className="mt-8">
                <Link href={ev.apply_url}
                  className="inline-block px-6 py-2.5 bg-gold text-navy text-sm font-medium rounded-full hover:opacity-90 transition-colors">
                  申し込みフォーム
                </Link>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link href="/annual-events" className="text-navy text-sm hover:underline">← 年間行事に戻る</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
