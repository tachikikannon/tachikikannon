import type { MetadataRoute } from 'next'

// 中禅寺・温泉寺とも検索エンジンにインデックスを許可
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
  }
}
