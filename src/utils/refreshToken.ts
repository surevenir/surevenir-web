import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

export function monitorTokenRefresh() {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      const idToken = await user.getIdToken(true);
      document.cookie = `idToken=${idToken}; path=/; Secure; HttpOnly; SameSite=Strict;`;
    } else {
      document.cookie =
        "idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  });
}
