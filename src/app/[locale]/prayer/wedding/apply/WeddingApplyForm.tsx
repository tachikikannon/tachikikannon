'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function WeddingApplyForm() {
  const supabase = createClient()
  const t = useTranslations('prayerWeddingApply')
  const tc = useTranslations('common')
  const tPrayer = useTranslations('prayer')
  const [form, setForm] = useState({
    name: '', nameKana: '', email: '', phone: '',
    wish1: '', wish2: '', partySize: '', notes: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const message = [
      `【申込種別】仏前式（結婚式）のご相談・お申し込み`,
      `フリガナ：${form.nameKana}`,
      `電話番号：${form.phone}`,
      `第一希望日：${form.wish1 || '未記入'}`,
      `第二希望日：${form.wish2 || '未記入'}`,
      `ご参列予定人数：${form.partySize || '未記入'}`,
      form.notes ? `\n【ご要望・ご質問】\n${form.notes}` : '',
    ].filter(Boolean).join('\n')

    const id = crypto.randomUUID()
    const { error } = await supabase.from('contacts').insert({
      id,
      name: form.name,
      email: form.email,
      subject: '仏前式（結婚式）のご相談・お申し込み',
      message,
      source: 'event_application',
    })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: form.name, email: form.email, subject: '仏前式（結婚式）のご相談・お申し込み', message }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">💐</p>
        <h1 className="text-2xl font-serif text-navy mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">{t('doneText')}</p>
        <Link href="/prayer/wedding"
          className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
          {t('backToWedding')}
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-16 pb-16">
      <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
        <div className="max-w-xl mx-auto">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/prayer">{tPrayer('title')}</Link> &gt; <Link href="/prayer/wedding">{t('breadcrumbWedding')}</Link> &gt; {t('breadcrumb')}
        </div>
      </div>

      <section className="bg-navy py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
        <p className="text-gold text-xs tracking-[0.3em] mb-2 relative">Application Form</p>
        <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest relative">{t('formTitle')}</h1>
        <p className="text-white/60 text-sm mt-2 relative">{t('formSub')}</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-700 space-y-1">
          <p className="font-medium text-amber-800 mb-1">{t('noticeHeading')}</p>
          <p>{t('noticeDate')}</p>
          <p>{t('noticeConfirm')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-label">{t('nameLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="admin-label">{t('nameKanaLabel')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
            <input className="admin-input" value={form.nameKana} onChange={set('nameKana')} />
          </div>
          <div>
            <label className="admin-label">{t('emailLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="email" required className="admin-input" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="admin-label">{t('phoneLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="tel" required className="admin-input" value={form.phone} onChange={set('phone')} />
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-1">{t('wishHeading')}</p>
            <p className="text-xs text-gray-400 mb-4">{t('wishSub')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">{t('wish1Label')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                <input type="date" className="admin-input" value={form.wish1} onChange={set('wish1')} />
              </div>
              <div>
                <label className="admin-label">{t('wish2Label')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                <input type="date" className="admin-input" value={form.wish2} onChange={set('wish2')} />
              </div>
            </div>
          </div>

          <div>
            <label className="admin-label">{t('partySizeLabel')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
            <input className="admin-input" placeholder={t('partySizePlaceholder')} value={form.partySize} onChange={set('partySize')} />
          </div>

          <div>
            <label className="admin-label">{t('notesLabel')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
            <textarea className="admin-input min-h-[100px]" placeholder={t('notesPlaceholder')} value={form.notes} onChange={set('notes')} />
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{t('submitError')}</p>
          )}

          <button type="submit" disabled={status === 'loading'}
            className="btn-primary w-full text-center disabled:opacity-50 py-3">
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
          <p className="text-xs text-gray-400 text-center">{t('afterSubmitNote')}</p>
        </form>

        <div className="mt-8 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-1">{t('phoneApplyTitle')}</p>
          <p>TEL：<a href="tel:0288-55-0013" className="text-navy font-medium">0288-55-0013</a></p>
        </div>
      </div>
    </main>
  )
}
