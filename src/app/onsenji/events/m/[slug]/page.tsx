import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import { createServerClient } from '@/lib/supabase-server'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('minor_events').select('title').eq('slug', slug).eq('site', 'onsenji').single()
  return { title: data?.title ?? '年間行事' }
}

export default async function OnsenjMinorEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data: ev } = await supabase
    .from('minor_events')
    .select('*')
    .eq('slug', slug)
    .eq('site', 'onsenji')
    .eq('is_published', true)
    .single()

  if (!ev) notFound()

  const heroSrc = ev.hero_url || ev.cover_url

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; <Link href="/onsenji/events">年間行事</Link> &gt; {ev.title}
          </div>
        </div>

        {heroSrc && (
          <div className="relative h-64 md:h-80">
            <ZoomableImage src={heroSrc} alt={ev.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-onsenji/30" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-xs text-[#7ec8a4] tracking-widest">{ev.month_label}　{ev.date_label}　{ev.time_label}</p>
            <h1 className="font-serif text-2xl text-onsenji mt-2 mb-6 leading-relaxed">{ev.title}</h1>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ev.desc_text}
            </div>
            <div className="mt-8">
              <Link href={ev.apply_url || '/onsenji/contact'}
                className="inline-block px-6 py-2.5 bg-[#7ec8a4] text-onsenji text-sm font-medium rounded-full hover:bg-[#a0d8bc] transition-colors">
                申し込みフォーム
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/onsenji/events" className="text-onsenji text-sm hover:underline">← 年間行事に戻る</Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
