'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/about',   label: '拝観案内' },
  { href: '/#access', label: 'アクセス' },
  { href: '/prayer',  label: '御祈願' },
  { href: '/goshuin', label: '御朱印' },
  { href: 'https://chuzenji.official.ec/', label: '授与品・通販', external: true },
  { href: '/contact', label: 'お問い合わせ' },
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
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo-emblem.png" alt="寺紋" width={36} height={36}
            className="opacity-90 brightness-0 invert sepia saturate-200 hue-rotate-10" />
          <div className="leading-tight">
            <span className="block text-gold text-[10px] tracking-widest">日光山</span>
            <span className="block text-white text-sm font-serif tracking-wider">中禅寺 立木観音</span>
          </div>
        </Link>

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
        </div>
      )}
    </header>
  )
}
