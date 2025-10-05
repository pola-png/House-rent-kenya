'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { initiateAnonymousSignIn } from './non-blocking-login';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isInitialized = getApps().length > 0;
  const firebaseApp = isInitialized ? getApp() : initializeApp(firebaseConfig);
  const { auth, firestore, analytics } = getSdks(firebaseApp);
  
  // In development, connect to local emulators
  // Note: You must have the Firebase emulators running for this to work
  if (process.env.NODE_ENV === 'development' && !isInitialized) {
    // This block will now run on every initialization in development,
    // ensuring a stable connection to the emulators during hot reloads.
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }

  if (!isInitialized) {
      // This should only run once when the app is first loaded.
      initiateAnonymousSignIn(auth);
  }

  return { firebaseApp, auth, firestore, analytics };
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    analytics: typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
