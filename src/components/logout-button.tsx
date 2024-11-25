"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Logout dari Firebase
      await signOut(auth);

      // Hapus cookie token
      document.cookie =
        "idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect ke halaman login
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <RainbowButton onClick={handleLogout} className="px-4 text-sm">
      <LogOut height={15} />
      Log out
    </RainbowButton>
  );
}
