'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import { getTimeSlots, blockedDateMatchesType, nowInJST, toDateStr, getMonday } from '@/lib/reservationSlots'
import type { ReservationType, SlotOverride } from '@/types'

const TYPES: { value: ReservationType; label: string }[] = [
  { value: 'prayer',  label: '護摩祈願' },
  { value: 'shakyou', label: '写経' },
  { value: 'shabutu', label: '写仏' },
  { value: 'jyuzu',   label: '数珠づくり' },
  { value: 'zazen',   label: '坐禅' },
]

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

type BlockedDate = { date: string; type: string; reason: string }
type Reservation = { date: string; time_slot: string; party_size: number }
type CapacitySetting = { max_groups: number; max_people: number }

export default function AvailabilityPage() {
  const supabase = createClient()
  const { canEditReservations: canEdit } = useAdminProfile()
  const today = nowInJST()
  today.setUTCHours(0, 0, 0, 0)

  const [type, setType] = useState<ReservationType>('prayer')
  const [weekStart, setWeekStart] = useState(() => getMonday(today))
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [capacity, setCapacity] = useState<CapacitySetting | null>(null)
  const [overrides, setOverrides] = useState<SlotOverride[]>([])
  const [selected, setSelected] = useState<{ date: string; slot: string } | null>(null)
  const [form, setForm] = useState({ is_closed: false, max_groups: '', max_people: '', reserved_groups: '', reserved_people: '', note: '' })
  const [saving, setSaving] = useState(false)

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setUTCDate(weekStart.getUTCDate() + i)
    return d
  }), [weekStart])

  async function load() {
    const from = toDateStr(weekDays[0])
    const to = toDateStr(weekDays[6])

    const [{ data: bd }, { data: rs }, { data: cap }, { data: ov }] = await Promise.all([
      supabase.from('blocked_dates').select('date,type,reason').gte('date', from).lte('date', to),
      supabase.from('reservations').select('date,time_slot,party_size').eq('type', type).gte('date', from).lte('date', to),
      supabase.from('capacity_settings').select('max_groups,max_people').eq('type', type).single(),
      supabase.from('slot_overrides').select('*').eq('type', type).gte('date', from).lte('date', to),
    ])
    setBlockedDates(bd ?? [])
    setReservations(rs ?? [])
    setCapacity(cap ?? { max_groups: 5, max_people: 20 })
    setOverrides((ov ?? []) as SlotOverride[])
  }

  useEffect(() => { load(); setSelected(null) }, [weekStart, type]) // eslint-disable-line react-hooks/exhaustive-deps

  function isDateBlocked(dateStr: string) {
    return blockedDates.find(b => b.date === dateStr && blockedDateMatchesType(b.type, type)) ?? null
  }

  function getOverride(dateStr: string, slot: string) {
    return overrides.find(o => o.date === dateStr && o.time_slot === slot) ?? null
  }

  function getCounts(dateStr: string, slot: string) {
    const list = reservations.filter(r => r.date === dateStr && r.time_slot === slot)
    return {
      groups: list.length,
      people: list.reduce((sum, r) => sum + (r.party_size ?? 1), 0),
    }
  }

  function openCell(dateStr: string, slot: string) {
    setSelected({ date: dateStr, slot })
    const ov = getOverride(dateStr, slot)
    setForm({
      is_closed: ov?.is_closed ?? false,
      max_groups: ov?.max_groups != null ? String(ov.max_groups) : '',
      max_people: ov?.max_people != null ? String(ov.max_people) : '',
      reserved_groups: ov?.reserved_groups != null ? String(ov.reserved_groups) : '',
      reserved_people: ov?.reserved_people != null ? String(ov.reserved_people) : '',
      note: ov?.note ?? '',
    })
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    await supabase.from('slot_overrides').upsert({
      type,
      date: selected.date,
      time_slot: selected.slot,
      is_closed: form.is_closed,
      max_groups: form.max_groups === '' ? null : Number(form.max_groups),
      max_people: form.max_people === '' ? null : Number(form.max_people),
      reserved_groups: form.reserved_groups === '' ? null : Number(form.reserved_groups),
      reserved_people: form.reserved_people === '' ? null : Number(form.reserved_people),
      note: form.note || null,
    }, { onConflict: 'type,date,time_slot' })
    setSaving(false)
    await load()
    setSelected(null)
  }

  async function resetToDefault() {
    if (!selected) return
    setSaving(true)
    await supabase.from('slot_overrides').delete()
      .eq('type', type).eq('date', selected.date).eq('time_slot', selected.slot)
    setSaving(false)
    await load()
    setSelected(null)
  }

  function prevWeek() { const d = new Date(weekStart); d.setUTCDate(d.getUTCDate() - 7); setWeekStart(d) }
  function nextWeek() { const d = new Date(weekStart); d.setUTCDate(d.getUTCDate() + 7); setWeekStart(d) }
  function goThisWeek() { setWeekStart(getMonday(today)) }

  const slots = Array.from(new Set(weekDays.flatMap(d => getTimeSlots(type, d.getUTCMonth() + 1))))
  const selectedOverride = selected ? getOverride(selected.date, selected.slot) : null
  const selectedCounts = selected ? getCounts(selected.date, selected.slot) : null
  const selectedBlocked = selected ? isDateBlocked(selected.date) : null

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif text-navy mb-1">空き状況の詳細設定</h1>
      <p className="text-sm text-gray-500 mb-6">
        マスをクリックすると、その日・その時間帯だけの定員変更や受付停止を設定できます。未設定のマスは「定員設定」の値がそのまま適用されます。
      </p>

      {/* 種別タブ */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TYPES.map(t => (
          <button key={t.value} onClick={() => setType(t.value)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors
              ${type === t.value ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200 hover:border-navy/40'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 週ナビ */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevWeek} className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:border-navy transition-colors">← 前の1週間</button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{weekDays[0].getUTCMonth() + 1}/{weekDays[0].getUTCDate()} 〜 {weekDays[6].getUTCMonth() + 1}/{weekDays[6].getUTCDate()}</span>
          <button onClick={goThisWeek} className="text-xs px-2.5 py-1 border border-gray-200 rounded hover:border-navy transition-colors">今週</button>
        </div>
        <button onClick={nextWeek} className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:border-navy transition-colors">次の1週間 →</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        {/* グリッド */}
        <div className="lg:col-span-2 overflow-x-auto bg-white rounded-xl shadow p-3">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-16 border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500">時間</th>
                {weekDays.map(d => {
                  const dateStr = toDateStr(d)
                  const dow = d.getUTCDay()
                  const isToday = dateStr === toDateStr(today)
                  return (
                    <th key={dateStr} className={`border border-gray-200 px-1 py-2 text-center ${isToday ? 'bg-gold/10' : 'bg-gray-50'}`}>
                      <div className={`text-xs font-medium ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'}`}>{DAY_LABELS[dow]}</div>
                      <div className={`text-base font-bold ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-navy'}`}>{d.getUTCDate()}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot}>
                  <td className="border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500 text-center whitespace-nowrap">{slot}</td>
                  {weekDays.map(d => {
                    const dateStr = toDateStr(d)
                    const validSlots = getTimeSlots(type, d.getUTCMonth() + 1)
                    if (!validSlots.includes(slot)) {
                      return <td key={dateStr} className="border border-gray-200 bg-gray-50" />
                    }
                    const blocked = isDateBlocked(dateStr)
                    const override = getOverride(dateStr, slot)
                    const counts = getCounts(dateStr, slot)
                    const maxGroupsRaw = override?.max_groups ?? capacity?.max_groups
                    const reservedGroups = override?.reserved_groups ?? 0
                    const maxGroups = maxGroupsRaw != null ? Math.max(0, maxGroupsRaw - reservedGroups) : null
                    const isSelected = selected?.date === dateStr && selected?.slot === slot

                    let cellClass = 'hover:bg-navy/5 text-gray-600'
                    let content: React.ReactNode = maxGroups != null ? `${counts.groups}/${maxGroups}` : `${counts.groups}`

                    if (blocked) {
                      cellClass = 'bg-gray-100 text-gray-400'
                      content = '休止(日)'
                    } else if (override?.is_closed) {
                      cellClass = 'bg-red-50 text-red-500 font-medium'
                      content = '受付停止'
                    } else if (reservedGroups > 0 || (override?.reserved_people ?? 0) > 0) {
                      cellClass = 'bg-sky-50 text-sky-700 font-medium'
                      content = `${counts.groups}/${maxGroups}(確保)`
                    } else if (override) {
                      cellClass = 'bg-amber-50 text-amber-700 font-medium'
                    }
                    if (isSelected) cellClass += ' ring-2 ring-navy'

                    return (
                      <td key={dateStr} className="border border-gray-200 p-1 text-center">
                        <button type="button" onClick={() => openCell(dateStr, slot)}
                          disabled={!!blocked}
                          className={`w-full h-10 rounded-lg flex items-center justify-center text-xs transition-all disabled:cursor-not-allowed ${cellClass}`}>
                          {content}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-4 mt-3 px-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-gray-100" /> 通常（組数/定員）</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-amber-50 border border-amber-200" /> 個別設定あり</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-red-50 border border-red-200" /> この時間帯だけ受付停止</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-sky-50 border border-sky-200" /> 指定枠数を確保</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-gray-100" /> 休止(日) ＝ 予約不可日の設定（別画面）</span>
          </div>
        </div>

        {/* 編集パネル */}
        <div className="bg-white rounded-xl shadow p-5 lg:sticky lg:top-4">
          {!selected ? (
            <p className="text-sm text-gray-400 text-center py-8">左のマスをクリックして編集</p>
          ) : selectedBlocked ? (
            <div className="text-sm text-gray-500">
              <p className="font-medium text-navy mb-2">{selected.date} {selected.slot}</p>
              <p>この日は「予約不可日」として終日休止に設定されています。時間帯単位の設定は解除されません。個別に戻すには予約不可日の設定を見直してください。</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-navy mb-1">{selected.date} {selected.slot}</p>
              <p className="text-xs text-gray-500 mb-4">
                現在の予約：{selectedCounts?.groups}組 / {selectedCounts?.people}名
                （デフォルト定員：{capacity?.max_groups}組・{capacity?.max_people}名）
              </p>

              <label className="flex items-center gap-2 mb-4 text-sm">
                <input type="checkbox" checked={form.is_closed}
                  onChange={e => setForm(f => ({ ...f, is_closed: e.target.checked }))}
                  disabled={!canEdit} />
                この時間帯だけ受付を停止する
              </label>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="admin-label">組数上限（空欄＝デフォルト）</label>
                  <input type="number" min={0} className="admin-input" placeholder={String(capacity?.max_groups ?? '')}
                    value={form.max_groups} disabled={!canEdit || form.is_closed}
                    onChange={e => setForm(f => ({ ...f, max_groups: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">人数上限（空欄＝デフォルト）</label>
                  <input type="number" min={0} className="admin-input" placeholder={String(capacity?.max_people ?? '')}
                    value={form.max_people} disabled={!canEdit || form.is_closed}
                    onChange={e => setForm(f => ({ ...f, max_people: e.target.value }))} />
                </div>
              </div>

              {(form.max_groups === '0' || form.max_people === '0') && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-4">
                  ⚠️ 上限を「0」にすると、予約の有無に関わらずこの枠は常に予約不可になります。この時間帯だけ受付を止めたい場合は、上の「受付を停止する」にチェックし、上限欄は空欄のままにしてください。
                </p>
              )}

              <div className="mb-4 pt-3 border-t border-gray-100">
                <p className="text-sm mb-2">指定枠数を確保する（電話予約・社内利用などのために空けておく）</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label">確保する組数</label>
                    <input type="number" min={0} className="admin-input" placeholder="0"
                      value={form.reserved_groups} disabled={!canEdit || form.is_closed}
                      onChange={e => setForm(f => ({ ...f, reserved_groups: e.target.value }))} />
                  </div>
                  <div>
                    <label className="admin-label">確保する人数</label>
                    <input type="number" min={0} className="admin-input" placeholder="0"
                      value={form.reserved_people} disabled={!canEdit || form.is_closed}
                      onChange={e => setForm(f => ({ ...f, reserved_people: e.target.value }))} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">定員からこの人数・組数を差し引いた分だけ、一般のお客様が予約できます。</p>
              </div>

              <div className="mb-5">
                <label className="admin-label">メモ（任意・内部用）</label>
                <input className="admin-input" placeholder="例：住職不在のため"
                  value={form.note} disabled={!canEdit}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={save} disabled={!canEdit || saving} className="btn-primary text-sm px-5 py-2 disabled:opacity-40">
                  {saving ? '保存中...' : '保存'}
                </button>
                {selectedOverride && (
                  <button onClick={resetToDefault} disabled={!canEdit || saving} className="text-red-500 text-xs hover:underline disabled:opacity-40">
                    個別設定を削除してデフォルトに戻す
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="text-gray-400 text-xs hover:underline ml-auto">閉じる</button>
              </div>
              {!canEdit && <p className="text-[11px] text-gray-400 mt-3">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
