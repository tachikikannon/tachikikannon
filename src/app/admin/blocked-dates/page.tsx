'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type BlockedDate = {
  id: string
  date: string
  reason: string
  type: string
  created_at: string
}

const TYPE_LABELS: Record<string, string> = {
  all:     '全種別',
  prayer:  '護摩祈願のみ',
  shakyou: '写経のみ',
  shabutu: '写仏のみ',
  jyuzu:   '数珠づくりのみ',
}

export default function BlockedDatesPage() {
  const supabase = createClient()
  const [list, setList] = useState<BlockedDate[]>([])
  const [form, setForm] = useState({ date: '', reason: '', type: 'all' })
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('date', { ascending: true })
    setList(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function add() {
    if (!form.date) return
    setLoading(true)
    await supabase.from('blocked_dates').insert(form)
    setForm({ date: '', reason: '', type: 'all' })
    setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('この日程を削除しますか？')) return
    await supabase.from('blocked_dates').delete().eq('id', id)
    load()
  }

  // 過去の日付と未来の日付を分ける
  const today = new Date().toISOString().split('T')[0]
  const upcoming = list.filter(d => d.date >= today)
  const past = list.filter(d => d.date < today)

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-serif text-navy mb-2">予約不可日の管理</h1>
      <p className="text-sm text-gray-500 mb-8">法要・行事などで予約を受け付けない日を登録します。登録した日は予約フォームで選択できなくなります。</p>

      {/* 追加フォーム */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-medium text-navy mb-4">予約不可日を追加</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="admin-label">日付 <span className="text-red-400">*</span></label>
            <input type="date" className="admin-input"
              min={today}
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">種別</label>
            <select className="admin-input" value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}>
              {Object.entries(TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">理由（任意）</label>
            <input className="admin-input" placeholder="例：大般若法要のため"
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })} />
          </div>
        </div>
        <button onClick={add} disabled={loading || !form.date}
          className="btn-primary text-sm px-5 py-2 disabled:opacity-40">
          {loading ? '追加中...' : '＋ 追加する'}
        </button>
      </div>

      {/* 今後の不可日 */}
      <section className="mb-8">
        <h2 className="font-medium text-navy mb-3">今後の予約不可日（{upcoming.length}件）</h2>
        {upcoming.length > 0 ? (
          <div className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-100">
            {upcoming.map(d => (
              <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-28 flex-shrink-0">
                  <time className="font-medium text-navy text-sm">
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' })}
                  </time>
                </div>
                <span className="text-xs bg-red-100 text-red-700 rounded px-2 py-0.5 flex-shrink-0">
                  {TYPE_LABELS[d.type] ?? d.type}
                </span>
                <span className="text-sm text-gray-600 flex-1">{d.reason || '—'}</span>
                <button onClick={() => remove(d.id)}
                  className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">削除</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm shadow">
            登録された予約不可日はありません
          </div>
        )}
      </section>

      {/* 過去の不可日 */}
      {past.length > 0 && (
        <section>
          <h2 className="font-medium text-gray-400 mb-3 text-sm">過去の予約不可日（{past.length}件）</h2>
          <div className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-100 opacity-60">
            {past.slice(-5).reverse().map(d => (
              <div key={d.id} className="flex items-center gap-4 px-5 py-3">
                <time className="text-sm text-gray-500 w-28 flex-shrink-0">
                  {new Date(d.date + 'T00:00:00').toLocaleDateString('ja-JP', { month:'long', day:'numeric' })}
                </time>
                <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 flex-shrink-0">
                  {TYPE_LABELS[d.type] ?? d.type}
                </span>
                <span className="text-sm text-gray-400 flex-1">{d.reason || '—'}</span>
                <button onClick={() => remove(d.id)} className="text-gray-300 hover:text-red-400 text-xs">削除</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
