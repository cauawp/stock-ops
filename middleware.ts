import { NextRequest, NextResponse } from "next/server";

// Lista de rotas públicas acessíveis sem autenticação
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isLoginOrSignup = pathname === "/login" || pathname === "/signup";

  // Usuário autenticado
  if (token) {
    // Redireciona se tentar acessar /login ou /signup
    if (isLoginOrSignup) {
      return NextResponse.redirect(new URL("/user", request.url));
    }

    // Redireciona se acessar página pública mas não for login/signup
    if (isPublicRoute && !isLoginOrSignup) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Permite acesso normalmente
    return NextResponse.next();
  }

  // Usuário não autenticado tentando acessar rota protegida
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Caso contrário, permite acesso
  return NextResponse.next();
}

// Aplica o middleware a todas as rotas, exceto arquivos estáticos, imagens, favicon e rotas internas do Next
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|sitemap.xml|api/).*)",
  ],
};
