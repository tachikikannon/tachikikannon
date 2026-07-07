'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-white font-serif text-2xl tracking-widest">管理画面</h1>
          <p className="text-white/50 text-xs mt-2">日光山中禅寺 立木観音</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-2xl">
          <div className="mb-4">
            <label className="admin-label">メールアドレス</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="admin-input" placeholder="admin@example.com" />
          </div>
          <div className="mb-6">
            <label className="admin-label">パスワード</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="admin-input" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-600 text-xs mb-4">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full btn-primary text-center disabled:opacity-50">
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
