import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = { title: 'ブログ' }

export default async function BlogPage() {
  const supabase = await createServerClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_url, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/">ホーム</Link> &gt; ブログ</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Blog</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">ブログ</h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden hover:-translate-y-1 transition-all">
                  <div className="h-44 bg-cream-alt relative overflow-hidden">
                    {post.cover_url
                      ? <Image src={post.cover_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="flex items-center justify-center h-full text-gray-300 text-sm">画像なし</div>
                    }
                  </div>
                  <div className="p-5">
                    <time className="text-xs text-gray-400">
                      {new Date(post.published_at ?? '').toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' })}
                    </time>
                    <h2 className="font-medium text-navy mt-2 mb-2 leading-snug group-hover:text-gold transition-colors">{post.title}</h2>
                    {post.excerpt && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                    <span className="inline-block mt-3 text-xs text-gold">続きを読む →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">現在ブログ記事はありません</p>
              <p className="text-sm">記事が公開されるとここに表示されます。</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
