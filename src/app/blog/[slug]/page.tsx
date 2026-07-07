import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('posts').select('title').eq('slug', slug).single()
  return { title: data?.title ?? 'ブログ' }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/blog">ブログ</Link> &gt; {post.title}
          </div>
        </div>

        {post.cover_url && (
          <div className="relative h-64 md:h-80">
            <Image src={post.cover_url} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-navy/30" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <time className="text-xs text-gray-400">
              {new Date(post.published_at ?? post.created_at).toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' })}
            </time>
            <h1 className="font-serif text-2xl text-navy mt-2 mb-6 leading-relaxed">{post.title}</h1>
            {post.excerpt && (
              <p className="text-sm text-gray-500 mb-6 leading-relaxed border-l-4 border-gold pl-4">{post.excerpt}</p>
            )}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-navy text-sm hover:underline">← ブログ一覧に戻る</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
