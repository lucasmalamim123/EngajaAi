import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const LOCALES = ['pt-PT', 'pt-BR', 'en', 'es'] as const
const DEFAULT_LOCALE = 'pt-PT'

const LOCALE_MAP: Record<string, string> = {
  'pt': 'pt-PT', 'pt-pt': 'pt-PT', 'pt-br': 'pt-BR',
  'en': 'en', 'en-us': 'en', 'en-gb': 'en',
  'es': 'es', 'es-es': 'es', 'es-419': 'es',
}

function detectLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? ''
  for (const tag of acceptLang.split(',')) {
    const lang = tag.split(';')[0].trim().toLowerCase()
    if (LOCALE_MAP[lang]) return LOCALE_MAP[lang]
    const base = lang.split('-')[0]
    if (LOCALE_MAP[base]) return LOCALE_MAP[base]
  }
  return DEFAULT_LOCALE
}

const ROLE_ROUTES: Record<string, string> = {
  '/cliente':  'client',
  '/advogado': 'lawyer',
  '/engajador': 'engager',
  '/admin':    'admin',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes
  if (pathname.startsWith('/api/')) return NextResponse.next({ request })

  // Check for locale prefix
  const pathnameLocale = LOCALES.find(
    loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  )

  // No locale prefix → detect and redirect
  if (!pathnameLocale) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  // Strip locale to get the actual path
  const pathWithoutLocale = pathname.slice(pathnameLocale.length + 1) || '/'
  const fullPathWithoutLocale = `/${pathWithoutLocale}`

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
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

  // Protect role routes
  const protectedPrefix = Object.keys(ROLE_ROUTES).find(prefix =>
    fullPathWithoutLocale.startsWith(prefix)
  )

  if (protectedPrefix) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${pathnameLocale}/login`
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
      url.pathname = `/${pathnameLocale}${getDashboardByRole(profile?.role)}`
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && (fullPathWithoutLocale === '/login' || fullPathWithoutLocale === '/cadastro')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = `/${pathnameLocale}${getDashboardByRole(profile?.role)}`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

function getDashboardByRole(role?: string | null): string {
  switch (role) {
    case 'client':  return '/cliente/dashboard'
    case 'lawyer':  return '/advogado/dashboard'
    case 'engager': return '/engajador/dashboard'
    case 'admin':   return '/admin/dashboard'
    default:        return '/'
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
