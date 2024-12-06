"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebaseConfig";
import Cookies from "js-cookie";
import ShinyButton from "./ui/shiny-button";
import { ArrowLeftIcon } from "lucide-react";
import { getUserById } from "@/utils/userActions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles user login, including signing in to Firebase and saving the user's
   * ID token and user ID to cookies. If the user is an admin or merchant, they
   * will be redirected to the dashboard. Otherwise, they will be redirected to
   * their profile page.
   *
   * @param {React.FormEvent} e The form event
   * @returns {Promise<void>}
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      Cookies.set("idToken", idToken, {
        expires: 7,
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("userId", userId, {
        expires: 7,
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      const user = await getUserById(userId as string, userId as string);

      if (user.role == "ADMIN" || user.role == "MERCHANT") {
        toast("Welcome to Dashboard");
        router.push("/dashboard");
      } else {
        toast("Welcome Home");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="top-4 left-4 fixed">
        <ShinyButton onClick={() => router.push("/")}>
          <div className="flex justify-between items-center gap-4">
            <ArrowLeftIcon width={15} />
            Home
          </div>
        </ShinyButton>
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="gap-4 grid" onSubmit={handleLogin}>
            <div className="gap-2 grid">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="gap-2 grid">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="inline-block ml-auto text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast("Google Login Coming Soon")}
            >
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
