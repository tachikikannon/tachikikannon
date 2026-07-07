import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import type { News } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('news').select('title, excerpt').eq('id', id).single()
  return { title: data?.title ?? 'お知らせ', description: data?.excerpt ?? undefined }
}

const CAT_COLORS: Record<string, string> = {
  'お知らせ':       'bg-navy/10 text-navy',
  '行事案内':       'bg-gold/20 text-amber-800',
  '季節のお知らせ': 'bg-teal/20 text-teal-800',
  '交通情報':       'bg-red-100 text-red-700',
  '授与品のお知らせ':'bg-purple-100 text-purple-700',
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: item } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!item) notFound()
  const news = item as News

  // 関連記事（同カテゴリ・最新3件）
  const { data: related } = await supabase
    .from('news')
    .select('id, title, category, published_at, created_at')
    .eq('is_published', true)
    .eq('category', news.category)
    .neq('id', news.id)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/news">お知らせ</Link> &gt; <span className="text-gray-600">{news.title}</span>
          </div>
        </div>

        {/* カバー画像 */}
        {news.cover_url && (
          <div className="relative h-56 md:h-72">
            <Image src={news.cover_url} alt={news.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-navy/30" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* メタ情報 */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs rounded px-2 py-0.5 ${CAT_COLORS[news.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {news.category}
              </span>
              <time className="text-xs text-gray-400">
                {new Date(news.published_at ?? news.created_at).toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' })}
              </time>
            </div>

            {/* タイトル */}
            <h1 className="font-serif text-2xl md:text-3xl text-navy leading-relaxed mb-6">{news.title}</h1>

            {/* 概要 */}
            {news.excerpt && (
              <p className="text-sm text-gray-500 border-l-4 border-gold pl-4 mb-8 leading-relaxed">{news.excerpt}</p>
            )}

            {/* 本文 */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-[2] whitespace-pre-wrap">
              {news.body}
            </div>
          </div>

          {/* 関連記事 */}
          {related && related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-serif text-navy pl-3 border-l-4 border-gold mb-4">同じカテゴリのお知らせ</h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
                {related.map(r => (
                  <Link key={r.id} href={`/news/${r.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-cream-alt transition-colors group">
                    <span className="text-sm text-navy group-hover:text-gold transition-colors">{r.title}</span>
                    <time className="text-xs text-gray-400 flex-shrink-0 ml-4">
                      {new Date(r.published_at ?? r.created_at).toLocaleDateString('ja-JP')}
                    </time>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/news" className="inline-flex items-center gap-1 text-navy text-sm hover:text-gold transition-colors">
              ← お知らせ一覧に戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
