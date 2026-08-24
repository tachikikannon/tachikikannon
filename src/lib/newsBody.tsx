import type { ReactNode } from 'react'

// お知らせ本文中に埋め込む写真のマーカー記法。Markdownの画像記法（![alt](url)）を
// そのまま流用し、本文はプレーンテキストのまま「本文に写真を挿入」ボタンで
// カーソル位置にこの記法を差し込む。パース側はこのパターンだけを画像として扱う。
const IMAGE_MARKER = /!\[([^\]]*)\]\((\S+?)\)/g

// 本文中に貼られたURLをリンク化する。日本語文中ではURLの直後にスペースなく
// 句読点や地の文が続くことが多く、[^\s<]+ のような「空白以外なら何でも」という
// パターンだと後続の日本語まで一緒に飲み込んでしまう。URLで実際に使われる
// ASCII文字だけに絞ることで、日本語文字に当たった時点で自然に区切りとする。
const URL_PATTERN = /https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/g
// それでも文末の「.」「)」等（英語の句読点や閉じ括弧）はURLの一部でなく
// 地の文である場合が多いため、末尾からそれらを取り除いてテキスト側に戻す。
const TRAILING_PUNCTUATION = /[.,;:!?)]+$/

function linkifyText(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  URL_PATTERN.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = URL_PATTERN.exec(text))) {
    let url = match[0]
    let end = match.index + url.length
    const trailing = url.match(TRAILING_PUNCTUATION)?.[0]
    if (trailing) {
      url = url.slice(0, -trailing.length)
      end -= trailing.length
    }
    if (!url) continue
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    nodes.push(
      <a key={`${keyPrefix}-${key++}`} href={url} target="_blank" rel="noopener noreferrer" className="underline break-all">
        {url}
      </a>
    )
    lastIndex = end
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  return nodes
}

// 本文文字列を、テキスト・画像・URLリンクが並ぶReactノード配列に変換する。
// 呼び出し元のdivがwhitespace-pre-wrapを持っている前提（テキスト部分の改行はそこで保持される）。
export function renderNewsBody(body: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  IMAGE_MARKER.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = IMAGE_MARKER.exec(body))) {
    if (match.index > lastIndex) {
      nodes.push(<span key={key}>{linkifyText(body.slice(lastIndex, match.index), `t${key}`)}</span>)
      key++
    }
    const [full, alt, url] = match
    nodes.push(
      // eslint-disable-next-line @next/next/no-img-element
      <img key={key++} src={url} alt={alt} className="w-full h-auto rounded-lg my-4" />
    )
    lastIndex = match.index + full.length
  }
  if (lastIndex < body.length) {
    nodes.push(<span key={key}>{linkifyText(body.slice(lastIndex), `t${key}`)}</span>)
  }
  return nodes
}
