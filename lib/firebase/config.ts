import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableNetwork, disableNetwork, initializeFirestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

// Only initialize Firebase in browser environment for static export compatibility
if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} else {
  // Create a mock app for server-side rendering/static export
  app = {} as FirebaseApp;
}

// Initialize Auth and Firestore only in browser environment
if (typeof window !== 'undefined' && app) {
  auth = getAuth(app);

  // Initialize Firestore with specific settings for static hosting
  try {
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
      experimentalForceLongPolling: true, // Helps with static hosting
    });
  } catch {
    // Fallback to default initialization if custom settings fail
    db = getFirestore(app);
  }
} else {
  // Create mock objects for server-side rendering/static export
  auth = {} as Auth;
  db = {} as Firestore;
}

// Initialize Analytics only in browser environment and avoid errors in static export
if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
    analytics = null;
  }
}

// Helper function to ensure Firestore connection
export const ensureFirestoreConnection = async () => {
  try {
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.warn('Firestore connection failed, retrying...', error);
    try {
      await disableNetwork(db);
      await enableNetwork(db);
      return true;
    } catch (retryError) {
      console.error('Failed to establish Firestore connection:', retryError);
      return false;
    }
  }
};

export { app, auth, db, analytics };