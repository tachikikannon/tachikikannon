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

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const loc = locale as Locale
  const supabase = await createPublicSupabaseClient()
  const { data } = await supabase.from('posts').select('*').eq('slug', slug).single()
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: data ? pickLocalized(loc, data.title, data.title_en) : t('title') }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('blog')
  const tc = await getTranslations('common')
  const dateLocale = loc === 'en' ? 'en-US' : 'ja-JP'
  const supabase = await createPublicSupabaseClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  const title = pickLocalized(loc, post.title, post.title_en)
  const excerpt = pickLocalized(loc, post.excerpt ?? '', post.excerpt_en)
  const body = pickLocalized(loc, post.body, post.body_en)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/blog">{t('title')}</Link> &gt; {title}
          </div>
        </div>

        {post.cover_url && (
          <div className="relative h-64 md:h-80">
            <ZoomableImage src={post.cover_url} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-navy/30" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <time className="text-xs text-gray-400">
              {new Date(post.published_at ?? post.created_at).toLocaleDateString(dateLocale, { year:'numeric', month:'long', day:'numeric' })}
            </time>
            <h1 className="font-serif text-2xl text-navy mt-2 mb-6 leading-relaxed">{title}</h1>
            {excerpt && (
              <p className="text-sm text-gray-500 mb-6 leading-relaxed border-l-4 border-gold pl-4">{excerpt}</p>
            )}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {body}
            </div>

            {post.gallery_urls && post.gallery_urls.length > 0 && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {post.gallery_urls.map((url: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <ZoomableImage src={url} alt={`${title} 写真${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-navy text-sm hover:underline">{t('backToBlog')}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
