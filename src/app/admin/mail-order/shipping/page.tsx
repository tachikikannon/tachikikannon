'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { SHIPPING_TABLE_KEY, parseShippingTable, sortShippingTable, type ShippingTier } from '@/lib/shipping'

type Row = ShippingTier & { key: number }

let rowKeySeq = 0
function toRow(t: ShippingTier): Row {
  return { ...t, key: rowKeySeq++ }
}

export default function ShippingTableAdmin() {
  const supabase = createClient()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', SHIPPING_TABLE_KEY).maybeSingle()
      .then(({ data }) => {
        setRows(parseShippingTable(data?.value).map(toRow))
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addRow() {
    setRows(rs => [...rs, toRow({ max_weight_g: null, price: 0 })])
  }
  function removeRow(key: number) {
    setRows(rs => rs.filter(r => r.key !== key))
  }
  function updateRow(key: number, patch: Partial<ShippingTier>) {
    setRows(rs => rs.map(r => r.key === key ? { ...r, ...patch } : r))
  }

  async function save() {
    setSaving(true)
    const tiers: ShippingTier[] = sortShippingTable(rows.map(({ key, ...t }) => { void key; return t }))
    await supabase.from('site_content').upsert({ key: SHIPPING_TABLE_KEY, value: JSON.stringify(tiers) }, { onConflict: 'key' })
    setRows(tiers.map(toRow))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">送料テーブル設定</h1>
      <p className="text-gray-500 text-sm mb-6">
        授与品・通販（代金引換）の合計重量に応じた送料です。「上限重量」は、注文の合計重量がその値以下（g）ならその送料を適用します。一番重い区分は上限重量を空欄にすると「それ以上は全てこの送料」という上限なしの区分にできます。
      </p>

      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        {rows.length === 0 && !loading && (
          <p className="text-sm text-gray-400 text-center py-6">まだ区分がありません。「区分を追加」から作成してください。</p>
        )}
        {rows.map((r, i) => (
          <div key={r.key} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6 flex-shrink-0">{i + 1}</span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number" min={1} step={1}
                className="admin-input"
                placeholder="上限なし"
                value={r.max_weight_g ?? ''}
                onChange={e => updateRow(r.key, { max_weight_g: e.target.value === '' ? null : Number(e.target.value) })}
              />
              <span className="text-xs text-gray-400 flex-shrink-0">g まで</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-gray-400 flex-shrink-0">¥</span>
              <input
                type="number" min={0} step={1}
                className="admin-input"
                value={r.price}
                onChange={e => updateRow(r.key, { price: Number(e.target.value) })}
              />
            </div>
            <button type="button" onClick={() => removeRow(r.key)}
              className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">削除</button>
          </div>
        ))}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <button type="button" onClick={addRow}
            className="text-xs px-3 py-1.5 rounded border border-navy text-navy hover:bg-navy hover:text-white transition-colors">
            ＋ 区分を追加
          </button>
          <button type="button" onClick={save} disabled={saving}
            className="btn-primary text-sm px-5 py-2 disabled:opacity-50">
            {saving ? '保存中...' : saved ? '✓ 保存しました' : '保存'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        例：500gまで ¥800／1,000gまで ¥1,000／上限なし ¥1,300、のように軽い順に並べます（保存時に自動で並び替えます）。商品ごとの重量は「商品重量設定」で登録してください。
      </p>
    </div>
  )
}
