'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { MinorEvent, NewsSite } from '@/types'

export default function MinorEventsAdmin({ site, siteLabel, accent = 'chuzenji' }: { site: NewsSite; siteLabel: string; accent?: 'chuzenji' | 'onsenji' }) {
  const supabase = createClient()
  const [list, setList] = useState<MinorEvent[]>([])
  const [editing, setEditing] = useState<Partial<MinorEvent> | null>(null)
  const [loading, setLoading] = useState(false)

  const accentBtn = accent === 'onsenji' ? 'bg-onsenji hover:bg-onsenji/90' : 'btn-primary'
  const accentText = accent === 'onsenji' ? 'text-onsenji' : 'text-navy'

  async function load() {
    const { data } = await supabase.from('minor_events').select('*').eq('site', site)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setList(data ?? [])
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site])

  function toSlug(title: string) {
    return encodeURIComponent(title.trim().replace(/\s+/g, '-').toLowerCase().slice(0, 30))
  }

  function openEditor(ev: Partial<MinorEvent> | null) {
    setEditing(ev)
  }

  async function save() {
    if (!editing) return
    setLoading(true)
    const payload = {
      ...editing,
      site,
      slug: editing.slug || toSlug(editing.title ?? ''),
      updated_at: new Date().toISOString(),
    }
    if (editing.id) {
      await supabase.from('minor_events').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('minor_events').insert(payload)
    }
    openEditor(null)
    setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    const { data, error } = await supabase.from('minor_events').delete().eq('id', id).select('id')
    if (error) { alert('削除に失敗しました：' + error.message); return }
    if (!data || data.length === 0) { alert('削除できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return }
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-serif ${accentText}`}>{siteLabel} こまごました行事</h1>
          <p className="text-xs text-gray-400 mt-1">年間行事ページの、専用ページを持たない追加行事です。一覧のカードと簡単な詳細ページのみになります。</p>
        </div>
        <button onClick={() => openEditor({ title:'', site, month_label:'', date_label:'', time_label:'', desc_text:'', sort_order: 0, is_published:false })} className={`text-white text-sm px-4 py-2 rounded ${accentBtn}`}>＋ 行事を追加</button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="font-medium text-navy mb-4">{editing.id ? '編集' : '新規行事'}</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">行事名</label>
              <input className="admin-input" value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">スラッグ（URLに使われます）</label>
              <input className="admin-input font-mono text-xs" placeholder="自動生成されます"
                value={editing.slug ?? ''} onChange={e => setEditing({...editing, slug: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="admin-label">月バッジ（例: 3月）</label>
                <input className="admin-input" value={editing.month_label ?? ''} onChange={e => setEditing({...editing, month_label: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">開催日（例: 3月21日）</label>
                <input className="admin-input" value={editing.date_label ?? ''} onChange={e => setEditing({...editing, date_label: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">開始時間（例: 午前10時〜）</label>
                <input className="admin-input" value={editing.time_label ?? ''} onChange={e => setEditing({...editing, time_label: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="admin-label">説明文</label>
              <textarea className="admin-input min-h-[120px]" value={editing.desc_text ?? ''} onChange={e => setEditing({...editing, desc_text: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">カード写真URL（画像管理からコピー）</label>
              <input className="admin-input" value={editing.cover_url ?? ''} onChange={e => setEditing({...editing, cover_url: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">ヒーロー写真URL（詳細ページ上部。空欄ならカード写真を使用）</label>
              <input className="admin-input" value={editing.hero_url ?? ''} onChange={e => setEditing({...editing, hero_url: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">申し込みフォームURL（空欄ならお問い合わせページへ）</label>
              <input className="admin-input" value={editing.apply_url ?? ''} onChange={e => setEditing({...editing, apply_url: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">並び順（小さいほど上に表示）</label>
              <input type="number" className="admin-input w-32" value={editing.sort_order ?? 0} onChange={e => setEditing({...editing, sort_order: Number(e.target.value)})} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pub" checked={editing.is_published ?? false} onChange={e => setEditing({...editing, is_published: e.target.checked})} />
              <label htmlFor="pub" className="text-sm">公開する</label>
            </div>
            <div className="flex gap-3">
              <button onClick={save} disabled={loading} className={`text-white text-sm px-4 py-2 rounded disabled:opacity-50 ${accentBtn}`}>{loading ? '保存中...' : '保存'}</button>
              <button onClick={() => openEditor(null)} className="text-sm px-4 py-2 border rounded text-gray-600">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500">行事名</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">開催日</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{ev.title}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${ev.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {ev.is_published ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ev.date_label}</td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <button onClick={() => openEditor(ev)} className={`hover:underline text-xs ${accentText}`}>編集</button>
                  <button onClick={() => remove(ev.id)} className="text-red-500 hover:underline text-xs">削除</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">まだ行事がありません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
