import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

export const storage = {
  // Upload media file
  uploadMedia: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  // Upload contract PDF
  uploadContract: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('contracts')
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