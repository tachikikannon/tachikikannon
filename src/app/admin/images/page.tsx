'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import type { Media, MediaSite } from '@/types'

const SITE_LABELS: Record<MediaSite, string> = { chuzenji: '立木観音', onsenji: '温泉寺' }

export default function AdminImagesPage() {
  const supabase = createClient()
  const [list, setList] = useState<Media[]>([])
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSite, setUploadSite] = useState<MediaSite>('chuzenji')
  const [filterSite, setFilterSite] = useState<MediaSite | 'all'>('all')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError(null)
    const errors: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('temple-images').upload(path, file)
      if (error) { errors.push(`${file.name}: ${error.message}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('temple-images').getPublicUrl(path)
      const { error: insertError } = await supabase.from('media').insert({
        filename: file.name,
        storage_path: path,
        public_url: publicUrl,
        size_bytes: file.size,
        mime_type: file.type,
        site: uploadSite,
      })
      if (insertError) errors.push(`${file.name}: ${insertError.message}`)
    }
    if (errors.length > 0) setUploadError(errors.join('\n'))
    setUploading(false)
    load()
    if (fileRef.current) fileRef.current.value = ''
  }

  async function remove(item: Media) {
    if (!confirm(`「${item.filename}」を削除しますか？`)) return
    await supabase.storage.from('temple-images').remove([item.storage_path])
    await supabase.from('media').delete().eq('id', item.id)
    load()
  }

  async function toggleLendable(item: Media) {
    await supabase.from('media').update({ is_lendable: !item.is_lendable }).eq('id', item.id)
    setList(prev => prev.map(m => m.id === item.id ? { ...m, is_lendable: !m.is_lendable } : m))
  }

  async function changeSite(item: Media, site: MediaSite) {
    await supabase.from('media').update({ site }).eq('id', item.id)
    setList(prev => prev.map(m => m.id === item.id ? { ...m, site } : m))
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = filterSite === 'all' ? list : list.filter(m => m.site === filterSite)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-serif text-navy">画像管理</h1>
        <div className="flex items-center gap-3">
          <select className="admin-input text-sm py-2" value={uploadSite}
            onChange={e => setUploadSite(e.target.value as MediaSite)}>
            <option value="chuzenji">立木観音の写真としてアップロード</option>
            <option value="onsenji">温泉寺の写真としてアップロード</option>
          </select>
          <label className={`btn-primary text-sm px-4 py-2 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? 'アップロード中...' : '＋ 画像をアップロード'}
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'chuzenji', 'onsenji'] as const).map(s => (
          <button key={s} onClick={() => setFilterSite(s)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterSite === s ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {s === 'all' ? 'すべて' : SITE_LABELS[s]}
            <span className="ml-1">({s === 'all' ? list.length : list.filter(m => m.site === s).length})</span>
          </button>
        ))}
      </div>

      {uploadError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 whitespace-pre-wrap">
          アップロードに失敗しました：{'\n'}{uploadError}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow overflow-hidden group">
            <div className="relative h-32">
              <Image src={item.public_url} alt={item.alt ?? item.filename} fill className="object-cover" />
              <span className={`absolute top-1.5 left-1.5 badge text-[10px] ${item.site === 'onsenji' ? 'bg-teal-100 text-teal-700' : 'bg-navy/10 text-navy'}`}>
                {SITE_LABELS[item.site]}
              </span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => copyUrl(item.public_url)}
                  className="bg-white text-navy text-xs px-2 py-1 rounded font-medium hover:bg-gold">
                  {copied === item.public_url ? 'コピー済み!' : 'URLコピー'}
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate">{item.filename}</p>
              <select className="admin-input text-[10px] py-1 mt-1.5" value={item.site}
                onChange={e => changeSite(item, e.target.value as MediaSite)}>
                <option value="chuzenji">立木観音</option>
                <option value="onsenji">温泉寺</option>
              </select>
              <label className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-500 cursor-pointer">
                <input type="checkbox" checked={item.is_lendable} onChange={() => toggleLendable(item)} className="w-3 h-3" />
                貸出可（写真一覧に表示）
              </label>
              <button onClick={() => remove(item)} className="text-red-400 hover:text-red-600 text-[10px] mt-1">削除</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !uploading && (
          <div className="col-span-full py-16 text-center text-gray-400 text-sm">
            画像がありません。
          </div>
        )}
      </div>
    </div>
  )
}
