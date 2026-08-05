'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function SetsubunApplyForm() {
  const supabase = createClient()
  const t = useTranslations('onsenjiSetsubunApply')
  const tSet = useTranslations('onsenjiSetsubun')
  const tc = useTranslations('common')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', wish1: '', wish2: '' })
  const [status, setStatus] = useState<Status>('idle')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const message = [
      `【行事名】温泉寺 節分大祭（1月下旬）`,
      `【電話番号】${form.phone}`,
      `【住所】${form.address}`,
      `【願い事1】${form.wish1}`,
      form.wish2 ? `【願い事2】${form.wish2}` : '',
    ].filter(Boolean).join('\n')

    const id = crypto.randomUUID()
    const { error } = await supabase.from('contacts').insert({
      id,
      name: form.name,
      email: form.email,
      subject: '【1月下旬】温泉寺 節分大祭 御札申し込み',
      message,
      source: 'event_application',
    })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: form.name, email: form.email, subject: '【1月下旬】温泉寺 節分大祭 御札申し込み', message }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🙏</p>
        <h1 className="text-2xl font-serif text-onsenji mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          {t('doneText1')}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t('doneText2')}
        </p>
        <Link href="/onsenji/events/setsubun"
          className="inline-block mt-8 text-sm text-onsenji border-b border-onsenji/40 hover:border-onsenji transition-colors">
          {t('backToEvent')}
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-16 pb-16">
      <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
        <div className="max-w-xl mx-auto">
          <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; <Link href="/onsenji/events">{tSet('eventsLabel')}</Link> &gt; <Link href="/onsenji/events/setsubun">{tSet('breadcrumb')}</Link> &gt; {t('breadcrumb')}
        </div>
      </div>

      <section className="bg-onsenji py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-2 relative">Application Form</p>
        <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest relative">{t('formTitle')}</h1>
        <p className="text-white/60 text-sm mt-2 relative">{t('eventName')}</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-onsenji/5 border border-onsenji/10 rounded-xl p-4 mb-6 flex gap-4 items-center">
          <div className="w-14 h-14 rounded-xl bg-onsenji flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-[#7ec8a4] text-xs">{t('cardMonth')}</span>
            <span className="text-white font-bold text-sm leading-none">{t('cardPart')}</span>
          </div>
          <div>
            <p className="font-serif text-onsenji font-medium">{t('cardTitle')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('cardTime')}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 space-y-2">
          <p className="font-medium text-amber-800 text-sm mb-2">{t('noticeHeading')}</p>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">⛩️</span>
            <p>{t.rich('noticeOfuda', { b: chunks => <strong>{chunks}</strong> })}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">💴</span>
            <p>{t.rich('noticePayment', { b: chunks => <strong>{chunks}</strong> })}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">📅</span>
            <p>{t('noticeSchedule')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-label">{t('nameLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" placeholder={t('namePlaceholder')} value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="admin-label">{t('emailLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="email" required className="admin-input" placeholder={t('emailPlaceholder')} value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="admin-label">{t('phoneLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="tel" required className="admin-input" placeholder={t('phonePlaceholder')} value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="admin-label">{t('addressLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" placeholder={t('addressPlaceholder')} value={form.address} onChange={set('address')} />
          </div>
          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-onsenji mb-1">{t('wishHeading')}</p>
            <p className="text-xs text-gray-400 mb-4">{t('wishSub')}</p>
            <div className="space-y-4">
              <div>
                <label className="admin-label">{t('wish1Label')} <span className="text-red-500 text-xs">{t('required')}</span></label>
                <input required className="admin-input" placeholder={t('wish1Placeholder')} value={form.wish1} onChange={set('wish1')} />
              </div>
              <div>
                <label className="admin-label">{t('wish2Label')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                <input className="admin-input" placeholder={t('wish2Placeholder')} value={form.wish2} onChange={set('wish2')} />
              </div>
            </div>
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {t('submitError')}
            </p>
          )}
          <button type="submit" disabled={status === 'loading'}
            className="w-full py-3 bg-onsenji text-white font-medium rounded-full hover:bg-onsenji/80 transition-colors disabled:opacity-50">
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
          <p className="text-xs text-gray-400 text-center">{t('afterSubmitNote')}</p>
        </form>

        <div className="mt-8 p-5 bg-onsenji/5 rounded-xl text-sm text-gray-600">
          <p className="font-medium text-onsenji mb-1">{t('phoneApplyTitle')}</p>
          <p>TEL：<a href="tel:0288-55-0013" className="text-onsenji font-medium">0288-55-0013</a></p>
          <p className="text-xs text-gray-400 mt-1">{t('phoneHours')}</p>
        </div>
      </div>
    </main>
  )
}
