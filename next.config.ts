import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  turbopack: {
    root: '.',
  },
  images: {
    // Vercel無料枠の画像変換（月5,000回）を使い切らないための設定。
    // Supabaseの画像は元のキャッシュ期間が1時間しかなく、既定のままだと同じ写真を
    // 数時間おきに作り直していた。アップロード画像は毎回別名で保存されるので、
    // 31日間キャッシュしても古い画像が残る心配はない。
    minimumCacheTTL: 2678400,
    formats: ['image/webp'],
    qualities: [75],
    // 生成する幅の種類を絞る（既定は16種類）
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
