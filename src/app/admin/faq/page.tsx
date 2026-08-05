'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type FaqItem = { q: string; a: string }

const DEFAULT_FAQS: FaqItem[] = [
  { q: '拝観時間を教えてください。', a: '4月〜11月は8:00〜17:00、12月〜3月は9:00〜16:00です。受付は閉門30分前までとなります。' },
  { q: '拝観料はいくらですか？', a: '大人500円、子供200円です。' },
  { q: '御祈願の予約は必要ですか？', a: '事前予約をお勧めしております。当日受付も可能な場合がありますが、混雑時はお断りする場合がございます。' },
  { q: '写経・写仏・数珠づくり体験の予約方法を教えてください。', a: 'ウェブサイトの「体験のご予約はこちら」よりオンラインでご予約いただけます。' },
  { q: '駐車場はありますか？', a: '中禅寺温泉周辺の有料駐車場をご利用ください。春・秋の観光シーズンはいろは坂が渋滞します。公共交通機関のご利用をお勧めします。' },
  { q: '御朱印はいただけますか？', a: 'はい、書き入れと書き置きをご用意しております。拝観時間内にお声がけください。' },
  { q: 'ベビーカーや車椅子での参拝はできますか？', a: '境内は段差がある箇所もございます。詳しくは事前にお問い合わせください。' },
  { q: 'お守り・授与品の通販はできますか？', a: 'はい、公式通販サイト（chuzenji.official.ec）にてお求めいただけます。' },
]
const DEFAULT_FAQS_EN: FaqItem[] = [
  { q: 'What are the visiting hours?', a: 'April–November: 8:00 AM–5:00 PM. December–March: 9:00 AM–4:00 PM. Reception closes 30 minutes before closing.' },
  { q: 'What is the admission fee?', a: '¥500 for adults, ¥200 for children.' },
  { q: 'Is a reservation required for prayer services?', a: 'Reservations are recommended. Same-day reception may be possible, but may be declined during busy periods.' },
  { q: 'How do I reserve the sutra-copying, Buddha-tracing, or juzu-making experiences?', a: 'You can reserve online via the "Reserve an Experience" link on the website.' },
  { q: 'Is parking available?', a: 'Please use one of the paid parking lots around Chuzenji-Onsen. Irohazaka gets congested during spring and autumn — public transport is recommended.' },
  { q: 'Can I receive a goshuin stamp?', a: 'Yes, both hand-written and pre-inscribed stamps are available. Please ask during visiting hours.' },
  { q: 'Can I visit with a stroller or wheelchair?', a: 'Some areas of the grounds have steps. Please contact us in advance for details.' },
  { q: 'Can I order amulets or other items online?', a: 'Yes, they are available through our official online shop (chuzenji.official.ec).' },
]

const TEXT_FIELDS = [
  { key: 'faq_subtitle', label: '見出し（英字サブタイトル）', defaultValue: 'FAQ' },
  { key: 'faq_heading', label: 'ページ見出し', defaultValue: 'よくある質問', translatable: true },
  { key: 'faq_bottom_text', label: '末尾の案内文', defaultValue: '解決しない場合はお気軽にお問い合わせください。', translatable: true },
  { key: 'faq_cta_label', label: 'お問い合わせボタンの文言', defaultValue: 'お問い合わせはこちら', translatable: true },
] as const

export default function FaqAdmin() {
  const supabase = createClient()
  const [items, setItems] = useState<FaqItem[]>([])
  const [itemsEn, setItemsEn] = useState<FaqItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingEn, setSavingEn] = useState(false)
  const [savedEn, setSavedEn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [textSaving, setTextSaving] = useState<string | null>(null)
  const [textSaved, setTextSaved] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_content').select('key,value').then(({ data }) => {
      const faqRow = data?.find(r => r.key === 'faq_items')
      if (faqRow?.value) {
        try { setItems(JSON.parse(faqRow.value)) } catch { setItems(DEFAULT_FAQS) }
      } else {
        setItems(DEFAULT_FAQS)
      }
      const faqRowEn = data?.find(r => r.key === 'faq_items_en')
      if (faqRowEn?.value) {
        try { setItemsEn(JSON.parse(faqRowEn.value)) } catch { setItemsEn(DEFAULT_FAQS_EN) }
      } else {
        setItemsEn(DEFAULT_FAQS_EN)
      }
      const defaults: Record<string, string> = {}
      TEXT_FIELDS.forEach(f => { defaults[f.key] = f.defaultValue })
      const map = { ...defaults }
      data?.forEach(row => { if (row.value && row.key !== 'faq_items' && row.key !== 'faq_items_en') map[row.key] = row.value })
      setTexts(map)
      setLoaded(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function saveAll() {
    setSaving(true)
    await supabase.from('site_content').upsert({ key: 'faq_items', value: JSON.stringify(items) }, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveAllEn() {
    setSavingEn(true)
    await supabase.from('site_content').upsert({ key: 'faq_items_en', value: JSON.stringify(itemsEn) }, { onConflict: 'key' })
    setSavingEn(false)
    setSavedEn(true)
    setTimeout(() => setSavedEn(false), 2000)
  }

  async function saveText(key: string) {
    setTextSaving(key)
    await supabase.from('site_content').upsert({ key, value: texts[key] ?? '' }, { onConflict: 'key' })
    setTextSaving(null)
    setTextSaved(key)
    setTimeout(() => setTextSaved(null), 2000)
  }

  function update(i: number, field: 'q' | 'a', val: string) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { q: '', a: '' }])
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function moveUp(i: number) {
    if (i === 0) return
    setItems(prev => { const arr = [...prev]; [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; return arr })
  }

  function moveDown(i: number) {
    if (i === items.length - 1) return
    setItems(prev => { const arr = [...prev]; [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; return arr })
  }

  function updateEn(i: number, field: 'q' | 'a', val: string) {
    setItemsEn(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  function addItemEn() {
    setItemsEn(prev => [...prev, { q: '', a: '' }])
  }

  function removeItemEn(i: number) {
    setItemsEn(prev => prev.filter((_, idx) => idx !== i))
  }

  function moveUpEn(i: number) {
    if (i === 0) return
    setItemsEn(prev => { const arr = [...prev]; [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; return arr })
  }

  function moveDownEn(i: number) {
    if (i === itemsEn.length - 1) return
    setItemsEn(prev => { const arr = [...prev]; [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; return arr })
  }

  if (!loaded) return <div className="p-8 text-gray-400">読み込み中...</div>

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">FAQ管理</h1>
      <p className="text-gray-500 text-sm mb-8">よくある質問の追加・編集・削除ができます。編集後は「すべて保存」を押してください。</p>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 mb-8">
        {TEXT_FIELDS.map(field => (
          <div key={field.key}>
            <label className="admin-label">{field.label}</label>
            <input
              type="text"
              className="admin-input"
              value={texts[field.key] ?? ''}
              placeholder={field.defaultValue}
              onChange={e => setTexts(v => ({ ...v, [field.key]: e.target.value }))}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => saveText(field.key)}
                disabled={textSaving === field.key}
                className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
              >
                {textSaving === field.key ? '保存中...' : textSaved === field.key ? '✓ 保存しました' : '保存'}
              </button>
            </div>
            {'translatable' in field && field.translatable && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <label className="admin-label text-gray-400">英語訳（未入力の場合は日本語が表示されます）</label>
                <input
                  type="text"
                  className="admin-input"
                  value={texts[`${field.key}_en`] ?? ''}
                  onChange={e => setTexts(v => ({ ...v, [`${field.key}_en`]: e.target.value }))}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => saveText(`${field.key}_en`)}
                    disabled={textSaving === `${field.key}_en`}
                    className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                  >
                    {textSaving === `${field.key}_en` ? '保存中...' : textSaved === `${field.key}_en` ? '✓ 保存しました' : '保存'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-sm font-medium text-gray-500 tracking-widest mb-3 uppercase">質問と回答（日本語）</h2>
      <div className="space-y-4 mb-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">Q{i + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => moveUp(i)} className="text-gray-400 hover:text-navy px-2 py-1 text-xs">↑</button>
                <button onClick={() => moveDown(i)} className="text-gray-400 hover:text-navy px-2 py-1 text-xs">↓</button>
                <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 px-2 py-1 text-xs">削除</button>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                className="admin-input"
                placeholder="質問"
                value={item.q}
                onChange={e => update(i, 'q', e.target.value)}
              />
              <textarea
                className="admin-input min-h-[70px]"
                placeholder="回答"
                value={item.a}
                onChange={e => update(i, 'a', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-10">
        <button onClick={addItem} className="btn-outline text-sm px-5 py-2">+ 質問を追加</button>
        <button onClick={saveAll} disabled={saving} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
          {saving ? '保存中...' : saved ? '✓ 保存しました' : 'すべて保存'}
        </button>
      </div>

      <h2 className="text-sm font-medium text-gray-500 tracking-widest mb-3 uppercase">質問と回答（英語訳・未入力の場合は日本語が表示されます）</h2>
      <div className="space-y-4 mb-6">
        {itemsEn.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">Q{i + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => moveUpEn(i)} className="text-gray-400 hover:text-navy px-2 py-1 text-xs">↑</button>
                <button onClick={() => moveDownEn(i)} className="text-gray-400 hover:text-navy px-2 py-1 text-xs">↓</button>
                <button onClick={() => removeItemEn(i)} className="text-red-400 hover:text-red-600 px-2 py-1 text-xs">削除</button>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                className="admin-input"
                placeholder="Question"
                value={item.q}
                onChange={e => updateEn(i, 'q', e.target.value)}
              />
              <textarea
                className="admin-input min-h-[70px]"
                placeholder="Answer"
                value={item.a}
                onChange={e => updateEn(i, 'a', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={addItemEn} className="btn-outline text-sm px-5 py-2">+ Add Question</button>
        <button onClick={saveAllEn} disabled={savingEn} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
          {savingEn ? '保存中...' : savedEn ? '✓ 保存しました' : 'すべて保存'}
        </button>
      </div>
    </div>
  )
}
