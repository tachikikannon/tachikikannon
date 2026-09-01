'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Banner = { image: string; href: string; caption_ja: string; caption_en: string; published: boolean }

const CONTENT_KEY = 'top_event_banners'

const DEFAULT_BANNERS: Banner[] = [
  { image: '/images/yakansanpai.png', href: '/news/13adf0b9-5fe7-4c32-9c5a-0850883cc0d4',
    caption_ja: '夜間参拝', caption_en: 'Night Visiting Event', published: true },
]

export default function AdminChuzenjiEventsBanner() {
  const supabase = createClient()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const replaceFileRef = useRef<HTMLInputElement>(null)
  const addFileRef = useRef<HTMLInputElement>(null)
  const replaceTargetIndex = useRef<number | null>(null)

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', CONTENT_KEY).maybeSingle().then(({ data }) => {
      if (data?.value) {
        try { setBanners(JSON.parse(data.value)) } catch { setBanners(DEFAULT_BANNERS) }
      } else {
        setBanners(DEFAULT_BANNERS)
      }
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function uploadFile(file: File): Promise<string | null> {
    setUploadError(null)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('temple-images').upload(path, file)
    if (error) { setUploadError(error.message); return null }
    const { data: { publicUrl } } = supabase.storage.from('temple-images').getPublicUrl(path)
    await supabase.from('media').insert({
      filename: file.name, storage_path: path, public_url: publicUrl,
      size_bytes: file.size, mime_type: file.type, site: 'chuzenji',
    })
    return publicUrl
  }

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const idx = replaceTargetIndex.current
    if (!file || idx === null) return
    setUploadingIndex(idx)
    const url = await uploadFile(file)
    if (url) setBanners(b => b.map((bn, i) => i === idx ? { ...bn, image: url } : bn))
    setUploadingIndex(null)
    if (replaceFileRef.current) replaceFileRef.current.value = ''
  }

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingIndex(-1)
    const url = await uploadFile(file)
    if (url) setBanners(b => [...b, { image: url, href: '', caption_ja: '', caption_en: '', published: true }])
    setUploadingIndex(null)
    if (addFileRef.current) addFileRef.current.value = ''
  }

  function update(i: number, field: keyof Banner, value: string) {
    setBanners(b => b.map((bn, idx) => idx === i ? { ...bn, [field]: value } : bn))
  }

  function togglePublished(i: number) {
    setBanners(b => b.map((bn, idx) => idx === i ? { ...bn, published: !bn.published } : bn))
  }

  function move(i: number, dir: -1 | 1) {
    setBanners(b => {
      const arr = [...b]
      const j = i + dir
      if (j < 0 || j >= arr.length) return b
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  function remove(i: number) {
    if (!confirm('このイベント情報を削除しますか？')) return
    setBanners(b => b.filter((_, idx) => idx !== i))
  }

  async function save() {
    setSaving(true)
    await supabase.from('site_content').upsert({ key: CONTENT_KEY, value: JSON.stringify(banners) }, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="p-8 text-gray-400 text-sm">読み込み中...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-1">
        <span className="inline-block w-3 h-3 rounded-full bg-navy" />
        <h1 className="text-2xl font-serif text-gray-800">イベント情報</h1>
      </div>
      <a href="/#access" target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline ml-4 block mb-6">
        トップページで見る ↗
      </a>
      <p className="text-gray-500 text-sm mb-8">
        トップページの「お知らせ」の上に表示される、期間限定のお知らせバナーを管理します。
        画像・リンク先・キャプション・並び順を編集できます。「公開する」のチェックを外すと、
        削除せずにそのバナーだけ非表示にできます（行事が終わった後などに）。すべて非公開の場合、
        セクション自体が表示されません。変更後は一番下の「保存」を押してください。
      </p>

      {uploadError && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3 mb-4">{uploadError}</p>
      )}

      <div className="space-y-4">
        {banners.map((banner, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-sm p-4 flex gap-4 ${banner.published ? '' : 'opacity-60'}`}>
            <div className="flex-shrink-0">
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.image} alt={banner.caption_ja} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => { replaceTargetIndex.current = i; replaceFileRef.current?.click() }}
                disabled={uploadingIndex === i}
                className="mt-2 text-xs text-navy border border-navy rounded px-2 py-1 hover:bg-navy hover:text-white transition-colors disabled:opacity-50 w-full"
              >
                {uploadingIndex === i ? 'アップロード中...' : '画像を差し替え'}
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={banner.published}
                    onChange={() => togglePublished(i)}
                  />
                  公開する
                </label>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↑</button>
                  <button onClick={() => move(i, 1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↓</button>
                  <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded">削除</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-0.5">リンク先（クリックで移動するURL。お知らせなら /news/記事ID）</label>
                <input type="text" className="admin-input text-sm" placeholder="/news/xxxxxxxx" value={banner.href} onChange={e => update(i, 'href', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">画像上の文字（日本語）</label>
                  <input type="text" className="admin-input text-sm" value={banner.caption_ja} onChange={e => update(i, 'caption_ja', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">画像上の文字（英語）</label>
                  <input type="text" className="admin-input text-sm" value={banner.caption_en} onChange={e => update(i, 'caption_en', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <input ref={replaceFileRef} type="file" accept="image/*" className="hidden" onChange={handleReplace} />
      <input ref={addFileRef} type="file" accept="image/*" className="hidden" onChange={handleAdd} />

      <button
        type="button"
        onClick={() => addFileRef.current?.click()}
        disabled={uploadingIndex === -1}
        className="mt-4 text-sm border border-navy text-navy rounded px-4 py-2 hover:bg-navy hover:text-white transition-colors disabled:opacity-50"
      >
        {uploadingIndex === -1 ? 'アップロード中...' : '+ イベント情報を追加'}
      </button>

      <div className="mt-8 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50">
          {saving ? '保存中...' : saved ? '✓ 保存しました' : '保存'}
        </button>
      </div>
    </div>
  )
}
