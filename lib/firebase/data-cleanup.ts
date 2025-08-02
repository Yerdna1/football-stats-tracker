import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from './config';

/**
 * Clean up user profile by removing undefined fields
 */
export const cleanupUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const updates: any = {};
      
      // Remove undefined displayName field if it exists and is empty/undefined
      if (data.displayName === undefined || data.displayName === null || data.displayName === '') {
        updates.displayName = deleteField();
      }
      
      // Apply updates if needed
      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
        console.log(`Cleaned up user profile for ${userId}`);
        return true;
      } else {
        console.log(`User profile for ${userId} is already clean`);
        return false;
      }
    } else {
      console.log(`User profile for ${userId} does not exist`);
      return false;
    }
  } catch (error) {
    console.error(`Error cleaning up user profile for ${userId}:`, error);
    throw error;
  }
};

/**
 * Create or recreate a clean user profile
 */
export const recreateUserProfile = async (userId: string, email: string, displayName?: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const cleanProfile: any = {
      uid: userId,
      email: email,
      createdAt: new Date(),
      plan: 'free',
    };
    
    // Only add displayName if it's a valid string
    if (displayName && displayName.trim() !== '') {
      cleanProfile.displayName = displayName.trim();
    }
    
    await updateDoc(userRef, cleanProfile);
    console.log(`Recreated clean user profile for ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error recreating user profile for ${userId}:`, error);
    throw error;
  }
};