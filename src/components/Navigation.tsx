'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InfluencerFlow AI</h1>
                <p className="text-sm text-gray-500">Multi-Agent Influencer Marketing Platform</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' || isLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 