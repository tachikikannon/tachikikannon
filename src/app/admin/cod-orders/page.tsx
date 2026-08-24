'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
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
const STATUS_OPTIONS: CodOrderStatus[] = ['unconfirmed', 'in_progress', 'confirmed', 'shipped', 'completed', 'cancelled']

export default function AdminCodOrdersPage() {
  const supabase = createClient()
  const router = useRouter()
  const { profile, canEditReservations: canEdit } = useAdminProfile()
  const [list, setList] = useState<CodOrder[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [detail, setDetail] = useState<CodOrder | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function load() {
    const { data } = await supabase.from('cod_orders').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  function openDetail(o: CodOrder | null) { setDetail(o) }

  async function updateStatus(id: string, status: CodOrderStatus) {
    await supabase.from('cod_orders').update({ status }).eq('id', id)
    load()
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
    router.refresh()
  }

  async function updateAssignee(id: string, assigned_admin_id: string) {
    await supabase.from('cod_orders').update({ assigned_admin_id: assigned_admin_id || null }).eq('id', id)
    load()
    if (detail?.id === id) setDetail(d => d ? { ...d, assigned_admin_id: assigned_admin_id || null } : d)
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
  const filtered = filter === 'all' ? list : list.filter(o => o.status === filter)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif text-navy mb-6">代金引換の申込管理</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filter === 'all' ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
          すべて<span className="ml-1">({list.length})</span>
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filter === s ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {STATUS_LABELS[s]}<span className="ml-1">({list.filter(o => o.status === s).length})</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-y-auto lg:max-h-[calc(100vh-14rem)]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500">申込日</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">お名前</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">商品</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">金額</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">担当者</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(o => (
                <tr key={o.id} onClick={() => openDetail(o)} className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{o.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[220px] truncate">
                    {o.items.map(it => `${it.name}×${it.quantity}`).join('、')}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">¥{o.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{adminName(o.assigned_admin_id)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">申込がありません</td></tr>}
            </tbody>
          </table>
        </div>

        {detail && (
          <div className="bg-white rounded-xl shadow p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy">申込詳細</h2>
              <div className="flex items-center gap-3">
                {canEdit && <button onClick={() => remove(detail.id)} className="text-red-500 text-xs hover:underline">削除</button>}
                <button onClick={() => openDetail(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
            </div>

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
              {[
                ['お名前', `${detail.name}（${detail.name_kana}）`],
                ['電話番号', detail.phone],
                ['メール', detail.email],
                ['お届け先', `〒${detail.postal_code} ${detail.address}`],
                ['備考', detail.notes || '—'],
                ['申込日時', detail.created_at ? new Date(detail.created_at).toLocaleString('ja-JP') : '—'],
                ['更新日時', detail.updated_at ? new Date(detail.updated_at).toLocaleString('ja-JP') : '—'],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-2">
                  <dt className="text-gray-500 text-xs pt-0.5">{k}</dt>
                  <dd className="break-all">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">担当者</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm">{adminName(detail.assigned_admin_id)}</span>
                {canEdit && profile && detail.assigned_admin_id !== profile.id && (
                  <button onClick={() => updateAssignee(detail.id, profile.id)} className="text-xs text-navy underline">自分を担当にする</button>
                )}
                {canEdit && detail.assigned_admin_id && (
                  <button onClick={() => updateAssignee(detail.id, '')} className="text-xs text-gray-400 underline">担当を外す</button>
                )}
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">ステータス変更</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => updateStatus(detail.id, s)}
                    disabled={!canEdit || detail.status === s}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40 ${STATUS_COLORS[s]}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              {!canEdit && <p className="text-[11px] text-gray-400 mt-2">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">自動返信メール</p>
              {detail.auto_reply_sent
                ? <p className="text-sm text-green-700">✉️ 送信済み</p>
                : <p className="text-sm text-gray-400">✉️ 未送信</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
