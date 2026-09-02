import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetch: (url: any, options: any) => fetch(url, { ...options, cache: 'no-store' }),
      },
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          )
        },
      },
    }
  )
}

// alias
export const createServerClient = createServerSupabaseClient

// 公開ページ（お知らせ・行事・トップページの一覧/詳細など、is_publishedで
// 絞り込み済みで誰が見ても同じ内容のもの）専用の読み取りクライアント。
// createServerSupabaseClientはcookies()を呼ぶためページ全体が強制的に
// 動的レンダリングになり、しかもfetchをcache:'no-store'固定にしているため
// Supabaseへのリクエストがキャッシュされずページビューのたびに発生する
// （2026-09-02のCached Egress超過の一因）。ログイン状態を見る必要が
// ない公開ページはこちらを使い、Next.jsのData Cacheで60秒キャッシュする
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetch: (url: any, options: any) => fetch(url, { ...options, next: { revalidate: 60 } }),
      },
    }
  )
}
