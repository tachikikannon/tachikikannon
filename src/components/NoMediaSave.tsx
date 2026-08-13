'use client'
import { useEffect } from 'react'

// 画像・動画の右クリック保存とドラッグ保存を防ぐ（簡易的な抑止であり、完全な保存防止ではない）
export default function NoMediaSave() {
  useEffect(() => {
    function isMedia(target: EventTarget | null) {
      return target instanceof Element && !!target.closest('img, video, picture')
    }
    function onContextMenu(e: MouseEvent) {
      if (isMedia(e.target)) e.preventDefault()
    }
    function onDragStart(e: DragEvent) {
      if (isMedia(e.target)) e.preventDefault()
    }
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return null
}
