import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import type { News, NewsCategory } from '@/types'

export const metadata: Metadata = { title: 'お知らせ' }

const CAT_COLORS: Record<string, string> = {
  'お知らせ':       'bg-navy/10 text-navy',
  '行事案内':       'bg-gold/20 text-amber-800',
  '季節のお知らせ': 'bg-teal/20 text-teal-800',
  '交通情報':       'bg-red-100 text-red-700',
  '授与品のお知らせ':'bg-purple-100 text-purple-700',
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createServerClient()
  let query = supabase
    .from('news')
    .select('id, title, excerpt, body, cover_url, category, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  const { data: items } = await query
  const news = (items ?? []) as News[]

  const CATEGORIES: NewsCategory[] = ['お知らせ','行事案内','季節のお知らせ','交通情報','授与品のお知らせ']

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/">ホーム</Link> &gt; お知らせ</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">News</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">お知らせ</h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/news"
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!searchParams.category ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-300 hover:border-navy'}`}>
              すべて
            </Link>
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/news?category=${encodeURIComponent(cat)}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${searchParams.category === cat ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-300 hover:border-navy'}`}>
                {cat}
              </Link>
            ))}
          </div>

          {news.length > 0 ? (
            <div className="space-y-6">
              {/* 最新記事（大カード） */}
              {news[0] && !searchParams.category && (
                <Link href={`/news/${news[0].id}`} className="group block bg-white rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 transition-all">
                  <div className="md:flex">
                    <div className="md:w-80 h-52 md:h-auto flex-shrink-0 bg-cream-alt relative">
                      {news[0].cover_url
                        ? <Image src={news[0].cover_url} alt={news[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="flex items-center justify-center h-full text-4xl">🏛️</div>
                      }
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs rounded px-2 py-0.5 ${CAT_COLORS[news[0].category] ?? 'bg-gray-100 text-gray-600'}`}>{news[0].category}</span>
                        <time className="text-xs text-gray-400">
                          {new Date(news[0].published_at ?? news[0].created_at).toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' })}
                        </time>
                      </div>
                      <h2 className="font-serif text-xl text-navy mb-2 group-hover:text-gold transition-colors leading-snug">{news[0].title}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {news[0].excerpt || news[0].body.slice(0, 100)}
                      </p>
                      <span className="mt-4 text-xs text-gold">続きを読む →</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* 残りの記事（リスト） */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
                {(searchParams.category ? news : news.slice(1)).map(item => (
                  <Link key={item.id} href={`/news/${item.id}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-cream-alt transition-colors group">
                    {item.cover_url && (
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden relative bg-cream-alt">
                        <Image src={item.cover_url} alt={item.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] rounded px-1.5 py-0.5 ${CAT_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>{item.category}</span>
                        <time className="text-xs text-gray-400">
                          {new Date(item.published_at ?? item.created_at).toLocaleDateString('ja-JP')}
                        </time>
                      </div>
                      <p className="text-sm font-medium text-navy group-hover:text-gold transition-colors leading-snug">{item.title}</p>
                      {item.excerpt && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.excerpt}</p>}
                    </div>
                    <span className="text-gray-300 group-hover:text-gold transition-colors flex-shrink-0 text-lg">›</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">現在お知らせはありません</p>
              <p className="text-sm">お知らせが公開されるとここに表示されます。</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
