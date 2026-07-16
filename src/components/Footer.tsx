import Link from 'next/link'

async function getSiteSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(site_address,site_tel)&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const rows: { key: string; value: string }[] = await res.json()
    return Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch {
    return {}
  }
}

export default async function Footer() {
  const settings = await getSiteSettings()
  const address = settings.site_address ?? '〒321-1661 栃木県日光市中宮祠2578'
  const tel = settings.site_tel ?? '0288-55-0013'

  return (
    <footer className="bg-navy text-white/70">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="text-white font-serif text-lg mb-2">日光山中禅寺 立木観音</p>
            <address className="not-italic text-sm leading-7">
              {address}<br />
              TEL：{tel}
            </address>
          </div>
          <div>
            <h4 className="text-gold text-xs tracking-widest mb-3">ご参拝・ご祈願</h4>
            <ul className="space-y-2 text-sm">
              {[['拝観案内','/about'],['御祈願','/prayer'],['御朱印','/goshuin'],['よくある質問','/faq']].map(([l,h])=>(
                <li key={h}><Link href={h} className="hover:text-gold transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-xs tracking-widest mb-3">授与品・通販</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://chuzenji.official.ec/" target="_blank" rel="noopener" className="hover:text-gold transition-colors">授与品・通販サイト</a></li>
            </ul>
            <h4 className="text-gold text-xs tracking-widest mt-5 mb-3">輪王寺関連</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.rinnoji.or.jp/" target="_blank" rel="noopener" className="hover:text-gold transition-colors">輪王寺 公式サイト</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <ul className="flex gap-4">
            <li><Link href="/privacy" className="hover:text-gold transition-colors">プライバシーポリシー</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">お問い合わせ</Link></li>
            <li><Link href="/apply" className="hover:text-gold transition-colors">各種申請のお問い合わせ</Link></li>
          </ul>
          <p>&copy; {new Date().getFullYear()} 日光山中禅寺 立木観音. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
