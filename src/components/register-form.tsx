"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
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
import { toast } from "sonner";
import { postUser } from "@/utils/userActions";
import ShinyButton from "./ui/shiny-button";
import { ArrowLeftIcon } from "lucide-react";
import dotenv from "dotenv";

/**
 * RegisterForm component
 *
 * Handles user registration, including creating a new Firebase user and
 * saving the user's full name, username, email, and password to the database.
 *
 * @returns A form component for user registration
 */
export function RegisterForm() {
  dotenv.config();
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles user registration, including creating a new Firebase user and
   * saving the user's full name, username, email, and password to the database.
   *
   * @param {React.FormEvent} e The form event
   * @returns {Promise<void>}
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let userCredential = null;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: username });

      const idUser = userCredential.user.uid;

      const userData = {
        id: idUser,
        full_name: fullname,
        username,
        email,
        password,
      };

      const result = await postUser(userData);

      if (userCredential && result) {
        toast.success("User registered successfully!");
        router.push("/auth/login");
      } else {
        throw new Error("Failed to save user to the database.");
      }
    } catch (err: any) {
      console.error("Error during registration:", err.message);
      setError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Registration failed.");

      if (userCredential) {
        try {
          await deleteUser(userCredential.user);
        } catch (deleteError: any) {
          console.error("Failed to delete Firebase user:", deleteError.message);
        }
      }

      setLoading(false);
      return;
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
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to register with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="gap-4 grid" onSubmit={handleRegister}>
            <div className="gap-2 grid">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="johndoe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
            <div className="gap-2 grid">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="gap-2 grid">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="gap-2 grid">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Have an account?{" "}
            <Link href="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
