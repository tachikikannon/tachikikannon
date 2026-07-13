'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/about',          label: '拝観案内' },
  { href: '/#access',        label: 'アクセス' },
  { href: '/prayer',         label: '御祈願' },
  { href: '/#experience',    label: '体験' },
  { href: 'https://chuzenji.official.ec/', label: '授与品・通販', external: true },
  { href: '/annual-events',  label: '年間行事' },
  { href: '/faq',            label: 'よくある質問' },
  { href: '/contact',        label: 'お問い合わせ' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-300 bg-navy ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ・寺切替 */}
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo-emblem.png" alt="寺紋" width={34} height={34}
              className="opacity-90 brightness-0 invert sepia saturate-200 hue-rotate-10" />
            <div className="leading-tight">
              <span className="block text-gold text-[9px] tracking-widest">日光山</span>
              <span className="block text-white text-[13px] font-serif tracking-wider">中禅寺 立木観音</span>
            </div>
          </Link>

          {/* 区切り */}
          <span className="mx-3 h-8 w-px bg-white/20" />

          {/* 温泉寺リンク */}
          <Link href="/onsenji" className="flex items-center gap-2 group">
            <div className="leading-tight">
              <span className="block text-[9px] tracking-widest text-white/40 group-hover:text-[#a0c8b8] transition-colors">日光山</span>
              <span className="block text-white/60 text-[13px] font-serif tracking-wider group-hover:text-[#7ec8a4] transition-colors">温泉寺</span>
            </div>
          </Link>
        </div>

        {/* PC ナビ */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map(({ href, label, external }) => (
            external
              ? <a key={href} href={href} target="_blank" rel="noopener"
                  className="text-white/80 hover:text-gold text-sm tracking-wide transition-colors">{label}</a>
              : <Link key={href} href={href}
                  className="text-white/80 hover:text-gold text-sm tracking-wide transition-colors">{label}</Link>
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
        <div className="md:hidden bg-navy border-t border-white/10">
          {navLinks.map(({ href, label, external }) => (
            external
              ? <a key={href} href={href} target="_blank" rel="noopener"
                  className="block px-6 py-3 text-white/80 hover:text-gold border-b border-white/10 text-sm">{label}</a>
              : <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-white/80 hover:text-gold border-b border-white/10 text-sm">{label}</Link>
          ))}
          <Link href="/onsenji" onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 text-[#7ec8a4]/80 hover:text-[#7ec8a4] border-b border-white/10 text-sm">
            → 日光山温泉寺サイトへ
          </Link>
        </div>
      )}
    </header>
  )
}
