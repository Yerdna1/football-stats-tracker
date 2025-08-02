'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, ensureFirestoreConnection } from './config';
import { createUserProfile, getUserProfile } from './firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wrap auth state change in try-catch for static export compatibility
    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        if (user) {
          try {
            // Only try Firestore operations in browser environment
            if (typeof window !== 'undefined') {
              // Ensure Firestore connection before making any calls
              const connected = await ensureFirestoreConnection();
              if (!connected) {
                console.warn('Firestore connection failed, skipping profile creation');
                setLoading(false);
                return;
              }

              // Check if user profile exists, create if not
              const profile = await getUserProfile(user.uid);
              if (!profile) {
                await createUserProfile({
                  uid: user.uid,
                  email: user.email!,
                  displayName: user.displayName || undefined,
                  createdAt: new Date(),
                  plan: 'free',
                });
              }
            }
          } catch (error) {
            console.error('Error creating/fetching user profile:', error);
            // Don't block the auth flow if profile creation fails
          }
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error('Auth state change listener failed:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};