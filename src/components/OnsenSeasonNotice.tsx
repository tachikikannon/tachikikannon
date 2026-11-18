import type { OnsenSeasonState } from '@/lib/onsenSeason'

/**
 * 薬師の湯の閉湯期間中に出す案内。
 * variant="hero": 温泉寺トップのヒーロー（営業状態バッジの代わり）
 * variant="page": 温泉のご案内ページ本文の先頭
 */
export default function OnsenSeasonNotice({
  season,
  openDateLine,
  variant,
}: {
  season: OnsenSeasonState
  openDateLine: string
  variant: 'hero' | 'page'
}) {
  if (variant === 'hero') {
    return (
      <div className="inline-flex flex-col items-center gap-1.5 bg-white text-gray-700 px-5 sm:px-8 py-5 rounded-2xl shadow-xl max-w-md text-center">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex rounded-full h-3 w-3 bg-[#5b7fa8] flex-shrink-0" />
          <p className="text-lg md:text-2xl font-bold tracking-wide break-keep">{season.label}</p>
        </div>
        {season.waitMessage && (
          <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">{season.waitMessage}</p>
        )}
        <p className="text-xs md:text-sm text-gray-700">{openDateLine}</p>
        {season.infoMessage && (
          <p className="text-[11px] md:text-xs text-gray-600 mt-0.5 leading-relaxed whitespace-pre-line">{season.infoMessage}</p>
        )}
      </div>
    )
  }
  return (
    <section className="rounded-2xl border border-[#5b7fa8]/30 bg-[#f3f6fa] px-6 py-6 text-center">
      <div className="flex items-center justify-center gap-2.5 mb-2">
        <span className="inline-flex rounded-full h-3 w-3 bg-[#5b7fa8] flex-shrink-0" />
        <p className="font-serif text-xl md:text-2xl text-onsenji tracking-wide">{season.label}</p>
      </div>
      {season.waitMessage && (
        <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">{season.waitMessage}</p>
      )}
      <p className="text-sm text-gray-600 mt-2 font-medium">{openDateLine}</p>
      {season.infoMessage && (
        <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{season.infoMessage}</p>
      )}
    </section>
  )
}
