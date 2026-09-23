'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
function isNavItemVisible(item: NavItem, role: AdminRole | undefined): boolean {
  switch (role) {
    case 'reservation_search_admin':
      return RESERVATION_ADMIN_ALLOWED_PATHS.includes(item.href)
    case 'reservation_admin':
      return item.group === RESERVATION_GROUP
    case 'contact_admin':
      return item.group === CONTACT_GROUP
    case 'admin':
    case 'viewer':
      return item.group === RESERVATION_GROUP || item.group === CONTACT_GROUP
    default:
      // super_admin、またはロール未取得（読み込み中）はフィルタしない
      return true
  }
}

const CHUZENJI_EVENTS_GROUP = '立木観音 行事・法要'
const CHUZENJI_PAGES_GROUP = '立木観音 ページ編集'
const ONSENJI_EVENTS_GROUP = '温泉寺 行事・法要'
const ONSENJI_PAGES_GROUP = '温泉寺 ページ編集'
const isOnsenjiGroup = (group: string | undefined) => group?.startsWith('温泉寺') ?? false

const navItems: NavItem[] = [
  { href: '/admin',               label: 'ダッシュボード',   icon: '🏠' },
  { href: '/admin/news',          label: 'お知らせ（立木観音）', icon: '📢' },
  { href: '/admin/blog',          label: 'ブログ',           icon: '✏️' },
  // ── 予約・体験 ──
  { href: '/admin/reservations',  label: '予約検索',         icon: '📋', group: RESERVATION_GROUP },
  { href: '/admin/reservations/schedule', label: '予約スケジュール', icon: '🗓️', group: RESERVATION_GROUP },
  { href: '/admin/reservations/availability', label: '空き状況の詳細設定', icon: '🕒', group: RESERVATION_GROUP },
  { href: '/admin/reservations/categories', label: '予約区分の管理', icon: '🏷️', group: RESERVATION_GROUP },
  { href: '/admin/blocked-dates', label: '予約不可日',       icon: '🚫', group: RESERVATION_GROUP },
  { href: '/admin/capacity',      label: '定員設定',         icon: '👥', group: RESERVATION_GROUP },
  // ── お問い合わせ ──
  { href: '/admin/contacts',      label: 'お問い合わせ',     icon: '✉️', group: CONTACT_GROUP },
  { href: '/admin/applications',  label: '申請管理',         icon: '📝', group: CONTACT_GROUP },
  // ── 授与品・通信販売 ──
  { href: '/admin/cod-orders',    label: '代金引換の申込',   icon: '📦', group: '授与品・通信販売' },
  { href: '/admin/mail-order/weights',  label: '商品重量設定',   icon: '⚖️', group: '授与品・通信販売' },
  { href: '/admin/mail-order/shipping', label: '送料テーブル設定', icon: '🚚', group: '授与品・通信販売' },
  // ── 立木観音 行事・法要 ──
  { href: '/admin/chuzenji/events-banner',     label: 'イベント情報',     icon: '📣', group: CHUZENJI_EVENTS_GROUP },
  { href: '/admin/chuzenji/events/annual',     label: '年間行事一覧',     icon: '📅', group: CHUZENJI_EVENTS_GROUP },
  { href: '/admin/chuzenji/events/kannonko',   label: '観音講（6/18）',   icon: '🎋', group: CHUZENJI_EVENTS_GROUP },
  { href: '/admin/chuzenji/events/funazento',  label: '船禅頂（8/4）',    icon: '⛵', group: CHUZENJI_EVENTS_GROUP },
  { href: '/admin/chuzenji/events/shogatsu',   label: '正月元旦特別護摩祈願（1/1）', icon: '🎍', group: CHUZENJI_EVENTS_GROUP },
  { href: '/admin/chuzenji/events/minor',      label: '立木法要',         icon: '📌', group: CHUZENJI_EVENTS_GROUP },
  { href: '/admin/events',                     label: '行事カレンダー',   icon: '🗓️', group: CHUZENJI_EVENTS_GROUP },
  // ── 立木観音 ページ編集 ──
  { href: '/admin/top-page',              label: 'トップページ',   icon: '🏠', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/history',      label: '歴史',           icon: '📜', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/grounds',      label: '境内のご案内',   icon: '🗺️', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/flower-calendar', label: '花ごよみ',    icon: '🌸', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/about',        label: '拝観案内',       icon: '🎫', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/prayer',       label: '御祈願',         icon: '🙏', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/shakyou',      label: '写経体験',       icon: '✍️', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/shabutu',      label: '写仏体験',       icon: '🖌️', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/jyuzu',        label: '数珠づくり',     icon: '📿', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/zazen',        label: '坐禅体験',       icon: '🧘', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/goshuin',      label: '御朱印',         icon: '📮', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/chuzenji/prayer-wedding', label: '仏前式（結婚式）', icon: '💐', group: CHUZENJI_PAGES_GROUP },
  { href: '/admin/faq',                   label: 'FAQ',            icon: '❓', group: CHUZENJI_PAGES_GROUP },
  // ── 温泉寺 行事・法要 ──
  { href: '/admin/onsenji/events/annual',      label: '年間行事一覧',     icon: '📅', group: ONSENJI_EVENTS_GROUP },
  { href: '/admin/onsenji/events/yakushiko',   label: '薬師講大祭（8/8）', icon: '🔥', group: ONSENJI_EVENTS_GROUP },
  { href: '/admin/onsenji/events/setsubun',    label: '節分大祭（1月）',   icon: '🫘', group: ONSENJI_EVENTS_GROUP },
  { href: '/admin/onsenji/events/minor',       label: '温泉寺法要',       icon: '📌', group: ONSENJI_EVENTS_GROUP },
  // ── 温泉寺 ページ編集 ──
  { href: '/admin/onsenji/top',           label: 'トップページ',   icon: '🏠', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/news',          label: 'お知らせ管理',   icon: '📢', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/history',       label: '歴史',           icon: '📜', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/grounds',       label: '境内のご案内',   icon: '🗺️', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/about',         label: '拝観案内',       icon: '🎫', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/goshuin',       label: '御朱印',         icon: '📮', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/onsen',         label: '温泉のご案内',   icon: '♨️', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/onsen-status',  label: '温泉設定',       icon: '🚦', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/shakyou',       label: '写経体験',       icon: '✍️', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/shabutu',       label: '写仏体験',       icon: '🖌️', group: ONSENJI_PAGES_GROUP },
  { href: '/admin/onsenji/faq',           label: 'FAQ',            icon: '❓', group: ONSENJI_PAGES_GROUP },
  // ── サイト管理 ──
  { href: '/admin/settings',      label: 'サイト設定',       icon: '⚙️', group: 'サイト管理' },
  { href: '/admin/images',        label: '画像管理',         icon: '🖼️', group: 'サイト管理' },
  { href: '/admin/chuzenji/gallery',       label: '中禅寺ギャラリー', icon: '🖼️', group: 'サイト管理' },
  { href: '/admin/chuzenji/jyuzu-gallery', label: '数珠作り体験ギャラリー', icon: '📷', group: 'サイト管理' },
  { href: '/admin/users',         label: '管理者管理',       icon: '👤', group: 'サイト管理' },
  { href: '/admin/activity-logs', label: '編集履歴',         icon: '🕓', group: 'サイト管理' },
]

// ── サイドバーの並び替え（端末ごとに localStorage へ保存） ──
// グループの順番と、各グループ内の項目の順番を別々に持つ。
// グループなしの先頭項目（ダッシュボード等）はキー '' のグループとして扱う
type NavSection = { group: string; items: NavItem[] }
type NavOrder = { groups: string[]; items: Record<string, string[]> }
const NAV_ORDER_KEY = 'admin-nav-order-v1'

function defaultSections(): NavSection[] {
  const sections: NavSection[] = []
  navItems.forEach(item => {
    const group = item.group ?? ''
    const last = sections[sections.length - 1]
    if (last && last.group === group) last.items.push(item)
    else sections.push({ group, items: [item] })
  })
  return sections
}

// 保存済みの順番を当てはめる。保存後に追加された項目・グループは既定の位置（末尾）に並ぶ
function sortByOrder<T>(list: T[], keyOf: (t: T) => string, order: string[] | undefined): T[] {
  if (!order) return list
  const rank = (t: T) => { const i = order.indexOf(keyOf(t)); return i === -1 ? order.length : i }
  return list.map((t, i) => ({ t, i })).sort((a, b) => rank(a.t) - rank(b.t) || a.i - b.i).map(x => x.t)
}

// 項目はカテゴリーをまたいで移動できるので、保存済みの order.items に載っている
// カテゴリーへ入れる。保存後に追加された項目だけは本来のカテゴリーの末尾に並ぶ。
// ロールによる表示の絞り込みは item.group（本来のカテゴリー）で判定するため、
// 見た目のカテゴリーを移しても権限には影響しない
function applyOrder(order: NavOrder | null): NavSection[] {
  const sections = defaultSections()
  if (!order) return sections
  const byHref = new Map(navItems.map(i => [i.href, i]))
  const placed = new Set<string>()
  const result = sortByOrder(sections, s => s.group, order.groups).map(s => {
    const items = (order.items[s.group] ?? [])
      .map(href => byHref.get(href))
      .filter((i): i is NavItem => !!i && !placed.has(i.href))
    items.forEach(i => placed.add(i.href))
    return { group: s.group, items }
  })
  navItems.forEach(item => {
    if (placed.has(item.href)) return
    result.find(s => s.group === (item.group ?? ''))?.items.push(item)
  })
  return result
}

function loadNavOrder(): NavOrder | null {
  try {
    const raw = localStorage.getItem(NAV_ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveNavOrder(order: NavOrder | null) {
  try {
    if (order) localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(order))
    else localStorage.removeItem(NAV_ORDER_KEY)
  } catch { /* 保存できない環境では並び替えはその場限りになる */ }
}

function moveInArray<T>(arr: T[], index: number, delta: number): T[] {
  const to = index + delta
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  ;[next[index], next[to]] = [next[to], next[index]]
  return next
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile } = useAdminProfile()
  const [navOrder, setNavOrder] = useState<NavOrder | null>(null)
  const [reorderMode, setReorderMode] = useState(false)
  // localStorage はサーバー描画時に読めないため、表示後に読み込む
  useEffect(() => { setNavOrder(loadNavOrder()) }, [])
  const sections = applyOrder(navOrder)

  function updateOrder(next: NavSection[]) {
    const order: NavOrder = {
      groups: next.map(s => s.group),
      items: Object.fromEntries(next.map(s => [s.group, s.items.map(i => i.href)])),
    }
    setNavOrder(order)
    saveNavOrder(order)
  }
  function moveGroup(index: number, delta: number) {
    updateOrder(moveInArray(sections, index, delta))
  }
  // カテゴリーの端にある項目をさらに上下へ動かすと、隣のカテゴリーへ移る
  // （上へ→前のカテゴリーの末尾、下へ→次のカテゴリーの先頭）
  function moveItem(sectionIndex: number, itemIndex: number, delta: number) {
    const section = sections[sectionIndex]
    const to = itemIndex + delta
    if (to >= 0 && to < section.items.length) {
      updateOrder(sections.map((s, i) => i === sectionIndex ? { ...s, items: moveInArray(s.items, itemIndex, delta) } : s))
      return
    }
    const targetIndex = sectionIndex + delta
    if (targetIndex < 0 || targetIndex >= sections.length) return
    const item = section.items[itemIndex]
    updateOrder(sections.map((s, i) => {
      if (i === sectionIndex) return { ...s, items: s.items.filter((_, j) => j !== itemIndex) }
      if (i === targetIndex) return { ...s, items: delta < 0 ? [...s.items, item] : [item, ...s.items] }
      return s
    }))
  }
  function resetOrder() {
    if (!confirm('メニューの並び順を初期状態に戻しますか？')) return
    setNavOrder(null)
    saveNavOrder(null)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    // スマホでは min-h-screen（100vh）だと、アドレスバーの表示/非表示で
    // ビューポート高さが変わるたびに本体（body）ごとスクロール可能になり、
    // 画面全体が上下にバウンドして見える不具合があった。svhで高さを固定し
    // overflow-hiddenで本体自体はスクロールさせず、中身（<main>）だけを
    // スクロール領域にすることで、ヘッダー・サイドバーが常に画面に固定されて見えるようにした
    <div className="h-[100svh] flex bg-gray-100 overflow-hidden">
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
            const arrowClass = 'w-6 h-6 flex items-center justify-center rounded text-[10px] text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent'
            const arrows = (upDisabled: boolean, downDisabled: boolean, onMove: (delta: number) => void, label: string) => (
              <span className="ml-auto flex gap-0.5 flex-shrink-0">
                <button type="button" aria-label={`${label}を上へ`} disabled={upDisabled} onClick={() => onMove(-1)} className={arrowClass}>▲</button>
                <button type="button" aria-label={`${label}を下へ`} disabled={downDisabled} onClick={() => onMove(1)} className={arrowClass}>▼</button>
              </span>
            )
            let renderedAny = false
            sections.forEach((section, sectionIndex) => {
              const { group } = section
              const items = section.items.filter(item => isNavItemVisible(item, profile?.role))
              // 並び替え中は空のカテゴリーも見出しを出し、項目を戻せるようにする
              if (items.length === 0 && !reorderMode) return
              const isOnsenji = isOnsenjiGroup(group)
              const groupArrows = () => arrows(sectionIndex === 0, sectionIndex === sections.length - 1, d => moveGroup(sectionIndex, d), group || '基本')
              if (group) {
                rendered.push(
                  <div key={`group-${group}`} className={`flex items-center px-5 pt-4 pb-1 text-[10px] tracking-widest font-medium ${isOnsenji ? 'text-[#7ec8a4]' : 'text-gold/70'}`}>
                    <span>── {group}</span>
                    {reorderMode && groupArrows()}
                  </div>
                )
              } else if (renderedAny || reorderMode) {
                rendered.push(
                  <div key="group-top" className="flex items-center px-5 pt-3 pb-1 text-[10px] tracking-widest font-medium text-gold/70">
                    {reorderMode ? <span>── 基本</span> : <span className="flex-1 border-t border-white/10" />}
                    {reorderMode && groupArrows()}
                  </div>
                )
              }
              renderedAny = true
              if (reorderMode && items.length === 0) {
                rendered.push(<p key={`empty-${group}`} className="pl-5 py-1 text-[11px] text-white/30">（項目なし）</p>)
              }
              items.forEach(({ href, label, icon }, itemIndex) => {
                if (reorderMode) {
                  rendered.push(
                    <div key={href} className="flex items-center gap-3 pl-5 pr-3 py-1.5 text-sm text-white/80">
                      <span>{icon}</span>
                      <span className="truncate">{label}</span>
                      {arrows(
                        sectionIndex === 0 && itemIndex === 0,
                        sectionIndex === sections.length - 1 && itemIndex === items.length - 1,
                        d => moveItem(sectionIndex, itemIndex, d), label)}
                    </div>
                  )
                  return
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
                        ? isOnsenji ? 'bg-white/10 text-[#7ec8a4]' : 'bg-white/10 text-gold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                    <span>{icon}</span>
                    <span>{label}</span>
                  </Link>
                )
              })
            })
            return rendered
          })()}
        </nav>
        {/* 並び替えは全項目が見える super_admin だけ（他ロールは表示項目が少なく、
            非表示の項目と入れ替わって動かないように見えるため） */}
        {profile?.role === 'super_admin' && <div className="px-4 pt-3 border-t border-white/10 flex items-center gap-3 text-xs">
          <button onClick={() => setReorderMode(m => !m)}
            className={`px-2 py-1.5 rounded transition-colors ${reorderMode ? 'bg-gold text-navy font-medium' : 'text-white/50 hover:text-white'}`}>
            {reorderMode ? '✓ 並び替えを終了' : '↕ メニューの並び替え'}
          </button>
          {reorderMode && navOrder && (
            <button onClick={resetOrder} className="text-white/50 hover:text-white underline">初期状態に戻す</button>
          )}
        </div>}
        <div className={`p-4 ${profile?.role === 'super_admin' ? 'pt-1' : 'border-t border-white/10'}`}>
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
