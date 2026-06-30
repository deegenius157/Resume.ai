import { app, analytics } from '../firebase';
import { logEvent as fbLogEvent } from 'firebase/analytics';

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
