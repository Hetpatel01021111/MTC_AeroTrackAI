'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, userData, logout } = useAuth();

  if (!user || !userData) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{userData.displayName}</h2>
          <p className="text-gray-600">{userData.email}</p>
          <p className="text-sm text-gray-500">
            Member since {userData.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Search History</h3>
        {userData.searchHistory.length === 0 ? (
          <p className="text-gray-500 italic">No search history yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userData.searchHistory.slice(0, 10).map((search) => (
              <div key={search.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium text-gray-900">{search.query}</p>
                <p className="text-sm text-gray-500">
                  {new Date(search.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
