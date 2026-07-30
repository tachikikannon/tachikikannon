import 'server-only'
import { createAdminClient } from '@/lib/supabase-admin'

// 申請/お問い合わせ/予約/代金引換の各テーブルで共通の
// 「自動返信メール送信済み」フラグを立てる。
// 匿名ユーザーはRLSでこれらのテーブルを更新できないため、
// サービスロールで直接更新する。idが無い場合は何もしない。
export async function markAutoReplySent(table: 'applications' | 'contacts' | 'reservations' | 'cod_orders', id: string | undefined | null) {
  if (!id) return
  const supabase = createAdminClient()
  const { error } = await supabase.from(table).update({ auto_reply_sent: true }).eq('id', id)
  if (error) console.error(`[notifyStatus] ${table} auto_reply_sent update failed:`, error)
}
