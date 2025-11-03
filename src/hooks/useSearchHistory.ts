'use client';

import { useAuth } from '@/contexts/AuthContext';

export const useSearchHistory = () => {
  const { user, saveSearchHistory } = useAuth();

  const saveSearch = async (query: string, results?: any) => {
    if (!user) {
      console.log('User not authenticated, skipping search history save');
      return;
    }

    try {
      // Save to Firebase through AuthContext
      await saveSearchHistory(query, results);
      
      // Also save via API endpoint as backup
      const response = await fetch('/api/save-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          query,
          results
        }),
      });

      if (!response.ok) {
        console.error('Failed to save search history via API');
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  return {
    saveSearch,
    isAuthenticated: !!user
  };
};
