import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return NextResponse.json(decodedToken, { status: 200 });
  } catch (error) {
    console.error("Token validation failed in API:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
