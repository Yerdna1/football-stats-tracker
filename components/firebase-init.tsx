'use client';

import { useEffect } from 'react';

// Client-side Firebase initialization component
export function FirebaseInit() {
  useEffect(() => {
    // This ensures Firebase is only initialized on the client side
    // Import Firebase config to trigger initialization
    import('@/lib/firebase/config').catch(console.error);
  }, []);

  return null;
}