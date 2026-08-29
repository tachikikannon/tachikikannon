'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { renderNewsBody } from '@/lib/newsBody'
import { CATEGORY_COLOR_SWATCHES, DEFAULT_NEWS_CATEGORIES, categoryColor, newsCategoriesKey, parseNewsCategories, suggestUnusedColor, type NewsCategoryDef } from '@/lib/newsCategories'
import type { News, NewsSite } from '@/types'

type BodyField = 'body' | 'body_en'

export default function NewsAdmin({ site, siteLabel, accent = 'chuzenji' }: { site: NewsSite; siteLabel: string; accent?: 'chuzenji' | 'onsenji' }) {
  const supabase = createClient()
  const [list, setList] = useState<News[]>([])
  const [editing, setEditing] = useState<Partial<News> | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  const [uploadingField, setUploadingField] = useState<BodyField | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const bodyImageInputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const bodyEnRef = useRef<HTMLTextAreaElement>(null)
  const insertTargetField = useRef<BodyField>('body')
  const [categories, setCategories] = useState<NewsCategoryDef[]>(DEFAULT_NEWS_CATEGORIES)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('')

  const accentBtn = accent === 'onsenji' ? 'bg-onsenji hover:bg-onsenji/90' : 'btn-primary'
  const accentBorder = accent === 'onsenji' ? 'border-[#7ec8a4]' : 'border-gold'
  const accentText = accent === 'onsenji' ? 'text-onsenji' : 'text-navy'

  async function load() {
    const { data } = await supabase.from('news').select('*').eq('site', site).order('created_at', { ascending: false })
    setList(data ?? [])
  }

  async function loadCategories() {
    const { data } = await supabase.from('site_content').select('value').eq('key', newsCategoriesKey(site)).maybeSingle()
    setCategories(parseNewsCategories(data?.value))
  }

  async function saveCategories(next: NewsCategoryDef[]) {
    setCategories(next)
    await supabase.from('site_content').upsert({ key: newsCategoriesKey(site), value: JSON.stringify(next) }, { onConflict: 'key' })
  }

  function addCategory() {
    const name = newCategoryInput.trim()
    if (!name || categories.some(c => c.name === name)) { setNewCategoryInput(''); return }
    const color = newCategoryColor || suggestUnusedColor(categories)
    const name_en = newCategoryNameEn.trim() || undefined
    saveCategories([...categories, { name, name_en, color }])
    setNewCategoryInput('')
    setNewCategoryNameEn('')
    setNewCategoryColor('')
  }

  function removeCategory(name: string) {
    saveCategories(categories.filter(c => c.name !== name))
  }

  function updateCategoryColor(name: string, color: string) {
    saveCategories(categories.map(c => c.name === name ? { ...c, color } : c))
  }

  function updateCategoryNameEn(name: string, name_en: string) {
    setCategories(cs => cs.map(c => c.name === name ? { ...c, name_en } : c))
  }

  function commitCategoryNameEn(name: string, name_en: string) {
    saveCategories(categories.map(c => c.name === name ? { ...c, name_en: name_en.trim() || undefined } : c))
  }

  useEffect(() => {
    load()
    loadCategories()
    if (new URLSearchParams(window.location.search).get('new') === '1') {
      setEditing({ title:'', excerpt:'', body:'', cover_url:'', category:'お知らせ', site, is_published:false })
      setPreview(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site])

  async function save() {
    if (!editing) return
    setLoading(true)
    const payload = {
      ...editing,
      site,
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

  function insertAtCursor(field: BodyField, ref: React.RefObject<HTMLTextAreaElement | null>, snippet: string) {
    const el = ref.current
    setEditing(v => {
      if (!v) return v
      const current = v[field] ?? ''
      if (!el) return { ...v, [field]: current + snippet }
      const start = el.selectionStart ?? current.length
      const end = el.selectionEnd ?? current.length
      const next = current.slice(0, start) + snippet + current.slice(end)
      requestAnimationFrame(() => {
        el.focus()
        const pos = start + snippet.length
        el.setSelectionRange(pos, pos)
      })
      return { ...v, [field]: next }
    })
  }

  // 選択範囲を [center]〜[/center] 等の行揃えマーカーで囲む。範囲を選択せずカーソルを
  // 置いただけの場合は、Wordのようにカーソルがある「行」全体を自動的に対象にする
  // （行が空なら開始・終了タグだけをカーソル位置に挿入し、その間にカーソルを置く）。
  // renderNewsBody側がこの記法を解釈してtext-alignスタイルに変換する（src/lib/newsBody.tsx参照）。
  function wrapSelection(field: BodyField, ref: React.RefObject<HTMLTextAreaElement | null>, align: 'left' | 'center' | 'right') {
    const el = ref.current
    setEditing(v => {
      if (!v) return v
      const current = v[field] ?? ''
      const openTag = `[${align}]`
      const closeTag = `[/${align}]`
      if (!el) return { ...v, [field]: current + openTag + closeTag }
      let start = el.selectionStart ?? current.length
      let end = el.selectionEnd ?? current.length
      if (start === end) {
        const lineStart = current.lastIndexOf('\n', start - 1) + 1
        const lineEndIdx = current.indexOf('\n', start)
        const lineEnd = lineEndIdx === -1 ? current.length : lineEndIdx
        if (lineEnd > lineStart) { start = lineStart; end = lineEnd }
      }
      const selected = current.slice(start, end)
      const inserted = `${openTag}${selected}${closeTag}`
      const next = current.slice(0, start) + inserted + current.slice(end)
      requestAnimationFrame(() => {
        el.focus()
        if (selected) {
          el.setSelectionRange(start, start + inserted.length)
        } else {
          const pos = start + openTag.length
          el.setSelectionRange(pos, pos)
        }
      })
      return { ...v, [field]: next }
    })
  }

  function alignButtons(field: BodyField, ref: React.RefObject<HTMLTextAreaElement | null>) {
    const ALIGN_OPTIONS: { value: 'left' | 'center' | 'right'; label: string }[] = [
      { value: 'left', label: '左揃え' },
      { value: 'center', label: '中央揃え' },
      { value: 'right', label: '右揃え' },
    ]
    return (
      <div className="flex gap-1 mb-1">
        {ALIGN_OPTIONS.map(({ value, label }) => (
          <button key={value} type="button" onClick={() => wrapSelection(field, ref, value)}
            className="text-xs border rounded px-2 py-1 text-gray-600 hover:bg-gray-50">
            {label}
          </button>
        ))}
      </div>
    )
  }

  function triggerBodyImageUpload(field: BodyField) {
    insertTargetField.current = field
    bodyImageInputRef.current?.click()
  }

  async function handleBodyImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const field = insertTargetField.current
    setUploadError(null)
    setUploadingField(field)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('temple-images').upload(path, file)
    if (error) {
      setUploadError(error.message)
      setUploadingField(null)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('temple-images').getPublicUrl(path)
    await supabase.from('media').insert({
      filename: file.name, storage_path: path, public_url: publicUrl,
      size_bytes: file.size, mime_type: file.type, site,
    })
    insertAtCursor(field, field === 'body' ? bodyRef : bodyEnRef, `\n![](${publicUrl})\n`)
    setUploadingField(null)
  }

  return (
    <div className="p-8 max-w-5xl">
      <input ref={bodyImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleBodyImageSelected} />
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-serif ${accentText}`}>{siteLabel} お知らせ管理</h1>
        <button
          onClick={() => { setEditing({ title:'', excerpt:'', body:'', cover_url:'', category:'お知らせ', site, is_published:false }); setPreview(false) }}
          className={`text-white text-sm px-4 py-2 rounded ${accentBtn}`}
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
                <span className={`rounded px-2 py-0.5 ${categoryColor(categories, editing.category ?? '')}`}>{editing.category}</span>
              </div>
              <h3 className={`text-xl font-serif ${accentText}`}>{editing.title || '（タイトルなし）'}</h3>
              {editing.excerpt && <p className={`text-sm text-gray-500 border-l-4 ${accentBorder} pl-4`}>{editing.excerpt}</p>}
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {editing.body ? renderNewsBody(editing.body) : '（本文なし）'}
              </div>
            </div>
          ) : (
            /* 編集フォーム */
            <div className="space-y-4">
              {uploadError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">{uploadError}</p>
              )}
              <div>
                <label className="admin-label">タイトル <span className="text-red-400">*</span></label>
                <input className="admin-input" placeholder="例：夏季拝観時間のお知らせ"
                  value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="admin-label mb-0">カテゴリ</label>
                  <button type="button" onClick={() => setShowCategoryManager(s => !s)}
                    className="text-xs text-gray-400 hover:text-navy underline">
                    {showCategoryManager ? '閉じる' : 'カテゴリーを追加・削除'}
                  </button>
                </div>
                <select className="admin-input" value={editing.category ?? 'お知らせ'}
                  onChange={e => setEditing({...editing, category: e.target.value})}>
                  {categories.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
                {showCategoryManager && (
                  <div className="mt-2 p-3 bg-cream-alt rounded-lg space-y-2">
                    {categories.map(c => (
                      <div key={c.name} className="bg-white rounded-lg border border-gray-200 px-3 py-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs rounded px-2 py-0.5 flex-shrink-0 whitespace-nowrap ${c.color}`}>{c.name}</span>
                          <div className="flex gap-1 flex-wrap flex-1">
                            {CATEGORY_COLOR_SWATCHES.map(sw => (
                              <button key={sw.key} type="button" title={sw.label} onClick={() => updateCategoryColor(c.name, sw.className)}
                                className={`w-5 h-5 rounded-full border-2 ${sw.className.split(' ')[0]} ${c.color === sw.className ? 'border-navy' : 'border-transparent'}`} />
                            ))}
                          </div>
                          <button type="button" onClick={() => removeCategory(c.name)} aria-label={`${c.name}を削除`}
                            className="text-gray-400 hover:text-red-500 text-xs flex-shrink-0">削除</button>
                        </div>
                        <input className="admin-input text-sm py-1" placeholder="英語名（未入力なら英語ページでも日本語のまま表示）"
                          value={c.name_en ?? ''}
                          onChange={e => updateCategoryNameEn(c.name, e.target.value)}
                          onBlur={e => commitCategoryNameEn(c.name, e.target.value)} />
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <input className="admin-input text-sm flex-1 min-w-[140px]" placeholder="新しいカテゴリー名"
                          value={newCategoryInput}
                          onChange={e => setNewCategoryInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }} />
                        <div className="flex gap-1">
                          {CATEGORY_COLOR_SWATCHES.map(sw => (
                            <button key={sw.key} type="button" title={sw.label} onClick={() => setNewCategoryColor(sw.className)}
                              className={`w-5 h-5 rounded-full border-2 ${sw.className.split(' ')[0]} ${(newCategoryColor || suggestUnusedColor(categories)) === sw.className ? 'border-navy' : 'border-transparent'}`} />
                          ))}
                        </div>
                        <button type="button" onClick={addCategory}
                          className="text-xs px-3 py-1.5 rounded border border-navy text-navy hover:bg-navy hover:text-white transition-colors flex-shrink-0">
                          追加
                        </button>
                      </div>
                      <input className="admin-input text-sm" placeholder="英語名（任意・後から追加もできます）"
                        value={newCategoryNameEn}
                        onChange={e => setNewCategoryNameEn(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }} />
                    </div>
                    <p className="text-[11px] text-gray-400">色の丸をクリックすると変更できます。新規追加時は未使用の色が自動で選ばれます。英語名を入れると英語ページでその表記になります（空欄なら日本語のまま表示）。削除しても、既にそのカテゴリーが付いている記事はそのまま表示されます（新規記事で選べなくなるだけです）。</p>
                  </div>
                )}
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
                {alignButtons('body', bodyRef)}
                <textarea ref={bodyRef} className="admin-input min-h-[240px] font-mono text-sm" placeholder="本文を入力してください。改行はそのまま反映されます。&#10;行にカーソルを置いて「左揃え／中央揃え／右揃え」を押すとその行に反映されます（範囲選択も可）。"
                  value={editing.body ?? ''} onChange={e => setEditing({...editing, body: e.target.value})} />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">改行・空行やURLはそのまま表示・リンク化されます</p>
                  <button type="button" onClick={() => triggerBodyImageUpload('body')} disabled={uploadingField === 'body'}
                    className="text-xs text-navy border border-navy rounded px-3 py-1.5 hover:bg-navy hover:text-white transition-colors disabled:opacity-50 flex-shrink-0 ml-3">
                    {uploadingField === 'body' ? 'アップロード中...' : '📷 本文に写真を挿入'}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <p className="text-xs text-gray-400">英語訳（未入力の場合は日本語が表示されます）</p>
                <div>
                  <label className="admin-label">タイトル（英語）</label>
                  <input className="admin-input" value={editing.title_en ?? ''} onChange={e => setEditing({...editing, title_en: e.target.value})} />
                </div>
                <div>
                  <label className="admin-label">概要文（英語）</label>
                  <textarea className="admin-input min-h-[60px]" value={editing.excerpt_en ?? ''} onChange={e => setEditing({...editing, excerpt_en: e.target.value})} />
                </div>
                <div>
                  <label className="admin-label">本文（英語）</label>
                  {alignButtons('body_en', bodyEnRef)}
                  <textarea ref={bodyEnRef} className="admin-input min-h-[180px] font-mono text-sm" value={editing.body_en ?? ''} onChange={e => setEditing({...editing, body_en: e.target.value})} />
                  <div className="flex justify-end mt-1">
                    <button type="button" onClick={() => triggerBodyImageUpload('body_en')} disabled={uploadingField === 'body_en'}
                      className="text-xs text-navy border border-navy rounded px-3 py-1.5 hover:bg-navy hover:text-white transition-colors disabled:opacity-50">
                      {uploadingField === 'body_en' ? 'アップロード中...' : '📷 本文に写真を挿入'}
                    </button>
                  </div>
                </div>
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
              className={`text-white text-sm px-4 py-2 rounded disabled:opacity-40 ${accentBtn}`}>
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
                <td className="px-4 py-3">
                  <span className={`badge ${categoryColor(categories, n.category)}`}>{n.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${n.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {n.is_published ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {n.published_at ? new Date(n.published_at).toLocaleDateString('ja-JP') : '—'}
                </td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <button onClick={() => { setEditing(n); setPreview(false) }} className={`hover:underline text-xs ${accentText}`}>編集</button>
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
