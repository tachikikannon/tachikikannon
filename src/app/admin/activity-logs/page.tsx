'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import type { AdminActivityLog, AdminProfile, Contact, Reservation, ReservationCategory } from '@/types'

const TARGET_TABLES = ['reservations', 'contacts'] as const
type TargetTable = typeof TARGET_TABLES[number]

const TABLE_LABELS: Record<TargetTable, string> = {
  reservations: '予約',
  contacts: 'お問い合わせ',
}
const ACTION_LABELS: Record<string, string> = {
  status_change: 'ステータス変更',
  assign: '担当者変更',
  edit: '編集',
  delete: '削除',
}
const ACTION_COLORS: Record<string, string> = {
  status_change: 'bg-blue-100 text-blue-700',
  assign: 'bg-purple-100 text-purple-700',
  edit: 'bg-amber-100 text-amber-700',
  delete: 'bg-red-100 text-red-700',
}
const RESERVATION_STATUS_LABELS: Record<string, string> = {
  unconfirmed: '未確認', pending: '未確認', provisional: '仮予約', in_progress: '対応中',
  confirmed: '予約確定', completed: '完了', cancelled: 'キャンセル',
}
const CONTACT_STATUS_LABELS: Record<string, string> = {
  unread: '未読', checking: '対応中', replied: '返信済み', completed: '完了',
}
const RESERVATION_TYPE_LABELS: Record<string, string> = {
  prayer: '護摩祈願', shakyou: '写経', shabutu: '写仏', jyuzu: '数珠づくり', zazen: '坐禅',
}
const FIELD_LABELS: Record<string, string> = {
  date: '予約日', time_slot: '時間帯', name: 'お名前', name_kana: 'フリガナ',
  email: 'メール', phone: '電話番号', party_size: '人数', notes: 'メモ',
  category_id: '区分', type: '予約種別', locale: '言語',
  subject: '件名', message: '本文', source: '種別',
  confirmation_email_sent: '確定メール送信', auto_reply_sent: '自動返信送信済み',
}

export default function AdminActivityLogsPage() {
  const supabase = createClient()
  const { loading: meLoading, isSuperAdmin } = useAdminProfile()

  const [logs, setLogs] = useState<AdminActivityLog[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [categories, setCategories] = useState<ReservationCategory[]>([])
  const [reservations, setReservations] = useState<Record<string, Reservation>>({})
  const [contacts, setContacts] = useState<Record<string, Contact>>({})
  const [loadingLogs, setLoadingLogs] = useState(true)

  const [targetFilter, setTargetFilter] = useState<'all' | TargetTable>('all')
  const [actionFilter, setActionFilter] = useState<'all' | 'status_change' | 'assign' | 'edit' | 'delete'>('all')
  const [actorFilter, setActorFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [limit, setLimit] = useState(100)

  useEffect(() => {
    if (!isSuperAdmin) return
    supabase.from('admin_profiles').select('*').order('created_at').then(({ data }) => setAdmins(data ?? []))
    supabase.from('reservation_categories').select('*').then(({ data }) => setCategories(data ?? []))
  }, [isSuperAdmin])

  useEffect(() => {
    if (!isSuperAdmin) return
    loadLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin, targetFilter, actionFilter, actorFilter, dateFrom, dateTo, limit])

  async function loadLogs() {
    setLoadingLogs(true)
    let query = supabase.from('admin_activity_logs').select('*').in('target_table', TARGET_TABLES)
    if (targetFilter !== 'all') query = query.eq('target_table', targetFilter)
    if (actionFilter !== 'all') query = query.eq('action', actionFilter)
    if (actorFilter) query = query.eq('actor_id', actorFilter)
    if (dateFrom) query = query.gte('created_at', `${dateFrom}T00:00:00`)
    if (dateTo) query = query.lte('created_at', `${dateTo}T23:59:59`)
    const { data } = await query.order('created_at', { ascending: false }).limit(limit)
    setLogs(data ?? [])
    setLoadingLogs(false)

    const resIds = Array.from(new Set((data ?? [])
      .filter(l => l.target_table === 'reservations' && l.target_id).map(l => l.target_id as string)))
      .filter(id => !reservations[id])
    const conIds = Array.from(new Set((data ?? [])
      .filter(l => l.target_table === 'contacts' && l.target_id).map(l => l.target_id as string)))
      .filter(id => !contacts[id])

    if (resIds.length) {
      const { data: rData } = await supabase.from('reservations').select('*').in('id', resIds)
      if (rData?.length) setReservations(prev => ({ ...prev, ...Object.fromEntries(rData.map(r => [r.id, r])) }))
    }
    if (conIds.length) {
      const { data: cData } = await supabase.from('contacts').select('*').in('id', conIds)
      if (cData?.length) setContacts(prev => ({ ...prev, ...Object.fromEntries(cData.map(c => [c.id, c])) }))
    }
  }

  const actorName = (id: string | null) => {
    if (!id) return 'システム'
    const a = admins.find(x => x.id === id)
    return a ? (a.name || a.email) : '不明な管理者（削除済み）'
  }
  const categoryName = (id: string | null) => categories.find(c => c.id === id)?.name ?? '区分なし'

  function targetLabel(log: AdminActivityLog) {
    if (log.action === 'delete') {
      const snap = log.old_value as Record<string, unknown> | null
      if (!snap) return '（削除されたデータの記録がありません）'
      if (log.target_table === 'reservations') {
        const type = RESERVATION_TYPE_LABELS[snap.type as string] ?? snap.type
        const date = snap.date ? new Date(snap.date as string).toLocaleDateString('ja-JP') : ''
        return `${type}／${date}／${snap.name} 様（削除済み）`
      }
      if (log.target_table === 'contacts') {
        return `${snap.subject}（${snap.name} 様・削除済み）`
      }
      return '（削除済み）'
    }
    if (log.target_table === 'reservations') {
      const r = reservations[log.target_id ?? '']
      if (!r) return '（予約情報が見つかりません。削除済みの可能性があります）'
      return `${RESERVATION_TYPE_LABELS[r.type] ?? r.type}／${new Date(r.date).toLocaleDateString('ja-JP')}／${r.name} 様`
    }
    if (log.target_table === 'contacts') {
      const c = contacts[log.target_id ?? '']
      if (!c) return '（お問い合わせ情報が見つかりません。削除済みの可能性があります）'
      return `${c.subject}（${c.name} 様）`
    }
    return '—'
  }

  function formatValue(table: string | null, key: string, value: unknown) {
    if (value === null || value === '' || value === undefined) return '（空）'
    if (key === 'category_id') return categoryName(value as string)
    if (key === 'type') return RESERVATION_TYPE_LABELS[value as string] ?? String(value)
    if (key === 'source') return value === 'event_application' ? '行事申込み' : 'お問い合わせ'
    if (typeof value === 'boolean') return value ? 'はい' : 'いいえ'
    if (key === 'date') return new Date(value as string).toLocaleDateString('ja-JP')
    return String(value)
  }

  function renderDiff(log: AdminActivityLog) {
    if (log.action === 'status_change') {
      const labels = log.target_table === 'reservations' ? RESERVATION_STATUS_LABELS : CONTACT_STATUS_LABELS
      const oldS = (log.old_value as { status?: string } | null)?.status
      const newS = (log.new_value as { status?: string } | null)?.status
      return (
        <p className="text-xs text-gray-500">
          {oldS ? (labels[oldS] ?? oldS) : '—'} <span className="text-gray-400">→</span> {newS ? (labels[newS] ?? newS) : '—'}
        </p>
      )
    }
    if (log.action === 'assign') {
      const oldA = (log.old_value as { assigned_admin_id?: string | null } | null)?.assigned_admin_id ?? null
      const newA = (log.new_value as { assigned_admin_id?: string | null } | null)?.assigned_admin_id ?? null
      return (
        <p className="text-xs text-gray-500">
          {oldA ? actorName(oldA) : '未割当'} <span className="text-gray-400">→</span> {newA ? actorName(newA) : '未割当'}
        </p>
      )
    }
    if (log.action === 'delete') {
      const snap = (log.old_value ?? {}) as Record<string, unknown>
      const keys = log.target_table === 'reservations'
        ? ['time_slot', 'email', 'phone', 'party_size', 'notes', 'category_id']
        : ['email', 'message']
      const rows = keys.filter(k => snap[k] !== undefined && snap[k] !== null && snap[k] !== '')
      if (rows.length === 0) return null
      return (
        <ul className="text-xs text-gray-500 space-y-0.5">
          {rows.map(key => (
            <li key={key}>
              <span className="text-gray-400">{FIELD_LABELS[key] ?? key}：</span>
              {formatValue(log.target_table, key, snap[key])}
            </li>
          ))}
        </ul>
      )
    }
    const keys = Object.keys(log.new_value ?? {})
    if (keys.length === 0) return null
    return (
      <ul className="text-xs text-gray-500 space-y-0.5">
        {keys.map(key => (
          <li key={key}>
            <span className="text-gray-400">{FIELD_LABELS[key] ?? key}：</span>
            {formatValue(log.target_table, key, (log.old_value as Record<string, unknown> | null)?.[key])}
            <span className="text-gray-400 mx-1">→</span>
            {formatValue(log.target_table, key, (log.new_value as Record<string, unknown> | null)?.[key])}
          </li>
        ))}
      </ul>
    )
  }

  if (meLoading) return <div className="p-8 text-sm text-gray-400">読み込み中...</div>

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-serif text-navy mb-4">編集履歴</h1>
        <p className="text-sm text-gray-500">このページは super_admin のみ閲覧できます。</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">編集履歴</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">予約・お問い合わせを「誰が・いつ・何を変更したか」を確認できます。</p>

      <div className="mb-4 flex flex-wrap gap-2 items-end">
        <div>
          <label className="admin-label">対象</label>
          <select className="admin-input text-sm" value={targetFilter} onChange={e => setTargetFilter(e.target.value as typeof targetFilter)}>
            <option value="all">すべて</option>
            <option value="reservations">予約</option>
            <option value="contacts">お問い合わせ</option>
          </select>
        </div>
        <div>
          <label className="admin-label">操作の種類</label>
          <select className="admin-input text-sm" value={actionFilter} onChange={e => setActionFilter(e.target.value as typeof actionFilter)}>
            <option value="all">すべて</option>
            <option value="status_change">ステータス変更</option>
            <option value="assign">担当者変更</option>
            <option value="edit">編集</option>
            <option value="delete">削除</option>
          </select>
        </div>
        <div>
          <label className="admin-label">変更した管理者</label>
          <select className="admin-input text-sm" value={actorFilter} onChange={e => setActorFilter(e.target.value)}>
            <option value="">すべての管理者</option>
            {admins.map(a => <option key={a.id} value={a.id}>{a.name || a.email}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">期間で絞り込み</label>
          <div className="flex items-center gap-1.5">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="admin-input text-sm" />
            <span className="text-gray-400 text-sm">〜</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="admin-input text-sm" />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo('') }} className="text-gray-400 hover:text-gray-600 text-sm px-1">✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {logs.map(log => (
            <li key={log.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                  <span className="badge bg-gray-100 text-gray-600">
                    {log.target_table ? TABLE_LABELS[log.target_table as TargetTable] : ''}
                  </span>
                  <span className="text-sm font-medium text-navy">{actorName(log.actor_id)}</span>
                  <span className="text-xs text-gray-400">が変更</span>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('ja-JP')}
                </span>
              </div>
              <p className="text-base font-medium text-navy mb-1">{targetLabel(log)}</p>
              {renderDiff(log)}
            </li>
          ))}
          {!loadingLogs && logs.length === 0 && (
            <li className="px-5 py-10 text-center text-gray-400 text-sm">該当する編集履歴はありません</li>
          )}
          {loadingLogs && (
            <li className="px-5 py-10 text-center text-gray-400 text-sm">読み込み中...</li>
          )}
        </ul>
      </div>

      {!loadingLogs && logs.length >= limit && (
        <div className="mt-4 text-center">
          <button onClick={() => setLimit(l => l + 100)} className="text-sm text-navy underline">さらに読み込む</button>
        </div>
      )}
    </div>
  )
}
