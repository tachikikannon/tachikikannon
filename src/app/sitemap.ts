import type { MetadataRoute } from 'next'
import { createPublicSupabaseClient } from '@/lib/supabase-server'

// クローラーが繰り返し取得するため、cookies()を使う管理用クライアントで
// 毎回Supabaseに問い合わせないようにする（キャッシュされない読み取りクライアントの
// 使用はCached Egress超過の一因だった）。1時間おきの再生成で十分
export const revalidate = 3600

const BASE_URL = process.env.SITE_URL || 'https://tachikikannon.vercel.app'
const LOCALES = ['ja', 'en'] as const

// [locale]配下の静的ページ一覧（動的ルート [id]/[slug] を除く）。
// ページを追加・削除したらここも更新すること。
const STATIC_PATHS = [
  '',
  '/about', '/annual-events', '/annual-events/funazento', '/annual-events/funazento/apply',
  '/annual-events/kannonko', '/annual-events/kannonko/apply', '/annual-events/shogatsu', '/annual-events/shogatsu/apply',
  '/apply', '/blog', '/contact', '/events',
  '/experience/jyuzu', '/experience/jyuzu/gallery', '/experience/shabutu', '/experience/shakyou', '/experience/zazen',
  '/faq', '/flower-calendar', '/goshuin', '/grounds', '/history', '/news', '/order/cod', '/photos',
  '/prayer', '/prayer/mail-apply', '/prayer/mail-apply/cod', '/prayer/wedding', '/prayer/wedding/apply',
  '/privacy', '/reserve',
  '/onsenji', '/onsenji/about', '/onsenji/apply', '/onsenji/contact', '/onsenji/events',
  '/onsenji/events/setsubun', '/onsenji/events/setsubun/apply', '/onsenji/events/yakushiko', '/onsenji/events/yakushiko/apply',
  '/onsenji/experience/shabutu', '/onsenji/experience/shakyou', '/onsenji/faq', '/onsenji/goshuin',
  '/onsenji/grounds', '/onsenji/history', '/onsenji/news', '/onsenji/onsen', '/onsenji/photos',
]

function urlFor(path: string, locale: (typeof LOCALES)[number]) {
  const prefix = locale === 'ja' ? '' : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

function withAlternates(path: string) {
  return LOCALES.map(locale => ({
    url: urlFor(path, locale),
    alternates: {
      languages: Object.fromEntries(LOCALES.map(l => [l, urlFor(path, l)])),
    },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createPublicSupabaseClient()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(withAlternates)

  const [{ data: news }, { data: posts }, { data: minorEvents }] = await Promise.all([
    supabase.from('news').select('id, site, updated_at').eq('is_published', true),
    supabase.from('posts').select('slug, updated_at').eq('is_published', true),
    supabase.from('minor_events').select('slug, site, updated_at').eq('is_published', true),
  ])

  const newsEntries: MetadataRoute.Sitemap = (news ?? []).flatMap(n => {
    const path = n.site === 'onsenji' ? `/onsenji/news/${n.id}` : `/news/${n.id}`
    return LOCALES.map(locale => ({
      url: urlFor(path, locale),
      lastModified: n.updated_at ? new Date(n.updated_at) : undefined,
    }))
  })

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).flatMap(p =>
    LOCALES.map(locale => ({
      url: urlFor(`/blog/${p.slug}`, locale),
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    }))
  )

  const minorEventEntries: MetadataRoute.Sitemap = (minorEvents ?? []).flatMap(e => {
    const path = e.site === 'onsenji' ? `/onsenji/events/m/${e.slug}` : `/annual-events/m/${e.slug}`
    return LOCALES.map(locale => ({
      url: urlFor(path, locale),
      lastModified: e.updated_at ? new Date(e.updated_at) : undefined,
    }))
  })

  return [...staticEntries, ...newsEntries, ...postEntries, ...minorEventEntries]
}
