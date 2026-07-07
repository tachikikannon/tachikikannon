'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Event } from '@/types'

export default function AdminEventsPage() {
  const supabase = createClient()
  const [list, setList] = useState<Event[]>([])
  const [editing, setEditing] = useState<Partial<Event> | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('events').select('*').order('start_date')
    setList(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function save() {
    if (!editing) return
    setLoading(true)
    if (editing.id) {
      await supabase.from('events').update(editing).eq('id', editing.id)
    } else {
      await supabase.from('events').insert(editing)
    }
    setEditing(null)
    setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">行事カレンダー</h1>
        <button onClick={() => setEditing({ title:'', start_date:'', all_day:true, color:'#1a2a4a' })} className="btn-primary text-sm px-4 py-2">＋ 行事を追加</button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="font-medium text-navy mb-4">{editing.id ? '編集' : '新規追加'}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="admin-label">行事名</label>
              <input className="admin-input" value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">開始日</label>
              <input type="date" className="admin-input" value={editing.start_date ?? ''} onChange={e => setEditing({...editing, start_date: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">終了日（任意）</label>
              <input type="date" className="admin-input" value={editing.end_date ?? ''} onChange={e => setEditing({...editing, end_date: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">説明（任意）</label>
              <textarea className="admin-input min-h-[80px]" value={editing.description ?? ''} onChange={e => setEditing({...editing, description: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={loading} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">{loading ? '保存中...' : '保存'}</button>
            <button onClick={() => setEditing(null)} className="text-sm px-4 py-2 border rounded text-gray-600">キャンセル</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500">行事名</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">日付</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">説明</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{ev.title}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(ev.start_date).toLocaleDateString('ja-JP')}
                  {ev.end_date && ` 〜 ${new Date(ev.end_date).toLocaleDateString('ja-JP')}`}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ev.description}</td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing(ev)} className="text-navy hover:underline text-xs">編集</button>
                  <button onClick={() => remove(ev.id)} className="text-red-500 hover:underline text-xs">削除</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">行事が登録されていません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
