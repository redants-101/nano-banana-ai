import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { redirectTo, provider = 'github' } = await request.json()
  const supabase = await createClient()

  // 验证提供商
  const validProviders = ['github', 'google']
  if (!validProviders.includes(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'github' | 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback?redirect=${encodeURIComponent(redirectTo || '/')}`,
      queryParams: provider === 'google' ? {
        access_type: 'offline',
        prompt: 'consent',
      } : undefined,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ url: data.url })
}

