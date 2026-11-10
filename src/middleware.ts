import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

const protectedRoutes = ["/cms", "/pro-portal", "/franchise"];
const allowedRoles: Record<string, string[]> = {
  "/cms": ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER"],
  "/pro-portal": ["CORPORATE_ADMIN", "FRANCHISEE", "SALON_MANAGER", "STYLIST"],
  "/franchise": ["CORPORATE_ADMIN", "FRANCHISEE"],
};

function roleForPath(pathname: string) {
  return protectedRoutes.find((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function middleware(request: NextRequest) {
  const hasLocalePrefix = locales.some((locale) => request.nextUrl.pathname === `/${locale}` || request.nextUrl.pathname.startsWith(`/${locale}/`));
  const path = request.nextUrl.pathname.replace(/^\/(en-US|fr-FR|ja-JP)(?=\/|$)/, "") || "/";
  const protectedRoute = roleForPath(path);

  if (protectedRoute) {
    const role = request.cookies.get("session_role")?.value;
    const permitted = role ? allowedRoles[protectedRoute].includes(role) : false;
    if (!permitted) {
      const loginUrl = new URL("/cms/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // The default locale is served by the regular App Router root. Only locale-prefixed
  // requests need next-intl's rewrite logic; this prevents `/` becoming a locale-only 404.
  return hasLocalePrefix ? intlMiddleware(request) : NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
