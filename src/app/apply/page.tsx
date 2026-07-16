'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'
import { APPLICATION_CATEGORIES } from '@/types'

function ApplyForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') ?? ''
  const initialPhoto = searchParams.get('photo') ?? ''

  const [form, setForm] = useState({
    category: APPLICATION_CATEGORIES.includes(initialCategory as never) ? initialCategory : '',
    name: '', email: '', phone: '', message: '', photo_ref: initialPhoto,
  })
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('applications').insert(form)
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">📝</p>
        <h1 className="text-2xl font-serif text-navy mb-3">申請を受け付けました</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          通常3〜5営業日以内にご返信いたします。<br />
          しばらくお待ちください。
        </p>
      </div>
    </main>
  )

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <nav className="text-xs text-gray-400 mb-6"><Link href="/">ホーム</Link> &gt; 各種申請のお問い合わせ</nav>
        <h1 className="text-3xl font-serif text-navy mb-1">各種申請のお問い合わせ</h1>
        <p className="text-gray-500 text-sm mb-8">写真の使用・貸出、境内撮影、取材など各種申請はこちらのフォームからご連絡ください。</p>

        <div className="mb-8 p-5 bg-cream-alt rounded-xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <p className="font-serif text-navy text-sm mb-1">貸出用写真をお探しですか？</p>
            <p className="text-xs text-gray-600 leading-relaxed">貸出可能な写真の一覧からお選びいただくと、申請にそのまま反映されます。</p>
          </div>
          <Link href="/photos" className="flex-shrink-0 px-5 py-2.5 bg-navy text-white text-xs rounded-full hover:bg-navy/80 transition-colors whitespace-nowrap">
            写真一覧を見る →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-label">申請区分</label>
            <select required className="admin-input" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="" disabled>選択してください</option>
              {APPLICATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {form.photo_ref && (
            <div>
              <label className="admin-label">対象写真</label>
              <input readOnly className="admin-input bg-gray-50 text-gray-500" value={form.photo_ref} />
            </div>
          )}
          <div>
            <label className="admin-label">お名前</label>
            <input required className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">メールアドレス</label>
            <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">電話番号（任意）</label>
            <input className="admin-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">申請内容の詳細</label>
            <textarea required className="admin-input min-h-[150px]" placeholder="使用目的・撮影日時・掲載媒体など、詳しくご記入ください。"
              value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          {status === 'error' && <p className="text-red-600 text-sm">送信に失敗しました。しばらく経ってから再度お試しください。</p>}
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full text-center disabled:opacity-50">
            {status === 'loading' ? '送信中...' : '申請する'}
          </button>
        </form>

        <div className="mt-10 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-2">お電話でのお問い合わせ</p>
          <p>TEL：0288-55-0013</p>
          <p className="text-xs text-gray-400 mt-1">受付時間：拝観時間内</p>
        </div>
      </div>
    </main>
  )
}

export default function ApplyPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ApplyForm />
      </Suspense>
      <Footer />
    </>
  )
}
