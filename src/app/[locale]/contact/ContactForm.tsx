'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'

export default function ContactForm() {
  const supabase = createClient()
  const t = useTranslations('contact')
  const tc = useTranslations('common')
  const locale = useLocale()
  // フリガナは日本語話者向けの慣習で、外国語話者には該当しないため日本語以外では欄自体を出さない。
  const showNameKana = locale === 'ja'
  const [form, setForm] = useState({ name:'', nameKana:'', email:'', subject:'', message:'' })
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')

  function goToConfirm(e: React.FormEvent) {
    e.preventDefault()
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToInput() {
    setStep('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setStatus('loading')
    const id = crypto.randomUUID()
    const message = showNameKana && form.nameKana ? `フリガナ：${form.nameKana}\n\n${form.message}` : form.message
    const payload = { name: form.name, email: form.email, subject: form.subject, message }
    const { error } = await supabase.from('contacts').insert({ ...payload, id })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, id, locale, temple: 'chuzenji' }),
    }).catch(() => {})
    setStatus('idle')
    setStep('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (step === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">✉️</p>
        <h1 className="text-2xl font-serif text-navy mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t('doneText')}
        </p>
      </div>
    </main>
  )

  const confirmRows: [string, string][] = [
    [t('nameLabel'), form.name],
    ...(showNameKana ? [[t('nameKanaLabel'), form.nameKana] as [string, string]] : []),
    [t('emailLabel'), form.email],
    [t('subjectLabel'), form.subject],
    [t('messageLabel'), form.message],
  ]

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <nav className="text-xs text-gray-400 mb-6"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</nav>
        <h1 className="text-3xl font-serif text-navy mb-1">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">{t('intro')}</p>

        {step === 'input' && (
          <form onSubmit={goToConfirm} className="space-y-5">
            <div>
              <label className="admin-label">{t('nameLabel')}</label>
              <input required className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            {showNameKana && (
              <div>
                <label className="admin-label">{t('nameKanaLabel')}</label>
                <input required className="admin-input" pattern="[ぁ-んー\s　]+" title={t('nameKanaLabel')}
                  placeholder={t('nameKanaPlaceholder')} value={form.nameKana} onChange={e => setForm({...form, nameKana: e.target.value})} />
              </div>
            )}
            <div>
              <label className="admin-label">{t('emailLabel')}</label>
              <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">{t('subjectLabel')}</label>
              <input required className="admin-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">{t('messageLabel')}</label>
              <textarea required className="admin-input min-h-[150px]" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary w-full text-center">
              {t('goToConfirm')}
            </button>
          </form>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <h2 className="font-serif text-navy text-xl">{t('confirmHeading')}</h2>
            <p className="text-sm text-gray-500">{t('confirmNote')}</p>
            <dl className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 text-sm">
              {confirmRows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="whitespace-pre-wrap">{value}</dd>
                </div>
              ))}
            </dl>
            {status === 'error' && <p className="text-red-600 text-sm">{t('submitError')}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={backToInput} disabled={status === 'loading'}
                className="flex-1 border border-navy text-navy rounded-full py-3 text-sm hover:bg-navy/5 transition-colors disabled:opacity-50">
                {t('backButton')}
              </button>
              <button type="button" onClick={handleSubmit} disabled={status === 'loading'}
                className="flex-1 btn-primary text-center disabled:opacity-50">
                {status === 'loading' ? t('submitting') : t('confirmSubmit')}
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-2">{t('phoneContactTitle')}</p>
          <p>TEL：0288-55-0013</p>
          <p className="text-xs text-gray-400 mt-1">{t('phoneHours')}</p>
        </div>
      </div>
    </main>
  )
}
