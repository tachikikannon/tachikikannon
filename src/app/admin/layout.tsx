'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type NavItem = { href: string; label: string; icon: string; group?: string }

const navItems: NavItem[] = [
  { href: '/admin',               label: 'ダッシュボード',   icon: '🏠' },
  { href: '/admin/news',          label: 'お知らせ',         icon: '📢' },
  { href: '/admin/blog',          label: 'ブログ',           icon: '✏️' },
  { href: '/admin/events',        label: '行事カレンダー',   icon: '📅' },
  { href: '/admin/reservations',  label: '予約管理',         icon: '📋' },
  { href: '/admin/blocked-dates', label: '予約不可日',       icon: '🚫' },
  { href: '/admin/capacity',      label: '定員設定',         icon: '👥' },
  // ── 立木観音 ──
  { href: '/admin/top-page',              label: 'トップページ',   icon: '🏠', group: '立木観音' },
  { href: '/admin/chuzenji/history',      label: '歴史',           icon: '📜', group: '立木観音' },
  { href: '/admin/chuzenji/grounds',      label: '境内のご案内',   icon: '🗺️', group: '立木観音' },
  { href: '/admin/chuzenji/about',        label: '拝観案内',       icon: '🎫', group: '立木観音' },
  { href: '/admin/chuzenji/prayer',       label: '御祈願',         icon: '🙏', group: '立木観音' },
  { href: '/admin/chuzenji/goshuin',      label: '御朱印',         icon: '📮', group: '立木観音' },
  { href: '/admin/chuzenji/shakyou',      label: '写経体験',       icon: '✍️', group: '立木観音' },
  { href: '/admin/chuzenji/shabutu',      label: '写仏体験',       icon: '🖌️', group: '立木観音' },
  { href: '/admin/chuzenji/jyuzu',             label: '数珠づくり',       icon: '📿', group: '立木観音' },
  { href: '/admin/faq',                        label: 'FAQ',              icon: '❓', group: '立木観音' },
  { href: '/admin/chuzenji/events/kannonko',   label: '観音講（6/18）',   icon: '🎋', group: '立木観音' },
  { href: '/admin/chuzenji/events/funazento',  label: '船禅頂（8/4）',    icon: '⛵', group: '立木観音' },
  // ── 温泉寺 ──
  { href: '/admin/onsenji/top',           label: 'トップページ',   icon: '🏠', group: '温泉寺' },
  { href: '/admin/onsenji/history',       label: '歴史',           icon: '📜', group: '温泉寺' },
  { href: '/admin/onsenji/grounds',       label: '境内のご案内',   icon: '🗺️', group: '温泉寺' },
  { href: '/admin/onsenji/about',         label: '拝観案内',       icon: '🎫', group: '温泉寺' },
  { href: '/admin/onsenji/prayer',        label: '御祈願',         icon: '🙏', group: '温泉寺' },
  { href: '/admin/onsenji/goshuin',       label: '御朱印',         icon: '📮', group: '温泉寺' },
  { href: '/admin/onsenji/faq',           label: 'FAQ',            icon: '❓', group: '温泉寺' },
  { href: '/admin/onsenji/shakyou',       label: '写経体験',       icon: '✍️', group: '温泉寺' },
  { href: '/admin/onsenji/shabutu',       label: '写仏体験',       icon: '🖌️', group: '温泉寺' },
  { href: '/admin/onsenji/jyuzu',              label: '数珠づくり',       icon: '📿', group: '温泉寺' },
  { href: '/admin/onsenji/events/yakushiko',   label: '薬師講大祭（8/8）', icon: '🔥', group: '温泉寺' },
  { href: '/admin/onsenji/events/setsubun',    label: '節分大祭（1月）',   icon: '🫘', group: '温泉寺' },
  // ── 共通 ──
  { href: '/admin/settings',      label: 'サイト設定',       icon: '⚙️' },
  { href: '/admin/contacts',      label: 'お問い合わせ',     icon: '✉️' },
  { href: '/admin/applications',  label: '申請管理',         icon: '📝' },
  { href: '/admin/images',        label: '画像管理',         icon: '🖼️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* サイドバー */}
      <aside className="w-56 bg-navy flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <p className="text-gold text-[10px] tracking-widest">管理画面</p>
          <p className="text-white font-serif text-sm mt-0.5">中禅寺 立木観音</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {(() => {
            const rendered: React.ReactNode[] = []
            let lastGroup: string | undefined = undefined
            navItems.forEach(({ href, label, icon, group }) => {
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
              const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
              rendered.push(
                <Link key={href} href={href}
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
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
