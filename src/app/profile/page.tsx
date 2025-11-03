'use client';

import { useState } from "react";
import { UserProfilePage } from "@/components/user/user-profile-page";
import { Sidebar } from "@/components/layout/sidebar";
import { FloatingChat } from "@/components/chat/floating-chat";
import { UserProfile as LayoutUserProfile } from "@/components/layout/user-profile";
import { UserProfile } from "@/components/user/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex h-screen bg-gray-50 items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Your Profile</h1>
            <p className="text-gray-600 mb-8">Sign in to view and manage your personal information and search history.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and account details</p>
            </div>
            <LayoutUserProfile />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <UserProfile />
        </div>
      </div>
      <FloatingChat />
    </div>
  );
}



