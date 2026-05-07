import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ROLE_ROUTES: Record<string, string> = {
  '/cliente': 'client',
  '/advogado': 'lawyer',
  '/engajador': 'engager',
  '/admin': 'admin',
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const protectedPrefix = Object.keys(ROLE_ROUTES).find(prefix =>
    pathname.startsWith(prefix)
  )

  if (protectedPrefix) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const requiredRole = ROLE_ROUTES[protectedPrefix]
    if (profile?.role !== requiredRole && profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = getDashboardByRole(profile?.role)
      return NextResponse.redirect(url)
    }
  }

  if (user && (pathname === '/login' || pathname === '/cadastro')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = getDashboardByRole(profile?.role)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

function getDashboardByRole(role?: string | null): string {
  switch (role) {
    case 'client':   return '/cliente/dashboard'
    case 'lawyer':   return '/advogado/dashboard'
    case 'engager':  return '/engajador/dashboard'
    case 'admin':    return '/admin/dashboard'
    default:         return '/'
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
