import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { createServerClient } from '@/lib/supabase-server'
import { pickLocalized } from '@/lib/site-content'
import { renderNewsBody } from '@/lib/newsBody'
import { newsCategoriesKey, parseNewsCategories, categoryColor, categoryLabel } from '@/lib/newsCategories'
import type { Locale } from '@/i18n/routing'
import type { News } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params
  const loc = locale as Locale
  const supabase = await createServerClient()
  const { data } = await supabase.from('news').select('*').eq('id', id).single()
  const t = await getTranslations({ locale, namespace: 'news' })
  return {
    title: data ? pickLocalized(loc, data.title, data.title_en) : t('title'),
    description: data ? (pickLocalized(loc, data.excerpt ?? '', data.excerpt_en) || undefined) : undefined,
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('news')
  const tDetail = await getTranslations('newsDetail')
  const tc = await getTranslations('common')
  const supabase = await createServerClient()

  const { data: item } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .eq('site', 'chuzenji')
    .single()

  if (!item) notFound()
  const news = item as News

  // 関連記事（同カテゴリ・最新3件）
  const { data: related } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .eq('site', 'chuzenji')
    .eq('category', news.category)
    .neq('id', news.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const { data: categoriesRow } = await supabase.from('site_content').select('value').eq('key', newsCategoriesKey('chuzenji')).maybeSingle()
  const CATEGORIES = parseNewsCategories(categoriesRow?.value)
  const dateLocale = loc === 'en' ? 'en-US' : 'ja-JP'
  const title = pickLocalized(loc, news.title, news.title_en)
  const excerpt = pickLocalized(loc, news.excerpt ?? '', news.excerpt_en)
  const body = pickLocalized(loc, news.body, news.body_en)

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/news">{t('title')}</Link> &gt; <span className="text-gray-600">{title}</span>
          </div>
        </div>

        {/* カバー画像 */}
        {news.cover_url && (
          <div className="relative h-56 md:h-72">
            <ZoomableImage src={news.cover_url} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-navy/30" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* メタ情報 */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs rounded px-2 py-0.5 ${categoryColor(CATEGORIES, news.category)}`}>
                {categoryLabel(CATEGORIES, news.category, loc)}
              </span>
              <time className="text-xs text-gray-400">
                {new Date(news.published_at ?? news.created_at).toLocaleDateString(dateLocale, { year:'numeric', month:'long', day:'numeric' })}
              </time>
            </div>

            {/* タイトル */}
            <h1 className="font-serif text-2xl md:text-3xl text-navy leading-relaxed mb-6">{title}</h1>

            {/* 概要 */}
            {excerpt && (
              <p className="text-sm text-gray-500 border-l-4 border-gold pl-4 mb-8 leading-relaxed">{excerpt}</p>
            )}

            {/* 本文 */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-[2] whitespace-pre-wrap">
              {renderNewsBody(body)}
            </div>
          </div>

          {/* 関連記事 */}
          {related && related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-serif text-navy pl-3 border-l-4 border-gold mb-4">{tDetail('relatedHeading')}</h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
                {related.map(r => (
                  <Link key={r.id} href={`/news/${r.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-cream-alt transition-colors group">
                    <span className="text-sm text-navy group-hover:text-gold transition-colors">{pickLocalized(loc, r.title, r.title_en)}</span>
                    <time className="text-xs text-gray-400 flex-shrink-0 ml-4">
                      {new Date(r.published_at ?? r.created_at).toLocaleDateString(dateLocale)}
                    </time>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/news" className="inline-flex items-center gap-1 text-navy text-sm hover:text-gold transition-colors">
              {tDetail('backToNews')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
