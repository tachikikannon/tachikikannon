export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import OnsenjiContactForm from './OnsenjiContactForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiContact' })
  return { title: `${t('title')} | 日光山温泉寺` }
}

export default async function OnsenjContactPage() {
  const t = await getTranslations('onsenjiContact')
  const tc = await getTranslations('common')

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Contact</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600 text-sm mb-10 leading-relaxed">
            {t('intro')}
          </p>
          <OnsenjiContactForm />
          <p className="text-xs text-gray-400 text-center mt-6">
            {t('phonePrefix')}<strong className="text-gray-600">0288-55-0013</strong>{t('phoneSuffix')}
          </p>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
