import { cert, initializeApp } from "firebase-admin/app";
import path from "path";
import "dotenv/config";

const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "./vueFastifyAccountKey.json";

if (!serviceAccountPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
}

const serviceAccount = path.resolve(serviceAccountPath);

// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
//   authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_FIREBASE_APP_ID,
//   measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
// };

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

console.log("Firebase Admin SDK initialized successfully!");
