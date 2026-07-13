'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/onsenji/about',              label: '拝観案内' },
  { href: '/onsenji/onsen',              label: '温泉について' },
  { href: '/onsenji#access',             label: 'アクセス' },
  { href: '/onsenji/goshuin',            label: '御朱印' },
  { href: '/onsenji/events',             label: '年間行事' },
  { href: '/onsenji/experience/shakyou', label: '体験' },
  { href: '/onsenji/faq',                label: 'よくある質問' },
  { href: '/onsenji/contact',            label: 'お問い合わせ' },
]

export default function HeaderOnsenji() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-300 bg-onsenji ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ・寺切替 */}
        <div className="flex items-center gap-1">
          {/* 温泉寺（現在地） */}
          <Link href="/onsenji" className="flex items-center gap-2.5">
            <Image src="/images/logo-emblem.png" alt="寺紋" width={34} height={34}
              className="opacity-90 brightness-0 invert sepia saturate-[3] hue-rotate-[120deg]" />
            <div className="leading-tight">
              <span className="block text-[#7ec8a4] text-[9px] tracking-widest">日光山</span>
              <span className="block text-white text-[13px] font-serif tracking-wider">温泉寺</span>
            </div>
          </Link>

          {/* 区切り */}
          <span className="mx-3 h-8 w-px bg-white/20" />

          {/* 立木観音リンク */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="leading-tight">
              <span className="block text-[9px] tracking-widest text-white/40 group-hover:text-gold/70 transition-colors">日光山</span>
              <span className="block text-white/60 text-[13px] font-serif tracking-wider group-hover:text-gold/80 transition-colors">中禅寺 立木観音</span>
            </div>
          </Link>
        </div>

        {/* PC ナビ */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className="text-white/80 hover:text-[#7ec8a4] text-sm tracking-wide transition-colors">{label}</Link>
          ))}
        </nav>

        {/* ハンバーガー */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="メニュー" aria-expanded={menuOpen}>
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="md:hidden bg-onsenji border-t border-white/10">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-white/80 hover:text-[#7ec8a4] border-b border-white/10 text-sm">{label}</Link>
          ))}
          <Link href="/" onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 text-gold/70 hover:text-gold border-b border-white/10 text-sm">
            → 日光山中禅寺 立木観音サイトへ
          </Link>
        </div>
      )}
    </header>
  )
}
