import Link from 'next/link'

async function getSiteSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(onsenji_address,onsenji_tel,onsenji_fax)&select=key,value`, {
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

export default async function FooterOnsenji() {
  const settings = await getSiteSettings()
  const address = settings.onsenji_address ?? '〒321-1494 栃木県日光市山内2300'
  const tel = settings.onsenji_tel ?? '0288-54-0560'

  return (
    <footer className="bg-onsenji text-white/70">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="text-white font-serif text-lg mb-2">日光山 温泉寺</p>
            <address className="not-italic text-sm leading-7">
              {address}<br />
              TEL：{tel}
            </address>
          </div>
          <div>
            <h4 className="text-[#7ec8a4] text-xs tracking-widest mb-3">ご参拝・ご祈願</h4>
            <ul className="space-y-2 text-sm">
              {[['拝観案内','/onsenji/about'],['御祈願','/onsenji/prayer'],['御朱印','/onsenji/goshuin'],['よくある質問','/onsenji/faq']].map(([l,h])=>(
                <li key={h}><Link href={h} className="hover:text-[#7ec8a4] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#7ec8a4] text-xs tracking-widest mb-3">関連サイト</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#7ec8a4] transition-colors">日光山中禅寺 立木観音</Link></li>
              <li><a href="https://www.rinnoji.or.jp/" target="_blank" rel="noopener" className="hover:text-[#7ec8a4] transition-colors">輪王寺 公式サイト</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <ul className="flex gap-4">
            <li><Link href="/privacy" className="hover:text-[#7ec8a4] transition-colors">プライバシーポリシー</Link></li>
            <li><Link href="/onsenji/contact" className="hover:text-[#7ec8a4] transition-colors">お問い合わせ</Link></li>
          </ul>
          <p>&copy; {new Date().getFullYear()} 日光山 温泉寺. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
