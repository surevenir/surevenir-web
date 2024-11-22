import Link from "next/link";

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

export function RegisterForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email below to register with your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="gap-4 grid">
          <div className="gap-2 grid">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="johndoe"
              required
            />
          </div>
          <div className="gap-2 grid">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              required
            />
          </div>
          <div className="gap-2 grid">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Have an account?{" "}
          <Link href="/auth/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
