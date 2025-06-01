'use client';

import React, { useState } from 'react';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleImageUpdate = async (url: string) => {
    setProfileImage(url);
    // TODO: Update user profile in database with new image URL
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-6">
          <ProfileImageUpload
            userId={session.user.id}
            currentImageUrl={profileImage}
            onImageUpdate={handleImageUpdate}
          />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {session.user.name}
            </h1>
            <p className="text-gray-600">{session.user.email}</p>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Upload a profile picture to personalize your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 