'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import FileUpload from './FileUpload';
import { STORAGE_BUCKETS } from '@/lib/supabase';

interface ProfileImageUploadProps {
  userId: string;
  currentImageUrl?: string | null;
  onImageUpdate: (url: string) => void;
  className?: string;
}

export default function ProfileImageUpload({
  userId,
  currentImageUrl,
  onImageUpdate,
  className = '',
}: ProfileImageUploadProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Camera className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <FileUpload
          bucket="PROFILE_IMAGES"
          path={`${userId}/profile`}
          onUploadComplete={onImageUpdate}
          accept="image/jpeg,image/png,image/gif,image/webp"
          maxSize={5 * 1024 * 1024} // 5MB
          className="w-32 h-32 rounded-full"
        />
      </div>
    </div>
  );
} 