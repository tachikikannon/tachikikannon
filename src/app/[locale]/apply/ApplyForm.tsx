'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { APPLICATION_CATEGORIES } from '@/types'

export default function ApplyForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const t = useTranslations('apply')
  const tc = useTranslations('common')
  const initialCategory = searchParams.get('category') ?? ''
  const initialPhoto = searchParams.get('photo') ?? ''

  const CATEGORY_LABELS: Record<string, string> = {
    '写真使用・貸出し許可申請': t('categoryPhoto'),
    '境内撮影許可申請': t('categoryPhotography'),
    '取材・取材協力依頼': t('categoryPress'),
    'その他': t('categoryOther'),
  }

  const [form, setForm] = useState({
    category: APPLICATION_CATEGORIES.includes(initialCategory as never) ? initialCategory : '',
    name: '', email: '', phone: '', message: '', photo_ref: initialPhoto,
  })
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const id = crypto.randomUUID()
    const { error } = await supabase.from('applications').insert({ ...form, id })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">📝</p>
        <h1 className="text-2xl font-serif text-navy mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t('doneText')}
        </p>
      </div>
    </main>
  )

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <nav className="text-xs text-gray-400 mb-6"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</nav>
        <h1 className="text-3xl font-serif text-navy mb-1">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">{t('intro')}</p>

        <div className="mb-8 p-5 bg-cream-alt rounded-xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <p className="font-serif text-navy text-sm mb-1">{t('photoBannerTitle')}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{t('photoBannerText')}</p>
          </div>
          <Link href="/photos" className="flex-shrink-0 px-5 py-2.5 bg-navy text-white text-xs rounded-full hover:bg-navy/80 transition-colors whitespace-nowrap">
            {t('photoBannerCta')}
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-label">{t('categoryLabel')}</label>
            <select required className="admin-input" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="" disabled>{t('categoryPlaceholder')}</option>
              {APPLICATION_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>)}
            </select>
          </div>
          {form.photo_ref && (
            <div>
              <label className="admin-label">{t('photoRefLabel')}</label>
              <input readOnly className="admin-input bg-gray-50 text-gray-500" value={form.photo_ref} />
            </div>
          )}
          <div>
            <label className="admin-label">{t('nameLabel')}</label>
            <input required className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('emailLabel')}</label>
            <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('phoneLabel')}</label>
            <input className="admin-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">{t('messageLabel')}</label>
            <textarea required className="admin-input min-h-[150px]" placeholder={t('messagePlaceholder')}
              value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          {status === 'error' && <p className="text-red-600 text-sm">{t('submitError')}</p>}
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full text-center disabled:opacity-50">
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
        </form>

        <div className="mt-10 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-2">{t('phoneContactTitle')}</p>
          <p>TEL：0288-55-0013</p>
          <p className="text-xs text-gray-400 mt-1">{t('phoneHours')}</p>
        </div>
      </div>
    </main>
  )
}
