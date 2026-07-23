'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { News, NewsCategory } from '@/types'

const CATEGORIES: NewsCategory[] = ['お知らせ','行事案内','季節のお知らせ','交通情報','授与品のお知らせ']

export default function AdminNewsPage() {
  const supabase = createClient()
  const [list, setList] = useState<News[]>([])
  const [editing, setEditing] = useState<Partial<News> | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  async function load() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
  }

  useEffect(() => {
    load()
    if (new URLSearchParams(window.location.search).get('new') === '1') {
      setEditing({ title:'', excerpt:'', body:'', cover_url:'', category:'お知らせ', is_published:false })
      setPreview(false)
    }
  }, [])

  async function save() {
    if (!editing) return
    setLoading(true)
    const payload = {
      ...editing,
      published_at: editing.is_published ? (editing.published_at ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    }
    if (editing.id) {
      await supabase.from('news').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('news').insert(payload)
    }
    setEditing(null)
    setPreview(false)
    setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('news').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">お知らせ管理</h1>
        <button
          onClick={() => { setEditing({ title:'', excerpt:'', body:'', cover_url:'', category:'お知らせ', is_published:false }); setPreview(false) }}
          className="btn-primary text-sm px-4 py-2"
        >
          ＋ 新規作成
        </button>
      </div>

      {/* 編集フォーム */}
      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-navy">{editing.id ? '編集' : '新規作成'}</h2>
            <button
              onClick={() => setPreview(p => !p)}
              className="text-xs border rounded px-3 py-1.5 text-gray-600 hover:bg-gray-50"
            >
              {preview ? '編集に戻る' : '📄 プレビュー'}
            </button>
          </div>

          {preview ? (
            /* プレビュー */
            <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
              {editing.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.cover_url} alt="カバー" className="w-full h-48 object-cover rounded-lg" />
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{new Date().toLocaleDateString('ja-JP')}</span>
                <span className="bg-navy/10 text-navy rounded px-2 py-0.5">{editing.category}</span>
              </div>
              <h3 className="text-xl font-serif text-navy">{editing.title || '（タイトルなし）'}</h3>
              {editing.excerpt && <p className="text-sm text-gray-500 border-l-4 border-gold pl-4">{editing.excerpt}</p>}
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{editing.body || '（本文なし）'}</div>
            </div>
          ) : (
            /* 編集フォーム */
            <div className="space-y-4">
              <div>
                <label className="admin-label">タイトル <span className="text-red-400">*</span></label>
                <input className="admin-input" placeholder="例：夏季拝観時間のお知らせ"
                  value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">カテゴリ</label>
                <select className="admin-input" value={editing.category ?? 'お知らせ'}
                  onChange={e => setEditing({...editing, category: e.target.value as NewsCategory})}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">カバー画像URL <span className="text-gray-400 font-normal text-xs">（画像管理からコピー）</span></label>
                <input className="admin-input" placeholder="https://..."
                  value={editing.cover_url ?? ''} onChange={e => setEditing({...editing, cover_url: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">概要文 <span className="text-gray-400 font-normal text-xs">（一覧ページに表示）</span></label>
                <textarea className="admin-input min-h-[60px]" placeholder="記事の内容を2〜3文で要約します"
                  value={editing.excerpt ?? ''} onChange={e => setEditing({...editing, excerpt: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">本文 <span className="text-red-400">*</span></label>
                <textarea className="admin-input min-h-[240px] font-mono text-sm" placeholder="本文を入力してください。改行はそのまま反映されます。"
                  value={editing.body ?? ''} onChange={e => setEditing({...editing, body: e.target.value})} />
                <p className="text-xs text-gray-400 mt-1">改行・空行はそのまま表示されます</p>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub" checked={editing.is_published ?? false}
                  onChange={e => setEditing({...editing, is_published: e.target.checked})} />
                <label htmlFor="pub" className="text-sm">公開する</label>
                {!editing.is_published && <span className="text-xs text-gray-400">（下書き保存）</span>}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t">
            <button onClick={save} disabled={loading || !editing.title}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-40">
              {loading ? '保存中...' : (editing.is_published ? '公開保存' : '下書き保存')}
            </button>
            <button onClick={() => { setEditing(null); setPreview(false) }}
              className="text-sm px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 一覧 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500">タイトル</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">カテゴリ</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">公開日</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(n => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{n.title}</p>
                  {n.excerpt && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{n.excerpt}</p>}
                </td>
                <td className="px-4 py-3 text-gray-500">{n.category}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${n.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {n.is_published ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {n.published_at ? new Date(n.published_at).toLocaleDateString('ja-JP') : '—'}
                </td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <button onClick={() => { setEditing(n); setPreview(false) }} className="text-navy hover:underline text-xs">編集</button>
                  <button onClick={() => remove(n.id)} className="text-red-500 hover:underline text-xs">削除</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">まだ記事がありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
