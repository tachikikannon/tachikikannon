import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // /admin/* は認証必須（/admin/login は除く）
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !user
  ) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // ログイン済みでも admin_profiles が無い、または停止(is_active=false)された
  // アカウントはアクセス不可（fail-closed）。Supabase Authのセッション自体は
  // 有効でも、職員ロールが無効化されていれば管理画面には入れない。
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    user
  ) {
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_active')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || !profile.is_active) {
      await supabase.auth.signOut()
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('reason', 'inactive')
      return NextResponse.redirect(url)
    }
  }

  // ログイン済みで /admin/login にアクセスしたらダッシュボードへ
  if (request.nextUrl.pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
