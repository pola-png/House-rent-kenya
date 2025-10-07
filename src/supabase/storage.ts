'use client';

import { supabase } from './client';

export const uploadImage = async (file: File, bucket: string, path: string) => {
  return await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
};

export const getImageUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

export const deleteImage = async (bucket: string, path: string) => {
  return await supabase.storage.from(bucket).remove([path]);
};

export const uploadPropertyImage = async (file: File, propertyId: string) => {
  const fileName = `${propertyId}/${Date.now()}-${file.name}`;
  const { data, error } = await uploadImage(file, 'property-images', fileName);
  
  if (error) return { error };
  
  return {
    data: {
      path: fileName,
      url: getImageUrl('property-images', fileName)
    }
  };
};

export const uploadAvatar = async (file: File, userId: string) => {
  const fileName = `${userId}/avatar-${Date.now()}.${file.name.split('.').pop()}`;
  const { data, error } = await uploadImage(file, 'avatars', fileName);
  
  if (error) return { error };
  
  return {
    data: {
      path: fileName,
      url: getImageUrl('avatars', fileName)
    }
  };
};