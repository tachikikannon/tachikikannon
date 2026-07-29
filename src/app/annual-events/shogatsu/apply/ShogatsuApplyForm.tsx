'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

type Status = 'idle' | 'loading' | 'done' | 'error'
type Applicant = { name: string; address: string; wish1: string; wish2: string }

const WISH_OPTIONS = ['心願成就', '家内安全', '身体健全', '身上安全', '商売繁盛', '開運', '厄除', '良縁成就', '安産', '病気平癒', '闘病平癒']
const CIRCLED = ['②', '③', '④', '⑤']
const emptyApplicant = (): Applicant => ({ name: '', address: '', wish1: '', wish2: '' })

const FEE_OPTIONS = [
  { price: '5,000円', size: '28㎝' },
  { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' },
  { price: '30,000円', size: '42.5㎝' },
]
const EC_SITE_URL = 'https://chuzenji.official.ec/'
const CASH_MAIL_FORM_URL = '/images/gomamousikomi.pdf'

function WishSelect({ value, onChange, required }: { value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <select required={required} className="admin-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">選択してください</option>
      {WISH_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
    </select>
  )
}

export default function ShogatsuApplyForm() {
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', email: '', phone: '', postal: '', address: '', wish1: '', wish2: '' })
  const [fee, setFee] = useState('')
  const [applicants, setApplicants] = useState<Applicant[]>(Array.from({ length: 4 }, emptyApplicant))
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [showEcConfirm, setShowEcConfirm] = useState(false)
  const [showCashMail, setShowCashMail] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function setApplicant(i: number, field: keyof Applicant, value: string) {
    setApplicants(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const applicantLines = applicants
      .map((a, i) => ({ ...a, num: CIRCLED[i] }))
      .filter(a => a.name.trim())
      .map(a => `${a.num} ${a.name}（${a.address || '住所未記入'}）　願い事：${[a.wish1, a.wish2].filter(Boolean).join('、') || '未選択'}`)
      .join('\n')

    const message = [
      `【行事名】正月元旦特別護摩祈願（1月1日）`,
      `【代表者①】`,
      `電話番号：${form.phone}`,
      `郵便番号：${form.postal}`,
      `住所：${form.address}`,
      `お願い事：${[form.wish1, form.wish2].filter(Boolean).join('、')}`,
      `御札：${fee}`,
      `お支払い方法：代金引換（代引き）`,
      applicantLines ? `\n【申込者一覧】\n${applicantLines}` : '',
      notes ? `\n【備考】\n${notes}` : '',
    ].filter(Boolean).join('\n')

    const { error } = await supabase.from('contacts').insert({
      name: form.name,
      email: form.email,
      subject: '【1月1日】正月元旦特別護摩祈願 申し込み',
      message,
      source: 'event_application',
    })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, subject: '【1月1日】正月元旦特別護摩祈願 申し込み', message }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🙏</p>
        <h1 className="text-2xl font-serif text-navy mb-3">お申し込みを受け付けました</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          1月1日 正月元旦特別護摩祈願のお申し込みを承りました。
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          ご不明な点はお電話（0288-55-0013）までお問い合わせください。
        </p>
        <Link href="/annual-events/shogatsu"
          className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
          ← 行事詳細に戻る
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-16 pb-16">
      {/* パンくず */}
      <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
        <div className="max-w-xl mx-auto">
          <Link href="/">ホーム</Link> &gt; <Link href="/annual-events">年間行事</Link> &gt; <Link href="/annual-events/shogatsu">正月元旦特別護摩祈願</Link> &gt; 申し込み
        </div>
      </div>

      {/* ヘッダー */}
      <section className="bg-navy py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <p className="text-gold text-xs tracking-[0.3em] mb-2 relative">Application Form</p>
        <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest relative">正月元旦特別護摩祈願 申し込みフォーム</h1>
        <p className="text-white/60 text-sm mt-2 relative">1月1日</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* イベント情報 */}
        <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 mb-6 flex gap-4 items-center">
          <div className="w-14 h-14 rounded-xl bg-navy flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-gold text-xs">1月</span>
            <span className="text-white font-bold text-lg leading-none">1</span>
          </div>
          <div>
            <p className="font-serif text-navy font-medium">正月元旦特別護摩祈願</p>
            <p className="text-xs text-gray-500 mt-0.5">午前0時〜　日光山中禅寺 立木観音</p>
          </div>
        </div>

        {/* お申し込み方法の選択 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <p className="font-medium text-navy text-sm mb-4">お申し込み方法をお選びください</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="#apply-form"
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-navy text-sm">代金引換（代引き）で申し込む</span>
              <span className="text-xs text-gray-500 leading-relaxed">下記フォームよりお申し込みください。送料・手数料は別途ご負担いただきます。</span>
            </a>
            <button type="button" onClick={() => setShowEcConfirm(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-navy text-sm">ECサイトを利用</span>
              <span className="text-xs text-gray-500 leading-relaxed">オンラインショップからお申し込みいただけます。</span>
            </button>
            <button type="button" onClick={() => setShowCashMail(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">✉️</span>
              <span className="font-medium text-navy text-sm">現金書留で申し込む</span>
              <span className="text-xs text-gray-500 leading-relaxed">申込書に必要事項をご記入の上、現金書留にてお送りください。</span>
            </button>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 space-y-2">
          <p className="font-medium text-amber-800 text-sm mb-2">📋 代引きでのお申し込みについて</p>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">⛩️</span>
            <p>御札は<strong>4種類（5,000円〜30,000円）</strong>からお選びいただけます。</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">💴</span>
            <p>下記フォームは<strong>代金引換（代引き）</strong>専用です。送料・手数料は別途ご負担いただきます。</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">👥</span>
            <p>1回のお申し込みで<strong>最大5名まで</strong>まとめてお申し込みいただけます。定員になり次第締め切ります。</p>
          </div>
        </div>

        {/* フォーム */}
        <form id="apply-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-label">代表者名 <span className="text-red-500 text-xs">※必須</span></label>
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
            <label className="admin-label">郵便番号 <span className="text-gray-400 text-xs">（任意）</span></label>
            <input className="admin-input" placeholder="000-0000" value={form.postal} onChange={set('postal')} />
          </div>
          <div>
            <label className="admin-label">ご住所 <span className="text-red-500 text-xs">※必須</span></label>
            <input required className="admin-input" placeholder="都道府県市区町村..." value={form.address} onChange={set('address')} />
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-3">御札 <span className="text-red-500 text-xs">※必須</span></p>
            <div className="grid grid-cols-2 gap-3">
              {FEE_OPTIONS.map(({ price, size }) => (
                <label key={price}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 cursor-pointer transition-colors ${fee === price ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-navy/40'}`}>
                  <input type="radio" name="fee" required className="sr-only" value={price}
                    checked={fee === price} onChange={() => setFee(price)} />
                  <span className="font-bold text-navy text-sm">{price}</span>
                  <span className="text-xs text-gray-500">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-1">代表者様のお願い事</p>
            <p className="text-xs text-gray-400 mb-4">御札にお名前とともに記します</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">願い事 1つ目 <span className="text-red-500 text-xs">※必須</span></label>
                <WishSelect value={form.wish1} onChange={v => setForm(f => ({ ...f, wish1: v }))} required />
              </div>
              <div>
                <label className="admin-label">願い事 2つ目 <span className="text-gray-400 text-xs">（任意）</span></label>
                <WishSelect value={form.wish2} onChange={v => setForm(f => ({ ...f, wish2: v }))} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-1">申込者②〜⑤</p>
            <p className="text-xs text-gray-400 mb-4">代表者様を含め最大5名まで。代表者様以外の方をこちらにご記入ください（任意）</p>
            <div className="space-y-4">
              {applicants.map((a, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-navy mb-3">申込者{CIRCLED[i]}</p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input className="admin-input" placeholder="お名前" value={a.name} onChange={e => setApplicant(i, 'name', e.target.value)} />
                    <input className="admin-input" placeholder="ご住所" value={a.address} onChange={e => setApplicant(i, 'address', e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <WishSelect value={a.wish1} onChange={v => setApplicant(i, 'wish1', v)} />
                    <WishSelect value={a.wish2} onChange={v => setApplicant(i, 'wish2', v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <label className="admin-label">備考 <span className="text-gray-400 text-xs">（一覧にないお願い事がある場合はこちらにご記入ください）</span></label>
            <textarea className="admin-input min-h-[80px]" placeholder="例：〇〇（申込者③）の願い事は「学業成就」" value={notes} onChange={e => setNotes(e.target.value)} />
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

      {/* ECサイト確認モーダル */}
      {showEcConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowEcConfirm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            <p className="font-medium text-navy text-sm mb-2">ECサイトでのお申し込みについて</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              こちらから申し込みの方は備考欄に必ず「<strong>正月元旦護摩希望</strong>」とご記入ください。
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowEcConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                キャンセル
              </button>
              <a href={EC_SITE_URL} target="_blank" rel="noopener"
                onClick={() => setShowEcConfirm(false)}
                className="flex-1 py-2.5 bg-navy text-white rounded-full text-sm text-center hover:bg-navy/80 transition-colors">
                はい
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 現金書留モーダル */}
      {showCashMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCashMail(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}>
            <p className="font-medium text-navy text-sm mb-4">現金書留でのお申し込み手順</p>
            <ol className="space-y-3 mb-6">
              <li className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">1</span>
                <p>現金書留の封筒を郵便局で購入する</p>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">2</span>
                <p>申込書をダウンロードして、必要事項を記入する</p>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">3</span>
                <p>御札の金額と送料1,000円を現金封筒に入れて立木観音に送る（例：5,000円の御札なら5,000円＋1,000円で6,000円）</p>
              </li>
            </ol>
            <a href={CASH_MAIL_FORM_URL} target="_blank" rel="noopener"
              className="block w-full text-center py-2.5 bg-gold text-navy font-medium rounded-full text-sm hover:opacity-90 transition-colors mb-4">
              📄 申込書をダウンロード
            </a>
            <div className="bg-cream-alt rounded-lg p-3 text-xs text-gray-600 mb-4">
              <p className="font-medium text-navy mb-1">送付先</p>
              <p>〒321-1661 栃木県日光市中宮祠2578　日光山中禅寺 立木観音</p>
            </div>
            <button type="button" onClick={() => setShowCashMail(false)}
              className="w-full py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
