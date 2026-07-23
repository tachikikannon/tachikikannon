import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: newsCount },
    { count: reservationCount },
    { count: unreadContacts },
    { count: pendingReservations },
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const stats = [
    { label: '未読のお問い合わせ', value: unreadContacts ?? 0, href: '/admin/contacts', alert: (unreadContacts ?? 0) > 0 },
    { label: '未確認の予約',       value: pendingReservations ?? 0, href: '/admin/reservations', alert: (pendingReservations ?? 0) > 0 },
    { label: 'お知らせ件数',       value: newsCount ?? 0, href: '/admin/news', alert: false },
    { label: '予約件数（合計）',   value: reservationCount ?? 0, href: '/admin/reservations', alert: false },
  ]

  const quickLinks = [
    { href: '/admin/news?new=1',       label: 'お知らせを書く', icon: '📢' },
    { href: '/admin/blog?new=1',       label: 'ブログを書く',   icon: '✏️' },
    { href: '/admin/events?new=1',     label: '行事を登録する', icon: '📅' },
    { href: '/admin/reservations',     label: '予約を確認する', icon: '📋' },
    { href: '/admin/contacts',         label: 'お問い合わせを見る', icon: '✉️' },
    { href: '/admin/images',           label: '画像をアップロード', icon: '🖼️' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif text-navy mb-1">ダッシュボード</h1>
      <p className="text-gray-500 text-sm mb-8">
        {new Date().toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric', weekday:'long' })}
      </p>

      {/* 概要カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, href, alert }) => (
          <Link key={label} href={href}
            className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4
              ${alert ? 'border-red-400' : 'border-navy'}`}>
            <p className="text-3xl font-serif font-bold text-navy">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
            {alert && value > 0 && <p className="text-[10px] text-red-500 mt-1">対応が必要です</p>}
          </Link>
        ))}
      </div>

      {/* クイックアクション */}
      <h2 className="text-sm font-medium text-gray-500 tracking-widest mb-3">クイックアクション</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickLinks.map(({ href, label, icon }) => (
          <Link key={href} href={href}
            className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm
                       hover:shadow-md hover:bg-navy hover:text-white transition-all group">
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-navy group-hover:text-white">{label}</span>
          </Link>
        ))}
      </div>

      {/* 公開サイトへのリンク */}
      <div className="mt-10 p-4 bg-white rounded-xl shadow-sm flex items-center justify-between">
        <p className="text-sm text-gray-600">公開サイトを確認する</p>
        <a href="/" target="_blank" rel="noopener"
          className="btn-primary text-sm px-4 py-2">
          サイトを開く →
        </a>
      </div>
    </div>
  )
}
