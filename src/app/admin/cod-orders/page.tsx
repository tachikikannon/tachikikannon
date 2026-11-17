'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import {
  AdminDetailModal, AssigneeEditor, DateRangeFilter, DetailRow, DetailSection, EditActions, EditField,
  EmptyCard, EmptyRow, FilterTabs, SearchBox, StatusChanger, inDateRange, shortDateTime, updateRecord,
} from '@/components/admin/RecordListUI'
import type { AdminProfile, CodOrder, CodOrderStatus } from '@/types'

const STATUS_LABELS: Record<CodOrderStatus, string> = {
  unconfirmed: '未確認',
  in_progress: '対応中',
  confirmed: '確定',
  shipped: '発送済み',
  completed: '完了',
  cancelled: 'キャンセル',
}
const STATUS_COLORS: Record<CodOrderStatus, string> = {
  unconfirmed: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  shipped: 'bg-teal-100 text-teal-700',
  completed: 'bg-gray-200 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-500',
}
// スマホのカード一覧だけで使う、状態を表す左ボーダーの色（バッジと同系色）
const STATUS_BORDER_COLORS: Record<CodOrderStatus, string> = {
  unconfirmed: 'border-yellow-400',
  in_progress: 'border-blue-400',
  confirmed: 'border-green-400',
  shipped: 'border-teal-400',
  completed: 'border-gray-300',
  cancelled: 'border-gray-300',
}
const STATUS_OPTIONS: CodOrderStatus[] = ['unconfirmed', 'in_progress', 'confirmed', 'shipped', 'completed', 'cancelled']

type FilterKey = 'all' | CodOrderStatus
// 編集できるのはお客様情報とお届け先・備考。商品・金額・送料は表示のみ
type EditForm = { name: string; name_kana: string; phone: string; email: string; postal_code: string; address: string; notes: string }

const itemsText = (o: CodOrder) => o.items.map(it => `${it.name}×${it.quantity}`).join('、')

export default function AdminCodOrdersPage() {
  const supabase = createClient()
  const router = useRouter()
  const { profile, canEditReservations: canEdit } = useAdminProfile()
  const [list, setList] = useState<CodOrder[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [detail, setDetail] = useState<CodOrder | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [editForm, setEditForm] = useState<EditForm | null>(null) // null のときは閲覧表示
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data, error } = await supabase.from('cod_orders').select('*').order('created_at', { ascending: false })
    // 読み込みに失敗したときは、一覧を空にせず直前の表示を残す
    if (!error) {
      const rows = (data ?? []) as CodOrder[]
      setList(rows)
      // 開いている詳細も最新の内容（更新日時など）に合わせる
      setDetail(d => d ? (rows.find(r => r.id === d.id) ?? d) : d)
    }
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  function openDetail(o: CodOrder | null) {
    setDetail(o)
    setEditForm(null)
  }

  async function update(id: string, values: Partial<CodOrder>) {
    const ok = await updateRecord(supabase, 'cod_orders', id, values)
    if (ok) {
      setDetail(d => d && d.id === id ? { ...d, ...values } : d)
      load()
      router.refresh()
    }
    return ok
  }

  function startEdit() {
    if (!detail) return
    setEditForm({
      name: detail.name, name_kana: detail.name_kana, phone: detail.phone, email: detail.email,
      postal_code: detail.postal_code, address: detail.address, notes: detail.notes ?? '',
    })
  }

  async function saveEdit() {
    if (!detail || !editForm) return
    setSaving(true)
    const ok = await update(detail.id, { ...editForm, notes: editForm.notes.trim() === '' ? null : editForm.notes })
    setSaving(false)
    if (ok) setEditForm(null)
  }

  async function remove(id: string) {
    if (!confirm('この申込を削除しますか？削除すると元に戻せません。')) return
    const { data, error } = await supabase.from('cod_orders').delete().eq('id', id).select('id')
    if (error) { alert('削除に失敗しました：' + error.message); return }
    if (!data || data.length === 0) { alert('削除できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return }
    setDetail(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'

  const byStatus = filter === 'all' ? list : list.filter(o => o.status === filter)
  const byDate = byStatus.filter(o => inDateRange(o.created_at, dateFrom, dateTo))
  const searchQuery = search.trim().toLowerCase()
  const filtered = searchQuery === '' ? byDate : byDate.filter(o =>
    [o.name, o.name_kana, o.phone, o.email, o.address].some(v => v?.toLowerCase().includes(searchQuery))
  )
  const hasCondition = filter !== 'all' || searchQuery !== '' || dateFrom !== '' || dateTo !== ''
  const emptyText = hasCondition ? '検索条件に一致する申込がありません' : '申込がありません'

  return (
    <div className="p-8 overflow-x-clip">
      <h1 className="text-2xl font-serif text-navy mb-6">代金引換の申込管理</h1>

      <FilterTabs value={filter} onChange={setFilter} tabs={[
        { key: 'all', label: 'すべて', count: list.length },
        ...STATUS_OPTIONS.map(s => ({ key: s, label: STATUS_LABELS[s], count: list.filter(o => o.status === s).length })),
      ]} />

      {/* 検索・絞り込み */}
      <div className="mb-4 flex flex-wrap gap-2 items-end">
        <SearchBox label="名前・電話・メール・住所で検索" value={search} onChange={setSearch} />
        <DateRangeFilter label="申込日で絞り込み" from={dateFrom} to={dateTo} onChange={(f, t) => { setDateFrom(f); setDateTo(t) }} />
      </div>

      {/* PC用の表。縦はページ本体のスクロールにまかせ、横だけこの枠でスクロールさせる（予約検索と同じ） */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {['状態', '申込日', 'お名前', '商品', '金額', '電話番号', 'メール', '担当者', '自動返信', '更新日時'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(o => (
              <tr key={o.id} onClick={() => openDetail(o)} className="hover:bg-blue-50 cursor-pointer">
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {o.created_at ? new Date(o.created_at).toLocaleDateString('ja-JP') : '—'}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{o.name}</td>
                <td className="px-4 py-3 text-xs text-gray-600 max-w-[220px] truncate">{itemsText(o)}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">¥{o.total_amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{o.phone || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{o.email || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{adminName(o.assigned_admin_id)}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {o.auto_reply_sent ? <span className="text-green-700">✉️ 送信済み</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                  {o.updated_at ? new Date(o.updated_at).toLocaleString('ja-JP') : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <EmptyRow colSpan={10}>{emptyText}</EmptyRow>}
          </tbody>
        </table>
      </div>

      {/* スマホ用カード一覧。横スクロールなしで下へスクロールして次の申込を確認できる */}
      <div className="md:hidden space-y-2.5">
        {filtered.map(o => (
          <div key={o.id} onClick={() => openDetail(o)}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${STATUS_BORDER_COLORS[o.status]} p-4 active:bg-blue-50 cursor-pointer`}>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`badge ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
              {o.created_at && <span className="text-xs text-gray-500 whitespace-nowrap">{shortDateTime(o.created_at)}</span>}
              <span className="text-xs text-gold font-medium ml-auto whitespace-nowrap">¥{o.total_amount.toLocaleString()}</span>
            </div>
            <p className="font-semibold text-base text-navy mb-1">
              {o.name}<span className="text-xs font-normal text-gray-400 ml-1">様</span>
            </p>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2 [overflow-wrap:anywhere]">📦 {itemsText(o)}</p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
              <div className="truncate">📞 {o.phone || '—'}</div>
              <div className="truncate">✉️ {o.email || '—'}</div>
              <div className="truncate">👤 {adminName(o.assigned_admin_id)}</div>
              <div className={o.auto_reply_sent ? 'text-green-700' : 'text-gray-300'}>自動返信{o.auto_reply_sent ? '済み' : '未'}</div>
            </dl>
          </div>
        ))}
        {filtered.length === 0 && <EmptyCard>{emptyText}</EmptyCard>}
      </div>

      {/* 詳細（ポップアップ） */}
      {detail && (
        <AdminDetailModal key={detail.id} title="申込詳細" onClose={() => openDetail(null)}
          headerActions={canEdit && !editForm && (
            <>
              <button onClick={startEdit} className="text-navy text-xs hover:underline">編集</button>
              <button onClick={() => remove(detail.id)} className="text-red-500 text-xs hover:underline">削除</button>
            </>
          )}>
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">商品</p>
            <div className="bg-cream-alt rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-white">
                  {detail.items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{it.name}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{it.quantity}点</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{it.price ? `¥${(it.price * it.quantity).toLocaleString()}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-sm mt-2 text-right space-y-0.5">
              <p className="text-gray-500 text-xs">商品代金小計：¥{detail.items.reduce((sum, it) => sum + it.price * it.quantity, 0).toLocaleString()}</p>
              <p className="text-gray-500 text-xs">送料：¥{detail.shipping_fee.toLocaleString()}</p>
              <p className="text-gold font-medium">合計：¥{detail.total_amount.toLocaleString()}</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <DetailRow label="状態">
              <span className={`badge ${STATUS_COLORS[detail.status]}`}>{STATUS_LABELS[detail.status]}</span>
            </DetailRow>
            {editForm ? (
              <>
                <EditField label="お名前" value={editForm.name} onChange={v => setEditForm(f => f && { ...f, name: v })} />
                <EditField label="フリガナ" value={editForm.name_kana} onChange={v => setEditForm(f => f && { ...f, name_kana: v })} />
                <EditField label="電話番号" type="tel" value={editForm.phone} onChange={v => setEditForm(f => f && { ...f, phone: v })} />
                <EditField label="メール" type="email" value={editForm.email} onChange={v => setEditForm(f => f && { ...f, email: v })} />
                <EditField label="郵便番号" value={editForm.postal_code} onChange={v => setEditForm(f => f && { ...f, postal_code: v })} />
                <EditField label="住所" rows={2} value={editForm.address} onChange={v => setEditForm(f => f && { ...f, address: v })} />
                <EditField label="備考" rows={3} value={editForm.notes} onChange={v => setEditForm(f => f && { ...f, notes: v })} />
                <EditActions saving={saving} onSave={saveEdit} onCancel={() => setEditForm(null)} />
              </>
            ) : (
              <>
                <DetailRow label="お名前">{detail.name}（{detail.name_kana}）</DetailRow>
                <DetailRow label="電話番号">{detail.phone}</DetailRow>
                <DetailRow label="メール">{detail.email}</DetailRow>
                <DetailRow label="お届け先">〒{detail.postal_code} {detail.address}</DetailRow>
                <DetailRow label="備考"><span className="whitespace-pre-wrap">{detail.notes || '—'}</span></DetailRow>
              </>
            )}
            <DetailRow label="申込日時">{detail.created_at ? new Date(detail.created_at).toLocaleString('ja-JP') : '—'}</DetailRow>
            <DetailRow label="更新日時">{detail.updated_at ? new Date(detail.updated_at).toLocaleString('ja-JP') : '—'}</DetailRow>
          </dl>

          <DetailSection label="担当者">
            <AssigneeEditor assignedId={detail.assigned_admin_id} assignedName={adminName(detail.assigned_admin_id)}
              myId={profile?.id} canEdit={canEdit}
              onChange={id => update(detail.id, { assigned_admin_id: id || null })} />
          </DetailSection>

          <DetailSection label="ステータス変更">
            <StatusChanger options={STATUS_OPTIONS} labels={STATUS_LABELS} colors={STATUS_COLORS}
              current={detail.status} canEdit={canEdit} onConfirm={s => update(detail.id, { status: s })} />
          </DetailSection>

          <DetailSection label="自動返信メール">
            {detail.auto_reply_sent
              ? <p className="text-sm text-green-700">✉️ 送信済み</p>
              : <p className="text-sm text-gray-400">✉️ 未送信</p>}
          </DetailSection>
        </AdminDetailModal>
      )}
    </div>
  )
}
