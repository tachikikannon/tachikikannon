export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title') }
}

const DEFAULTS: Record<string, string> = {
  about_subtitle: '拝観時間・拝観料',
  about_subtitle_en: 'Visiting Hours & Admission Fee',
  about_hours_note: '季節により異なります（下記参照）',
  about_hours_note_en: 'Varies by season (see below)',
  about_holiday: '年中無休',
  about_holiday_en: 'Open year-round',
  about_fee_adult: '500円',
  about_fee_adult_en: '¥500',
  about_fee_child: '200円',
  about_fee_child_en: '¥200',
  about_fee_group_adult: '450円',
  about_fee_group_adult_en: '¥450',
  about_fee_group_child: '180円',
  about_fee_group_child_en: '¥180',
  about_parking: '無料駐車場有（予約不可）\n※満車の時はお近くに有料駐車場をご利用ください。',
  about_parking_en: 'Free parking available (no reservations)\n※If full, please use a nearby paid parking lot.',
  about_hours_peak: '午前8時〜午後5時',
  about_hours_peak_en: '8:00 AM – 5:00 PM',
  about_hours_shoulder: '午前8時〜午後4時',
  about_hours_shoulder_en: '8:00 AM – 4:00 PM',
  about_hours_winter: '午前8時30分〜午後3時30分',
  about_hours_winter_en: '8:30 AM – 3:30 PM',
  about_grounds_teaser_title: '境内のご案内',
  about_grounds_teaser_title_en: 'Grounds Guide',
  about_grounds_teaser_desc: '山門・観音堂・鐘楼・札所・天道・愛染堂・延命水など、境内各所の見どころをご紹介しています。',
  about_grounds_teaser_desc_en: 'Explore the temple gate, main hall, bell tower, pilgrimage stations, Tendo, Aizen-do, and the Enmeisui spring water.',
}

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return DEFAULTS }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('about')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="relative h-64 md:h-80">
          <ZoomableImage src="/images/chuzenji/common/haikan.png" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/50 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-2">{g('about_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('about_subtitle')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableHours'), g('about_hours_note')],
                    [t('tableFee'), `${t('adult')}：${g('about_fee_adult')}　${t('child')}：${g('about_fee_child')}`],
                    [t('tableGroupFee'), `${t('adult')}：${g('about_fee_group_adult')}　${t('child')}：${g('about_fee_group_child')}`],
                    [t('tableHoliday'), g('about_holiday')],
                    [t('tableParking'), g('about_parking')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-pre-line">{k}</th>
                      <td className="px-4 py-3 whitespace-pre-line bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { period: t('periodPeak'), time: g('about_hours_peak') },
                { period: t('periodShoulder'), time: g('about_hours_shoulder') },
                { period: t('periodWinter'), time: g('about_hours_winter') },
              ].map(({ period, time }) => (
                <div key={period} className="bg-white rounded-xl p-5 text-center shadow-sm border-t-4 border-gold">
                  <p className="font-serif text-navy font-medium mb-2">{period}</p>
                  <p className="text-sm text-gray-700">{time}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-cream-alt rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-1">
              <p className="font-serif text-navy text-lg mb-1">{g('about_grounds_teaser_title')}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{g('about_grounds_teaser_desc')}</p>
            </div>
            <Link href="/grounds"
              className="flex-shrink-0 px-6 py-3 bg-navy text-white text-sm rounded-full hover:bg-navy/80 transition-colors">
              {t('groundsCta')}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '🗺', label: t('quickAccess'), href: '/#access' },
              { icon: '🙏', label: t('quickPrayer'), href: '/prayer' },
              { icon: '/images/chuzenji/common/gosyuin-main.png', label: t('quickGoshuin'), href: '/goshuin' },
              { icon: '❓', label: t('quickFaq'), href: '/faq' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group">
                {icon.startsWith('/') ? (
                  <span className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                    <img src={icon} alt="" className="w-full h-full object-cover scale-125" />
                  </span>
                ) : (
                  <span className="text-2xl">{icon}</span>
                )}
                <span className="text-sm font-medium text-navy group-hover:text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
