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
// 本文中の行揃え指定。[center]〜[/center] のように対象範囲を挟んで指定する
// （管理画面の「左揃え／中央揃え／右揃え」ボタンが選択範囲を自動でこの記法に置き換える）
const ALIGN_BLOCK = /\[(center|right|left)\]([\s\S]*?)\[\/\1\]/g

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

// テキスト・画像・URLリンクが並ぶReactノード配列に変換する（行揃え指定の中身にも再帰的に使う）。
// 呼び出し元のdivがwhitespace-pre-wrapを持っている前提（テキスト部分の改行はそこで保持される）。
function renderInline(body: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  IMAGE_MARKER.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = IMAGE_MARKER.exec(body))) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`${keyPrefix}-t${key}`}>{linkifyText(body.slice(lastIndex, match.index), `${keyPrefix}-t${key}`)}</span>)
      key++
    }
    const [full, alt, url] = match
    nodes.push(
      // eslint-disable-next-line @next/next/no-img-element
      <img key={`${keyPrefix}-i${key++}`} src={url} alt={alt} className="w-full h-auto rounded-lg my-4" />
    )
    lastIndex = match.index + full.length
  }
  if (lastIndex < body.length) {
    nodes.push(<span key={`${keyPrefix}-t${key}`}>{linkifyText(body.slice(lastIndex), `${keyPrefix}-t${key}`)}</span>)
  }
  return nodes
}

// 本文文字列を、行揃え指定（[center]〜[/center]等）・画像・URLリンクが並ぶReactノード配列に変換する。
export function renderNewsBody(body: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  ALIGN_BLOCK.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = ALIGN_BLOCK.exec(body))) {
    if (match.index > lastIndex) {
      nodes.push(...renderInline(body.slice(lastIndex, match.index), `p${key}`))
      key++
    }
    const [full, align, inner] = match
    nodes.push(
      <div key={`a${key}`} style={{ textAlign: align as 'center' | 'right' | 'left' }}>
        {renderInline(inner, `a${key}`)}
      </div>
    )
    key++
    lastIndex = match.index + full.length
  }
  if (lastIndex < body.length) {
    nodes.push(...renderInline(body.slice(lastIndex), `p${key}`))
  }
  return nodes
}
