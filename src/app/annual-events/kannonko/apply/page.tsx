'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function KannonkoApplyPage() {
  const supabase = createClient()
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
      `【行事名】観音講・大護摩供・地蔵流し（6月18日）`,
      `【電話番号】${form.phone}`,
      `【住所】${form.address}`,
      `【願い事1】${form.wish1}`,
      form.wish2 ? `【願い事2】${form.wish2}` : '',
    ].filter(Boolean).join('\n')

    const { error } = await supabase.from('contacts').insert({
      name: form.name,
      email: form.email,
      subject: '【6月18日】観音講・大護摩供・地蔵流し 御札申し込み',
      message,
    })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, subject: '【6月18日】観音講・大護摩供・地蔵流し 御札申し込み', message }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <>
      <Header />
      <main className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🙏</p>
          <h1 className="text-2xl font-serif text-navy mb-3">お申し込みを受け付けました</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            6月18日 観音講・大護摩供・地蔵流しの<br />御札申し込みを承りました。
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            ご不明な点はお電話（0288-55-0013）までお問い合わせください。
          </p>
          <Link href="/annual-events/kannonko"
            className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
            ← 行事詳細に戻る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Header />
      <main className="pt-16 pb-16">
        {/* パンくず */}
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/annual-events">年間行事</Link> &gt; <Link href="/annual-events/kannonko">観音講・大護摩供・地蔵流し</Link> &gt; 申し込み
          </div>
        </div>

        {/* ヘッダー */}
        <section className="bg-navy py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-2 relative">Application Form</p>
          <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest relative">御札 申し込みフォーム</h1>
          <p className="text-white/60 text-sm mt-2 relative">観音講・大護摩供・地蔵流し（6月18日）</p>
        </section>

        <div className="max-w-xl mx-auto px-4 py-10">
          {/* イベント情報 */}
          <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 mb-6 flex gap-4 items-center">
            <div className="w-14 h-14 rounded-xl bg-navy flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs">6月</span>
              <span className="text-white font-bold text-lg leading-none">18</span>
            </div>
            <div>
              <p className="font-serif text-navy font-medium">観音講・大護摩供・地蔵流し</p>
              <p className="text-xs text-gray-500 mt-0.5">午前10時〜　日光山中禅寺 立木観音</p>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 space-y-2">
            <p className="font-medium text-amber-800 text-sm mb-2">📋 お申し込みの前にご確認ください</p>
            <div className="flex gap-2 text-sm text-amber-700">
              <span className="flex-shrink-0">⛩️</span>
              <p>お申し込みの方には大護摩供にてお焚き上げする<strong>御札</strong>をお授けいたします。</p>
            </div>
            <div className="flex gap-2 text-sm text-amber-700">
              <span className="flex-shrink-0">💴</span>
              <p>お支払いは<strong>当日・現地でのお支払い</strong>となります。事前のお振込みは不要です。</p>
            </div>
            <div className="flex gap-2 text-sm text-amber-700">
              <span className="flex-shrink-0">📌</span>
              <p>参列自体は申し込み不要です。御札をご希望の方のみお申し込みください。</p>
            </div>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">お名前 <span className="text-red-500 text-xs">※必須</span></label>
              <input required className="admin-input" placeholder="山田 太郎" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="admin-label">メールアドレス <span className="text-red-500 text-xs">※必須</span></label>
              <input type="email" required className="admin-input" placeholder="example@email.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="admin-label">電話番号 <span className="text-red-500 text-xs">※必須</span></label>
              <input type="tel" required className="admin-input" placeholder="090-0000-0000" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="admin-label">ご住所 <span className="text-red-500 text-xs">※必須</span></label>
              <input required className="admin-input" placeholder="〒000-0000 都道府県市区町村..." value={form.address} onChange={set('address')} />
            </div>

            <div className="border-t border-gray-200 pt-5">
              <p className="text-sm font-medium text-navy mb-1">お願い事</p>
              <p className="text-xs text-gray-400 mb-4">御札にお名前とともに記します</p>
              <div className="space-y-4">
                <div>
                  <label className="admin-label">願い事 1つ目 <span className="text-red-500 text-xs">※必須</span></label>
                  <input required className="admin-input" placeholder="例：病気平癒、家内安全、健康増進..." value={form.wish1} onChange={set('wish1')} />
                </div>
                <div>
                  <label className="admin-label">願い事 2つ目 <span className="text-gray-400 text-xs">（任意）</span></label>
                  <input className="admin-input" placeholder="例：交通安全、縁結び、学業成就..." value={form.wish2} onChange={set('wish2')} />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                送信に失敗しました。お電話（0288-55-0013）にてお申し込みください。
              </p>
            )}

            <button type="submit" disabled={status === 'loading'}
              className="btn-primary w-full text-center disabled:opacity-50 py-3">
              {status === 'loading' ? '送信中...' : '申し込む'}
            </button>
            <p className="text-xs text-gray-400 text-center">送信後、確認メールをお送りします。</p>
          </form>

          <div className="mt-8 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
            <p className="font-medium text-navy mb-1">お電話でのお申し込み</p>
            <p>TEL：<a href="tel:0288-55-0013" className="text-navy font-medium">0288-55-0013</a></p>
            <p className="text-xs text-gray-400 mt-1">受付時間：拝観時間内（8時〜17時）</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
