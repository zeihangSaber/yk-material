import { NextRequest, NextResponse } from 'next/server'

// 中间件可以是 async 函数，如果使用了 await
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
