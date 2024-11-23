import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_CREDENTIALS || "{}"
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
