type Props = {
  videoId: string
  alt: string
  className?: string
}

// 自動再生（ミュート・ループ）でYouTube動画を埋め込む
export default function YouTubeAutoplay({ videoId, alt, className }: Props) {
  return (
    <div className={`relative w-full h-full ${className ?? ''}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0`}
        title={alt}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
