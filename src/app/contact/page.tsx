'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'

export default function ContactPage() {
  const supabase = createClient()
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('contacts').insert(form)
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <>
      <Header />
      <main className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">✉️</p>
          <h1 className="text-2xl font-serif text-navy mb-3">お問い合わせを受け付けました</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            通常3〜5営業日以内にご返信いたします。<br />
            しばらくお待ちください。
          </p>
        </div>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <nav className="text-xs text-gray-400 mb-6"><a href="/">ホーム</a> &gt; お問い合わせ</nav>
          <h1 className="text-3xl font-serif text-navy mb-1">お問い合わせ</h1>
          <p className="text-gray-500 text-sm mb-8">ご質問・ご不明な点はお気軽にお問い合わせください。</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">お名前</label>
              <input required className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">メールアドレス</label>
              <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">件名</label>
              <input required className="admin-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">お問い合わせ内容</label>
              <textarea required className="admin-input min-h-[150px]" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
            </div>
            {status === 'error' && <p className="text-red-600 text-sm">送信に失敗しました。しばらく経ってから再度お試しください。</p>}
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full text-center disabled:opacity-50">
              {status === 'loading' ? '送信中...' : '送信する'}
            </button>
          </form>

          <div className="mt-10 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
            <p className="font-medium text-navy mb-2">お電話でのお問い合わせ</p>
            <p>TEL：0288-55-0013</p>
            <p className="text-xs text-gray-400 mt-1">受付時間：拝観時間内</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
