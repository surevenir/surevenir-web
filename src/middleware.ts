import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token dari cookies
  const idToken = request.cookies.get("idToken")?.value;

  // Jika pengguna sudah login, blok akses ke "/auth/login" dan "/auth/register"
  if (
    idToken &&
    (pathname === "/auth/login" || pathname === "/auth/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !idToken &&
    (pathname === "/markets" ||
      pathname === "/merchants" ||
      pathname === "/products" ||
      pathname === "/predict")
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Izinkan akses ke public routes tanpa validasi
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Jika tidak ada token, arahkan pengguna ke "/auth/login"
  if (!idToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Validasi token dengan API
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/validate-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      }
    );

    // Jika token valid, lanjutkan request
    if (response.status === 200) {
      const decodedToken = await response.json();

      const res = NextResponse.next();
      res.headers.set("X-User-ID", decodedToken.uid);
      return res;
    }
  } catch (error) {
    console.error("Error during token validation:", error);
  }

  // Jika validasi token gagal, arahkan ke "/auth/login"
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/markets",
    "/merchants",
    "/products",
  ], // Middleware berlaku untuk dashboard dan auth routes
};
