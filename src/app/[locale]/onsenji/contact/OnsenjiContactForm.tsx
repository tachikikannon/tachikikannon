'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase'

export default function OnsenjiContactForm() {
  const supabase = createClient()
  const t = useTranslations('onsenjiContact')
  const locale = useLocale()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')

  function goToConfirm(e: React.FormEvent) {
    e.preventDefault()
    setStep('confirm')
  }

  function backToInput() {
    setStep('input')
  }

  async function handleSubmit() {
    setStatus('loading')
    const id = crypto.randomUUID()
    // contactsテーブルはsubject必須で温泉寺専用の区分カラムが無いため、
    // 管理画面の一覧で見分けられるよう件名の先頭に【温泉寺】を付ける。
    const submission = { ...form, subject: `【温泉寺】${t('title')}` }
    const { error } = await supabase.from('contacts').insert({ ...submission, id })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...submission, id, locale, temple: 'onsenji' }),
    }).catch(() => {})
    setStatus('idle')
    setStep('done')
  }

  if (step === 'done') return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
      <p className="text-5xl mb-4">✉️</p>
      <h2 className="font-serif text-xl text-onsenji mb-2">{t('doneTitle')}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{t('doneText')}</p>
    </div>
  )

  if (step === 'confirm') {
    const confirmRows: [string, string][] = [
      [t('nameLabel'), form.name],
      [t('emailLabel'), form.email],
      [t('messageLabel'), form.message],
    ]
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        <h2 className="font-serif text-xl text-onsenji">{t('confirmHeading')}</h2>
        <p className="text-sm text-gray-500">{t('confirmNote')}</p>
        <dl className="border border-gray-200 rounded-xl divide-y divide-gray-100 text-sm">
          {confirmRows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[6rem_1fr] gap-3 px-4 py-3">
              <dt className="text-gray-500">{label}</dt>
              <dd className="whitespace-pre-wrap">{value}</dd>
            </div>
          ))}
        </dl>
        {status === 'error' && <p className="text-red-500 text-sm">{t('submitError')}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={backToInput} disabled={status === 'loading'}
            className="flex-1 py-3 border border-onsenji text-onsenji rounded-full font-medium hover:bg-onsenji/5 transition-colors text-sm disabled:opacity-50">
            {t('backButton')}
          </button>
          <button type="button" onClick={handleSubmit} disabled={status === 'loading'}
            className="flex-1 py-3 bg-onsenji text-white rounded-full font-medium hover:bg-onsenji-light transition-colors text-sm disabled:opacity-50">
            {status === 'loading' ? t('submitting') : t('confirmSubmit')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={goToConfirm} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm text-onsenji font-medium mb-1">{t('nameLabel')} <span className="text-red-400 text-xs">{t('required')}</span></label>
          <input type="text" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7ec8a4]"
            placeholder={t('namePlaceholder')} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-onsenji font-medium mb-1">{t('emailLabel')} <span className="text-red-400 text-xs">{t('required')}</span></label>
          <input type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7ec8a4]"
            placeholder={t('emailPlaceholder')} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-onsenji font-medium mb-1">{t('messageLabel')} <span className="text-red-400 text-xs">{t('required')}</span></label>
          <textarea rows={6} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7ec8a4] resize-none"
            placeholder={t('messagePlaceholder')} value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
        </div>
      </div>
      <button type="submit"
        className="w-full py-3 bg-onsenji text-white rounded-full font-medium hover:bg-onsenji-light transition-colors text-sm">
        {t('goToConfirm')}
      </button>
    </form>
  )
}
