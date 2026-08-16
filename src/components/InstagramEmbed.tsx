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
      <div className="grid sm:grid-cols-2 gap-6">
        {urls.map((url, i) => (
          <blockquote
            key={i}
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: '0 auto', width: '100%' }}
          />
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
