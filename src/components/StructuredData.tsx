import type { Locale } from '@/i18n/routing'

const SITE_URL = process.env.SITE_URL || 'https://tachikikannon.vercel.app'

const SAME_AS = [
  'https://www.instagram.com/tachikikannon/',
  'https://x.com/tachikikannon13',
  'https://www.youtube.com/channel/UCAgVoWanU8Yetmnk6bpXCww',
  'https://www.tiktok.com/@tachikikannon',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

// 拝観時間（4〜10月 8:00〜17:00／11月・3月 8:00〜16:00／12〜2月 8:30〜15:30）を
// 実行時の年を使って生成する。年をハードコードしないことで来年以降も更新不要にする
function chuzenjiOpeningHours() {
  const y = new Date().getFullYear()
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
  const febEnd = isLeap ? '02-29' : '02-28'
  const seasons: { from: string; through: string; opens: string; closes: string }[] = [
    { from: `${y}-01-01`, through: `${y}-${febEnd}`, opens: '08:30', closes: '15:30' },
    { from: `${y}-03-01`, through: `${y}-03-31`, opens: '08:00', closes: '16:00' },
    { from: `${y}-04-01`, through: `${y}-10-31`, opens: '08:00', closes: '17:00' },
    { from: `${y}-11-01`, through: `${y}-11-30`, opens: '08:00', closes: '16:00' },
    { from: `${y}-12-01`, through: `${y}-12-31`, opens: '08:30', closes: '15:30' },
  ]
  return seasons.map(s => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: DAYS,
    opens: s.opens,
    closes: s.closes,
    validFrom: s.from,
    validThrough: s.through,
  }))
}

// noindex解除と同時に効力を持つ（noindexの間はGoogleがクロールしないため無害）
export async function ChuzenjiStructuredData({ locale }: { locale: Locale }) {
  const settings = await getSiteSettings(['site_address', 'site_tel'])
  const tel = settings.site_tel ?? '0288-55-0013'
  const isEn = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['BuddhistTemple', 'TouristAttraction'],
    name: isEn ? 'Nikkozan Chuzenji Tachiki Kannon' : '日光山中禅寺 立木観音',
    alternateName: 'Nikkozan Chuzenji Temple (Tachiki Kannon)',
    url: SITE_URL,
    image: `${SITE_URL}/images/chuzenji/common/main2.png`,
    telephone: tel,
    description: isEn
      ? 'A temple of prayer and pilgrimage on the shore of Lake Chuzenji, Nikko. 2578 Chugushi, Nikko, Tochigi 321-1661, Japan. Visiting hours, prayer services, goshuin stamps, and sutra-copying experiences.'
      : '中禅寺湖畔に佇む、祈りと巡礼の寺。栃木県日光市中宮祠2578。拝観・御祈願・御朱印・写経体験のご案内。',
    address: isEn
      ? {
          '@type': 'PostalAddress',
          streetAddress: '2578 Chugushi',
          addressLocality: 'Nikko',
          addressRegion: 'Tochigi',
          postalCode: '321-1661',
          addressCountry: 'JP',
        }
      : {
          '@type': 'PostalAddress',
          streetAddress: '中宮祠2578',
          addressLocality: '日光市',
          addressRegion: '栃木県',
          postalCode: '321-1661',
          addressCountry: 'JP',
        },
    sameAs: SAME_AS,
    openingHoursSpecification: chuzenjiOpeningHours(),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export async function OnsenjiStructuredData({ locale }: { locale: Locale }) {
  const settings = await getSiteSettings(['onsenji_address', 'onsenji_tel'])
  const tel = settings.onsenji_tel ?? '0288-55-0013'
  const isEn = locale === 'en'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['BuddhistTemple', 'TouristAttraction'],
    name: isEn ? 'Nikkozan Onsenji Temple' : '日光山温泉寺',
    alternateName: 'Nikkozan Onsenji Temple',
    url: `${SITE_URL}/onsenji`,
    image: `${SITE_URL}/images/onsenji/hero/onsenji-main.png`,
    telephone: tel,
    description: isEn
      ? 'The official site of Nikkozan Onsenji Temple on the shore of Lake Chuzenji, Nikko. 2559 Yumoto, Nikko, Tochigi, Japan. A hot spring and place of prayer dedicated to Yakushi Nyorai. Visiting hours, goshuin stamps, sutra-copying, and the Yakushi-no-Yu hot spring.'
      : '中禅寺湖畔に佇む、日光山温泉寺の公式サイト。栃木県日光市湯元2559。薬師瑠璃光如来をお祀りする温泉と祈りの霊場。拝観・御朱印・写経体験・薬師の湯のご案内。',
    address: isEn
      ? {
          '@type': 'PostalAddress',
          streetAddress: '2559 Yumoto',
          addressLocality: 'Nikko',
          addressRegion: 'Tochigi',
          addressCountry: 'JP',
        }
      : {
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
