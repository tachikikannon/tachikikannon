'use client'
import { useRef } from 'react'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/types'

export default function RecordsCarousel({ posts, noImageLabel }: { posts: Post[]; noImageLabel: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`}
            className="group card overflow-hidden flex-shrink-0 w-40 snap-start flex flex-col">
            <div className="relative h-28 bg-white overflow-hidden">
              {post.cover_url
                ? <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="flex items-center justify-center h-full text-gray-300 text-xs">{noImageLabel}</div>
              }
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <time className="text-[10px] text-gray-400">
                {new Date(post.published_at ?? '').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <p className="text-xs text-navy font-medium mt-1 leading-snug line-clamp-2 group-hover:text-gold transition-colors">{post.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <button type="button" onClick={() => scroll(-1)} aria-label="前へ"
        className="absolute left-0 top-[38%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-navy hover:bg-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
        ‹
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="次へ"
        className="absolute right-0 top-[38%] translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-navy hover:bg-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
        ›
      </button>
    </div>
  )
}
