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
import crypto from "crypto";
import dotenv from "dotenv";

export function RegisterForm() {
  dotenv.config();
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const encryptPassword = (password: string): string => {
    // Mengambil key dari env
    const key = process.env.NEXT_PUBLIC_PASSWORD_KEY;

    if (!key) {
      throw new Error("PASSWORD_KEY is not defined");
    }

    // Hash key menjadi panjang 32 byte dengan SHA-256
    const hashedKey = crypto.createHash("sha256").update(key).digest();

    const algorithm = "aes-256-ctr";
    const iv = crypto.randomBytes(16); // Inisialisasi vector acak
    const cipher = crypto.createCipheriv(algorithm, hashedKey, iv);
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let userCredential = null;
    try {
      // Mendaftar ke Firebase menggunakan password plain text
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Update display name di Firebase
      await updateProfile(userCredential.user, { displayName: username });

      // Enkripsi password sebelum menyimpan ke database
      const encryptedPassword = encryptPassword(password);

      const idUser = userCredential.user.uid;

      const userData = {
        id: idUser,
        full_name: fullname,
        username,
        email,
        password: encryptedPassword,
      };

      const result = await postUser(userData);

      console.log("result: " + JSON.stringify(result));

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

      // Jika ada error dan userCredential sudah ada, hapus user yang baru terdaftar di Firebase
      if (userCredential) {
        try {
          await deleteUser(userCredential.user); // Menghapus user dari Firebase
        } catch (deleteError: any) {
          console.error("Failed to delete Firebase user:", deleteError.message);
        }
      }

      // Batalkan kedua proses jika salah satu gagal
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
