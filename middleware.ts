import { NextRequest, NextResponse } from 'next/server'

// Rotas públicas acessíveis sem autenticação
const publicRoutes = ['/', '/login', '/signup', '/about']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value

  const isPublicRoute = publicRoutes.includes(pathname)
  const isLoginOrSignup = pathname === '/login' || pathname === '/signup'

  // Usuário logado tenta acessar /login ou /signup -> redireciona para /user
  if (token && isLoginOrSignup) {
    return NextResponse.redirect(new URL('/user', request.url))
  }

  // Usuário logado acessa qualquer outra rota pública -> redireciona para /dashboard
  if (token && isPublicRoute && !isLoginOrSignup) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Usuário não logado acessa rota protegida -> redireciona para /login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Caso contrário, permite acesso
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
