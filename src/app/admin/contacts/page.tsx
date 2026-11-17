'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import {
  AdminDetailModal, AssigneeEditor, DateRangeFilter, DetailRow, DetailSection, EditActions, EditField,
  EmptyCard, EmptyRow, FilterTabs, SearchBox, StatusChanger, inDateRange, shortDateTime, updateRecord,
} from '@/components/admin/RecordListUI'
import type { AdminProfile, Contact, ContactSource, ContactStatus } from '@/types'

const STATUS_LABELS: Record<ContactStatus, string> = {
  unread: '未読', checking: '対応中', replied: '返信済み', completed: '完了',
}
const STATUS_COLORS: Record<ContactStatus, string> = {
  unread: 'bg-red-100 text-red-700',
  checking: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  completed: 'bg-gray-200 text-gray-600',
}
// スマホのカード一覧だけで使う、状態を表す左ボーダーの色（バッジと同系色）
const STATUS_BORDER_COLORS: Record<ContactStatus, string> = {
  unread: 'border-red-400',
  checking: 'border-yellow-400',
  replied: 'border-green-400',
  completed: 'border-gray-300',
}
const STATUS_OPTIONS: ContactStatus[] = ['unread', 'checking', 'replied', 'completed']
const SOURCE_LABELS: Record<ContactSource, string> = { contact: 'お問い合わせ', event_application: '行事申込み' }

type FilterKey = 'all' | ContactStatus
type EditForm = { subject: string; name: string; email: string; message: string }

export default function AdminContactsPage() {
  const supabase = createClient()
  const router = useRouter()
  const { profile, canEditContacts: canEdit } = useAdminProfile()
  const [list, setList] = useState<Contact[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [detail, setDetail] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sourceFilter, setSourceFilter] = useState<'' | ContactSource>('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [editForm, setEditForm] = useState<EditForm | null>(null) // null のときは閲覧表示
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    // 読み込みに失敗したときは、一覧を空にせず直前の表示を残す
    if (!error) {
      const rows = (data ?? []) as Contact[]
      setList(rows)
      // 開いている詳細も最新の内容（更新日時など）に合わせる
      setDetail(d => d ? (rows.find(r => r.id === d.id) ?? d) : d)
    }
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  function openDetail(c: Contact | null) {
    setDetail(c)
    setEditForm(null)
    if (c && !c.is_read && canEdit) markRead(c.id)
  }

  async function markRead(id: string) {
    await supabase.from('contacts').update({ is_read: true }).eq('id', id)
    setList(prev => prev.map(c => c.id === id ? { ...c, is_read: true } : c))
    setDetail(d => d && d.id === id ? { ...d, is_read: true } : d)
    router.refresh()
  }

  async function update(id: string, values: Partial<Contact>) {
    const ok = await updateRecord(supabase, 'contacts', id, values)
    if (ok) {
      setDetail(d => d && d.id === id ? { ...d, ...values } : d)
      load()
      router.refresh()
    }
    return ok
  }

  function startEdit() {
    if (!detail) return
    setEditForm({ subject: detail.subject, name: detail.name, email: detail.email, message: detail.message })
  }

  async function saveEdit() {
    if (!detail || !editForm) return
    setSaving(true)
    const ok = await update(detail.id, editForm)
    setSaving(false)
    if (ok) setEditForm(null)
  }

  async function remove(id: string) {
    if (!confirm('このお問い合わせを削除しますか？削除すると元に戻せません。')) return
    const { data, error } = await supabase.from('contacts').delete().eq('id', id).select('id')
    if (error) { alert('削除に失敗しました：' + error.message); return }
    if (!data || data.length === 0) { alert('削除できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return }
    setDetail(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'
  const sourceOf = (c: Contact) => c.source ?? 'contact'

  const byStatus = filter === 'all' ? list : list.filter(c => c.status === filter)
  const bySource = sourceFilter === '' ? byStatus : byStatus.filter(c => sourceOf(c) === sourceFilter)
  const byDate = bySource.filter(c => inDateRange(c.created_at, dateFrom, dateTo))
  const searchQuery = search.trim().toLowerCase()
  const filtered = searchQuery === '' ? byDate : byDate.filter(c =>
    [c.name, c.email, c.subject, c.message].some(v => v?.toLowerCase().includes(searchQuery))
  )
  const hasCondition = filter !== 'all' || sourceFilter !== '' || searchQuery !== '' || dateFrom !== '' || dateTo !== ''
  const emptyText = hasCondition ? '検索条件に一致するお問い合わせがありません' : 'お問い合わせはありません'

  return (
    <div className="p-8 print:p-0 overflow-x-clip">
      <div className="print:hidden">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-serif text-navy">お問い合わせ管理</h1>
          <span className="badge bg-red-100 text-red-700">
            未読 {list.filter(c => c.status === 'unread').length} 件
          </span>
        </div>

        <FilterTabs value={filter} onChange={setFilter} tabs={[
          { key: 'all', label: 'すべて', count: list.length },
          ...STATUS_OPTIONS.map(s => ({ key: s, label: STATUS_LABELS[s], count: list.filter(c => c.status === s).length })),
        ]} />

        {/* 検索・絞り込み */}
        <div className="mb-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="admin-label">種別で絞り込み</label>
            <select className="admin-input text-sm" value={sourceFilter} onChange={e => setSourceFilter(e.target.value as '' | ContactSource)}>
              <option value="">すべての種別</option>
              {Object.entries(SOURCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <SearchBox label="名前・メール・件名・本文で検索" value={search} onChange={setSearch} />
          <DateRangeFilter label="受信日で絞り込み" from={dateFrom} to={dateTo} onChange={(f, t) => { setDateFrom(f); setDateTo(t) }} />
        </div>

        {/* PC用の表。縦はページ本体のスクロールにまかせ、横だけこの枠でスクロールさせる（予約検索と同じ） */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {['状態', '受信日', '種別', 'お名前', '件名', 'メール', '担当者', '自動返信', '更新日時'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} onClick={() => openDetail(c)} className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString('ja-JP')}<br />
                    <span className="text-gray-400">{new Date(c.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{SOURCE_LABELS[sourceOf(c)]}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      {!c.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="未読" />}
                      {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700 max-w-[240px] truncate">{c.subject}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{adminName(c.assigned_admin_id)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {c.auto_reply_sent ? <span className="text-green-700">✉️ 送信済み</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {c.updated_at ? new Date(c.updated_at).toLocaleString('ja-JP') : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <EmptyRow colSpan={9}>{emptyText}</EmptyRow>}
            </tbody>
          </table>
        </div>

        {/* スマホ用カード一覧。横スクロールなしで下へスクロールして次のお問い合わせを確認できる */}
        <div className="md:hidden space-y-2.5">
          {filtered.map(c => (
            <div key={c.id} onClick={() => openDetail(c)}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${STATUS_BORDER_COLORS[c.status]} p-4 active:bg-blue-50 cursor-pointer`}>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {!c.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="未読" />}
                <span className={`badge ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
                {sourceOf(c) === 'event_application' && <span className="badge bg-amber-100 text-amber-700">行事申込み</span>}
                <span className="text-xs text-gray-500 whitespace-nowrap">{shortDateTime(c.created_at)}</span>
              </div>
              <p className="font-semibold text-base text-navy mb-1">
                {c.name}<span className="text-xs font-normal text-gray-400 ml-1">様</span>
              </p>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2 [overflow-wrap:anywhere]">{c.subject}</p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                <div className="truncate">✉️ {c.email || '—'}</div>
                <div className="truncate">👤 {adminName(c.assigned_admin_id)}</div>
              </dl>
              <p className={`mt-2 text-[11px] ${c.auto_reply_sent ? 'text-green-700' : 'text-gray-300'}`}>
                自動返信{c.auto_reply_sent ? '済み' : '未'}
              </p>
            </div>
          ))}
          {filtered.length === 0 && <EmptyCard>{emptyText}</EmptyCard>}
        </div>
      </div>

      {/* 詳細（ポップアップ） */}
      {detail && (
        <AdminDetailModal key={detail.id} title="お問い合わせ詳細" onClose={() => openDetail(null)}
          headerActions={canEdit && !editForm && (
            <>
              <button onClick={startEdit} className="text-navy text-xs hover:underline">編集</button>
              <button onClick={() => remove(detail.id)} className="text-red-500 text-xs hover:underline">削除</button>
            </>
          )}>
          <dl className="space-y-3 text-sm">
            <DetailRow label="種別">{SOURCE_LABELS[sourceOf(detail)]}</DetailRow>
            <DetailRow label="状態">
              <span className={`badge ${STATUS_COLORS[detail.status]}`}>{STATUS_LABELS[detail.status]}</span>
            </DetailRow>
            {editForm ? (
              <>
                <EditField label="件名" value={editForm.subject} onChange={v => setEditForm(f => f && { ...f, subject: v })} />
                <EditField label="お名前" value={editForm.name} onChange={v => setEditForm(f => f && { ...f, name: v })} />
                <EditField label="メール" type="email" value={editForm.email} onChange={v => setEditForm(f => f && { ...f, email: v })} />
                <EditField label="本文" rows={8} value={editForm.message} onChange={v => setEditForm(f => f && { ...f, message: v })} />
                <EditActions saving={saving} onSave={saveEdit} onCancel={() => setEditForm(null)} />
              </>
            ) : (
              <>
                <DetailRow label="件名">{detail.subject}</DetailRow>
                <DetailRow label="お名前">{detail.name}</DetailRow>
                <DetailRow label="メール">
                  <a href={`mailto:${detail.email}`} className="text-navy underline print:no-underline print:text-black">{detail.email}</a>
                </DetailRow>
              </>
            )}
            <DetailRow label="受信日時">{new Date(detail.created_at).toLocaleString('ja-JP')}</DetailRow>
            <DetailRow label="更新日時">{detail.updated_at ? new Date(detail.updated_at).toLocaleString('ja-JP') : '—'}</DetailRow>
          </dl>

          {!editForm && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">本文</p>
              <div className="bg-gray-50 rounded p-4 text-sm leading-relaxed whitespace-pre-wrap print:bg-white print:p-0">
                {detail.message}
              </div>
            </div>
          )}

          <DetailSection label="担当者">
            <AssigneeEditor assignedId={detail.assigned_admin_id} assignedName={adminName(detail.assigned_admin_id)}
              myId={profile?.id} canEdit={canEdit}
              onChange={id => update(detail.id, { assigned_admin_id: id || null })} />
          </DetailSection>

          <DetailSection label="対応状況の変更">
            <StatusChanger options={STATUS_OPTIONS} labels={STATUS_LABELS} colors={STATUS_COLORS}
              current={detail.status} canEdit={canEdit} onConfirm={s => update(detail.id, { status: s })} />
          </DetailSection>

          <DetailSection label="自動返信メール（受付時）">
            {detail.auto_reply_sent
              ? <p className="text-sm text-green-700">✉️ 送信済み</p>
              : <p className="text-sm text-gray-400">✉️ 未送信</p>}
          </DetailSection>

          <DetailSection label="返信・印刷">
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${detail.email}?subject=${encodeURIComponent(`Re: ${detail.subject}`)}`}
                className="btn-primary text-sm px-4 py-2">返信する（メール）</a>
              <button onClick={() => window.print()}
                className="text-sm px-4 py-2 border border-navy text-navy rounded hover:bg-navy hover:text-white transition-colors">🖨 印刷</button>
            </div>
          </DetailSection>
        </AdminDetailModal>
      )}
    </div>
  )
}
