import { useSyncExternalStore } from 'react'

/**
 * トップページのヒーロー演出（白背景の見出し演出〜写真が現れるまで）が再生中かどうかを、
 * HeroReveal から別コンポーネント（ヘッダー等）へ伝えるための小さな共有ストア。
 * 両者はサーバーコンポーネントのページから兄弟として描画されるため props では渡せない。
 * サーバー描画時・HeroReveal が無いページでは常に false。
 */
let playing = false
const listeners = new Set<() => void>()

export function setHeroIntroPlaying(v: boolean) {
  if (playing === v) return
  playing = v
  listeners.forEach(l => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function useHeroIntroPlaying(): boolean {
  return useSyncExternalStore(subscribe, () => playing, () => false)
}
