'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import type { AdminRole } from '@/types'

type NavItem = { href: string; label: string; icon: string; group?: string }

// reservation_search_admin ロールがアクセスできる管理画面パス（完全一致）。
// ミドルウェア（src/middleware.ts）の許可リストと揃えておくこと。
const RESERVATION_ADMIN_ALLOWED_PATHS = ['/admin/reservations', '/admin/reservations/schedule']

const RESERVATION_GROUP = '予約・体験'
const CONTACT_GROUP = 'お問い合わせ'

// ロールごとにサイドバーへ表示するナビ項目を絞り込む。
// ここでの絞り込みは表示（UX）のみで、実際の編集可否は Supabase の RLS が決める
// （src/lib/useAdminProfile.ts のコメント参照）。ただし reservation_search_admin
// だけは src/middleware.ts 側でも同じ許可リストにより直接URLアクセスを禁止している。
function getVisibleNavItems(role: AdminRole | undefined): NavItem[] {
  switch (role) {
    case 'reservation_search_admin':
      return navItems.filter(item => RESERVATION_ADMIN_ALLOWED_PATHS.includes(item.href))
    case 'reservation_admin':
      return navItems.filter(item => item.group === RESERVATION_GROUP)
    case 'contact_admin':
      return navItems.filter(item => item.group === CONTACT_GROUP)
    case 'admin':
    case 'viewer':
      return navItems.filter(item => item.group === RESERVATION_GROUP || item.group === CONTACT_GROUP)
    default:
      // super_admin、またはロール未取得（読み込み中）はフィルタしない
      return navItems
  }
}

const navItems: NavItem[] = [
  { href: '/admin',               label: 'ダッシュボード',   icon: '🏠' },
  { href: '/admin/news',          label: 'お知らせ（立木観音）', icon: '📢' },
  { href: '/admin/blog',          label: 'ブログ',           icon: '✏️' },
  // ── 予約・体験 ──
  { href: '/admin/reservations',  label: '予約検索',         icon: '📋', group: '予約・体験' },
  { href: '/admin/reservations/schedule', label: '予約スケジュール', icon: '🗓️', group: '予約・体験' },
  { href: '/admin/reservations/availability', label: '空き状況の詳細設定', icon: '🕒', group: '予約・体験' },
  { href: '/admin/reservations/categories', label: '予約区分の管理', icon: '🏷️', group: '予約・体験' },
  { href: '/admin/blocked-dates', label: '予約不可日',       icon: '🚫', group: '予約・体験' },
  { href: '/admin/capacity',      label: '定員設定',         icon: '👥', group: '予約・体験' },
  // ── 授与品 ──
  { href: '/admin/cod-orders',    label: '代金引換の申込',   icon: '📦', group: '授与品' },
  // ── 通信販売設定 ──
  { href: '/admin/mail-order/weights',  label: '商品重量設定',   icon: '⚖️', group: '通信販売設定' },
  { href: '/admin/mail-order/shipping', label: '送料テーブル設定', icon: '🚚', group: '通信販売設定' },
  // ── 行事 ──
  { href: '/admin/events',        label: '行事カレンダー',   icon: '📅', group: '行事' },
  // ── お問い合わせ ──
  { href: '/admin/contacts',      label: 'お問い合わせ',     icon: '✉️', group: 'お問い合わせ' },
  { href: '/admin/applications',  label: '申請管理',         icon: '📝', group: 'お問い合わせ' },
  // ── 立木観音 ──
  { href: '/admin/top-page',              label: 'トップページ',   icon: '🏠', group: '立木観音' },
  { href: '/admin/chuzenji/history',      label: '歴史',           icon: '📜', group: '立木観音' },
  { href: '/admin/chuzenji/grounds',      label: '境内のご案内',   icon: '🗺️', group: '立木観音' },
  { href: '/admin/chuzenji/flower-calendar', label: '花ごよみ',    icon: '🌸', group: '立木観音' },
  { href: '/admin/chuzenji/about',        label: '拝観案内',       icon: '🎫', group: '立木観音' },
  { href: '/admin/chuzenji/prayer',       label: '御祈願',         icon: '🙏', group: '立木観音' },
  { href: '/admin/chuzenji/prayer-wedding', label: '仏前式（結婚式）', icon: '💐', group: '立木観音' },
  { href: '/admin/chuzenji/gallery',        label: '中禅寺ギャラリー', icon: '🖼️', group: '立木観音' },
  { href: '/admin/chuzenji/goshuin',      label: '御朱印',         icon: '📮', group: '立木観音' },
  { href: '/admin/chuzenji/shakyou',      label: '写経体験',       icon: '✍️', group: '立木観音' },
  { href: '/admin/chuzenji/shabutu',      label: '写仏体験',       icon: '🖌️', group: '立木観音' },
  { href: '/admin/chuzenji/jyuzu',             label: '数珠づくり',       icon: '📿', group: '立木観音' },
  { href: '/admin/chuzenji/jyuzu-gallery',     label: '数珠作り体験ギャラリー', icon: '📷', group: '立木観音' },
  { href: '/admin/chuzenji/zazen',             label: '坐禅体験',         icon: '🧘', group: '立木観音' },
  { href: '/admin/faq',                        label: 'FAQ',              icon: '❓', group: '立木観音' },
  { href: '/admin/chuzenji/events/annual',     label: '年間行事一覧',     icon: '📅', group: '立木観音' },
  { href: '/admin/chuzenji/events/kannonko',   label: '観音講（6/18）',   icon: '🎋', group: '立木観音' },
  { href: '/admin/chuzenji/events/funazento',  label: '船禅頂（8/4）',    icon: '⛵', group: '立木観音' },
  { href: '/admin/chuzenji/events/shogatsu',   label: '正月元旦特別護摩祈願（1/1）', icon: '🎍', group: '立木観音' },
  { href: '/admin/chuzenji/events/minor',      label: '立木法要',   icon: '📌', group: '立木観音' },
  // ── 温泉寺 ──
  { href: '/admin/onsenji/top',           label: 'トップページ',   icon: '🏠', group: '温泉寺' },
  { href: '/admin/onsenji/news',          label: 'お知らせ管理',   icon: '📢', group: '温泉寺' },
  { href: '/admin/onsenji/history',       label: '歴史',           icon: '📜', group: '温泉寺' },
  { href: '/admin/onsenji/grounds',       label: '境内のご案内',   icon: '🗺️', group: '温泉寺' },
  { href: '/admin/onsenji/about',         label: '拝観案内',       icon: '🎫', group: '温泉寺' },
  { href: '/admin/onsenji/goshuin',       label: '御朱印',         icon: '📮', group: '温泉寺' },
  { href: '/admin/onsenji/onsen',         label: '温泉のご案内',   icon: '♨️', group: '温泉寺' },
  { href: '/admin/onsenji/onsen-status',  label: '温泉設定',       icon: '🚦', group: '温泉寺' },
  { href: '/admin/onsenji/faq',           label: 'FAQ',            icon: '❓', group: '温泉寺' },
  { href: '/admin/onsenji/shakyou',       label: '写経体験',       icon: '✍️', group: '温泉寺' },
  { href: '/admin/onsenji/shabutu',       label: '写仏体験',       icon: '🖌️', group: '温泉寺' },
  { href: '/admin/onsenji/jyuzu',              label: '数珠づくり',       icon: '📿', group: '温泉寺' },
  { href: '/admin/onsenji/events/annual',      label: '年間行事一覧',     icon: '📅', group: '温泉寺' },
  { href: '/admin/onsenji/events/yakushiko',   label: '薬師講大祭（8/8）', icon: '🔥', group: '温泉寺' },
  { href: '/admin/onsenji/events/setsubun',    label: '節分大祭（1月）',   icon: '🫘', group: '温泉寺' },
  { href: '/admin/onsenji/events/minor',       label: '温泉寺法要',   icon: '📌', group: '温泉寺' },
  // ── サイト管理 ──
  { href: '/admin/settings',      label: 'サイト設定',       icon: '⚙️', group: 'サイト管理' },
  { href: '/admin/images',        label: '画像管理',         icon: '🖼️', group: 'サイト管理' },
  { href: '/admin/users',         label: '管理者管理',       icon: '👤', group: 'サイト管理' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile } = useAdminProfile()
  const visibleNavItems = getVisibleNavItems(profile?.role)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* モバイル用ヘッダー（ハンバーガーメニュー） */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-navy text-white px-4 py-3 print:hidden">
        <p className="font-serif text-sm">中禅寺 立木観音 管理画面</p>
        <button onClick={() => setMenuOpen(o => !o)} aria-label="メニュー" className="text-2xl leading-none px-1">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* モバイルでメニューを開いた時の背景オーバーレイ */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-20" onClick={() => setMenuOpen(false)} />
      )}

      {/* サイドバー */}
      <aside className={`w-56 bg-navy flex flex-col flex-shrink-0 print:hidden
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-200
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0`}>
        <div className="p-5 border-b border-white/10">
          <p className="text-gold text-[10px] tracking-widest">管理画面</p>
          <p className="text-white font-serif text-sm mt-0.5">中禅寺 立木観音</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {(() => {
            const rendered: React.ReactNode[] = []
            let lastGroup: string | undefined = undefined
            visibleNavItems.forEach(({ href, label, icon, group }) => {
              if (group !== lastGroup) {
                if (group) {
                  const isOnsenji = group === '温泉寺'
                  rendered.push(
                    <div key={`group-${group}`} className={`px-5 pt-4 pb-1 text-[10px] tracking-widest font-medium ${isOnsenji ? 'text-[#7ec8a4]' : 'text-gold/70'}`}>
                      ── {group}
                    </div>
                  )
                } else if (lastGroup) {
                  rendered.push(<div key={`sep-${href}`} className="mx-5 my-2 border-t border-white/10" />)
                }
                lastGroup = group
              }
              // このhrefより下の階層に、専用のナビ項目を持つ子ページがある場合
              // （例：/admin/reservations に対する /admin/reservations/schedule）は、
              // 完全一致のときだけ選択中として扱う。そうしないと子ページを開いた
              // ときに親のリンクまで選択中に見えてしまう（例：予約スケジュールを
              // 開いても予約管理が同時にハイライトされる不具合）。
              const hasChildRoute = navItems.some(item => item.href !== href && item.href.startsWith(`${href}/`))
              const isActive = hasChildRoute ? pathname === href : pathname.startsWith(href)
              rendered.push(
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors
                    ${isActive
                      ? group === '温泉寺' ? 'bg-white/10 text-[#7ec8a4]' : 'bg-white/10 text-gold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              )
            })
            return rendered
          })()}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full text-left text-white/50 hover:text-white text-xs px-2 py-2 transition-colors">
            🚪 ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto pt-12 md:pt-0">
        {children}
      </main>
    </div>
  )
}
