
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: Do not expose this file to the client-side.
// This configuration is for server-side use only.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let adminApp: App;
let firestoreAdmin;

if (!getApps().some(app => app.name === 'admin')) {
  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    }, 'admin');
  } else {
    // Initialize without credentials for local emulator or environments
    // where GOOGLE_APPLICATION_CREDENTIALS might be set.
    adminApp = initializeApp(undefined, 'admin');
    console.warn("Firebase Admin SDK initialized without explicit service account. Make sure GOOGLE_APPLICATION_CREDENTIALS is set or you're using an emulator.");
  }
} else {
  adminApp = getApps().find(app => app.name === 'admin')!;
}

firestoreAdmin = getFirestore(adminApp);

export { adminApp, firestoreAdmin };
