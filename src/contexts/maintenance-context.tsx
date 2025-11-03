"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface MaintenanceEntry {
  id: string;
  userId: string;
  userEmail?: string;
  userDisplayName?: string;
  icao24?: string;
  flightNumber: string;
  aircraftType: string;
  scheduledDate: string;
  status: 'Scheduled' | 'Pending' | 'Completed' | 'Cancelled';
  maintenanceType: 'A-Check' | 'B-Check' | 'C-Check';
  description?: string;
  estimatedDuration?: string;
  createdAt: string;
  updatedAt?: string;
}

interface MaintenanceContextType {
  maintenanceEntries: MaintenanceEntry[];
  loading: boolean;
  addMaintenanceEntry: (entry: Omit<MaintenanceEntry, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateMaintenanceEntry: (id: string, updates: Partial<MaintenanceEntry>) => Promise<void>;
  deleteMaintenanceEntry: (id: string) => Promise<void>;
  getMaintenanceEntries: () => MaintenanceEntry[];
  loadMaintenanceEntries: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [maintenanceEntries, setMaintenanceEntries] = useState<MaintenanceEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load maintenance entries from Firebase
  const loadMaintenanceEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const maintenanceCollection = collection(db, 'maintenance');
      // Simplified query without orderBy to avoid index requirement
      const q = query(
        maintenanceCollection,
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const entries: MaintenanceEntry[] = [];
      const seenIds = new Set<string>();
      
      querySnapshot.forEach((doc) => {
        const entry = {
          id: doc.id,
          ...doc.data()
        } as MaintenanceEntry;
        
        // Ensure unique IDs to prevent React key duplication
        if (!seenIds.has(entry.id)) {
          seenIds.add(entry.id);
          entries.push(entry);
        }
      });
      
      // Sort entries by createdAt on the client side (most recent first)
      entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('Loaded maintenance entries from Firebase:', entries);
      
      // Filter out any entries with timestamp IDs (these are invalid)
      const validEntries = entries.filter(entry => !entry.id.match(/^\d+$/));
      console.log('Valid entries after filtering:', validEntries);
      
      setMaintenanceEntries(validEntries);
    } catch (error) {
      console.error('Error loading maintenance entries:', error);
      console.error('This is likely due to Firestore security rules not being configured.');
      console.error('Please configure Firestore security rules in Firebase Console.');
      // Keep existing entries if Firebase fails
    } finally {
      setLoading(false);
    }
  };

  const addMaintenanceEntry = async (entry: Omit<MaintenanceEntry, 'id' | 'userId' | 'createdAt' | 'userEmail' | 'userDisplayName'>) => {
    if (!user) return;

    // Create entry data without ID (Firebase will generate it)
    const entryData = {
      ...entry,
      userId: user.uid,
      userEmail: user.email || '',
      userDisplayName: user.displayName || user.email?.split('@')[0] || 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create temporary entry for immediate UI update
    const tempId = `temp-${Date.now()}`;
    const tempEntry: MaintenanceEntry = {
      ...entryData,
      id: tempId
    };
    setMaintenanceEntries(prev => [tempEntry, ...prev]);

    try {
      // Save to Firebase (Firebase generates the real ID)
      const docRef = await addDoc(collection(db, 'maintenance'), entryData);
      
      console.log('Entry added to Firebase with ID:', docRef.id);
      
      // Update local state with real Firebase ID
      setMaintenanceEntries(prev => 
        prev.map(item => 
          item.id === tempId 
            ? { ...item, id: docRef.id }
            : item
        )
      );
    } catch (error) {
      console.error('Error adding maintenance entry:', error);
      // Remove the temporary entry if Firebase fails
      setMaintenanceEntries(prev => prev.filter(item => item.id !== tempId));
      throw error;
    }
  };

  const updateMaintenanceEntry = async (id: string, updates: Partial<MaintenanceEntry>) => {
    if (!user) return;

    // Don't try to update temporary entries
    if (id.startsWith('temp-')) {
      console.log('Skipping update for temporary entry:', id);
      return;
    }

    console.log('Updating entry:', { id, updates });

    // Update local state immediately
    setMaintenanceEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
      )
    );

    try {
      // Update in Firebase
      const docRef = doc(db, 'maintenance', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      console.log('Successfully updated entry in Firebase:', id);
    } catch (error) {
      console.error('Error updating maintenance entry:', error);
      // Revert local changes if Firebase fails
      await loadMaintenanceEntries();
      throw error;
    }
  };

  const deleteMaintenanceEntry = async (id: string) => {
    if (!user) return;

    // Update local state immediately
    const originalEntries = maintenanceEntries;
    setMaintenanceEntries(prev => prev.filter(entry => entry.id !== id));

    try {
      // Delete from Firebase
      await deleteDoc(doc(db, 'maintenance', id));
    } catch (error) {
      console.error('Error deleting maintenance entry:', error);
      // Revert local changes if Firebase fails
      setMaintenanceEntries(originalEntries);
      throw error;
    }
  };

  const getMaintenanceEntries = () => {
    return maintenanceEntries;
  };

  // Load maintenance entries when user changes
  useEffect(() => {
    if (user) {
      loadMaintenanceEntries();
    } else {
      setMaintenanceEntries([]);
    }
  }, [user]);

  // Listen for AI-generated flight additions
  useEffect(() => {
    const handleAddFlightFromAI = async (event: CustomEvent) => {
      const flightInfo = event.detail;
      try {
        await addMaintenanceEntry(flightInfo);
      } catch (error) {
        console.error('Error adding flight from AI:', error);
      }
    };

    window.addEventListener('addFlightToMaintenance', handleAddFlightFromAI as any);
    
    return () => {
      window.removeEventListener('addFlightToMaintenance', handleAddFlightFromAI as any);
    };
  }, [user]);

  return (
    <MaintenanceContext.Provider value={{
      maintenanceEntries,
      loading,
      addMaintenanceEntry,
      updateMaintenanceEntry,
      deleteMaintenanceEntry,
      getMaintenanceEntries,
      loadMaintenanceEntries
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
