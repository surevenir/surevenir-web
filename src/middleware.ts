import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserById } from "./utils/userActions";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

/**
 * This middleware handles authentication and authorization for the app.
 * It checks if the user is logged in and has the correct role for the requested route.
 * If the user is not logged in, it redirects to the login page.
 * If the user is logged in but does not have the correct role, it redirects to the home page.
 * If the user is logged in and has the correct role, it adds the user ID to the request headers.
 * If the user is not logged in, it redirects to the login page.
 * If the request is for a public route, it returns the response from Next.js.
 * If the request is for a protected route and the user is not logged in, it redirects to the login page.
 * If the request is for a protected route and the user is logged in, it validates the user's token.
 * If the token is valid, it adds the user ID to the request headers and returns the response from Next.js.
 * If the token is invalid, it redirects to the login page.
 * If there is an error during token validation, it logs the error to the console and redirects to the login page.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const idToken = request.cookies.get("idToken")?.value;
  const userId = request.cookies.get("userId")?.value;

  const user = await getUserById(userId as string, userId as string);

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

  if (user) {
    if (user.role !== "ADMIN" && pathname.includes("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!idToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const response = await fetch(`${apiUrl}/api/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken }),
    });

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
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/markets",
    "/merchants",
    "/products",
  ],
};
