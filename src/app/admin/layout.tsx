'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const navItems = [
  { href: '/admin',              label: 'ダッシュボード', icon: '🏠' },
  { href: '/admin/news',         label: 'お知らせ',       icon: '📢' },
  { href: '/admin/blog',         label: 'ブログ',         icon: '✏️' },
  { href: '/admin/events',       label: '行事カレンダー', icon: '📅' },
  { href: '/admin/reservations',  label: '予約管理',       icon: '📋' },
  { href: '/admin/blocked-dates', label: '予約不可日',     icon: '🚫' },
  { href: '/admin/contacts',      label: 'お問い合わせ',   icon: '✉️' },
  { href: '/admin/images',        label: '画像管理',       icon: '🖼️' },
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
        <nav className="flex-1 py-4">
          {navItems.map(({ href, label, icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors
                  ${isActive ? 'bg-white/10 text-gold' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
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
