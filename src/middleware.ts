import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

// reservation_search_admin ロールがアクセスできる管理画面パス（完全一致）。
// サイドバーのフィルタ（src/app/admin/layout.tsx）と揃えておくこと。
const RESERVATION_ADMIN_ALLOWED_PATHS = ['/admin/reservations', '/admin/reservations/schedule']

async function adminAuthMiddleware(request: NextRequest) {
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
      .select('is_active, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || !profile.is_active) {
      await supabase.auth.signOut()
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('reason', 'inactive')
      return NextResponse.redirect(url)
    }

    // reservation_search_admin は「予約検索」「予約スケジュール」の2画面のみ操作可能
    // （既存の reservation_admin とは別ロール。そちらの挙動は変更しない）。
    // サイドバー側でも他の項目は非表示にしているが、URLを直接叩かれた場合の
    // 抜け道を防ぐため、ミドルウェアでも同じ許可リストで強制リダイレクトする。
    if (
      profile.role === 'reservation_search_admin' &&
      !RESERVATION_ADMIN_ALLOWED_PATHS.includes(request.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL('/admin/reservations', request.url))
    }
  }

  // ログイン済みで /admin/login にアクセスしたらダッシュボードへ
  if (request.nextUrl.pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export async function middleware(request: NextRequest) {
  // 管理画面は [locale] の外にあるため、ロケール解決を行わず認証のみ実施
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminAuthMiddleware(request)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
