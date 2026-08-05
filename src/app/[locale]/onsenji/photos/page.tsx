export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import type { Media } from '@/types'

export const metadata: Metadata = { title: '貸出用写真一覧 | 日光山温泉寺' }

async function getLendablePhotos(): Promise<Media[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/media?is_lendable=eq.true&site=eq.onsenji&select=*&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

export default async function OnsenjiPhotosPage() {
  const photos = await getLendablePhotos()

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-5xl mx-auto"><Link href="/onsenji">ホーム</Link> &gt; 貸出用写真一覧</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-2xl md:text-3xl font-serif text-onsenji mb-1">貸出用写真一覧</h1>
          <div className="w-10 h-0.5 bg-[#7ec8a4] mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            使用・貸出が可能な写真をご紹介しています。ご希望の写真がございましたら「この写真を申請する」ボタンより申請フォームにお進みください。
          </p>

          {photos.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-16">現在、貸出用の写真はありません。</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {photos.map((item, i) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                  <div className="relative h-36">
                    <ZoomableImage src={item.public_url} alt={`貸出用写真 ${i + 1}`} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600 mb-2">写真 {i + 1}</p>
                    <Link href={`/onsenji/apply?category=${encodeURIComponent('写真使用・貸出し許可申請')}&photo=${encodeURIComponent(item.id)}`}
                      className="block text-center text-xs px-3 py-2 bg-onsenji text-white rounded-full hover:bg-onsenji/80 transition-colors">
                      この写真を申請する
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
