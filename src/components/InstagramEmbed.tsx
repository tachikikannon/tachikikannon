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
      {/* Instagram公式ウィジェットは自前で枠線・角丸・影を付けてくるため、
          さらに外側にborder/rounded/shadowを重ねると二重枠になって
          がたついて見える。ここでは幅(グリッドの列)だけ決めて、見た目は
          Instagram側の描画にそのまま任せる。3列グリッドで、はみ出た分は
          縦スクロールで見られる形にした */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
