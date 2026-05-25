import { NextResponse, type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from './lib/supabase/server'


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore homepage & auth routes
  if (pathname === '/' || pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // get user data
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'

    return NextResponse.redirect(url)
  }

  // check user role
  const role = user?.user_metadata?.role as string

  if (role === 'admin' && pathname.startsWith('/issue')) {
    // redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'

    return NextResponse.redirect(url)
  } else if (role !== 'admin' && !pathname.startsWith('/issue')) {
    // redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/issue'

    return NextResponse.redirect(url)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
