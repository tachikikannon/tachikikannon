'use client'
// お問い合わせ・申請管理・代金引換の申込で共通に使う一覧/詳細ポップアップの部品。
// 見た目と操作は予約検索（src/app/admin/reservations/page.tsx）に合わせてある：
// 上部に状態タブ（件数つき）と検索・期間の絞り込み、PCは表・スマホはカードの一覧、
// 1件をタップすると詳細がポップアップで開き、その中で確認・編集・状態変更ができる。
import { useState, type ReactNode } from 'react'
import type { createClient } from '@/lib/supabase'

type SupabaseClient = ReturnType<typeof createClient>

// 端末の日付（日本時間）で YYYY-MM-DD を返す。期間で絞り込むときの比較用
export function localDateKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function inDateRange(iso: string, from: string, to: string) {
  if (!from && !to) return true
  const key = localDateKey(iso)
  return (!from || key >= from) && (!to || key <= to)
}

// スマホのカードで使う短い日時表記（例：11/17(月) 10:05）
export function shortDateTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })
}

// 1件を更新する。RLSで権限がない場合はエラーにならず0件更新になるため、件数でも失敗を判定する
export async function updateRecord(supabase: SupabaseClient, table: string, id: string, values: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select('id')
  if (error) { alert('保存に失敗しました：' + error.message); return false }
  if (!data || data.length === 0) { alert('保存できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return false }
  return true
}

export function FilterTabs<K extends string>({ tabs, value, onChange }: {
  tabs: { key: K; label: string; count: number }[]
  value: K
  onChange: (key: K) => void
}) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap items-center">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors
            ${value === t.key ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
          {t.label}<span className="ml-1">({t.count})</span>
        </button>
      ))}
    </div>
  )
}

export function SearchBox({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-full max-w-xs">
      <label className="admin-label">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="admin-input w-full pr-8 text-sm" />
      {value && (
        <button onClick={() => onChange('')} aria-label="検索語を消す"
          className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600 text-sm">✕</button>
      )}
    </div>
  )
}

export function DateRangeFilter({ label, from, to, onChange }: {
  label: string; from: string; to: string; onChange: (from: string, to: string) => void
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="flex items-center gap-1.5 flex-wrap">
        <input type="date" value={from} onChange={e => onChange(e.target.value, to)} className="admin-input w-auto text-sm" />
        <span className="text-gray-400 text-sm">〜</span>
        <input type="date" value={to} onChange={e => onChange(from, e.target.value)} className="admin-input w-auto text-sm" />
        {(from || to) && (
          <button onClick={() => onChange('', '')} aria-label="期間を消す" className="text-gray-400 hover:text-gray-600 text-sm px-1">✕</button>
        )}
      </div>
    </div>
  )
}

// 詳細ポップアップの外枠。背景（黒の半透明部分）をタップするか ✕ で閉じる。
// 印刷時はポップアップの枠を外し、中身だけを通常の紙面として印刷する
export function AdminDetailModal({ title, onClose, headerActions, children }: {
  title: ReactNode; onClose: () => void; headerActions?: ReactNode; children: ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/50 overflow-y-auto
      print:static print:block print:p-0 print:bg-transparent print:overflow-visible"
      onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-2xl my-8 sm:my-0 max-h-[85svh] overflow-y-auto [overflow-wrap:anywhere]
        print:max-w-none print:max-h-none print:overflow-visible print:shadow-none print:rounded-none print:p-0 print:my-0"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-medium text-navy min-w-0">{title}</h2>
          <div className="flex items-center gap-3 flex-shrink-0 print:hidden">
            {headerActions}
            <button onClick={onClose} aria-label="閉じる" className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-2">
      <dt className="text-gray-500 text-xs pt-0.5">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

// 詳細ポップアップ下部の区切りつきブロック（担当者・ステータス変更など）。印刷には出さない
export function DetailSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 border-t pt-4 print:hidden">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      {children}
    </div>
  )
}

export function EditField({ label, value, onChange, type = 'text', rows }: {
  label: string; value: string; onChange: (v: string) => void; type?: string
  rows?: number // 指定すると複数行の入力欄になる
}) {
  return (
    <div className={`grid grid-cols-[6rem_1fr] gap-2 ${rows ? '' : 'items-center'}`}>
      <dt className={`text-gray-500 text-xs ${rows ? 'pt-2' : ''}`}>{label}</dt>
      <dd className="min-w-0">
        {rows
          ? <textarea className="admin-input w-full" rows={rows} value={value} onChange={e => onChange(e.target.value)} />
          : <input type={type} className="admin-input w-full" value={value} onChange={e => onChange(e.target.value)} />}
      </dd>
    </div>
  )
}

export function EditActions({ saving, onSave, onCancel }: { saving: boolean; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button onClick={onSave} disabled={saving} className="btn-primary text-xs px-4 py-1.5 disabled:opacity-50">
        {saving ? '保存中...' : '保存する'}
      </button>
      <button onClick={onCancel} disabled={saving} className="text-xs text-gray-400 underline disabled:opacity-50">
        キャンセル
      </button>
    </div>
  )
}

export function AssigneeEditor({ assignedId, assignedName, myId, canEdit, onChange }: {
  assignedId: string | null; assignedName: string; myId: string | undefined; canEdit: boolean
  onChange: (adminId: string) => void // 空文字で担当を外す
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm">{assignedName}</span>
      {canEdit && myId && assignedId !== myId && (
        <button onClick={() => onChange(myId)} className="text-xs text-navy underline">自分を担当にする</button>
      )}
      {canEdit && assignedId && (
        <button onClick={() => onChange('')} className="text-xs text-gray-400 underline">担当を外す</button>
      )}
    </div>
  )
}

// 状態ボタンを押す →「〇〇に変更しますか？」→ 確定する、の2段階で変更する（誤タップ防止）
export function StatusChanger<S extends string>({ options, labels, colors, current, canEdit, onConfirm }: {
  options: S[]; labels: Record<S, string>; colors: Record<S, string>; current: S; canEdit: boolean
  onConfirm: (status: S) => void
}) {
  const [pending, setPending] = useState<S | null>(null)
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {options.map(s => (
          <button key={s} onClick={() => setPending(s)} disabled={!canEdit || current === s}
            className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40
              ${colors[s]} ${pending === s ? 'ring-2 ring-offset-1 ring-navy' : ''}`}>
            {labels[s]}
          </button>
        ))}
      </div>
      {pending && pending !== current && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">「{labels[pending]}」に変更しますか？</span>
          <button onClick={() => { onConfirm(pending); setPending(null) }} className="btn-primary text-xs px-3 py-1.5">確定する</button>
          <button onClick={() => setPending(null)} className="text-xs text-gray-400 underline">キャンセル</button>
        </div>
      )}
      {!canEdit && <p className="text-[11px] text-gray-400 mt-2">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
    </>
  )
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return <tr><td colSpan={colSpan} className="px-4 py-8 text-center text-gray-400 text-sm">{children}</td></tr>
}

export function EmptyCard({ children }: { children: ReactNode }) {
  return <p className="bg-white rounded-xl shadow-sm px-4 py-8 text-center text-gray-400 text-sm">{children}</p>
}
