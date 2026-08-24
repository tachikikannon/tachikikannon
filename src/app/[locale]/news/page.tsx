import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import { pickLocalized } from '@/lib/site-content'
import { newsCategoriesKey, parseNewsCategories, categoryColor, categoryLabel } from '@/lib/newsCategories'
import type { Locale } from '@/i18n/routing'
import type { News } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  return { title: t('title') }
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const { category } = await searchParams
  const t = await getTranslations('news')
  const tc = await getTranslations('common')
  const supabase = await createServerClient()
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .eq('site', 'chuzenji')
    .order('published_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: items } = await query
  const news = (items ?? []) as News[]

  const { data: categoriesRow } = await supabase.from('site_content').select('value').eq('key', newsCategoriesKey('chuzenji')).maybeSingle()
  const CATEGORIES = parseNewsCategories(categoriesRow?.value)
  const dateLocale = loc === 'en' ? 'en-US' : 'ja-JP'

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">News</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/news"
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!category ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-300 hover:border-navy'}`}>
              {t('filterAll')}
            </Link>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/news?category=${encodeURIComponent(cat.name)}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${category === cat.name ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-300 hover:border-navy'}`}>
                {categoryLabel(CATEGORIES, cat.name, loc)}
              </Link>
            ))}
          </div>

          {news.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {news.map(item => {
                const title = pickLocalized(loc, item.title, item.title_en)
                return (
                  <Link key={item.id} href={`/news/${item.id}`}
                    className="flex items-stretch hover:bg-cream-alt transition-colors group">
                    <div className="w-20 flex-shrink-0 relative bg-navy">
                      <Image src={item.cover_url || '/images/chuzenji/common/jimon-navy.png'} alt={title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-4 flex-1 min-w-0">
                      <time className="text-xs text-gray-400 whitespace-nowrap sm:w-24 sm:flex-shrink-0">
                        {new Date(item.published_at ?? item.created_at).toLocaleDateString(dateLocale)}
                      </time>
                      <span className="sm:w-fit sm:flex-shrink-0">
                        <span className={`badge text-[13px] whitespace-nowrap ${categoryColor(CATEGORIES, item.category)}`}>{categoryLabel(CATEGORIES, item.category, loc)}</span>
                      </span>
                      <p className="flex-1 min-w-0 text-base text-navy group-hover:text-gold transition-colors leading-relaxed truncate">{title}</p>
                      <span className="hidden sm:inline text-gray-300 group-hover:text-gold transition-colors flex-shrink-0 text-lg">›</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">{t('emptyTitle')}</p>
              <p className="text-sm">{t('emptyText')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
