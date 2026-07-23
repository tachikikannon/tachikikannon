'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Post } from '@/types'

export default function AdminBlogPage() {
  const supabase = createClient()
  const [list, setList] = useState<Post[]>([])
  const [editing, setEditing] = useState<Partial<Post> | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
  }
  useEffect(() => {
    load()
    if (new URLSearchParams(window.location.search).get('new') === '1') {
      setEditing({ title:'', body:'', excerpt:'', is_published:false })
    }
  }, [])

  function toSlug(title: string) {
    return encodeURIComponent(title.trim().replace(/\s+/g, '-').toLowerCase()).slice(0, 60)
  }

  async function save() {
    if (!editing) return
    setLoading(true)
    const payload = {
      ...editing,
      slug: editing.slug || toSlug(editing.title ?? ''),
      published_at: editing.is_published ? (editing.published_at ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    }
    if (editing.id) {
      await supabase.from('posts').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('posts').insert(payload)
    }
    setEditing(null)
    setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('posts').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">ブログ管理</h1>
        <button onClick={() => setEditing({ title:'', body:'', excerpt:'', is_published:false })} className="btn-primary text-sm px-4 py-2">＋ 記事を書く</button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="font-medium text-navy mb-4">{editing.id ? '編集' : '新規記事'}</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">タイトル</label>
              <input className="admin-input" value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">スラッグ（URLに使われます）</label>
              <input className="admin-input font-mono text-xs" placeholder="自動生成されます"
                value={editing.slug ?? ''} onChange={e => setEditing({...editing, slug: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">概要（一覧ページに表示）</label>
              <textarea className="admin-input min-h-[60px]" value={editing.excerpt ?? ''} onChange={e => setEditing({...editing, excerpt: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">本文</label>
              <textarea className="admin-input min-h-[250px]" value={editing.body ?? ''} onChange={e => setEditing({...editing, body: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">カバー画像URL（画像管理からコピー）</label>
              <input className="admin-input" value={editing.cover_url ?? ''} onChange={e => setEditing({...editing, cover_url: e.target.value})} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pub" checked={editing.is_published ?? false} onChange={e => setEditing({...editing, is_published: e.target.checked})} />
              <label htmlFor="pub" className="text-sm">公開する</label>
            </div>
            <div className="flex gap-3">
              <button onClick={save} disabled={loading} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">{loading ? '保存中...' : '保存'}</button>
              <button onClick={() => setEditing(null)} className="text-sm px-4 py-2 border rounded text-gray-600">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500">タイトル</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">作成日</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_published ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString('ja-JP')}</td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing(p)} className="text-navy hover:underline text-xs">編集</button>
                  <button onClick={() => remove(p.id)} className="text-red-500 hover:underline text-xs">削除</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">まだ記事がありません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
