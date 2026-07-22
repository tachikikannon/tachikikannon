'use server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import type { AdminRole } from '@/types'

type ActionResult = { ok: true } | { ok: false; error: string }

// 呼び出し元がアクティブな super_admin であることをサーバー側で必ず再検証する。
// クライアント側のロール表示（UIの出し分け）は信用しない。
async function requireSuperAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: '未ログインです' }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !profile.is_active || profile.role !== 'super_admin') {
    return { ok: false as const, error: '権限がありません（super_adminのみ実行できます）' }
  }
  return { ok: true as const, userId: user.id }
}

export async function createAdminUser(input: {
  email: string
  password: string
  name: string
  role: AdminRole
}): Promise<ActionResult> {
  const auth = await requireSuperAdmin()
  if (!auth.ok) return auth

  const admin = createAdminClient()

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  })
  if (createError || !created.user) {
    return { ok: false, error: createError?.message ?? 'アカウント作成に失敗しました' }
  }

  const { error: profileError } = await admin.from('admin_profiles').insert({
    id: created.user.id,
    email: input.email,
    name: input.name,
    role: input.role,
    is_active: true,
  })
  if (profileError) {
    // profile作成に失敗した場合はauth userを補償削除し、不完全なアカウントを残さない
    await admin.auth.admin.deleteUser(created.user.id)
    return { ok: false, error: profileError.message }
  }

  await admin.from('admin_activity_logs').insert({
    actor_id: auth.userId,
    action: 'admin_added',
    target_table: 'admin_profiles',
    target_id: created.user.id,
    new_value: { email: input.email, role: input.role },
  })

  return { ok: true }
}

export async function updateAdminRole(targetId: string, role: AdminRole): Promise<ActionResult> {
  const auth = await requireSuperAdmin()
  if (!auth.ok) return auth

  const admin = createAdminClient()
  const { data: before } = await admin.from('admin_profiles').select('role').eq('id', targetId).maybeSingle()

  const { error } = await admin.from('admin_profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', targetId)
  if (error) return { ok: false, error: error.message }

  await admin.from('admin_activity_logs').insert({
    actor_id: auth.userId,
    action: 'admin_edited',
    target_table: 'admin_profiles',
    target_id: targetId,
    old_value: { role: before?.role },
    new_value: { role },
  })

  return { ok: true }
}

export async function setAdminActive(targetId: string, isActive: boolean): Promise<ActionResult> {
  const auth = await requireSuperAdmin()
  if (!auth.ok) return auth

  if (targetId === auth.userId && !isActive) {
    return { ok: false, error: '自分自身のアカウントは停止できません' }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', targetId)
  if (error) return { ok: false, error: error.message }

  await admin.from('admin_activity_logs').insert({
    actor_id: auth.userId,
    action: isActive ? 'admin_activated' : 'admin_deactivated',
    target_table: 'admin_profiles',
    target_id: targetId,
    new_value: { is_active: isActive },
  })

  return { ok: true }
}
