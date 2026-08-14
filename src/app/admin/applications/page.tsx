'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
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
const STATUS_OPTIONS: ApplicationStatus[] = ['unread', 'checking', 'replied', 'completed']

export default function AdminApplicationsPage() {
  const supabase = createClient()
  const router = useRouter()
  const { profile, canEditContacts: canEdit } = useAdminProfile()
  const [list, setList] = useState<Application[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [selected, setSelected] = useState<Application | null>(null)
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null)
  const [photoMedia, setPhotoMedia] = useState<Media[]>([])

  async function load() {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    setList(data ?? [])
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  // photo_refはmedia.idのカンマ区切り（複数選択可）。ここで実物を引いて表示する。
  useEffect(() => {
    setPhotoMedia([])
    const ids = selected?.photo_ref?.split(',').map(s => s.trim()).filter(Boolean) ?? []
    if (ids.length === 0) return
    supabase.from('media').select('*').in('id', ids)
      .then(({ data }) => setPhotoMedia((data ?? []) as Media[]))
  }, [selected?.photo_ref])

  function openDetail(a: Application | null) {
    setSelected(a)
    setPendingStatus(null)
  }

  async function markRead(id: string) {
    await supabase.from('applications').update({ is_read: true }).eq('id', id)
    setList(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
    if (selected?.id === id) setSelected(s => s ? { ...s, is_read: true } : s)
    router.refresh()
  }

  async function updateStatus(id: string, status: ApplicationStatus) {
    await supabase.from('applications').update({ status }).eq('id', id)
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
    router.refresh()
  }

  async function updateAssignee(id: string, assigned_admin_id: string) {
    await supabase.from('applications').update({ assigned_admin_id: assigned_admin_id || null }).eq('id', id)
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, assigned_admin_id: assigned_admin_id || null } : s)
  }

  async function remove(id: string) {
    if (!confirm('削除しますか？')) return
    const { data, error } = await supabase.from('applications').delete().eq('id', id).select('id')
    if (error) { alert('削除に失敗しました：' + error.message); return }
    if (!data || data.length === 0) { alert('削除できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return }
    setSelected(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-navy">申請管理</h1>
        <span className="badge bg-red-100 text-red-700">
          未読 {list.filter(a => !a.is_read).length} 件
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* 一覧 */}
        <div className="bg-white rounded-xl shadow overflow-y-auto lg:max-h-[calc(100vh-14rem)]">
          <ul className="divide-y divide-gray-100">
            {list.map(a => (
              <li key={a.id} onClick={() => { openDetail(a); if(!a.is_read && canEdit) markRead(a.id) }}
                className={`px-5 py-4 cursor-pointer hover:bg-blue-50 transition-colors
                  ${selected?.id === a.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!a.is_read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                      <p className="font-medium text-sm truncate">{a.name}</p>
                      <span className={`badge ${STATUS_COLORS[a.status]} flex-shrink-0`}>{STATUS_LABELS[a.status]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{a.category}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">担当: {adminName(a.assigned_admin_id)}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </li>
            ))}
            {list.length === 0 && <li className="px-4 py-8 text-center text-gray-400 text-sm">申請はありません</li>}
          </ul>
        </div>

        {/* 詳細 */}
        {selected && (
          <div className="bg-white rounded-xl shadow p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy text-lg">{selected.category}</h2>
              <button onClick={() => openDetail(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2 text-sm mb-5">
              <dt className="text-gray-500 text-xs">お名前</dt><dd>{selected.name}</dd>
              <dt className="text-gray-500 text-xs">メール</dt>
              <dd><a href={`mailto:${selected.email}`} className="text-navy underline">{selected.email}</a></dd>
              <dt className="text-gray-500 text-xs">電話番号</dt><dd>{selected.phone || '（未入力）'}</dd>
              {selected.company_name && (<><dt className="text-gray-500 text-xs">会社名・団体名</dt><dd>{selected.company_name}</dd></>)}
              {selected.contact_kana && (<><dt className="text-gray-500 text-xs">フリガナ</dt><dd>{selected.contact_kana}</dd></>)}
              {selected.postal_code && (<><dt className="text-gray-500 text-xs">郵便番号</dt><dd>{selected.postal_code}</dd></>)}
              {(selected.address || selected.address_detail) && (
                <><dt className="text-gray-500 text-xs">ご住所</dt><dd>{[selected.address, selected.address_detail].filter(Boolean).join(' ')}</dd></>
              )}
              {selected.mobile && (<><dt className="text-gray-500 text-xs">携帯電話</dt><dd>{selected.mobile}</dd></>)}
              {selected.fax && (<><dt className="text-gray-500 text-xs">FAX番号</dt><dd>{selected.fax}</dd></>)}
              {selected.attachment_url && (
                <><dt className="text-gray-500 text-xs">添付ファイル</dt>
                <dd><a href={selected.attachment_url} target="_blank" rel="noopener" className="text-navy underline">
                  📎 {selected.attachment_filename || 'ファイルを開く'}
                </a></dd></>
              )}
              {selected.photo_ref && (
                <>
                  <dt className="text-gray-500 text-xs">対象写真</dt>
                  <dd>
                    {photoMedia.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {photoMedia.map(m => (
                          <div key={m.id} className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border" title={m.filename}>
                            <Image src={m.public_url} alt={m.filename} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">{selected.photo_ref}</span>
                    )}
                  </dd>
                </>
              )}
              <dt className="text-gray-500 text-xs">受信日</dt>
              <dd className="text-xs text-gray-500">{new Date(selected.created_at).toLocaleString('ja-JP')}</dd>
              <dt className="text-gray-500 text-xs">更新日時</dt>
              <dd className="text-xs text-gray-500">{selected.updated_at ? new Date(selected.updated_at).toLocaleString('ja-JP') : '—'}</dd>
            </dl>
            <div className="bg-gray-50 rounded p-4 text-sm leading-relaxed whitespace-pre-wrap mb-4">
              {selected.message}
            </div>

            {((selected.media_categories?.length ?? 0) > 0 || (selected.interview_formats?.length ?? 0) > 0) && (
              <div className="mb-4 bg-blue-50 rounded p-4 text-sm space-y-1.5">
                <p className="font-medium text-navy text-xs mb-2">メディア・取材情報</p>
                {(selected.media_categories?.length ?? 0) > 0 && <p><span className="text-gray-500">メディアカテゴリ：</span>{selected.media_categories!.join('、')}</p>}
                {selected.media_name && <p><span className="text-gray-500">メディア名・番組名：</span>{selected.media_name}</p>}
                {selected.media_content && <p><span className="text-gray-500">掲載・企画内容：</span>{selected.media_content}</p>}
                {selected.publish_date && <p><span className="text-gray-500">発行・オンエア予定日：</span>{selected.publish_date}</p>}
                {(selected.interview_formats?.length ?? 0) > 0 && <p><span className="text-gray-500">取材形式：</span>{selected.interview_formats!.join('、')}</p>}
                {selected.preferred_date_1 && <p><span className="text-gray-500">希望日時（第一）：</span>{selected.preferred_date_1} {selected.preferred_time_1}</p>}
                {selected.preferred_date_2 && <p><span className="text-gray-500">希望日時（第二）：</span>{selected.preferred_date_2} {selected.preferred_time_2}</p>}
                {selected.preferred_date_3 && <p><span className="text-gray-500">希望日時（第三）：</span>{selected.preferred_date_3} {selected.preferred_time_3}</p>}
                {selected.attendee_count && <p><span className="text-gray-500">当日取材人数：</span>{selected.attendee_count}名様</p>}
                {selected.duration_minutes && <p><span className="text-gray-500">予定所要時間：</span>{selected.duration_minutes}分</p>}
                {selected.request_notes && <p><span className="text-gray-500">ご要望・ご質問：</span>{selected.request_notes}</p>}
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">担当者</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm">{adminName(selected.assigned_admin_id)}</span>
                {canEdit && profile && selected.assigned_admin_id !== profile.id && (
                  <button onClick={() => updateAssignee(selected.id, profile.id)} className="text-xs text-navy underline">
                    自分を担当にする
                  </button>
                )}
                {canEdit && selected.assigned_admin_id && (
                  <button onClick={() => updateAssignee(selected.id, '')} className="text-xs text-gray-400 underline">
                    担当を外す
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">対応状況</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => setPendingStatus(s)}
                    disabled={!canEdit || selected.status === s}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40 ${STATUS_COLORS[s]} ${pendingStatus === s ? 'ring-2 ring-offset-1 ring-navy' : ''}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              {pendingStatus && pendingStatus !== selected.status && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">「{STATUS_LABELS[pendingStatus]}」に変更しますか？</span>
                  <button onClick={() => { updateStatus(selected.id, pendingStatus); setPendingStatus(null) }}
                    className="btn-primary text-xs px-3 py-1.5">確定する</button>
                  <button onClick={() => setPendingStatus(null)} className="text-xs text-gray-400 underline">キャンセル</button>
                </div>
              )}
              {!canEdit && <p className="text-[11px] text-gray-400 mt-2">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
            </div>

            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2">自動返信メール</p>
              {selected.auto_reply_sent
                ? <p className="text-sm text-green-700">✉️ 送信済み</p>
                : <p className="text-sm text-gray-400">✉️ 未送信</p>}
            </div>

            <div className="flex gap-3">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.category}`}
                className="btn-primary text-sm px-4 py-2">返信する（メール）</a>
              {canEdit && <button onClick={() => remove(selected.id)} className="text-red-500 text-sm hover:underline">削除</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
