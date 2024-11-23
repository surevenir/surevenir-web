import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "./lib/firebaseAdmin";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan akses ke public routes tanpa validasi
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const idToken = request.cookies.get("idToken")?.value;

  if (!idToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Validasi token dengan Firebase Admin
    await adminAuth.verifyIdToken(idToken);
    return NextResponse.next();
  } catch (error) {
    console.error("Token invalid atau expired:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
