import admin from "firebase-admin";

// Konfigurasi service account

import serviceAccount from "./../credentials/credentials";

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Ekspor objek autentikasi
export const adminAuth = admin.auth();
