'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import ListEditor, { type ListField } from '@/components/admin/ListEditor'

type TextField = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string; type?: 'text' }
type ListFieldDef = { key: string; label: string; type: 'list'; listFields: ListField[]; defaultValue: string }
export type Field = TextField | ListFieldDef

interface Props {
  title: string
  href: string
  fields: Field[]
  accent?: 'navy' | 'onsenji'
}

export default function SectionEditor({ title, href, fields, accent = 'navy' }: Props) {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    const defaults: Record<string, string> = {}
    fields.forEach(f => { if (f.defaultValue) defaults[f.key] = f.defaultValue })
    supabase.from('site_content').select('key,value').then(({ data }) => {
      const map: Record<string, string> = { ...defaults }
      data?.forEach(row => { if (row.value) map[row.key] = row.value })
      setValues(map)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save(key: string) {
    setSaving(key)
    await supabase.from('site_content').upsert({ key, value: values[key] ?? '' }, { onConflict: 'key' })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  const dotColor = accent === 'onsenji' ? 'bg-onsenji' : 'bg-navy'

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <span className={`inline-block w-3 h-3 rounded-full ${dotColor}`} />
        <h1 className="text-2xl font-serif text-gray-800">{title}</h1>
      </div>
      <a href={href} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline ml-4 block mb-6">
        {href} ↗
      </a>
      <p className="text-gray-500 text-sm mb-8">変更後は「保存」を押してください。すぐにサイトに反映されます。</p>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="admin-label">{field.label}</label>
            {field.type === 'list' ? (
              <ListEditor
                value={values[field.key] ?? field.defaultValue}
                fields={field.listFields}
                onChange={val => setValues(v => ({ ...v, [field.key]: val }))}
              />
            ) : field.multiline ? (
              <textarea
                className="admin-input min-h-[100px]"
                value={values[field.key] ?? ''}
                placeholder={field.defaultValue}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
              />
            ) : (
              <input
                type="text"
                className="admin-input"
                value={values[field.key] ?? ''}
                placeholder={field.defaultValue}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
              />
            )}
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => save(field.key)}
                disabled={saving === field.key}
                className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
              >
                {saving === field.key ? '保存中...' : saved === field.key ? '✓ 保存しました' : '保存'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
