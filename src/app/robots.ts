import type { MetadataRoute } from 'next'

const BASE_URL = process.env.SITE_URL || 'https://tachikikannon.vercel.app'

// 中禅寺・温泉寺とも検索エンジンにインデックスを許可
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
