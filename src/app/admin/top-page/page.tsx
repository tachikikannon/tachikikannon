'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import ListEditor, { type ListField } from '@/components/admin/ListEditor'

const J = (v: unknown) => JSON.stringify(v)

type TextField = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string; type?: 'text' }
type ListFieldDef = { key: string; label: string; type: 'list'; listFields: ListField[]; defaultValue: string }
type Field = TextField | ListFieldDef

const FIELDS: { section: string; fields: Field[] }[] = [
  {
    section: 'ヒーローセクション',
    fields: [
      { key: 'hero_en',    label: '英語サブタイトル', hint: '例：Nikkozan Chuzenji Temple', defaultValue: 'Nikkozan Chuzenji Temple' },
      { key: 'hero_title', label: 'キャッチコピー', hint: '改行は「\\n」で入力してください', multiline: true, defaultValue: '中禅寺湖畔に佇む、\n祈りと巡礼の寺' },
    ],
  },
  {
    section: 'お知らせ・SNS',
    fields: [
      { key: 'top_sns_heading',  label: 'SNSバナーの見出し', defaultValue: '公式SNSでも最新情報を発信中' },
      { key: 'top_heading_news', label: '「お知らせ」見出し', defaultValue: 'お知らせ' },
    ],
  },
  {
    section: '立木観音について',
    fields: [
      { key: 'top_heading_about', label: 'セクション見出し', defaultValue: '立木観音について' },
      {
        key: 'top_about_cards', label: 'カード（歴史・拝観料金・境内案内・年間行事の順、4件固定）', type: 'list',
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'desc', label: '説明' }],
        defaultValue: J([
          { label: '立木観音の歴史', desc: '歴史と縁起' },
          { label: '拝観料金', desc: '拝観料・各種料金' },
          { label: '境内のご案内', desc: '見どころ・境内マップ' },
          { label: '年間行事', desc: '法要・行事のご案内' },
        ]),
      },
    ],
  },
  {
    section: '近日の行事',
    fields: [
      { key: 'top_heading_events', label: 'セクション見出し', defaultValue: '近日の行事' },
    ],
  },
  {
    section: '祈る・体験する',
    fields: [
      { key: 'top_heading_experience', label: 'セクション見出し', defaultValue: '祈る・体験する' },
      {
        key: 'top_experience_cards', label: 'カード（御祈願・数珠づくり・写経・写仏の順、4件固定）', type: 'list',
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'sub', label: '価格・補足' }],
        defaultValue: J([
          { label: '御祈願', sub: '御祈願料：5,000円〜' },
          { label: '数珠づくり体験', sub: '2,000円〜' },
          { label: '写経体験', sub: '約15分 / 1,000円' },
          { label: '写仏体験', sub: '1,000円' },
        ]),
      },
    ],
  },
  {
    section: '受ける',
    fields: [
      { key: 'top_heading_service', label: 'セクション見出し', defaultValue: '受ける' },
      {
        key: 'top_service_cards', label: 'カード（御朱印・授与品通販の順、2件固定）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'text', label: '説明文', multiline: true }, { key: 'info', label: '価格・補足' }],
        defaultValue: J([
          { title: '御朱印', text: '中禅寺ならではの御朱印をお受けいただけます。書き入れのほか書き置きもございます。', info: '御朱印代：500円〜' },
          { title: '授与品・通販', text: 'お守り・お札など各種授与品をご用意しております。一部通販でもお求めいただけます。', info: '通販サイトでもご購入いただけます' },
        ]),
      },
    ],
  },
  {
    section: 'アクセス',
    fields: [
      { key: 'top_heading_access', label: 'セクション見出し', defaultValue: 'アクセス' },
      { key: 'access_address', label: '住所', multiline: true, defaultValue: '〒321-1661\n栃木県日光市中宮祠2578' },
      { key: 'access_car',     label: '車でのアクセス', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約40分\n（いろは坂経由）' },
      { key: 'access_bus',     label: '電車・バスでのアクセス', multiline: true, defaultValue: '東武日光駅よりバスで約50分\n「中禅寺温泉」バス停より徒歩3分' },
    ],
  },
]

export default function TopPageEditor() {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    const defaults: Record<string, string> = {}
    FIELDS.forEach(({ fields }) => fields.forEach(f => { if (f.defaultValue) defaults[f.key] = f.defaultValue }))
    supabase.from('site_content').select('key,value')
      .then(({ data }) => {
        const map: Record<string, string> = { ...defaults }
        data?.forEach(row => { if (row.value) map[row.key] = row.value })
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
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="admin-label">{field.label}</label>
                  {'hint' in field && field.hint && <p className="text-xs text-gray-400 mb-1">{field.hint}</p>}
                  {field.type === 'list' ? (
                    <ListEditor
                      value={values[field.key] ?? field.defaultValue}
                      fields={field.listFields}
                      onChange={val => setValues(v => ({ ...v, [field.key]: val }))}
                    />
                  ) : field.multiline ? (
                    <textarea
                      className="admin-input min-h-[80px]"
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
        ))}
      </div>
    </div>
  )
}
