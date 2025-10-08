'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initiateAnonymousSignIn } from './non-blocking-login';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null;

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
