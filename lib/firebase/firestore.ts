import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  increment,
  FieldValue,
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile, ApiCall, ApiResponse, UsageStats } from '@/types/firebase';

// User Profile Functions
export const createUserProfile = async (userProfile: UserProfile) => {
  const userRef = doc(db, 'users', userProfile.uid);
  
  // Clean the profile data to remove undefined values
  const cleanProfile: any = {
    uid: userProfile.uid,
    email: userProfile.email,
    createdAt: userProfile.createdAt instanceof Date ? Timestamp.fromDate(userProfile.createdAt) : userProfile.createdAt,
    plan: userProfile.plan,
  };
  
  // Only add displayName if it exists and is not undefined
  if (userProfile.displayName && userProfile.displayName.trim() !== '') {
    cleanProfile.displayName = userProfile.displayName;
  }
  
  await setDoc(userRef, cleanProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
    } as UserProfile;
  }
  
  return null;
};

// API Call Tracking Functions
export const recordApiCall = async (apiCall: Omit<ApiCall, 'id'>) => {
  const callsRef = collection(db, 'api_calls');
  await addDoc(callsRef, {
    ...apiCall,
    timestamp: Timestamp.fromDate(apiCall.timestamp),
  });
  
  // Update daily usage stats
  await updateUsageStats(apiCall);
};

export const getRecentApiCalls = async (userId: string, limitCount: number = 100) => {
  const callsRef = collection(db, 'api_calls');
  const q = query(
    callsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  })) as ApiCall[];
};

// API Response Caching Functions
export const cacheApiResponse = async (response: Omit<ApiResponse, 'id'>) => {
  const responsesRef = collection(db, 'api_responses');
  await addDoc(responsesRef, {
    ...response,
    timestamp: Timestamp.fromDate(response.timestamp),
    expiresAt: Timestamp.fromDate(response.expiresAt),
  });
};

export const getCachedResponse = async (
  userId: string,
  endpoint: string
): Promise<ApiResponse | null> => {
  const responsesRef = collection(db, 'api_responses');
  const q = query(
    responsesRef,
    where('userId', '==', userId),
    where('endpoint', '==', endpoint),
    where('expiresAt', '>', Timestamp.now()),
    orderBy('expiresAt', 'desc'),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
      expiresAt: doc.data().expiresAt.toDate(),
    } as ApiResponse;
  }
  
  return null;
};

// Usage Statistics Functions
export const updateUsageStats = async (apiCall: Omit<ApiCall, 'id'>) => {
  const date = apiCall.timestamp.toISOString().split('T')[0];
  const statsRef = doc(db, 'usage_stats', `${apiCall.userId}_${date}`);
  
  const statsDoc = await getDoc(statsRef);
  
  if (statsDoc.exists()) {
    // Update existing stats
    const updates: { [key: string]: any } = {
      totalCalls: increment(1),
      [`byEndpoint.${apiCall.endpoint}`]: increment(1),
      totalResponseSize: increment(apiCall.responseSize),
    };
    
    if (apiCall.status >= 400) {
      updates.errors = increment(1);
    }
    
    await updateDoc(statsRef, updates as { [x: string]: FieldValue | Partial<unknown> | undefined });
    
    // Update average response time
    const currentStats = statsDoc.data() as UsageStats;
    const newAvg = 
      (currentStats.avgResponseTime * currentStats.totalCalls + apiCall.responseTime) /
      (currentStats.totalCalls + 1);
    
    await updateDoc(statsRef, { avgResponseTime: newAvg });
  } else {
    // Create new stats document
    const newStats: UsageStats = {
      userId: apiCall.userId,
      date,
      totalCalls: 1,
      byEndpoint: { [apiCall.endpoint]: 1 },
      errors: apiCall.status >= 400 ? 1 : 0,
      avgResponseTime: apiCall.responseTime,
      totalResponseSize: apiCall.responseSize,
    };
    
    await setDoc(statsRef, newStats);
  }
};

export const getUsageStats = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<UsageStats[]> => {
  const statsRef = collection(db, 'usage_stats');
  const q = query(
    statsRef,
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as UsageStats[];
};