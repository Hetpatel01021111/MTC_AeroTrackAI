'use client';

import { UserProfile } from "./user-profile";
import { AuthNavigation } from "@/components/navigation/AuthNavigation";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, userData } = useAuth();

  return (
    <div className="bg-white px-6 py-8 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">
            {user && userData 
              ? `Welcome back, ${userData.displayName}! Get a quick overview of your fleet.`
              : "Welcome to AeroTrack AI - Sign in to get started."
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <AuthNavigation />
          {user && <UserProfile />}
        </div>
      </div>
    </div>
  );
}
