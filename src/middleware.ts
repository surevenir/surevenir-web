import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan akses ke public routes tanpa validasi
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const idToken = request.cookies.get("idToken")?.value;

  if (!idToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Kirim token ke API route untuk validasi
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

    if (response.status === 200) {
      const decodedToken = await response.json();

      const res = NextResponse.next();
      res.headers.set("X-User-ID", decodedToken.uid);
      return res;
    }
  } catch (error) {
    console.error("Error during token validation:", error);
  }

  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
