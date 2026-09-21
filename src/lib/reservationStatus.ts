import type { SupabaseClient } from '@supabase/supabase-js'

export type StatusUpdateResult = { ok: true } | { ok: false; message: string }

// 予約のステータスを更新し、実際に1行更新されたことまで確認する。
// スマホの復帰直後などは、通信やログイン状態の更新が間に合わず最初の1回だけ失敗することがあるため、
// 失敗したらセッションを更新して1回だけ再試行する。
// （以前は結果を確認していなかったため、保存に失敗してもメールだけ送られ、状態が「未確認」のまま残っていた）
export async function updateReservationStatus(
  supabase: SupabaseClient,
  id: string,
  status: string,
): Promise<StatusUpdateResult> {
  const attempt = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.from('reservations').update({ status }).eq('id', id).select('id')
      if (error) return error.message
      if (!data || data.length === 0) return '更新対象が見つからないか、権限がありません'
      return null
    } catch (e) {
      return e instanceof Error ? e.message : String(e)
    }
  }

  let failure = await attempt()
  if (failure) {
    await supabase.auth.refreshSession().catch(() => undefined)
    await new Promise(resolve => setTimeout(resolve, 500))
    failure = await attempt()
  }
  return failure ? { ok: false, message: failure } : { ok: true }
}
