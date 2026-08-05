import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import { createServerClient } from '@/lib/supabase-server'
import type { Locale } from '@/i18n/routing'
import type { News, NewsCategory } from '@/types'

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
    .select('id, title, excerpt, body, cover_url, category, published_at, created_at')
    .eq('is_published', true)
    .eq('site', 'onsenji')
    .order('published_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: items } = await query
  const news = (items ?? []) as News[]

  const CATEGORIES: NewsCategory[] = ['お知らせ','行事案内','季節のお知らせ','交通情報','授与品のお知らせ']
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
            <div className="space-y-6">
              {/* 最新記事（大カード） */}
              {news[0] && !category && (
                <Link href={`/onsenji/news/${news[0].id}`} className="group block bg-white rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 transition-all">
                  <div className="md:flex">
                    <div className="md:w-80 h-52 md:h-auto flex-shrink-0 bg-onsenji/5 relative">
                      {news[0].cover_url
                        ? <Image src={news[0].cover_url} alt={news[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="flex items-center justify-center h-full text-4xl">♨️</div>
                      }
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs rounded px-2 py-0.5 ${CAT_COLORS[news[0].category] ?? 'bg-gray-100 text-gray-600'}`}>{CAT_LABELS[news[0].category] ?? news[0].category}</span>
                        <time className="text-xs text-gray-400">
                          {new Date(news[0].published_at ?? news[0].created_at).toLocaleDateString(dateLocale, { year:'numeric', month:'long', day:'numeric' })}
                        </time>
                      </div>
                      <h2 className="font-serif text-xl text-onsenji mb-2 group-hover:text-[#2d6b57] transition-colors leading-snug">{news[0].title}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {news[0].excerpt || news[0].body.slice(0, 100)}
                      </p>
                      <span className="mt-4 text-xs text-[#2d6b57]">{t('readMore')}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* 残りの記事（リスト） */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
                {(category ? news : news.slice(1)).map(item => (
                  <Link key={item.id} href={`/onsenji/news/${item.id}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-onsenji/5 transition-colors group">
                    {item.cover_url && (
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden relative bg-onsenji/5">
                        <Image src={item.cover_url} alt={item.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] rounded px-1.5 py-0.5 ${CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>{CAT_LABELS[item.category] ?? item.category}</span>
                        <time className="text-xs text-gray-400">
                          {new Date(item.published_at ?? item.created_at).toLocaleDateString(dateLocale)}
                        </time>
                      </div>
                      <p className="text-sm font-medium text-onsenji group-hover:text-[#2d6b57] transition-colors leading-snug">{item.title}</p>
                      {item.excerpt && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.excerpt}</p>}
                    </div>
                    <span className="text-gray-300 group-hover:text-[#2d6b57] transition-colors flex-shrink-0 text-lg">›</span>
                  </Link>
                ))}
              </div>
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
