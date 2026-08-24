import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import { createServerClient } from '@/lib/supabase-server'
import { pickLocalized } from '@/lib/site-content'
import { newsCategoriesKey, parseNewsCategories } from '@/lib/newsCategories'
import type { Locale } from '@/i18n/routing'
import type { News } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiNews' })
  return { title: `${t('title')} | 日光山温泉寺` }
}

const CAT_COLORS: Record<string, string> = {
  'お知らせ':       'bg-onsenji/10 text-onsenji',
  '行事案内':       'bg-[#7ec8a4]/20 text-[#2d6b57]',
  '季節のお知らせ': 'bg-teal-100 text-teal-800',
  '交通情報':       'bg-red-100 text-red-700',
  '授与品のお知らせ':'bg-purple-100 text-purple-700',
}

export default async function OnsenjiNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const { category } = await searchParams
  const t = await getTranslations('onsenjiNews')
  const tc = await getTranslations('common')
  const supabase = await createServerClient()
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .eq('site', 'onsenji')
    .order('published_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: items } = await query
  const news = (items ?? []) as News[]

  const { data: categoriesRow } = await supabase.from('site_content').select('value').eq('key', newsCategoriesKey('onsenji')).maybeSingle()
  const CATEGORIES = parseNewsCategories(categoriesRow?.value)
  const CAT_LABELS: Record<string, string> = {
    'お知らせ': t('catNews'),
    '行事案内': t('catEvent'),
    '季節のお知らせ': t('catSeasonal'),
    '交通情報': t('catTraffic'),
    '授与品のお知らせ': t('catGoods'),
  }
  const dateLocale = loc === 'en' ? 'en-US' : 'ja-JP'

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>

        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">News</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/onsenji/news"
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!category ? 'bg-onsenji text-white border-onsenji' : 'text-gray-600 border-gray-300 hover:border-onsenji'}`}>
              {t('filterAll')}
            </Link>
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/onsenji/news?category=${encodeURIComponent(cat)}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${category === cat ? 'bg-onsenji text-white border-onsenji' : 'text-gray-600 border-gray-300 hover:border-onsenji'}`}>
                {CAT_LABELS[cat] ?? cat}
              </Link>
            ))}
          </div>

          {news.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
              {news.map(item => {
                const title = pickLocalized(loc, item.title, item.title_en)
                return (
                  <Link key={item.id} href={`/onsenji/news/${item.id}`}
                    className="flex items-stretch hover:bg-onsenji/5 transition-colors group">
                    <div className="w-20 flex-shrink-0 relative bg-onsenji">
                      <Image src={item.cover_url || '/images/onsenji/common/jimon-green.png'} alt={title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-4 flex-1 min-w-0">
                      <time className="text-xs text-gray-400 whitespace-nowrap sm:w-24 sm:flex-shrink-0">
                        {new Date(item.published_at ?? item.created_at).toLocaleDateString(dateLocale)}
                      </time>
                      <span className="sm:w-32 sm:flex-shrink-0">
                        <span className={`badge text-[13px] whitespace-nowrap ${CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>{CAT_LABELS[item.category] ?? item.category}</span>
                      </span>
                      <p className="flex-1 min-w-0 text-base text-onsenji group-hover:text-[#2d6b57] transition-colors leading-relaxed truncate">{title}</p>
                      <span className="hidden sm:inline text-gray-300 group-hover:text-[#2d6b57] transition-colors flex-shrink-0 text-lg">›</span>
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
      <FooterOnsenji />
    </>
  )
}
