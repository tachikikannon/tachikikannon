'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { padListToDefault } from '@/lib/site-content'
import ListEditor, { type ListField } from '@/components/admin/ListEditor'

const J = (v: unknown) => JSON.stringify(v)

type TextField = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string; type?: 'text'; translatable?: boolean }
type ListFieldDef = { key: string; label: string; type: 'list'; listFields: ListField[]; defaultValue: string; translatable?: boolean; defaultValueEn?: string; padToDefault?: boolean }
type MediaField = { key: string; label: string; type: 'image' | 'video'; hint?: string; defaultValue?: string }
type Field = TextField | ListFieldDef | MediaField

const FIELDS: { section: string; fields: Field[] }[] = [
  {
    section: 'ヒーローセクション',
    fields: [
      { key: 'hero_en',    label: '英語サブタイトル', hint: '例：Nikkozan Chuzenji Temple', defaultValue: 'Nikkozan Chuzenji Temple' },
      { key: 'hero_title', label: 'キャッチコピー（改行可・Enterで改行）', multiline: true, defaultValue: '中禅寺湖畔に佇む\n祈りと巡礼の寺', translatable: true },
      { key: 'hero_bg_image', label: '背景の写真', type: 'image', defaultValue: '/images/chuzenji/common/main2.png' },
      {
        key: 'hero_bg_video', label: '背景の動画1（任意）', type: 'video',
        hint: '設定すると、写真の表示後にこの動画が自動再生されます。空にすると写真のみになります（2本目・3本目も再生されません）。',
        defaultValue: '/videos/chuzenji/hero-1.mp4',
      },
      {
        key: 'hero_bg_video_2', label: '背景の動画2（任意）', type: 'video',
        hint: '設定すると、1本目の動画の再生が終わった後に続けてこの動画が再生されます。空にすると1本目の後は写真に戻ります（3本目も再生されません）。',
        defaultValue: '/videos/chuzenji/hero-2.mp4',
      },
      {
        key: 'hero_bg_video_3', label: '背景の動画3（任意）', type: 'video',
        hint: '設定すると、2本目の動画の再生が終わった後に続けてこの動画が再生され、終わると写真に戻ります。空にすると2本目の後は写真に戻ります。',
        defaultValue: '/videos/chuzenji/hero-3.mp4',
      },
    ],
  },
  {
    section: 'イベント情報',
    fields: [
      { key: 'top_heading_events_banner', label: 'セクション見出し', hint: 'バナーの写真・リンク先・公開/非公開は「イベント情報」（/admin/chuzenji/events-banner）から編集してください。', defaultValue: 'イベント情報', translatable: true },
    ],
  },
  {
    section: 'お知らせ・SNS',
    fields: [
      { key: 'top_sns_heading',  label: 'SNSバナーの見出し', defaultValue: '公式SNSでも最新情報を発信中', translatable: true },
      { key: 'top_heading_news', label: '「お知らせ」見出し', defaultValue: 'お知らせ', translatable: true },
    ],
  },
  {
    section: '立木観音について',
    fields: [
      { key: 'top_heading_about', label: 'セクション見出し', defaultValue: '立木観音について', translatable: true },
      {
        key: 'top_about_cards', label: 'カード（歴史・拝観料金・境内案内・花ごよみ・年間行事の順、5件固定）', type: 'list',
        padToDefault: true,
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'desc', label: '説明' }],
        defaultValue: J([
          { label: '立木観音の歴史', desc: '歴史と縁起' },
          { label: '拝観料金', desc: '拝観料・各種料金' },
          { label: '境内のご案内', desc: '見どころ・境内マップ' },
          { label: '花ごよみ', desc: '四季折々の花' },
          { label: '年間行事', desc: '法要・行事のご案内' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { label: 'History of Tachiki Kannon', desc: 'History & origins' },
          { label: 'Admission Fees',            desc: 'Admission & other fees' },
          { label: 'Grounds Guide',             desc: 'Highlights & temple map' },
          { label: 'Flower Calendar',           desc: 'Seasonal flowers' },
          { label: 'Annual Events',             desc: 'Services & event information' },
        ]),
      },
    ],
  },
  {
    section: '近日の行事',
    fields: [
      { key: 'top_heading_events', label: 'セクション見出し', defaultValue: '近日の行事', translatable: true },
    ],
  },
  {
    section: '祈る・体験する',
    fields: [
      { key: 'top_heading_experience', label: '「体験する」セクション見出し', defaultValue: '体験する', translatable: true },
      {
        key: 'top_experience_cards', label: 'カード（1件目＝「祈る」の大きなカード＝御祈願、2〜5件目＝「体験する」の一覧＝数珠づくり・写経・写仏・坐禅の順、5件固定）', type: 'list',
        padToDefault: true,
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'sub', label: '価格・補足' }],
        defaultValue: J([
          { label: '御祈願', sub: '約40分/5,000円～' },
          { label: '数珠づくり体験', sub: '約30分~/2,000円〜' },
          { label: '写経体験', sub: '約15分 / 1,000円' },
          { label: '写仏体験', sub: '約15分/1,000円' },
          { label: '坐禅体験', sub: '約30分 / 2,000円' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { label: 'Prayer Service',           sub: 'Approx. 40 min / From ¥5,000' },
          { label: 'Juzu Bracelet Making',     sub: 'Approx. 30 min~ / From ¥2,000' },
          { label: 'Sutra Copying',            sub: 'Approx. 15 min / ¥1,000' },
          { label: 'Buddhist Image Tracing',   sub: 'Approx. 15 min / ¥1,000' },
          { label: 'Zazen Meditation',         sub: 'Approx. 30 min / ¥2,000' },
        ]),
      },
    ],
  },
  {
    section: '受ける',
    fields: [
      { key: 'top_heading_service', label: 'セクション見出し', defaultValue: '受ける', translatable: true },
      {
        key: 'top_service_cards', label: 'カード（御朱印・授与品通販の順、2件固定。授与品カードには通販サイト／代金引換の2ボタンを表示）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'text', label: '説明文', multiline: true }, { key: 'info', label: '価格・補足' }],
        defaultValue: J([
          { title: '御朱印', text: '中禅寺ならではの御朱印をお受けいただけます。書き入れのほか書き置きもございます。', info: '御朱印代：500円〜' },
          { title: '授与品・通販', text: 'お守り・お札など各種授与品をご用意しております。通販サイトのほか、代金引換でもお求めいただけます。', info: '通販サイト／代金引換からお選びいただけます' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Goshuin Stamps',    text: "Receive Chuzenji's own goshuin stamp, either hand-written or pre-inscribed.", info: 'From ¥500' },
          { title: 'Amulets & Mail Order', text: 'Omamori charms, ofuda tablets, and other items are available online or by cash-on-delivery order.', info: 'Choose online shop or cash-on-delivery' },
        ]),
      },
    ],
  },
  {
    section: '中禅寺ギャラリー',
    fields: [
      { key: 'top_heading_gallery', label: 'セクション見出し', hint: '写真・動画の中身は「ギャラリー管理」（/admin/chuzenji/gallery）から追加・編集してください。', defaultValue: '中禅寺ギャラリー', translatable: true },
    ],
  },
  {
    section: '過去の実績',
    fields: [
      { key: 'top_heading_records', label: 'セクション見出し', defaultValue: '過去の実績', hint: '記事の中身は「ブログ管理」から追加・編集してください。ここでは公開済みブログ記事の最新6件が自動で表示されます。', translatable: true },
    ],
  },
  {
    section: 'アクセス',
    fields: [
      { key: 'top_heading_access', label: 'セクション見出し', defaultValue: 'アクセス', translatable: true },
      { key: 'access_address', label: '住所', multiline: true, defaultValue: '〒321-1661\n栃木県日光市中宮祠2578', translatable: true },
      { key: 'access_car',     label: '車でのアクセス', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約40分\n（いろは坂経由）', translatable: true },
      { key: 'access_bus',     label: '電車・バスでのアクセス', multiline: true, defaultValue: '東武日光駅よりバスで約50分\n「中禅寺温泉」バス停より徒歩3分', translatable: true },
    ],
  },
]

export default function TopPageEditor() {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTargetKey = useRef<string | null>(null)

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

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const key = uploadTargetKey.current
    if (!file || !key) return
    setUploadingKey(key)
    const url = await uploadFile(file)
    if (url) setValues(v => ({ ...v, [key]: url }))
    setUploadingKey(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function triggerUpload(key: string, accept: string) {
    uploadTargetKey.current = key
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept
      fileInputRef.current.click()
    }
  }

  function renderMediaField(field: MediaField) {
    const current = values[field.key] || field.defaultValue
    return (
      <div className="space-y-2">
        {current && (
          field.type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt="" className="w-48 h-28 object-cover rounded-lg bg-gray-100" />
          ) : (
            <video src={current} className="w-48 h-28 object-cover rounded-lg bg-gray-100" muted controls />
          )
        )}
        <div className="flex gap-3 items-center flex-wrap">
          <button
            type="button"
            onClick={() => triggerUpload(field.key, field.type === 'image' ? 'image/*' : 'video/*')}
            disabled={uploadingKey === field.key}
            className="text-xs text-navy border border-navy rounded px-3 py-1.5 hover:bg-navy hover:text-white transition-colors disabled:opacity-50"
          >
            {uploadingKey === field.key ? 'アップロード中...' : field.type === 'image' ? '画像をアップロード' : '動画をアップロード'}
          </button>
          {field.type === 'video' && values[field.key] && (
            <button
              type="button"
              onClick={() => setValues(v => ({ ...v, [field.key]: '' }))}
              className="text-xs text-red-400 hover:text-red-600"
            >
              動画を削除（写真のみにする）
            </button>
          )}
        </div>
        <input
          type="text"
          className="admin-input text-xs"
          value={values[field.key] ?? ''}
          placeholder={field.defaultValue}
          onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
        />
      </div>
    )
  }

  useEffect(() => {
    const defaults: Record<string, string> = {}
    FIELDS.forEach(({ fields }) => fields.forEach(f => { if (f.defaultValue) defaults[f.key] = f.defaultValue }))
    supabase.from('site_content').select('key,value')
      .then(({ data }) => {
        const map: Record<string, string> = { ...defaults }
        data?.forEach(row => { if (row.value) map[row.key] = row.value })
        FIELDS.forEach(({ fields }) => fields.forEach(f => {
          if (f.type === 'list' && f.padToDefault) {
            map[f.key] = padListToDefault(map[f.key] ?? f.defaultValue, f.defaultValue)
            if (f.translatable) {
              const fallbackEn = f.defaultValueEn ?? '[]'
              map[`${f.key}_en`] = padListToDefault(map[`${f.key}_en`] ?? fallbackEn, fallbackEn)
            }
          }
        }))
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

      {uploadError && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3 mb-4">{uploadError}</p>
      )}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />

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
                  ) : field.type === 'image' ? (
                    renderMediaField(field)
                  ) : field.type === 'video' ? (
                    renderMediaField(field)
                  ) : 'multiline' in field && field.multiline ? (
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
                  {field.type === 'list' && field.translatable && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <label className="admin-label text-gray-400">英語訳（未入力の場合は日本語が表示されます）</label>
                      <ListEditor
                        value={values[`${field.key}_en`] ?? field.defaultValueEn ?? '[]'}
                        fields={field.listFields}
                        onChange={val => setValues(v => ({ ...v, [`${field.key}_en`]: val }))}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => save(`${field.key}_en`)}
                          disabled={saving === `${field.key}_en`}
                          className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                        >
                          {saving === `${field.key}_en` ? '保存中...' : saved === `${field.key}_en` ? '✓ 保存しました' : '保存'}
                        </button>
                      </div>
                    </div>
                  )}
                  {'translatable' in field && field.type !== 'list' && field.translatable && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <label className="admin-label text-gray-400">英語訳（未入力の場合は日本語が表示されます）</label>
                      {field.multiline ? (
                        <textarea
                          className="admin-input min-h-[80px]"
                          value={values[`${field.key}_en`] ?? ''}
                          onChange={e => setValues(v => ({ ...v, [`${field.key}_en`]: e.target.value }))}
                        />
                      ) : (
                        <input
                          type="text"
                          className="admin-input"
                          value={values[`${field.key}_en`] ?? ''}
                          onChange={e => setValues(v => ({ ...v, [`${field.key}_en`]: e.target.value }))}
                        />
                      )}
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => save(`${field.key}_en`)}
                          disabled={saving === `${field.key}_en`}
                          className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                        >
                          {saving === `${field.key}_en` ? '保存中...' : saved === `${field.key}_en` ? '✓ 保存しました' : '保存'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
