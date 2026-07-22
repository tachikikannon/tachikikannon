import 'server-only'
import { createClient } from '@supabase/supabase-js'

// サービスロールキーを使うクライアント。RLSを完全にバイパスするため、
// Server Action / Route Handler など「サーバー専用」コードからのみ呼び出すこと。
// 'server-only' の import により、誤って 'use client' 側でimportした場合は
// ビルド時にエラーとなる。
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
