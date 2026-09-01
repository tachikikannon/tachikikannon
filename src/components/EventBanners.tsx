import { Link } from '@/i18n/navigation'

interface EventBanner {
  image: string
  href: string
  caption: string
  subcaption?: string
}

// トップページ「お知らせ」の上に表示する、期間限定のお知らせバナー一覧。
// 高さの低い横長バナーに写真とキャプションを重ね、クリックでリンク先へ遷移する。
// 管理画面（/admin/chuzenji/events-banner）でバナーごとに公開・非公開を切り替えられる。
export default function EventBanners({ banners }: { banners: EventBanner[] }) {
  if (!banners.length) return null

  return (
    <div className="space-y-4">
      {banners.map((banner, i) => (
        <Link
          key={i}
          href={banner.href}
          className="relative block h-28 sm:h-36 rounded-lg overflow-hidden shadow-sm group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.image}
            alt={banner.caption}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <p className="font-serif text-lg sm:text-2xl text-white tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {banner.caption}
            </p>
            {banner.subcaption && (
              <p className="text-sm sm:text-base text-gold-light mt-1.5" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {banner.subcaption}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
