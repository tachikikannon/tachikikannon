'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { GOODS_WEIGHTS_KEY, parseGoodsWeights, type GoodsWeights } from '@/lib/shipping'
import type { GoodsItem } from '@/types'

export default function GoodsWeightsAdmin() {
  const supabase = createClient()
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [goodsError, setGoodsError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [weights, setWeights] = useState<GoodsWeights>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/goods/list').then(res => res.json()).catch(() => ({ ok: false, items: [] })),
      supabase.from('site_content').select('value').eq('key', GOODS_WEIGHTS_KEY).maybeSingle(),
    ]).then(([goodsRes, weightsRes]) => {
      if (goodsRes.ok) setGoods(goodsRes.items)
      else setGoodsError(true)
      setWeights(parseGoodsWeights(weightsRes.data?.value))
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function saveWeight(id: string, value: string) {
    const grams = value.trim() === '' ? undefined : Number(value)
    const next = { ...weights }
    if (grams == null || !Number.isFinite(grams) || grams <= 0) delete next[id]
    else next[id] = grams
    setWeights(next)
    setSavingId(id)
    await supabase.from('site_content').upsert({ key: GOODS_WEIGHTS_KEY, value: JSON.stringify(next) }, { onConflict: 'key' })
    setSavingId(null)
    setSavedId(id)
    setTimeout(() => setSavedId(null), 1500)
  }

  const missingCount = goods.filter(g => !weights[g.id]).length

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-serif text-navy mb-1">商品重量設定</h1>
      <p className="text-gray-500 text-sm mb-6">
        授与品・通販（代金引換）の送料自動計算に使う、商品ごとの重量です。BASE（chuzenji.official.ec）は重量情報を持っていないため、ここで1点ずつ入力してください。未入力の商品は送料計算の対象外になります。
      </p>

      {goodsError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
          BASEの商品一覧を取得できませんでした。時間をおいて再度開いてください。
        </p>
      )}

      {!loading && !goodsError && missingCount > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 mb-4">
          重量未設定の商品が{missingCount}件あります。
        </p>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500">商品名</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500">価格</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 w-40">重量（g）</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {goods.map(g => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{g.name}</td>
                <td className="px-4 py-3 text-gray-500">¥{g.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={1} step={1}
                      className="admin-input w-24"
                      placeholder="未設定"
                      defaultValue={weights[g.id] ?? ''}
                      onBlur={e => saveWeight(g.id, e.target.value)}
                    />
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {savingId === g.id ? '保存中...' : savedId === g.id ? '✓ 保存しました' : ''}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400 text-sm">読み込み中...</td></tr>
            )}
            {!loading && !goodsError && goods.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400 text-sm">商品がありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
