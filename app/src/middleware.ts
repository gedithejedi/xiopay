import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/dashboard') && !req.auth?.user) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (req.nextUrl.pathname.startsWith('/login') && req.auth?.user) {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
