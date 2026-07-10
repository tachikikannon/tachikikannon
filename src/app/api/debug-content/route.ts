import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const res = await fetch(`${supabaseUrl}/rest/v1/site_content?select=key,value`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    cache: 'no-store',
  })

  const status = res.status
  const body = await res.text()

  return NextResponse.json({
    supabaseUrl: supabaseUrl?.replace(/https:\/\/(.{8}).*/, 'https://$1...'),
    status,
    body,
  })
}
