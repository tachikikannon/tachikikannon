'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Field = {
  key: string
  label: string
  hint?: string
  multiline?: boolean
}

const FIELDS: { section: string; fields: Field[] }[] = [
  {
    section: 'ヒーローセクション',
    fields: [
      { key: 'hero_en',    label: '英語サブタイトル', hint: '例：Nikkozan Chuzenji Temple' },
      { key: 'hero_title', label: 'キャッチコピー', hint: '改行は「\\n」で入力してください', multiline: true },
    ],
  },
  {
    section: 'アクセス',
    fields: [
      { key: 'access_address', label: '住所', multiline: true },
      { key: 'access_car',     label: '車でのアクセス', multiline: true },
      { key: 'access_bus',     label: '電車・バスでのアクセス', multiline: true },
    ],
  },
]

export default function TopPageEditor() {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_content').select('key,value')
      .then(({ data }) => {
        const map: Record<string, string> = {}
        data?.forEach(row => { map[row.key] = row.value })
        setValues(map)
      })
  }, [])

  async function save(key: string) {
    setSaving(key)
    await supabase.from('site_content')
      .upsert({ key, value: values[key] ?? '' }, { onConflict: 'key' })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">トップページ編集</h1>
      <p className="text-gray-500 text-sm mb-8">変更後は「保存」を押してください。すぐにサイトに反映されます。</p>

      <div className="space-y-8">
        {FIELDS.map(({ section, fields }) => (
          <div key={section}>
            <h2 className="text-sm font-medium text-gray-500 tracking-widest mb-3 uppercase">{section}</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
              {fields.map(({ key, label, hint, multiline }) => (
                <div key={key}>
                  <label className="admin-label">{label}</label>
                  {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
                  {multiline ? (
                    <textarea
                      className="admin-input min-h-[80px]"
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      className="admin-input"
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                  )}
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => save(key)}
                      disabled={saving === key}
                      className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                    >
                      {saving === key ? '保存中...' : saved === key ? '✓ 保存しました' : '保存'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
