import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import { pickLocalized } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: t('title') }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('blog')
  const tc = await getTranslations('common')
  const dateLocale = loc === 'en' ? 'en-US' : 'ja-JP'
  const supabase = await createServerClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Blog</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map(post => {
                const title = pickLocalized(loc, post.title, post.title_en)
                const excerpt = pickLocalized(loc, post.excerpt ?? '', post.excerpt_en)
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden hover:-translate-y-1 transition-all">
                    <div className="h-44 bg-cream-alt relative overflow-hidden">
                      {post.cover_url
                        ? <Image src={post.cover_url} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="flex items-center justify-center h-full text-gray-300 text-sm">{t('noImage')}</div>
                      }
                    </div>
                    <div className="p-5">
                      <time className="text-xs text-gray-400">
                        {new Date(post.published_at ?? '').toLocaleDateString(dateLocale, { year:'numeric', month:'long', day:'numeric' })}
                      </time>
                      <h2 className="font-medium text-navy mt-2 mb-2 leading-snug group-hover:text-gold transition-colors">{title}</h2>
                      {excerpt && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{excerpt}</p>}
                      <span className="inline-block mt-3 text-xs text-gold">{t('readMore')}</span>
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
