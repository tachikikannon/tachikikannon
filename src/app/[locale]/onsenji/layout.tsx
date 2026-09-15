import type { Metadata } from 'next'

const SITE_META = {
  ja: {
    title: { default: '日光山温泉寺 【公式】｜中禅寺湖畔の温泉と祈りの霊場', template: '%s | 日光山温泉寺' },
    description: '中禅寺湖畔に佇む、日光山温泉寺の公式サイト。栃木県日光市湯元2559。薬師瑠璃光如来をお祀りする温泉と祈りの霊場。拝観・御朱印・写経体験・薬師の湯のご案内。',
    siteName: '日光山温泉寺',
    ogLocale: 'ja_JP',
  },
  en: {
    title: { default: 'Nikkozan Onsenji Temple (Official Site) | Hot Spring & Prayer on Lake Chuzenji', template: '%s | Nikkozan Onsenji Temple' },
    description: 'The official site of Nikkozan Onsenji Temple on the shore of Lake Chuzenji, Nikko. 2559 Yumoto, Nikko, Tochigi, Japan. A hot spring and place of prayer dedicated to Yakushi Nyorai. Visiting hours, goshuin stamps, sutra-copying, and the Yakushi-no-Yu hot spring.',
    siteName: 'Nikkozan Onsenji Temple',
    ogLocale: 'en_US',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = locale === 'en' ? SITE_META.en : SITE_META.ja
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      siteName: m.siteName,
      locale: m.ogLocale,
      type: 'website',
    },
  }
}

export default function OnsenjiLayout({ children }: { children: React.ReactNode }) {
  return children
}
