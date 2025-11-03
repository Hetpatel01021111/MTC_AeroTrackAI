'use client';

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  // If not open, return null (for modal usage)
  if (!isOpen) return null;

  // Check if onClose is a no-op function (for embedded usage in AuthGuard)
  const isEmbedded = onClose.toString() === '() => {}';

  if (isEmbedded) {
    // Embedded mode - no modal wrapper
    return (
      <div className="w-full">
        {mode === 'login' ? (
          <LoginForm onToggleMode={toggleMode} onClose={onClose} />
        ) : (
          <SignUpForm onToggleMode={toggleMode} onClose={onClose} />
        )}
      </div>
    );
  }

  // Modal mode - with backdrop and close button
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">
              {mode === 'login' ? 'Welcome Back' : 'Join AeroTrack AI'}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} onClose={onClose} />
          ) : (
            <SignUpForm onToggleMode={toggleMode} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};
