'use client'
import { useEffect, useState } from 'react'
import Image, { type ImageProps } from 'next/image'

function Lightbox({ onClose, width, height, fill, ...rest }: ImageProps & { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative w-full h-full max-w-4xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
        <Image {...rest} fill sizes="100vw" className="object-contain" />
      </div>
      <button onClick={onClose} aria-label="閉じる"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center text-xl hover:bg-white transition-colors">
        ×
      </button>
    </div>
  )
}

// 既存の <Image> の差し替え用。fillモード/width-heightモードの両方に対応し、
// クリックすると同じ画像を全画面オーバーレイで拡大表示する。
export default function ZoomableImage(props: ImageProps) {
  const [open, setOpen] = useState(false)

  if (props.fill) {
    return (
      <>
        <button type="button" onClick={() => setOpen(true)} aria-label="写真を拡大表示"
          className="absolute inset-0 w-full h-full block group cursor-zoom-in">
          <Image {...props} />
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-2xl drop-shadow">🔍</span>
          </span>
        </button>
        {open && <Lightbox {...props} onClose={() => setOpen(false)} />}
      </>
    )
  }

  // fillでない場合、余分なボックスを挟むと呼び出し元の h-full/w-full 指定が壊れるため
  // display:contents でボタンをレイアウトから消し、クリック領域だけ提供する。
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="写真を拡大表示" className="contents">
        <Image {...props} className={`${props.className ?? ''} cursor-zoom-in hover:opacity-80 transition-opacity`} />
      </button>
      {open && <Lightbox {...props} onClose={() => setOpen(false)} />}
    </>
  )
}
