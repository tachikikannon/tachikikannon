const SITE_URL = 'https://tachikikannon.vercel.app'

async function getSiteSettings(keys: string[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys.join(',')})&select=key,value`, {
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

// noindex解除と同時に効力を持つ（noindexの間はGoogleがクロールしないため無害）
export async function ChuzenjiStructuredData() {
  const settings = await getSiteSettings(['site_address', 'site_tel'])
  const tel = settings.site_tel ?? '0288-55-0013'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['PlaceOfWorship', 'TouristAttraction'],
    name: '日光山中禅寺 立木観音',
    alternateName: 'Nikkozan Chuzenji Temple (Tachiki Kannon)',
    url: SITE_URL,
    image: `${SITE_URL}/images/chuzenji/common/main2.png`,
    telephone: tel,
    description: '中禅寺湖畔に佇む、祈りと巡礼の寺。栃木県日光市中宮祠2578。拝観・御祈願・御朱印・写経体験のご案内。',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '中宮祠2578',
      addressLocality: '日光市',
      addressRegion: '栃木県',
      postalCode: '321-1661',
      addressCountry: 'JP',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export async function OnsenjiStructuredData() {
  const settings = await getSiteSettings(['onsenji_address', 'onsenji_tel'])
  const tel = settings.onsenji_tel ?? '0288-55-0013'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['PlaceOfWorship', 'TouristAttraction'],
    name: '日光山温泉寺',
    alternateName: 'Nikkozan Onsenji Temple',
    url: `${SITE_URL}/onsenji`,
    image: `${SITE_URL}/images/onsenji/hero/onsenji-main.png`,
    telephone: tel,
    description: '中禅寺湖畔に佇む、日光山温泉寺の公式サイト。栃木県日光市湯元2559。薬師瑠璃光如来をお祀りする温泉と祈りの霊場。拝観・御朱印・写経体験・薬師の湯のご案内。',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '湯元2559',
      addressLocality: '日光市',
      addressRegion: '栃木県',
      addressCountry: 'JP',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
