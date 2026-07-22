'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import { createAdminUser, updateAdminRole, setAdminActive } from './actions'
import type { AdminProfile, AdminRole } from '@/types'

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'super_admin（全権限）',
  admin: 'admin（編集可能）',
  viewer: 'viewer（閲覧のみ）',
}

export default function AdminUsersPage() {
  const supabase = createClient()
  const { profile: me, loading: meLoading, isSuperAdmin } = useAdminProfile()
  const [list, setList] = useState<AdminProfile[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'admin' as AdminRole })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function load() {
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at')
    setList(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    const result = await createAdminUser(form)
    setBusy(false)
    if (!result.ok) { setMessage(result.error); return }
    setForm({ email: '', password: '', name: '', role: 'admin' })
    setShowForm(false)
    load()
  }

  async function handleRoleChange(id: string, role: AdminRole) {
    setBusy(true)
    const result = await updateAdminRole(id, role)
    setBusy(false)
    if (!result.ok) { setMessage(result.error); return }
    load()
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setBusy(true)
    const result = await setAdminActive(id, isActive)
    setBusy(false)
    if (!result.ok) { setMessage(result.error); return }
    load()
  }

  if (meLoading) return <div className="p-8 text-sm text-gray-400">読み込み中...</div>

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-serif text-navy mb-4">管理者管理</h1>
        <p className="text-sm text-gray-500">このページは super_admin のみ閲覧できます。</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">管理者管理</h1>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary text-sm px-4 py-2">
          {showForm ? 'キャンセル' : '+ 管理者を追加'}
        </button>
      </div>

      {message && <p className="text-red-600 text-sm mb-4">{message}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-5 mb-6 space-y-4 max-w-md">
          <div>
            <label className="admin-label">メールアドレス</label>
            <input type="email" required className="admin-input" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">初期パスワード</label>
            <input type="password" required minLength={6} className="admin-input" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">名前</label>
            <input required className="admin-input" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">ロール</label>
            <select className="admin-input" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as AdminRole })}>
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={busy} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
            {busy ? '作成中...' : '作成する'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500">名前</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">メール</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">ロール</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(u => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <select className="admin-input text-xs py-1" value={u.role} disabled={busy}
                    onChange={e => handleRoleChange(u.id, e.target.value as AdminRole)}>
                    {(Object.keys(ROLE_LABELS) as AdminRole[]).map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.is_active ? '有効' : '停止中'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={busy || u.id === me?.id}
                    onClick={() => handleToggleActive(u.id, !u.is_active)}
                    className="text-xs text-navy hover:underline disabled:opacity-30 disabled:no-underline">
                    {u.is_active ? '停止する' : '再開する'}
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">管理者がいません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
