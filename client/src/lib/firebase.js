import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as fbLogEvent } from 'firebase/analytics';

// Firebase configuration using Vite environment variables (fallback to placeholders if not set)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0000000000"
};

let app = null;
let analytics = null;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined' && firebaseConfig.apiKey !== "dummy-api-key") {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn("⚠️ Firebase failed to initialize:", error);
}

// Stateful metrics logger with fallback to console
export const logMetric = (eventName, eventParams = {}) => {
  console.log(`📊 [Metric Logged]: ${eventName}`, eventParams);
  if (analytics) {
    try {
      fbLogEvent(analytics, eventName, eventParams);
    } catch (err) {
      console.error("❌ Failed to log event to Firebase Analytics:", err);
    }
  }
};

export { app, analytics };
