import { createClient } from '@supabase/supabase-js';

// Environment variable validation
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not defined`);
  }
});

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Storage bucket names
export const BUCKETS = {
  PROFILE_IMAGES: 'profile-images',
  CONTENT_MEDIA: 'content-media',
  CAMPAIGN_ASSETS: 'campaign-assets',
} as const;

// File type validation
export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// File size limits (in bytes)
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

// Helper functions
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const validateFileType = (file: File, allowedTypes: string[]) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

export const validateFileSize = (file: File, maxSize: number) => {
  if (file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`);
  }
};

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    allowedTypes?: string[];
    maxSize?: number;
    metadata?: Record<string, string>;
  }
) => {
  try {
    // Validate file type if allowed types are specified
    if (options?.allowedTypes) {
      validateFileType(file, options.allowedTypes);
    }

    // Validate file size if max size is specified
    if (options?.maxSize) {
      validateFileSize(file, options.maxSize);
    }

    // Upload file with metadata
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        ...options?.metadata && { metadata: options.metadata },
      });

    if (error) {
      console.error('File upload error:', {
        bucket,
        path,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }

    console.log('File uploaded successfully:', {
      bucket,
      path,
      size: file.size,
      type: file.type,
      timestamp: new Date().toISOString(),
    });

    return data;
  } catch (error) {
    console.error('File upload failed:', {
      bucket,
      path,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('File deletion error:', {
        bucket,
        path,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }

    console.log('File deleted successfully:', {
      bucket,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('File deletion failed:', {
      bucket,
      path,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

export const listFiles = async (
  bucket: string,
  path?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '', {
        limit: options?.limit,
        offset: options?.offset,
        sortBy: options?.sortBy ? {
          column: options.sortBy.column,
          order: options.sortBy.order,
        } : undefined,
      });

    if (error) {
      console.error('File listing error:', {
        bucket,
        path,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('File listing failed:', {
      bucket,
      path,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

export const updateFileMetadata = async (
  bucket: string,
  path: string,
  metadata: Record<string, string>
) => {
  try {
    // First, get the current file
    const { data: fileData, error: getError } = await supabase.storage
      .from(bucket)
      .download(path);

    if (getError) {
      console.error('Error getting file for metadata update:', {
        bucket,
        path,
        error: getError.message,
        timestamp: new Date().toISOString(),
      });
      throw getError;
    }

    if (!fileData) {
      throw new Error('File not found');
    }

    // Upload the file with new metadata
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, fileData, {
        upsert: true,
        contentType: fileData.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading file with new metadata:', {
        bucket,
        path,
        error: uploadError.message,
        timestamp: new Date().toISOString(),
      });
      throw uploadError;
    }

    console.log('File metadata updated successfully:', {
      bucket,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Metadata update failed:', {
      bucket,
      path,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

// Health check function
export const checkStorageHealth = async () => {
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.storage.getBucket(BUCKETS.PROFILE_IMAGES);
    const responseTime = Date.now() - startTime;

    if (error) {
      throw error;
    }

    console.log('Storage health check passed:', {
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return {
      status: 'healthy',
      responseTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Storage health check failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

export default supabase; 