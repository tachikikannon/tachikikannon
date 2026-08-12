'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Slide = { src: string; alt: string; month?: string; caption_ja: string; caption_en: string }

const CONTENT_KEY = 'top_gallery_slides'

const DEFAULT_SLIDES: Slide[] = [
  { src: '/images/godaido.jpg', alt: '五大堂', month: '', caption_ja: '五大堂 — 中禅寺湖を望む舞台', caption_en: 'Godaido Hall — overlooking Lake Chuzenji' },
  { src: '/images/dragon.jpg', alt: '立木観音 境内', month: '', caption_ja: '本堂を包む新緑', caption_en: 'Fresh greenery around the main hall' },
  { src: '/images/gallery/yakan-sanpai.jpg', alt: '夜間参拝', month: '10月', caption_ja: '夜間参拝 — 灯りに浮かぶ本堂', caption_en: 'Night visiting — the hall lit after dark' },
  { src: '/images/gallery/ongakusai.jpg', alt: '音楽祭', month: '5月', caption_ja: '音楽祭 — 天井の龍の下で', caption_en: 'Music Festival beneath the dragon ceiling' },
  { src: '/images/gallery/yoga.jpg', alt: 'YOGA IN 五大堂', month: '6月', caption_ja: 'YOGA IN 五大堂', caption_en: 'YOGA IN Godaido' },
  { src: '/images/gallery/classical-music.jpg', alt: 'クラシックコンサート', month: '5月', caption_ja: '湖を望むピアノコンサート', caption_en: 'A piano recital overlooking the lake' },
]

export default function AdminChuzenjiGallery() {
  const supabase = createClient()
  const [slides, setSlides] = useState<Slide[]>([])
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
        try { setSlides(JSON.parse(data.value)) } catch { setSlides(DEFAULT_SLIDES) }
      } else {
        setSlides(DEFAULT_SLIDES)
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
    if (url) setSlides(s => s.map((sl, i) => i === idx ? { ...sl, src: url } : sl))
    setUploadingIndex(null)
    if (replaceFileRef.current) replaceFileRef.current.value = ''
  }

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingIndex(-1)
    const url = await uploadFile(file)
    if (url) setSlides(s => [...s, { src: url, alt: '', month: '', caption_ja: '', caption_en: '' }])
    setUploadingIndex(null)
    if (addFileRef.current) addFileRef.current.value = ''
  }

  function update(i: number, field: keyof Slide, value: string) {
    setSlides(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: value } : sl))
  }

  function move(i: number, dir: -1 | 1) {
    setSlides(s => {
      const arr = [...s]
      const j = i + dir
      if (j < 0 || j >= arr.length) return s
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  function remove(i: number) {
    if (!confirm('この写真をギャラリーから削除しますか？')) return
    setSlides(s => s.filter((_, idx) => idx !== i))
  }

  async function save() {
    setSaving(true)
    await supabase.from('site_content').upsert({ key: CONTENT_KEY, value: JSON.stringify(slides) }, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="p-8 text-gray-400 text-sm">読み込み中...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-1">
        <span className="inline-block w-3 h-3 rounded-full bg-navy" />
        <h1 className="text-2xl font-serif text-gray-800">中禅寺ギャラリー</h1>
      </div>
      <a href="/#access" target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline ml-4 block mb-6">
        トップページで見る ↗
      </a>
      <p className="text-gray-500 text-sm mb-8">
        トップページ「中禅寺ギャラリー」の下段に自動再生で表示される写真を管理します。写真の差し替え・追加・削除・並び替え・キャプション編集・撮影月の表示ができます。変更後は一番下の「保存」を押してください。
        なお上段の動画（douga01）はこの画面では編集できません。差し替える場合は開発担当にご相談ください。
      </p>

      {uploadError && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3 mb-4">{uploadError}</p>
      )}

      <div className="space-y-4">
        {slides.map((slide, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
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
                <span className="text-xs text-gray-400 font-medium">{i + 1}枚目</span>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↑</button>
                  <button onClick={() => move(i, 1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↓</button>
                  <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded">削除</button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">代替テキスト（alt）</label>
                  <input type="text" className="admin-input text-sm" value={slide.alt} onChange={e => update(i, 'alt', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">撮影月（右上に小さく表示・空欄で非表示）</label>
                  <input type="text" className="admin-input text-sm" placeholder="例：8月" value={slide.month ?? ''} onChange={e => update(i, 'month', e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">キャプション（日本語）</label>
                  <input type="text" className="admin-input text-sm" value={slide.caption_ja} onChange={e => update(i, 'caption_ja', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">キャプション（英語）</label>
                  <input type="text" className="admin-input text-sm" value={slide.caption_en} onChange={e => update(i, 'caption_en', e.target.value)} />
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
        {uploadingIndex === -1 ? 'アップロード中...' : '+ 写真を追加'}
      </button>

      <div className="mt-8 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary text-sm px-6 py-2.5 disabled:opacity-50">
          {saving ? '保存中...' : saved ? '✓ 保存しました' : '保存'}
        </button>
      </div>
    </div>
  )
}
