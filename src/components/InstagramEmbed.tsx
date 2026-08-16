'use client'
import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

// Instagram公式の埋め込みウィジェット。data-instgrm-permalinkを持つ
// blockquoteを置いておき、embed.jsが読み込まれるとInstagram側で
// 実際の投稿(写真・キャプション等)に描画し直してくれる。
// ページ遷移で再マウントされたときはscriptタグ自体は再読み込みされない
// (Next.jsのScriptはsrcで重複排除する)ため、window.instgrmが既にあれば
// 明示的にprocess()を呼び直す必要がある。
export default function InstagramEmbed({ urls }: { urls: string[] }) {
  useEffect(() => {
    window.instgrm?.Embeds.process()
  }, [urls])

  if (urls.length === 0) return null

  return (
    <>
      {/* 大きくなりすぎないよう、1枚あたりの幅を固定し横一列でスクロールさせる
          (Instagram公式ウィジェットは幅326px前後が実質的な下限のため、
          これ以上狭めると写真が欠けて表示されてしまう) */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
        {urls.map((url, i) => (
          <div key={i} className="flex-shrink-0 w-[320px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ margin: 0, width: '100%' }}
            />
          </div>
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
    </>
  )
}
