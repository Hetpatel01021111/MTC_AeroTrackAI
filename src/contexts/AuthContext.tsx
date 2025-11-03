'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Create Google provider instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  searchHistory: SearchHistoryItem[];
}

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  results?: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveSearchHistory: (query: string, results?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              searchHistory: data.searchHistory || []
            });
          } else {
            // User document doesn't exist, create basic user data
            setUserData({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              createdAt: new Date(),
              searchHistory: []
            });
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
          // Create basic user data even if Firestore fails
          setUserData({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            createdAt: new Date(),
            searchHistory: []
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore (with error handling)
      const newUserData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        createdAt: new Date(),
        searchHistory: []
      };

      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          ...newUserData,
          createdAt: new Date() // Firestore timestamp
        });
      } catch (firestoreError) {
        console.error('Error creating user document in Firestore:', firestoreError);
        // Continue with local user data even if Firestore fails
      }
      
      setUserData(newUserData);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create user data object
      const newUserData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        createdAt: new Date(),
        searchHistory: []
      };

      try {
        // Check if user document exists, if not create it
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create user document for new Google users
          await setDoc(userDocRef, {
            ...newUserData,
            createdAt: new Date() // Firestore timestamp
          });
        }
      } catch (firestoreError) {
        console.error('Error handling user document in Firestore:', firestoreError);
        // Continue with authentication even if Firestore fails
      }
      
      setUserData(newUserData);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const saveSearchHistory = async (query: string, results?: any) => {
    if (!user || !userData) return;

    const searchItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      results
    };

    const updatedSearchHistory = [searchItem, ...userData.searchHistory].slice(0, 50); // Keep last 50 searches
    
    // Update local state immediately
    setUserData({
      ...userData,
      searchHistory: updatedSearchHistory
    });

    // Try to save to Firestore, but don't fail if it doesn't work
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...userData,
        searchHistory: updatedSearchHistory,
        lastUpdated: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving search history to Firestore:', error);
      // Search history is still saved locally, so this is not a critical error
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    saveSearchHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
