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

export default function FaqAdmin() {
  const supabase = createClient()
  const [items, setItems] = useState<FaqItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'faq_items').single()
      .then(({ data }) => {
        if (data?.value) {
          try { setItems(JSON.parse(data.value)) } catch { setItems(DEFAULT_FAQS) }
        } else {
          setItems(DEFAULT_FAQS)
        }
        setLoaded(true)
      })
  }, [])

  async function saveAll() {
    setSaving(true)
    await supabase.from('site_content').upsert({ key: 'faq_items', value: JSON.stringify(items) }, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

  if (!loaded) return <div className="p-8 text-gray-400">読み込み中...</div>

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">FAQ管理</h1>
      <p className="text-gray-500 text-sm mb-8">よくある質問の追加・編集・削除ができます。編集後は「すべて保存」を押してください。</p>

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

      <div className="flex gap-3">
        <button onClick={addItem} className="btn-outline text-sm px-5 py-2">+ 質問を追加</button>
        <button onClick={saveAll} disabled={saving} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
          {saving ? '保存中...' : saved ? '✓ 保存しました' : 'すべて保存'}
        </button>
      </div>
    </div>
  )
}
