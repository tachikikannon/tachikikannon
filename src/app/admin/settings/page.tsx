'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Field = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string }

const FIELDS: Field[] = [
  { key: 'site_address', label: '住所', multiline: true, defaultValue: '〒321-1661 栃木県日光市中宮祠2578' },
  { key: 'site_tel',     label: '電話番号', defaultValue: '0288-55-0013' },
]

export default function SettingsAdmin() {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_content').select('key,value').then(({ data }) => {
      const map: Record<string, string> = {}
      data?.forEach(row => { map[row.key] = row.value })
      setValues(map)
    })
  }, [])

  async function save(key: string) {
    setSaving(key)
    await supabase.from('site_content').upsert({ key, value: values[key] ?? '' }, { onConflict: 'key' })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">サイト設定</h1>
      <p className="text-gray-500 text-sm mb-8">フッターなどに表示される基本情報を編集できます。</p>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {FIELDS.map(({ key, label, hint, multiline, defaultValue }) => (
          <div key={key}>
            <label className="admin-label">{label}</label>
            {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
            {multiline ? (
              <textarea
                className="admin-input min-h-[80px]"
                value={values[key] ?? ''}
                placeholder={defaultValue}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
              />
            ) : (
              <input
                type="text"
                className="admin-input"
                value={values[key] ?? ''}
                placeholder={defaultValue}
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
  )
}
