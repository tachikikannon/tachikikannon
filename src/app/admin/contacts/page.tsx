'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import type { AdminProfile, Contact, ContactStatus } from '@/types'

const STATUS_LABELS: Record<ContactStatus, string> = {
  unread: '未読', checking: '対応中', replied: '返信済み', completed: '完了',
}
const STATUS_COLORS: Record<ContactStatus, string> = {
  unread: 'bg-red-100 text-red-700',
  checking: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  completed: 'bg-gray-200 text-gray-600',
}
const STATUS_OPTIONS: ContactStatus[] = ['unread', 'checking', 'replied', 'completed']

export default function AdminContactsPage() {
  const supabase = createClient()
  const { profile, canEditContacts: canEdit } = useAdminProfile()
  const [list, setList] = useState<Contact[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [selected, setSelected] = useState<Contact | null>(null)
  const [pendingStatus, setPendingStatus] = useState<ContactStatus | null>(null)

  async function load() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  function openDetail(c: Contact | null) {
    setSelected(c)
    setPendingStatus(null)
  }

  async function markRead(id: string) {
    await supabase.from('contacts').update({ is_read: true }).eq('id', id)
    setList(prev => prev.map(c => c.id === id ? { ...c, is_read: true } : c))
    if (selected?.id === id) setSelected(s => s ? { ...s, is_read: true } : s)
  }

  async function updateStatus(id: string, status: ContactStatus) {
    await supabase.from('contacts').update({ status }).eq('id', id)
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
  }

  async function updateAssignee(id: string, assigned_admin_id: string) {
    await supabase.from('contacts').update({ assigned_admin_id: assigned_admin_id || null }).eq('id', id)
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, assigned_admin_id: assigned_admin_id || null } : s)
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('contacts').delete().eq('id', id)
    setSelected(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'

  return (
    <div className="p-8 print:p-0">
      <div className="print:hidden flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">お問い合わせ管理</h1>
        <span className="badge bg-red-100 text-red-700">
          未読 {list.filter(c => !c.is_read).length} 件
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 print:block items-start">
        {/* 一覧 */}
        <div className="bg-white rounded-xl shadow overflow-y-auto lg:max-h-[calc(100vh-14rem)] print:hidden">
          <ul className="divide-y divide-gray-100">
            {list.map(c => (
              <li key={c.id} onClick={() => { openDetail(c); if(!c.is_read && canEdit) markRead(c.id) }}
                className={`px-5 py-4 cursor-pointer hover:bg-blue-50 transition-colors
                  ${selected?.id === c.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!c.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                      <p className="font-medium text-sm truncate">{c.name}</p>
                      <span className={`badge ${STATUS_COLORS[c.status]} flex-shrink-0`}>{STATUS_LABELS[c.status]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{c.subject}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">担当: {adminName(c.assigned_admin_id)}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </li>
            ))}
            {list.length === 0 && <li className="px-4 py-8 text-center text-gray-400 text-sm">お問い合わせはありません</li>}
          </ul>
        </div>

        {/* 詳細 */}
        {selected && (
          <div className="bg-white rounded-xl shadow p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto print:shadow-none print:p-0 print:max-h-none print:overflow-visible">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy text-lg">{selected.subject}</h2>
              <button onClick={() => openDetail(null)} className="text-gray-400 hover:text-gray-600 text-lg print:hidden">✕</button>
            </div>
            <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2 text-sm mb-5">
              <dt className="text-gray-500 text-xs">お名前</dt><dd>{selected.name}</dd>
              <dt className="text-gray-500 text-xs">メール</dt>
              <dd><a href={`mailto:${selected.email}`} className="text-navy underline print:no-underline print:text-black">{selected.email}</a></dd>
              <dt className="text-gray-500 text-xs">受信日</dt>
              <dd className="text-xs text-gray-500">{new Date(selected.created_at).toLocaleString('ja-JP')}</dd>
              <dt className="text-gray-500 text-xs">更新日時</dt>
              <dd className="text-xs text-gray-500">{selected.updated_at ? new Date(selected.updated_at).toLocaleString('ja-JP') : '—'}</dd>
            </dl>
            <div className="bg-gray-50 rounded p-4 text-sm leading-relaxed whitespace-pre-wrap mb-4 print:bg-white print:p-0">
              {selected.message}
            </div>

            <div className="mb-4 print:hidden">
              <p className="text-xs text-gray-500 mb-2">担当者</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm">{adminName(selected.assigned_admin_id)}</span>
                {canEdit && profile && selected.assigned_admin_id !== profile.id && (
                  <button onClick={() => updateAssignee(selected.id, profile.id)} className="text-xs text-navy underline">
                    自分を担当にする
                  </button>
                )}
                {canEdit && selected.assigned_admin_id && (
                  <button onClick={() => updateAssignee(selected.id, '')} className="text-xs text-gray-400 underline">
                    担当を外す
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4 print:hidden">
              <p className="text-xs text-gray-500 mb-2">対応状況</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => setPendingStatus(s)}
                    disabled={!canEdit || selected.status === s}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40 ${STATUS_COLORS[s]} ${pendingStatus === s ? 'ring-2 ring-offset-1 ring-navy' : ''}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              {pendingStatus && pendingStatus !== selected.status && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">「{STATUS_LABELS[pendingStatus]}」に変更しますか？</span>
                  <button onClick={() => { updateStatus(selected.id, pendingStatus); setPendingStatus(null) }}
                    className="btn-primary text-xs px-3 py-1.5">確定する</button>
                  <button onClick={() => setPendingStatus(null)} className="text-xs text-gray-400 underline">キャンセル</button>
                </div>
              )}
              {!canEdit && <p className="text-[11px] text-gray-400 mt-2">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
            </div>

            <div className="flex gap-3 print:hidden">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="btn-primary text-sm px-4 py-2">返信する（メール）</a>
              <button onClick={() => window.print()} className="text-sm px-4 py-2 border border-navy text-navy rounded hover:bg-navy hover:text-white transition-colors">🖨 印刷</button>
              {canEdit && <button onClick={() => remove(selected.id)} className="text-red-500 text-sm hover:underline">削除</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
