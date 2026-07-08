'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'

const TYPES: { value: ReservationType; label: string }[] = [
  { value: 'prayer',  label: '護摩祈願' },
  { value: 'shakyou', label: '写経' },
  { value: 'shabutu', label: '写仏' },
  { value: 'jyuzu',   label: '数珠づくり' },
]

type CapacitySetting = {
  type: ReservationType
  max_groups: number
  max_people: number
}

export default function CapacityPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<CapacitySetting[]>([])
  const [saving, setSaving] = useState<ReservationType | null>(null)
  const [saved, setSaved] = useState<ReservationType | null>(null)

  useEffect(() => {
    supabase.from('capacity_settings').select('type,max_groups,max_people')
      .then(({ data }) => {
        if (!data) return
        // 取得データをマージ（未設定の種別はデフォルト値）
        const merged = TYPES.map(t => {
          const found = data.find(d => d.type === t.value)
          return found ?? { type: t.value, max_groups: 5, max_people: 20 }
        })
        setSettings(merged as CapacitySetting[])
      })
  }, [])

  function update(type: ReservationType, field: 'max_groups' | 'max_people', value: number) {
    setSettings(prev => prev.map(s => s.type === type ? { ...s, [field]: value } : s))
  }

  async function save(type: ReservationType) {
    const s = settings.find(s => s.type === type)
    if (!s) return
    setSaving(type)
    await supabase.from('capacity_settings').upsert({ type, max_groups: s.max_groups, max_people: s.max_people }, { onConflict: 'type' })
    setSaving(null)
    setSaved(type)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">定員設定</h1>
      <p className="text-gray-500 text-sm mb-8">体験種別ごとに1時間帯あたりの受入可能な組数・人数を設定します。</p>

      <div className="space-y-4">
        {settings.map(s => {
          const typeLabel = TYPES.find(t => t.value === s.type)?.label ?? s.type
          return (
            <div key={s.type} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-medium text-navy mb-4">{typeLabel}</h2>
              <div className="flex items-end gap-6">
                <div>
                  <label className="admin-label">最大組数</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={1} max={99}
                      className="admin-input w-20"
                      value={s.max_groups}
                      onChange={e => update(s.type, 'max_groups', Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">組</span>
                  </div>
                </div>
                <div>
                  <label className="admin-label">最大人数</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={1} max={999}
                      className="admin-input w-20"
                      value={s.max_people}
                      onChange={e => update(s.type, 'max_people', Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">名</span>
                  </div>
                </div>
                <button
                  onClick={() => save(s.type)}
                  disabled={saving === s.type}
                  className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                >
                  {saving === s.type ? '保存中...' : saved === s.type ? '✓ 保存しました' : '保存'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">ご注意</p>
        <p>組数・人数どちらか一方でも上限に達した時間帯は予約不可（×）になります。</p>
      </div>
    </div>
  )
}
