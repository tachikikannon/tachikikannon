'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from '@/components/SafeImage'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import { APPLICATION_ATTACHMENT_BUCKET, ATTACHMENT_LINK_TTL_SECONDS, attachmentPath } from '@/lib/applicationAttachment'
import {
  AdminDetailModal, AssigneeEditor, DateRangeFilter, DetailRow, DetailSection, EditActions, EditField,
  EmptyCard, EmptyRow, FilterTabs, SearchBox, StatusChanger, inDateRange, shortDateTime, updateRecord,
} from '@/components/admin/RecordListUI'
import type { AdminProfile, Application, ApplicationStatus, Media } from '@/types'

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  unread: '未読', checking: '対応中', replied: '返信済み', completed: '完了',
}
const STATUS_COLORS: Record<ApplicationStatus, string> = {
  unread: 'bg-red-100 text-red-700',
  checking: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  completed: 'bg-gray-200 text-gray-600',
}
// スマホのカード一覧だけで使う、状態を表す左ボーダーの色（バッジと同系色）
const STATUS_BORDER_COLORS: Record<ApplicationStatus, string> = {
  unread: 'border-red-400',
  checking: 'border-yellow-400',
  replied: 'border-green-400',
  completed: 'border-gray-300',
}
const STATUS_OPTIONS: ApplicationStatus[] = ['unread', 'checking', 'replied', 'completed']

type FilterKey = 'all' | ApplicationStatus

// 編集できる項目（申請者の連絡先と本文）。メディア取材・団体予約の詳細項目は表示のみ
const EDIT_FIELDS = [
  { key: 'name', label: 'お名前' },
  { key: 'contact_kana', label: 'フリガナ' },
  { key: 'company_name', label: '会社名・団体名' },
  { key: 'email', label: 'メール', type: 'email' },
  { key: 'phone', label: '電話番号', type: 'tel' },
  { key: 'mobile', label: '携帯電話', type: 'tel' },
  { key: 'fax', label: 'FAX番号', type: 'tel' },
  { key: 'postal_code', label: '郵便番号' },
  { key: 'address', label: 'ご住所' },
  { key: 'address_detail', label: '番地・建物名' },
  { key: 'message', label: '内容', rows: 6 },
] as const
type EditKey = typeof EDIT_FIELDS[number]['key']
type EditForm = Record<EditKey, string>
// 必須項目以外は、空欄で保存したら null（未入力）として保存する
const REQUIRED_KEYS: EditKey[] = ['name', 'email', 'message']

export default function AdminApplicationsPage() {
  const supabase = createClient()
  const router = useRouter()
  const { profile, canEditContacts: canEdit } = useAdminProfile()
  const [list, setList] = useState<Application[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [detail, setDetail] = useState<Application | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [editForm, setEditForm] = useState<EditForm | null>(null) // null のときは閲覧表示
  const [saving, setSaving] = useState(false)
  const [photoMedia, setPhotoMedia] = useState<Media[]>([])
  // 添付PDFは非公開バケットにあるため、詳細を開くたびに期限付きリンクを発行する
  const [attachmentLink, setAttachmentLink] = useState<{ url: string | null; failed: boolean }>({ url: null, failed: false })

  async function load() {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    // 読み込みに失敗したときは、一覧を空にせず直前の表示を残す
    if (!error) {
      const rows = (data ?? []) as Application[]
      setList(rows)
      // 開いている詳細も最新の内容（更新日時など）に合わせる
      setDetail(d => d ? (rows.find(r => r.id === d.id) ?? d) : d)
    }
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  // photo_refはmedia.idのカンマ区切り（複数選択可）。ここで実物を引いて表示する。
  useEffect(() => {
    setPhotoMedia([])
    const ids = detail?.photo_ref?.split(',').map(s => s.trim()).filter(Boolean) ?? []
    if (ids.length === 0) return
    supabase.from('media').select('*').in('id', ids)
      .then(({ data }) => setPhotoMedia((data ?? []) as Media[]))
  }, [detail?.photo_ref])

  useEffect(() => {
    setAttachmentLink({ url: null, failed: false })
    const value = detail?.attachment_url
    if (!value) return
    let cancelled = false
    supabase.storage.from(APPLICATION_ATTACHMENT_BUCKET)
      .createSignedUrl(attachmentPath(value), ATTACHMENT_LINK_TTL_SECONDS)
      .then(({ data, error }) => {
        if (cancelled) return
        setAttachmentLink(error || !data ? { url: null, failed: true } : { url: data.signedUrl, failed: false })
      })
    return () => { cancelled = true }
  }, [detail?.id, detail?.attachment_url])

  function openDetail(a: Application | null) {
    setDetail(a)
    setEditForm(null)
    if (a && !a.is_read && canEdit) markRead(a.id)
  }

  async function markRead(id: string) {
    await supabase.from('applications').update({ is_read: true }).eq('id', id)
    setList(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
    setDetail(d => d && d.id === id ? { ...d, is_read: true } : d)
    router.refresh()
  }

  async function update(id: string, values: Partial<Application>) {
    const ok = await updateRecord(supabase, 'applications', id, values)
    if (ok) {
      setDetail(d => d && d.id === id ? { ...d, ...values } : d)
      load()
      router.refresh()
    }
    return ok
  }

  function startEdit() {
    if (!detail) return
    setEditForm(Object.fromEntries(EDIT_FIELDS.map(f => [f.key, detail[f.key] ?? ''])) as EditForm)
  }

  async function saveEdit() {
    if (!detail || !editForm) return
    const values = Object.fromEntries(EDIT_FIELDS.map(f => {
      const v = editForm[f.key]
      return [f.key, REQUIRED_KEYS.includes(f.key) || v.trim() !== '' ? v : null]
    })) as Partial<Application>
    setSaving(true)
    const ok = await update(detail.id, values)
    setSaving(false)
    if (ok) setEditForm(null)
  }

  async function remove(id: string) {
    if (!confirm('この申請を削除しますか？削除すると元に戻せません。')) return
    const { data, error } = await supabase.from('applications').delete().eq('id', id).select('id')
    if (error) { alert('削除に失敗しました：' + error.message); return }
    if (!data || data.length === 0) { alert('削除できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return }
    setDetail(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'
  const categories = Array.from(new Set(list.map(a => a.category).filter(Boolean)))

  const byStatus = filter === 'all' ? list : list.filter(a => a.status === filter)
  const byCategory = categoryFilter === '' ? byStatus : byStatus.filter(a => a.category === categoryFilter)
  const byDate = byCategory.filter(a => inDateRange(a.created_at, dateFrom, dateTo))
  const searchQuery = search.trim().toLowerCase()
  const filtered = searchQuery === '' ? byDate : byDate.filter(a =>
    [a.name, a.contact_kana, a.company_name, a.email, a.phone, a.mobile, a.message]
      .some(v => v?.toLowerCase().includes(searchQuery))
  )
  const hasCondition = filter !== 'all' || categoryFilter !== '' || searchQuery !== '' || dateFrom !== '' || dateTo !== ''
  const emptyText = hasCondition ? '検索条件に一致する申請がありません' : '申請はありません'

  return (
    <div className="p-8 print:p-0 overflow-x-clip">
      <div className="print:hidden">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-serif text-navy">申請管理</h1>
          <span className="badge bg-red-100 text-red-700">
            未読 {list.filter(a => !a.is_read).length} 件
          </span>
        </div>

        <FilterTabs value={filter} onChange={setFilter} tabs={[
          { key: 'all', label: 'すべて', count: list.length },
          ...STATUS_OPTIONS.map(s => ({ key: s, label: STATUS_LABELS[s], count: list.filter(a => a.status === s).length })),
        ]} />

        {/* 検索・絞り込み */}
        <div className="mb-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="admin-label">申請種別で絞り込み</label>
            <select className="admin-input text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="">すべての申請種別</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <SearchBox label="名前・団体名・電話・メール・内容で検索" value={search} onChange={setSearch} />
          <DateRangeFilter label="受信日で絞り込み" from={dateFrom} to={dateTo} onChange={(f, t) => { setDateFrom(f); setDateTo(t) }} />
        </div>

        {/* PC用の表。縦はページ本体のスクロールにまかせ、横だけこの枠でスクロールさせる（予約検索と同じ） */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {['状態', '受信日', '申請種別', 'お名前', '会社名・団体名', '電話番号', 'メール', '担当者', '自動返信', '更新日時'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(a => (
                <tr key={a.id} onClick={() => openDetail(a)} className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[a.status]}`}>{STATUS_LABELS[a.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString('ja-JP')}<br />
                    <span className="text-gray-400">{new Date(a.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{a.category}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      {!a.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="未読" />}
                      {a.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{a.company_name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{a.phone || a.mobile || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{a.email || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{adminName(a.assigned_admin_id)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {a.auto_reply_sent ? <span className="text-green-700">✉️ 送信済み</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {a.updated_at ? new Date(a.updated_at).toLocaleString('ja-JP') : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <EmptyRow colSpan={10}>{emptyText}</EmptyRow>}
            </tbody>
          </table>
        </div>

        {/* スマホ用カード一覧。横スクロールなしで下へスクロールして次の申請を確認できる */}
        <div className="md:hidden space-y-2.5">
          {filtered.map(a => (
            <div key={a.id} onClick={() => openDetail(a)}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${STATUS_BORDER_COLORS[a.status]} p-4 active:bg-blue-50 cursor-pointer`}>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {!a.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="未読" />}
                <span className={`badge ${STATUS_COLORS[a.status]}`}>{STATUS_LABELS[a.status]}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">{shortDateTime(a.created_at)}</span>
              </div>
              <p className="text-xs text-navy font-medium mb-1.5">📝 {a.category}</p>
              <p className="font-semibold text-base text-navy mb-2">
                {a.name}<span className="text-xs font-normal text-gray-400 ml-1">様</span>
                {a.company_name && <span className="block text-xs font-normal text-gray-500 mt-0.5 [overflow-wrap:anywhere]">{a.company_name}</span>}
              </p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                <div className="truncate">📞 {a.phone || a.mobile || '—'}</div>
                <div className="truncate">✉️ {a.email || '—'}</div>
                <div className="truncate">👤 {adminName(a.assigned_admin_id)}</div>
                <div className={a.auto_reply_sent ? 'text-green-700' : 'text-gray-300'}>自動返信{a.auto_reply_sent ? '済み' : '未'}</div>
              </dl>
            </div>
          ))}
          {filtered.length === 0 && <EmptyCard>{emptyText}</EmptyCard>}
        </div>
      </div>

      {/* 詳細（ポップアップ） */}
      {detail && (
        <AdminDetailModal key={detail.id} title={detail.category || '申請詳細'} onClose={() => openDetail(null)}
          headerActions={canEdit && !editForm && (
            <>
              <button onClick={startEdit} className="text-navy text-xs hover:underline">編集</button>
              <button onClick={() => remove(detail.id)} className="text-red-500 text-xs hover:underline">削除</button>
            </>
          )}>
          <dl className="space-y-3 text-sm">
            <DetailRow label="状態">
              <span className={`badge ${STATUS_COLORS[detail.status]}`}>{STATUS_LABELS[detail.status]}</span>
            </DetailRow>
            {editForm ? (
              <>
                {EDIT_FIELDS.map(f => (
                  <EditField key={f.key} label={f.label} value={editForm[f.key]}
                    type={'type' in f ? f.type : undefined} rows={'rows' in f ? f.rows : undefined}
                    onChange={v => setEditForm(prev => prev && { ...prev, [f.key]: v })} />
                ))}
                <EditActions saving={saving} onSave={saveEdit} onCancel={() => setEditForm(null)} />
              </>
            ) : (
              <>
                <DetailRow label="お名前">{detail.name}</DetailRow>
                {detail.contact_kana && <DetailRow label="フリガナ">{detail.contact_kana}</DetailRow>}
                {detail.company_name && <DetailRow label="会社名・団体名">{detail.company_name}</DetailRow>}
                <DetailRow label="メール">
                  <a href={`mailto:${detail.email}`} className="text-navy underline print:no-underline print:text-black">{detail.email}</a>
                </DetailRow>
                <DetailRow label="電話番号">{detail.phone || '（未入力）'}</DetailRow>
                {detail.mobile && <DetailRow label="携帯電話">{detail.mobile}</DetailRow>}
                {detail.fax && <DetailRow label="FAX番号">{detail.fax}</DetailRow>}
                {detail.postal_code && <DetailRow label="郵便番号">{detail.postal_code}</DetailRow>}
                {(detail.address || detail.address_detail) && (
                  <DetailRow label="ご住所">{[detail.address, detail.address_detail].filter(Boolean).join(' ')}</DetailRow>
                )}
              </>
            )}
            {detail.attachment_url && (
              <DetailRow label="添付ファイル">
                {attachmentLink.url ? (
                  <a href={attachmentLink.url} target="_blank" rel="noopener" className="text-navy underline">
                    📎 {detail.attachment_filename || 'ファイルを開く'}
                  </a>
                ) : attachmentLink.failed ? (
                  <span className="text-red-600 text-xs">添付ファイルを開けませんでした（{detail.attachment_filename || 'PDF'}）。時間をおいて再度お試しください。</span>
                ) : (
                  <span className="text-gray-400 text-xs">📎 {detail.attachment_filename || 'ファイル'}（読み込み中…）</span>
                )}
              </DetailRow>
            )}
            {detail.photo_ref && (
              <DetailRow label="対象写真">
                {photoMedia.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {photoMedia.map(m => (
                      <div key={m.id} className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border" title={m.filename}>
                        <Image src={m.public_url} alt={m.filename} fill sizes="48px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">{detail.photo_ref}</span>
                )}
              </DetailRow>
            )}
            <DetailRow label="受信日時">{new Date(detail.created_at).toLocaleString('ja-JP')}</DetailRow>
            <DetailRow label="更新日時">{detail.updated_at ? new Date(detail.updated_at).toLocaleString('ja-JP') : '—'}</DetailRow>
          </dl>

          {!editForm && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">内容</p>
              <div className="bg-gray-50 rounded p-4 text-sm leading-relaxed whitespace-pre-wrap print:bg-white print:p-0">
                {detail.message}
              </div>
            </div>
          )}

          {((detail.media_categories?.length ?? 0) > 0 || (detail.interview_formats?.length ?? 0) > 0) && (
            <div className="mt-4 bg-blue-50 rounded p-4 text-sm space-y-1.5 print:bg-white print:p-0">
              <p className="font-medium text-navy text-xs mb-2">メディア・取材情報</p>
              {(detail.media_categories?.length ?? 0) > 0 && <p><span className="text-gray-500">メディアカテゴリ：</span>{detail.media_categories!.join('、')}</p>}
              {detail.media_name && <p><span className="text-gray-500">メディア名・番組名：</span>{detail.media_name}</p>}
              {detail.media_content && <p><span className="text-gray-500">掲載・企画内容：</span>{detail.media_content}</p>}
              {detail.publish_date && <p><span className="text-gray-500">発行・オンエア予定日：</span>{detail.publish_date}</p>}
              {(detail.interview_formats?.length ?? 0) > 0 && <p><span className="text-gray-500">取材形式：</span>{detail.interview_formats!.join('、')}</p>}
              {detail.preferred_date_1 && <p><span className="text-gray-500">希望日時（第一）：</span>{detail.preferred_date_1} {detail.preferred_time_1}</p>}
              {detail.preferred_date_2 && <p><span className="text-gray-500">希望日時（第二）：</span>{detail.preferred_date_2} {detail.preferred_time_2}</p>}
              {detail.preferred_date_3 && <p><span className="text-gray-500">希望日時（第三）：</span>{detail.preferred_date_3} {detail.preferred_time_3}</p>}
              {detail.attendee_count && <p><span className="text-gray-500">当日取材人数：</span>{detail.attendee_count}名様</p>}
              {detail.duration_minutes && <p><span className="text-gray-500">予定所要時間：</span>{detail.duration_minutes}分</p>}
              {detail.request_notes && <p><span className="text-gray-500">ご要望・ご質問：</span>{detail.request_notes}</p>}
            </div>
          )}

          {(detail.visit_date || detail.group_name) && (
            <div className="mt-4 bg-green-50 rounded p-4 text-sm space-y-1.5 print:bg-white print:p-0">
              <p className="font-medium text-navy text-xs mb-2">団体予約・減免申請情報</p>
              {detail.visit_date && <p><span className="text-gray-500">参拝日：</span>{detail.visit_date}</p>}
              {detail.school_or_company && <p><span className="text-gray-500">学校名・会社名・個人：</span>{detail.school_or_company}</p>}
              {detail.group_name && <p><span className="text-gray-500">団体名：</span>{detail.group_name}</p>}
              {detail.course_number && <p><span className="text-gray-500">コース番号：</span>{detail.course_number}</p>}
              {detail.adult_count && <p><span className="text-gray-500">大人：</span>{detail.adult_count}名</p>}
              {detail.child_count && <p><span className="text-gray-500">子供：</span>{detail.child_count}名</p>}
              {detail.student_count && <p><span className="text-gray-500">小中学生：</span>{detail.student_count}名</p>}
            </div>
          )}

          <DetailSection label="担当者">
            <AssigneeEditor assignedId={detail.assigned_admin_id} assignedName={adminName(detail.assigned_admin_id)}
              myId={profile?.id} canEdit={canEdit}
              onChange={id => update(detail.id, { assigned_admin_id: id || null })} />
          </DetailSection>

          <DetailSection label="対応状況の変更">
            <StatusChanger options={STATUS_OPTIONS} labels={STATUS_LABELS} colors={STATUS_COLORS}
              current={detail.status} canEdit={canEdit} onConfirm={s => update(detail.id, { status: s })} />
          </DetailSection>

          <DetailSection label="自動返信メール（受付時）">
            {detail.auto_reply_sent
              ? <p className="text-sm text-green-700">✉️ 送信済み</p>
              : <p className="text-sm text-gray-400">✉️ 未送信</p>}
          </DetailSection>

          <DetailSection label="返信・印刷">
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${detail.email}?subject=${encodeURIComponent(`Re: ${detail.category}`)}`}
                className="btn-primary text-sm px-4 py-2">返信する（メール）</a>
              <button onClick={() => window.print()}
                className="text-sm px-4 py-2 border border-navy text-navy rounded hover:bg-navy hover:text-white transition-colors">🖨 印刷</button>
            </div>
          </DetailSection>
        </AdminDetailModal>
      )}
    </div>
  )
}
