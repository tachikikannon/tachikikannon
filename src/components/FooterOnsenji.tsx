import Link from 'next/link'

async function getSiteSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    // Footerは全ページで読み込まれるため、no-storeのままだとページビューのたびに
    // Supabaseへ問い合わせが発生する（2026-09-02のCached Egress超過の一因）
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(onsenji_address,onsenji_tel,onsenji_fax)&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
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
  const address = settings.onsenji_address ?? '栃木県日光市湯元2559'
  const tel = settings.onsenji_tel ?? '0288-55-0013'
  const fax = settings.onsenji_fax ?? '0288-55-0801'

  return (
    <footer className="bg-onsenji text-white/70">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-serif text-lg mb-2">日光山 温泉寺</p>
            <address className="not-italic text-sm leading-7">
              {address}<br />
              TEL：{tel}<br />
              FAX：{fax}
            </address>
          </div>
          <div>
            <h4 className="text-[#7ec8a4] text-xs tracking-widest mb-3">ご参拝</h4>
            <ul className="space-y-2 text-sm">
              {[['拝観案内','/onsenji/about'],['薬師の湯','/onsenji/onsen'],['御朱印','/onsenji/goshuin'],['よくある質問','/onsenji/faq']].map(([l,h])=>(
                <li key={h}><Link href={h} className="hover:text-[#7ec8a4] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#7ec8a4] text-xs tracking-widest mb-3">関連サイト</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#7ec8a4] transition-colors">日光山中禅寺 立木観音</Link></li>
              <li><a href="https://www.rinnoji.or.jp/" target="_blank" rel="noopener" className="hover:text-[#7ec8a4] transition-colors">輪王寺 公式サイト</a></li>
              <li><a href="https://www.nikkoyumoto.com/" target="_blank" rel="noopener" className="hover:text-[#7ec8a4] transition-colors">奥日光湯元温泉旅館協同組合</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#7ec8a4] text-xs tracking-widest mb-3">各種申請</h4>
            <ul className="flex flex-wrap text-sm mb-5">
              {[
                ['団体予約', '団体予約申請'],
                ['減免申請', '減免申請'],
                ['写真貸出', '写真使用・貸出し許可申請'],
                ['撮影取材', '撮影・取材申請'],
              ].map(([l, category], i, arr) => (
                <li key={category} className="flex items-center">
                  <Link href={`/onsenji/apply?category=${encodeURIComponent(category)}`} className="hover:text-[#7ec8a4] transition-colors">{l}</Link>
                  {i < arr.length - 1 && <span className="text-white/20 mx-1.5">・</span>}
                </li>
              ))}
            </ul>
            <h4 className="text-[#7ec8a4] text-xs tracking-widest mb-3">お問い合わせ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/onsenji/contact" className="hover:text-[#7ec8a4] transition-colors">お問い合わせフォーム</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <ul className="flex gap-4">
            <li><Link href="/privacy" className="hover:text-[#7ec8a4] transition-colors">プライバシーポリシー</Link></li>
          </ul>
          <p>&copy; {new Date().getFullYear()} 日光山 温泉寺. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
