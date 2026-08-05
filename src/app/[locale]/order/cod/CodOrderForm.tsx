'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { GoodsItem, CodOrderItem } from '@/types'

type Row = { key: number; goodsId: string; customName: string; quantity: number }

let rowKeySeq = 0
function newRow(): Row {
  return { key: rowKeySeq++, goodsId: '', customName: '', quantity: 1 }
}

export default function CodOrderForm() {
  const supabase = createClient()
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [goodsError, setGoodsError] = useState(false)
  const [loadingGoods, setLoadingGoods] = useState(true)
  const [rows, setRows] = useState<Row[]>([newRow()])
  const [form, setForm] = useState({
    name: '', name_kana: '', email: '', phone: '',
    postal_code: '', address: '', notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/goods/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setGoods(data.items)
        else setGoodsError(true)
      })
      .catch(() => setGoodsError(true))
      .finally(() => setLoadingGoods(false))
  }, [])

  function updateRow(key: number, patch: Partial<Row>) {
    setRows(rs => rs.map(r => r.key === key ? { ...r, ...patch } : r))
  }
  function addRow() {
    setRows(rs => [...rs, newRow()])
  }
  function removeRow(key: number) {
    setRows(rs => rs.length > 1 ? rs.filter(r => r.key !== key) : rs)
  }

  function resolveItem(r: Row): CodOrderItem | null {
    if (r.goodsId === '__other__') {
      if (!r.customName.trim()) return null
      return { name: r.customName.trim(), price: 0, quantity: r.quantity }
    }
    const g = goods.find(g => g.id === r.goodsId)
    if (!g) return null
    return { name: g.name, price: g.price, quantity: r.quantity }
  }

  const items = rows.map(resolveItem).filter((it): it is CodOrderItem => it !== null)
  const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      setErrorMsg('授与物を1点以上選択してください。')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    const payload = {
      ...form,
      items,
      total_amount: totalAmount,
      status: 'unconfirmed' as const,
    }
    const { data, error } = await supabase.from('cod_orders').insert(payload).select('id').single()
    if (error) { setStatus('error'); setErrorMsg('送信に失敗しました。しばらく経ってから再度お試しください。'); return }

    await fetch('/api/notify/cod-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, id: data?.id }),
    }).catch(() => {})

    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🙏</p>
        <h1 className="text-2xl font-serif text-navy mb-3">お申し込みを受け付けました</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          代金引換にて発送いたします。到着まで今しばらくお待ちください。<br />
          内容確認のご連絡をする場合がございます。
        </p>
      </div>
    </main>
  )

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <nav className="text-xs text-gray-400 mb-6">
          <a href="/">ホーム</a> &gt; 授与品・通販 &gt; 代金引換でのお申し込み
        </nav>
        <h1 className="text-3xl font-serif text-navy mb-1">代金引換でのお申し込み</h1>
        <p className="text-gray-500 text-sm mb-8">
          授与品を代金引換（着払い）でお送りします。商品代金と送料は配達員へお支払いください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 授与物選択 */}
          <div>
            <label className="admin-label">ご希望の授与物</label>
            {goodsError && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2 mb-2">
                商品一覧の取得に失敗しました。お手数ですが「その他（商品名を入力）」からご希望の授与物名をご記入ください。
              </p>
            )}
            <div className="space-y-2">
              {rows.map(r => (
                <div key={r.key} className="flex gap-2 items-start">
                  <select
                    required
                    className="admin-input flex-1"
                    disabled={loadingGoods}
                    value={r.goodsId}
                    onChange={e => updateRow(r.key, { goodsId: e.target.value })}
                  >
                    <option value="" disabled>{loadingGoods ? '読み込み中...' : '選択してください'}</option>
                    {goods.map(g => (
                      <option key={g.id} value={g.id}>{g.name}（¥{g.price.toLocaleString()}）</option>
                    ))}
                    <option value="__other__">その他（商品名を入力）</option>
                  </select>
                  <input type="number" min={1} required className="admin-input w-16 flex-shrink-0"
                    value={r.quantity}
                    onChange={e => updateRow(r.key, { quantity: Number(e.target.value) })} />
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(r.key)}
                      className="text-red-400 hover:text-red-600 text-xs px-2 py-2.5 flex-shrink-0">削除</button>
                  )}
                </div>
              ))}
              {rows.some(r => r.goodsId === '__other__') && (
                <div className="space-y-2">
                  {rows.filter(r => r.goodsId === '__other__').map(r => (
                    <input key={r.key} className="admin-input" placeholder="商品名をご記入ください"
                      value={r.customName} onChange={e => updateRow(r.key, { customName: e.target.value })} />
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={addRow} className="text-navy text-xs underline mt-2">＋ 商品を追加</button>
            {totalAmount > 0 && (
              <p className="text-sm text-gold font-medium mt-3">商品代金合計：¥{totalAmount.toLocaleString()}（送料別途）</p>
            )}
          </div>

          {/* 氏名 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">お名前</label>
              <input required className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">フリガナ</label>
              <input required className="admin-input" value={form.name_kana} onChange={e => setForm({ ...form, name_kana: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">メールアドレス</label>
            <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">電話番号</label>
            <input type="tel" required className="admin-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">郵便番号</label>
            <input required className="admin-input w-40" placeholder="例：321-1661" value={form.postal_code}
              onChange={e => setForm({ ...form, postal_code: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">ご住所</label>
            <input required className="admin-input" placeholder="都道府県から番地・建物名までご記入ください"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">備考（任意）</label>
            <textarea className="admin-input min-h-[80px]" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full text-center disabled:opacity-50">
            {status === 'loading' ? '送信中...' : '代金引換で申し込む'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            商品代金・送料は商品お届け時に配達員へお支払いください。
          </p>
        </form>
      </div>
    </main>
  )
}
