import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  console.log('middleware', req.nextUrl.pathname)
  if (req.nextUrl.pathname.startsWith('/dashboard') && !req.auth?.user) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (req.nextUrl.pathname.startsWith('/login') && req.auth?.user) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (req.nextUrl.pathname.startsWith('/api') && !req.auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})

export const config = {
  matcher: ['/api/:path((?!auth).+)', '/dashboard/:path*', '/login'],
}
