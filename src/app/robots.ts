import type { MetadataRoute } from 'next'

// 中禅寺・温泉寺とも検索エンジンにインデックスさせない
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
