// 管理画面からアップロードする写真を、保存前にブラウザ内で縮小・圧縮する。
// Supabase Storage の容量を節約するため（スマホ写真は1枚2〜10MBあり、無料枠1GBをすぐ使い切る）。
// 閲覧者への表示は別途 next/image で最適化されるので、ここでは保存用の元画像を軽くするだけ。

const MAX_EDGE = 2560 // 長辺の最大px（印刷でもA5程度まで十分な解像度）
const JPEG_QUALITY = 0.85
const MIN_BYTES = 300 * 1024 // これより小さいファイルはそのまま

function hasTransparency(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const data = ctx.getImageData(0, 0, w, h).data
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true
  }
  return false
}

/** 圧縮できなかった・小さくならなかった場合は元のファイルをそのまま返す */
export async function compressImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < MIN_BYTES) return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) { bitmap.close(); return file }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    // 透過のあるPNG（ロゴ・切り抜き素材など）はPNGのまま、それ以外の写真はJPEGにする
    const keepPng = file.type === 'image/png' && hasTransparency(ctx, w, h)
    const targetType = keepPng ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, targetType, keepPng ? undefined : JPEG_QUALITY))
    // Safari等は webp を書き出せず PNG で返すことがあるので、実際の blob.type を使う
    if (!blob || blob.size >= file.size * 0.9) return file

    const ext = blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/webp' ? 'webp' : 'png'
    const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext
    return new File([blob], name, { type: blob.type, lastModified: file.lastModified })
  } catch {
    return file
  }
}
