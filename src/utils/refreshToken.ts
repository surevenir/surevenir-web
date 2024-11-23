import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

export function monitorTokenRefresh() {
  // Pastikan kode berjalan di browser
  if (typeof window === "undefined") return;

  onIdTokenChanged(auth, async (user) => {
    if (user) {
      try {
        // Refresh token
        const idToken = await user.getIdToken(true);

        // Simpan token di cookie (tanpa HttpOnly)
        // document.cookie = `idToken=${idToken}; path=/; Secure; SameSite=Strict;`;
        if (typeof window !== "undefined") {
          document.cookie = `idToken=${idToken}; path=/; SameSite=Strict; Secure`;
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    } else {
      // Hapus token jika user logout
      document.cookie =
        "idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  });
}
