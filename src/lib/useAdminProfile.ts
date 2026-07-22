'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { AdminProfile } from '@/types'

// ログイン中の管理者自身の role/profile を取得するフック。
// UIの出し分け（編集ボタンの表示/非表示など）専用で、実効的な権限制御ではない。
// 実際の書き込み可否は必ず Supabase 側の RLS（current_admin_role()）が決める。
export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const supabase = createClient()
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (active) { setProfile(null); setLoading(false) }; return }
      const { data } = await supabase.from('admin_profiles').select('*').eq('id', user.id).maybeSingle()
      if (active) { setProfile(data as AdminProfile | null); setLoading(false) }
    })()
    return () => { active = false }
  }, [])

  const canEdit = profile?.role === 'admin' || profile?.role === 'super_admin'
  const isSuperAdmin = profile?.role === 'super_admin'

  return { profile, loading, canEdit, isSuperAdmin }
}
