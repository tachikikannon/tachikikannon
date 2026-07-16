'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Application } from '@/types'

export default function AdminApplicationsPage() {
  const supabase = createClient()
  const [list, setList] = useState<Application[]>([])
  const [selected, setSelected] = useState<Application | null>(null)

  async function load() {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function markRead(id: string) {
    await supabase.from('applications').update({ is_read: true }).eq('id', id)
    setList(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
    if (selected?.id === id) setSelected({ ...selected, is_read: true })
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('applications').delete().eq('id', id)
    setSelected(null)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">申請管理</h1>
        <span className="badge bg-red-100 text-red-700">
          未読 {list.filter(a => !a.is_read).length} 件
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* 一覧 */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {list.map(a => (
              <li key={a.id} onClick={() => { setSelected(a); if(!a.is_read) markRead(a.id) }}
                className={`px-5 py-4 cursor-pointer hover:bg-blue-50 transition-colors
                  ${selected?.id === a.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!a.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                      <p className="font-medium text-sm truncate">{a.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{a.category}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </li>
            ))}
            {list.length === 0 && <li className="px-4 py-8 text-center text-gray-400 text-sm">申請はありません</li>}
          </ul>
        </div>

        {/* 詳細 */}
        {selected && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy">{selected.category}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2 text-sm mb-5">
              <dt className="text-gray-500 text-xs">お名前</dt><dd>{selected.name}</dd>
              <dt className="text-gray-500 text-xs">メール</dt>
              <dd><a href={`mailto:${selected.email}`} className="text-navy underline">{selected.email}</a></dd>
              <dt className="text-gray-500 text-xs">電話番号</dt><dd>{selected.phone || '（未入力）'}</dd>
              {selected.photo_ref && (<><dt className="text-gray-500 text-xs">対象写真</dt><dd>{selected.photo_ref}</dd></>)}
              <dt className="text-gray-500 text-xs">受信日</dt>
              <dd className="text-xs text-gray-500">{new Date(selected.created_at).toLocaleString('ja-JP')}</dd>
            </dl>
            <div className="bg-gray-50 rounded p-4 text-sm leading-relaxed whitespace-pre-wrap mb-4">
              {selected.message}
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.category}`}
                className="btn-primary text-sm px-4 py-2">返信する（メール）</a>
              <button onClick={() => remove(selected.id)} className="text-red-500 text-sm hover:underline">削除</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
