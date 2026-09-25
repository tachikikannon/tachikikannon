// next/image（Vercelの画像最適化）に通せるURLかどうか。next.config.tsの
// images.remotePatterns で許可しているのはサイト内の画像とSupabase Storageの
// 公開画像だけなので、それ以外（管理画面で外部URLを貼られた場合など）を
// next/imageに渡すと実行時エラーになる。そうしたURLは素の<img>で表示する。
const SUPABASE_PUBLIC_IMAGE = /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//

export function isOptimizableImage(src: string): boolean {
  return (src.startsWith('/') && !src.startsWith('//')) || SUPABASE_PUBLIC_IMAGE.test(src)
}
