'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'

export default function HeaderOnsenji() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('onsenjiHeader')
  const tc = useTranslations('common')

  const navLinks = [
    { href: '/onsenji/about',      label: t('about') },
    { href: '/onsenji/grounds',    label: t('grounds') },
    { href: '/onsenji#access',     label: t('access') },
    { href: '/onsenji#experience', label: t('experience') },
    { href: '/onsenji/goshuin',    label: t('goshuin') },
    { href: '/onsenji/events',     label: t('annualEvents') },
    { href: '/onsenji/faq',        label: t('faq') },
    { href: '/onsenji/contact',    label: t('contact') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'ja' ? 'en' : 'ja'
  const switchLocale = () => router.replace(pathname, { locale: otherLocale })
  // 英語はラベルが長く、日本語と同じmdブレークポイントだと中途半端な幅で折り返して崩れるため、
  // 英語のときだけ横並びナビに切り替わる幅をlgまで遅らせる。
  const isEnglish = locale === 'en'

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-300 bg-onsenji ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ・寺切替 */}
        <div className="flex items-center gap-1">
          {/* 温泉寺（現在地） */}
          <Link href="/onsenji" className="flex items-center gap-2.5">
            <Image src="/images/common/logo-emblem.png" alt="寺紋" width={34} height={34}
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
        <nav className={isEnglish ? 'hidden xl:flex items-center gap-4' : 'hidden md:flex items-center gap-6'}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className="text-white/80 hover:text-[#7ec8a4] text-sm tracking-wide transition-colors">{label}</Link>
          ))}
          <button onClick={switchLocale}
            className="text-white/60 hover:text-[#7ec8a4] text-xs tracking-wide border border-white/30 rounded px-2 py-1 transition-colors">
            {tc('langSwitch')}
          </button>
        </nav>

        {/* ハンバーガー */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className={`${isEnglish ? 'xl:hidden' : 'md:hidden'} flex flex-col gap-1.5 p-2`}
          aria-label="メニュー" aria-expanded={menuOpen}>
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className={`${isEnglish ? 'xl:hidden' : 'md:hidden'} bg-onsenji border-t border-white/10`}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-white/80 hover:text-[#7ec8a4] border-b border-white/10 text-sm">{label}</Link>
          ))}
          <Link href="/" onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 text-gold/70 hover:text-gold border-b border-white/10 text-sm">
            {t('chuzenjiLink')}
          </Link>
          <button onClick={() => { switchLocale(); setMenuOpen(false) }}
            className="block w-full text-left px-6 py-3 text-white/60 hover:text-[#7ec8a4] text-sm">
            {tc('langSwitch')}
          </button>
        </div>
      )}
    </header>
  )
}
