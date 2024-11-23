"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut />
      Log out
    </Button>
  );
}
