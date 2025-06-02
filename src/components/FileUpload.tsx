'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { uploadFile, BUCKETS, getPublicUrl } from '@/lib/supabase';

interface FileUploadProps {
  bucket: keyof typeof BUCKETS;
  path: string;
  onUploadComplete: (url: string) => void;
  onError?: (error: Error) => void;
  accept?: string[];
  maxSize?: number;
  className?: string;
}

export default function FileUpload({
  bucket,
  path,
  onUploadComplete,
  onError,
  accept,
  maxSize,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        await handleFile(file);
      }
    },
    [bucket, path]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleFile(file);
      }
    },
    [bucket, path]
  );

  const handleFile = async (file: File) => {
    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadFile(
        BUCKETS[bucket],
        path,
        file,
        {
          allowedTypes: accept || [],
          maxSize,
          metadata: {
            originalName: file.name,
            contentType: file.type,
          },
        }
      );

      if (result) {
        const publicUrl = getPublicUrl(BUCKETS[bucket], result.path);
        onUploadComplete(publicUrl);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      onError?.(err instanceof Error ? err : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    if (preview) return <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded" />;
    
    switch (bucket) {
      case 'PROFILE_IMAGES':
        return <ImageIcon className="w-12 h-12 text-gray-400" />;
      case 'CONTENT_MEDIA':
        return <Video className="w-12 h-12 text-gray-400" />;
      case 'CAMPAIGN_ASSETS':
        return <FileText className="w-12 h-12 text-gray-400" />;
      default:
        return <Upload className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept?.join(',')}
        onChange={handleFileInput}
        className="hidden"
        id={`file-upload-${bucket}`}
        disabled={isUploading}
      />
      
      <label
        htmlFor={`file-upload-${bucket}`}
        className="cursor-pointer block"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {getFileIcon()}
          
          <div className="text-sm text-gray-600">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p>Uploading... {progress}%</p>
              </div>
            ) : (
              <>
                <p className="font-medium">Drag and drop your file here</p>
                <p className="text-xs">or click to browse</p>
                {maxSize && (
                  <p className="text-xs text-gray-500">
                    Max size: {Math.round(maxSize / 1024 / 1024)}MB
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </label>

      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center justify-center">
          <X className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
} 