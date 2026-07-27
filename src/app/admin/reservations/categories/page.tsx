'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import type { ReservationCategory } from '@/types'

export default function ReservationCategoriesPage() {
  const supabase = createClient()
  const { canEditReservations: canEdit } = useAdminProfile()
  const [list, setList] = useState<ReservationCategory[]>([])
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  async function load() {
    const { data } = await supabase.from('reservation_categories').select('*').order('sort_order')
    setList(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function add() {
    if (!newName.trim()) return
    setAdding(true)
    const maxOrder = list.reduce((m, c) => Math.max(m, c.sort_order), 0)
    await supabase.from('reservation_categories').insert({ name: newName.trim(), sort_order: maxOrder + 1 })
    setNewName('')
    setAdding(false)
    load()
  }

  function startEdit(c: ReservationCategory) {
    setEditingId(c.id)
    setEditingName(c.name)
  }

  async function saveEdit() {
    if (!editingId || !editingName.trim()) return
    await supabase.from('reservation_categories').update({ name: editingName.trim() }).eq('id', editingId)
    setEditingId(null)
    load()
  }

  async function setDefault(id: string) {
    // is_default は1つだけにする
    await supabase.from('reservation_categories').update({ is_default: false }).neq('id', id)
    await supabase.from('reservation_categories').update({ is_default: true }).eq('id', id)
    load()
  }

  async function remove(id: string, name: string) {
    if (!confirm(`区分「${name}」を削除しますか？\nこの区分が設定されていた予約は「区分なし」になります。`)) return
    await supabase.from('reservation_categories').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-2">予約区分の管理</h1>
      <p className="text-sm text-gray-500 mb-8">
        「一般予約」「団体」「リッツ予約」など、予約を分類するための区分を管理します。
        ★の区分は予約サイトから送信された予約に自動的に設定されます。
      </p>

      {canEdit && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="font-medium text-navy mb-4">区分を追加</h2>
          <div className="flex items-center gap-3">
            <input className="admin-input flex-1" placeholder="例：旅行代理店予約"
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') add() }} />
            <button onClick={add} disabled={adding || !newName.trim()}
              className="btn-primary text-sm px-5 py-2 disabled:opacity-40 flex-shrink-0">
              {adding ? '追加中...' : '＋ 追加する'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-100">
        {list.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-4">
            {editingId === c.id ? (
              <input className="admin-input flex-1" value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit() }} autoFocus />
            ) : (
              <span className="flex-1 text-sm">
                {c.is_default && <span className="text-gold mr-1" title="予約サイトからの予約に自動設定される区分">★</span>}
                {c.name}
              </span>
            )}

            {canEdit && (
              <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                {editingId === c.id ? (
                  <>
                    <button onClick={saveEdit} className="text-navy underline">保存</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 underline">キャンセル</button>
                  </>
                ) : (
                  <>
                    {!c.is_default && (
                      <button onClick={() => setDefault(c.id)} className="text-gray-400 hover:text-gold underline">
                        デフォルトにする
                      </button>
                    )}
                    <button onClick={() => startEdit(c)} className="text-navy underline">編集</button>
                    <button onClick={() => remove(c.id, c.name)} className="text-red-400 hover:text-red-600 underline">削除</button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {list.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">区分が登録されていません</div>
        )}
      </div>
      {!canEdit && <p className="text-[11px] text-gray-400 mt-3">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
    </div>
  )
}
