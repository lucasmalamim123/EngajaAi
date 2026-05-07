import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

<<<<<<< HEAD
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

=======
const ROLE_ROUTES: Record<string, string> = {
  '/cliente': 'client',
  '/advogado': 'lawyer',
  '/engajador': 'engager',
  '/admin': 'admin',
}

export async function proxy(request: NextRequest) {
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
<<<<<<< HEAD
        getAll() { return request.cookies.getAll() },
=======
        getAll() {
          return request.cookies.getAll()
        },
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD

  // Protect role routes
  const protectedPrefix = Object.keys(ROLE_ROUTES).find(prefix =>
    fullPathWithoutLocale.startsWith(prefix)
=======
  const { pathname } = request.nextUrl

  const protectedPrefix = Object.keys(ROLE_ROUTES).find(prefix =>
    pathname.startsWith(prefix)
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
  )

  if (protectedPrefix) {
    if (!user) {
      const url = request.nextUrl.clone()
<<<<<<< HEAD
      url.pathname = `/${pathnameLocale}/login`
=======
      url.pathname = '/login'
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD
      url.pathname = `/${pathnameLocale}${getDashboardByRole(profile?.role)}`
=======
      url.pathname = getDashboardByRole(profile?.role)
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
      return NextResponse.redirect(url)
    }
  }

<<<<<<< HEAD
  // Redirect authenticated users away from auth pages
  if (user && (fullPathWithoutLocale === '/login' || fullPathWithoutLocale === '/cadastro')) {
=======
  if (user && (pathname === '/login' || pathname === '/cadastro')) {
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
<<<<<<< HEAD
    url.pathname = `/${pathnameLocale}${getDashboardByRole(profile?.role)}`
=======
    url.pathname = getDashboardByRole(profile?.role)
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

function getDashboardByRole(role?: string | null): string {
  switch (role) {
<<<<<<< HEAD
    case 'client':  return '/cliente/dashboard'
    case 'lawyer':  return '/advogado/dashboard'
    case 'engager': return '/engajador/dashboard'
    case 'admin':   return '/admin/dashboard'
    default:        return '/'
=======
    case 'client':   return '/cliente/dashboard'
    case 'lawyer':   return '/advogado/dashboard'
    case 'engager':  return '/engajador/dashboard'
    case 'admin':    return '/admin/dashboard'
    default:         return '/'
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
