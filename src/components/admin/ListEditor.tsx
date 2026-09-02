'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

export type ListField = { key: string; label: string; multiline?: boolean; images?: boolean; image?: boolean }

type Props = {
  value: string
  fields: ListField[]
  onChange: (json: string) => void
  addLabel?: string
}

export default function ListEditor({ value, fields, onChange, addLabel = '項目を追加' }: Props) {
  const supabase = createClient()
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTarget = useRef<{ index: number; key: string } | null>(null)

  const items: Record<string, string>[] = (() => {
    try { return JSON.parse(value) } catch { return [] }
  })()

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const target = uploadTarget.current
    if (!file || !target) return
    setUploadError(null)
    setUploadingKey(`${target.index}-${target.key}`)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('temple-images').upload(path, file)
    if (error) {
      setUploadError(error.message)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('temple-images').getPublicUrl(path)
      await supabase.from('media').insert({
        filename: file.name, storage_path: path, public_url: publicUrl,
        size_bytes: file.size, mime_type: file.type,
      })
      update(target.index, target.key, publicUrl)
    }
    setUploadingKey(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function triggerUpload(index: number, key: string) {
    uploadTarget.current = { index, key }
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.click()
    }
  }

  function update(i: number, key: string, val: string) {
    const updated = items.map((item, idx) => idx === i ? { ...item, [key]: val } : item)
    onChange(JSON.stringify(updated))
  }

  function add() {
    const empty = Object.fromEntries(fields.map(f => [f.key, '']))
    onChange(JSON.stringify([...items, empty]))
  }

  function remove(i: number) {
    onChange(JSON.stringify(items.filter((_, idx) => idx !== i)))
  }

  function move(i: number, dir: -1 | 1) {
    const arr = [...items]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    onChange(JSON.stringify(arr))
  }

  return (
    <div className="space-y-2">
      {uploadError && (
        <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded p-2">{uploadError}</p>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelected} />
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-medium">{i + 1}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↑</button>
              <button onClick={() => move(i, 1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↓</button>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded">削除</button>
            </div>
          </div>
          <div className="space-y-2">
            {fields.map(({ key, label, multiline, images, image }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-0.5">{label}</label>
                {image ? (
                  <div className="flex items-center gap-3">
                    {item[key] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item[key]} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    )}
                    <button
                      type="button"
                      onClick={() => triggerUpload(i, key)}
                      disabled={uploadingKey === `${i}-${key}`}
                      className="text-xs text-navy border border-navy rounded px-3 py-1.5 hover:bg-navy hover:text-white transition-colors disabled:opacity-50"
                    >
                      {uploadingKey === `${i}-${key}` ? 'アップロード中...' : item[key] ? '写真を変更' : '写真をアップロード'}
                    </button>
                  </div>
                ) : images ? (
                  <>
                    <textarea
                      className="admin-input min-h-[70px] text-sm"
                      value={item[key] ?? ''}
                      placeholder={'1行に1枚ずつ画像URLを貼り付け'}
                      onChange={e => update(i, key, e.target.value)}
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">複数枚可。1行につき画像1枚のURLを貼り付けてください。</p>
                  </>
                ) : multiline ? (
                  <textarea
                    className="admin-input min-h-[60px] text-sm"
                    value={item[key] ?? ''}
                    onChange={e => update(i, key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="admin-input text-sm"
                    value={item[key] ?? ''}
                    onChange={e => update(i, key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={add} className="text-xs border border-navy text-navy rounded px-3 py-1.5 hover:bg-navy hover:text-white transition-colors">
        + {addLabel}
      </button>
    </div>
  )
}
