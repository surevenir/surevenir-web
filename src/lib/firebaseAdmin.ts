import admin from "firebase-admin";

// Konfigurasi service account

var serviceAccount = require("./../credentials/credentials.json");

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Ekspor objek autentikasi
export const adminAuth = admin.auth();
