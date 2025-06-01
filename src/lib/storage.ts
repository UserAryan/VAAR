import { supabase, STORAGE_BUCKETS } from './supabase';

export const storage = {
  // Upload media file
  uploadMedia: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.CONTENT_MEDIA)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  // Upload contract PDF
  uploadContract: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.CAMPAIGN_ASSETS)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  // Get public URL
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete file
  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  }
}

export default supabase 