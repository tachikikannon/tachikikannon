'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import {
  GOODS_WEIGHTS_KEY, SHIPPING_TABLE_KEY,
  parseGoodsWeights, parseShippingTable, calcOrderShippingFee,
  type GoodsWeights, type ShippingTier,
} from '@/lib/shipping'
import type { GoodsItem, CodOrderItem } from '@/types'

type Row = { key: number; goodsId: string; customName: string; quantity: number }

let rowKeySeq = 0
function newRow(): Row {
  return { key: rowKeySeq++, goodsId: '', customName: '', quantity: 1 }
}

export default function CodOrderForm() {
  const supabase = createClient()
  const t = useTranslations('codOrder')
  const tc = useTranslations('common')
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [goodsError, setGoodsError] = useState(false)
  const [loadingGoods, setLoadingGoods] = useState(true)
  const [weights, setWeights] = useState<GoodsWeights>({})
  const [shippingTiers, setShippingTiers] = useState<ShippingTier[]>([])
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

    supabase.from('site_content').select('key,value')
      .in('key', [GOODS_WEIGHTS_KEY, SHIPPING_TABLE_KEY])
      .then(({ data }) => {
        const weightsRow = data?.find(r => r.key === GOODS_WEIGHTS_KEY)
        const shippingRow = data?.find(r => r.key === SHIPPING_TABLE_KEY)
        setWeights(parseGoodsWeights(weightsRow?.value))
        setShippingTiers(parseShippingTable(shippingRow?.value))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const resolvedRows = rows
    .map(r => ({ row: r, item: resolveItem(r) }))
    .filter((x): x is { row: Row; item: CodOrderItem } => x.item !== null)
  const items = resolvedRows.map(x => x.item)
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0)
  const cart = resolvedRows.map(x => ({ goodsId: x.row.goodsId, quantity: x.row.quantity }))
  const shippingFee = calcOrderShippingFee(cart, weights, shippingTiers)
  const totalAmount = subtotal + (shippingFee ?? 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      setErrorMsg(t('itemsRequiredError'))
      return
    }
    setStatus('loading')
    setErrorMsg('')

    const payload = {
      ...form,
      items,
      total_amount: totalAmount,
      shipping_fee: shippingFee ?? 0,
      status: 'unconfirmed' as const,
    }
    const { data, error } = await supabase.from('cod_orders').insert(payload).select('id').single()
    if (error) { setStatus('error'); setErrorMsg(t('submitError')); return }

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
        <h1 className="text-2xl font-serif text-navy mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t('doneText')}
        </p>
      </div>
    </main>
  )

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('breadcrumbGoods')} &gt; {t('title')}
        </nav>
        <h1 className="text-3xl font-serif text-navy mb-1">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">
          {t('intro')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 授与物選択 */}
          <div>
            <label className="admin-label">{t('itemsLabel')}</label>
            {goodsError && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2 mb-2">
                {t('goodsErrorNote')}
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
                    <option value="" disabled>{loadingGoods ? t('loading') : t('selectPlaceholder')}</option>
                    {goods.map(g => (
                      <option key={g.id} value={g.id}>{g.name}（¥{g.price.toLocaleString()}）</option>
                    ))}
                    <option value="__other__">{t('otherOption')}</option>
                  </select>
                  <input type="number" min={1} required className="admin-input w-16 flex-shrink-0"
                    value={r.quantity}
                    onChange={e => updateRow(r.key, { quantity: Number(e.target.value) })} />
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(r.key)}
                      className="text-red-400 hover:text-red-600 text-xs px-2 py-2.5 flex-shrink-0">{t('remove')}</button>
                  )}
                </div>
              ))}
              {rows.some(r => r.goodsId === '__other__') && (
                <div className="space-y-2">
                  {rows.filter(r => r.goodsId === '__other__').map(r => (
                    <input key={r.key} className="admin-input" placeholder={t('otherPlaceholder')}
                      value={r.customName} onChange={e => updateRow(r.key, { customName: e.target.value })} />
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={addRow} className="text-navy text-xs underline mt-2">{t('addItem')}</button>
            {subtotal > 0 && (
              <div className="text-sm mt-3 space-y-1">
                <p className="text-gray-600">{t('subtotalLabel')}¥{subtotal.toLocaleString()}</p>
                <p className="text-gray-600">
                  {t('shippingFeeLabel')}
                  {shippingFee !== null ? `¥${shippingFee.toLocaleString()}` : t('shippingUnknownNote')}
                </p>
                <p className="text-gold font-medium">
                  {t('grandTotalLabel')}¥{totalAmount.toLocaleString()}
                  {shippingFee === null && t('shippingUnknownSuffix')}
                </p>
              </div>
            )}
          </div>

          {/* 氏名 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">{t('nameLabel')}</label>
              <input required className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">{t('nameKanaLabel')}</label>
              <input required className="admin-input" value={form.name_kana} onChange={e => setForm({ ...form, name_kana: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">{t('emailLabel')}</label>
            <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('phoneLabel')}</label>
            <input type="tel" required className="admin-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('postalLabel')}</label>
            <input required className="admin-input w-40" placeholder={t('postalPlaceholder')} value={form.postal_code}
              onChange={e => setForm({ ...form, postal_code: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('addressLabel')}</label>
            <input required className="admin-input" placeholder={t('addressPlaceholder')}
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('notesLabel')}</label>
            <textarea className="admin-input min-h-[80px]" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full text-center disabled:opacity-50">
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
          <p className="text-xs text-gray-400 text-center">
            {t('submitNote')}
          </p>
        </form>
      </div>
    </main>
  )
}
