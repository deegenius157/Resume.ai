import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCyoK_wZTq97ZWOBUArQKL1DYV7i4GfuBY",
  authDomain: "resumeai-172a8.firebaseapp.com",
  projectId: "resumeai-172a8",
  storageBucket: "resumeai-172a8.firebasestorage.app",
  messagingSenderId: "451778859090",
  appId: "1:451778859090:web:e0ce221c6073e6dfb34f8b",
  measurementId: "G-PF98N16M30"
};

let app;
let analytics;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn("⚠️ Firebase failed to initialize:", error);
}

export { app, analytics };
