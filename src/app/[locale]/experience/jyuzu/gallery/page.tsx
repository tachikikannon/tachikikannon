export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InstagramEmbed from '@/components/InstagramEmbed'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

const DEFAULTS: Record<string, string> = {
  jyuzu_heading_instagram: '数珠作り体験ギャラリー',
  jyuzu_heading_instagram_en: 'Juzu Making Experience Gallery',
  jyuzu_instagram_hint: '「#中禅寺立木観音」「#数珠づくり体験」のハッシュタグをつけて投稿すると、こちらでご紹介させていただくことがあります。',
  jyuzu_instagram_hint_en: 'Posts tagged with both "#中禅寺立木観音" and "#数珠づくり体験" may be featured here.',
  jyuzu_instagram_urls: '[]',
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

async function getContent(): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return DEFAULTS
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return DEFAULTS }
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: DEFAULTS.jyuzu_heading_instagram }
}

export default async function JyuzuGalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('jyuzu')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const instagramUrls = pj<{ url: string }[]>(g('jyuzu_instagram_urls'), [])
    .map(({ url }) => url?.trim())
    .filter((url): url is string => !!url)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/experience/jyuzu">{t('title')}</Link> &gt; {g('jyuzu_heading_instagram')}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-14">
          <h1 className="text-xl font-serif text-navy text-center mb-1">{g('jyuzu_heading_instagram')}</h1>
          <div className="w-10 h-0.5 bg-gold mx-auto mb-2" />
          <p className="text-xs text-gray-400 text-center mb-8 max-w-md mx-auto">{g('jyuzu_instagram_hint')}</p>

          {instagramUrls.length > 0 ? (
            <InstagramEmbed urls={instagramUrls} />
          ) : (
            <p className="text-sm text-gray-400 text-center py-10">{t('galleryEmpty')}</p>
          )}

          <div className="text-center mt-12">
            <Link href="/experience/jyuzu" className="text-navy text-sm border-b border-navy/40 hover:border-navy pb-0.5">
              {t('backToJyuzu')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
