import { supabase } from './supabase';

// Define storage bucket names as constants
export const STORAGE_BUCKETS = {
  MEDIA: 'media',
  AVATARS: 'avatars',
  TEMP: 'temp'
} as const;

export const storage = {
  // Upload media file
  uploadMedia: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.MEDIA)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data;
  },

  // Get public URL for media
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.MEDIA)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete media file
  deleteMedia: async (path: string) => {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.MEDIA)
      .remove([path]);

    if (error) throw error;
  },

  // Upload avatar
  uploadAvatar: async (file: File, userId: string) => {
    const path = `${userId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data;
  },

  // Get avatar URL
  getAvatarUrl: (userId: string, filename: string) => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .getPublicUrl(`${userId}/${filename}`);
    return data.publicUrl;
  },

  // Upload temporary file
  uploadTemp: async (file: File) => {
    const path = `temp/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.TEMP)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data;
  },

  // Clean up temporary files
  cleanupTemp: async (olderThan: Date) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.TEMP)
      .list('temp', {
        sortBy: { column: 'created_at', order: 'asc' }
      });

    if (error) throw error;

    const filesToDelete = data
      .filter(file => new Date(file.created_at) < olderThan)
      .map(file => `temp/${file.name}`);

    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKETS.TEMP)
        .remove(filesToDelete);

      if (deleteError) throw deleteError;
    }
  }
};

export default supabase 