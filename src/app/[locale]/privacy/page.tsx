import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return { title: t('title') }
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy')
  const tc = await getTranslations('common')
  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>

        <section className="bg-navy py-16 text-center">
          <h1 className="font-serif text-3xl text-white tracking-widest">{t('title')}</h1>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 prose prose-sm max-w-none text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500 mb-8">{t('intro')}</p>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('collectionHeading')}</h2>
            <p>{t('collectionText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('purposeHeading')}</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>{t('purpose1')}</li>
              <li>{t('purpose2')}</li>
              <li>{t('purpose3')}</li>
              <li>{t('purpose4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('thirdPartyHeading')}</h2>
            <p>{t('thirdPartyText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('managementHeading')}</h2>
            <p>{t('managementText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('disclosureHeading')}</h2>
            <p>{t('disclosureText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('cookieHeading')}</h2>
            <p>{t('cookieText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">{t('changesHeading')}</h2>
            <p>{t('changesText')}</p>
          </section>

          <section className="bg-cream-alt rounded-xl p-6">
            <h2 className="text-lg font-serif text-navy mb-4">{t('contactHeading')}</h2>
            <address className="not-italic text-sm text-gray-700 space-y-1">
              <p className="font-medium">{t('contactName')}</p>
              <p>{t('contactAddress')}</p>
              <p>TEL：0288-55-0013</p>
              <p>{t('contactHours')}</p>
            </address>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
