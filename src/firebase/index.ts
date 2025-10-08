'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initiateAnonymousSignIn } from './non-blocking-login';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null;

// This flag ensures that we only connect to the emulators once.
let emulatorsConnected = false;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;
    initiateAnonymousSignIn(auth);
  } else {
    firebaseApp = getApp();
    const sdks = getSdks(firebaseApp);
    auth = sdks.auth;
    firestore = sdks.firestore;
    analytics = sdks.analytics;
  }
  
  // In development, connect to local emulators
  // Note: You must have the Firebase emulators running for this to work
  if (process.env.NODE_ENV === 'development' && !emulatorsConnected) {
    try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        emulatorsConnected = true;
        console.log("Connected to Firebase emulators.");
    } catch (e) {
        console.error("Error connecting to Firebase emulators. Please ensure they are running.", e);
    }
  }

  return { firebaseApp, auth, firestore, analytics };
}

export function getSdks(app: FirebaseApp) {
  return {
    auth: getAuth(app),
    firestore: getFirestore(app),
    analytics: typeof window !== 'undefined' ? getAnalytics(app) : null
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