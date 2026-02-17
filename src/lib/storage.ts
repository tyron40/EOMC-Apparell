import { supabase } from './supabase';
import { resizeImage, ImageContext } from './imageResize';

export async function uploadImage(
  file: File,
  options?: { resize?: boolean; context?: ImageContext }
): Promise<string> {
  let fileToUpload = file;

  if (options?.resize && options?.context) {
    try {
      fileToUpload = await resizeImage(file, options.context);
    } catch (error) {
      console.warn('Image resize failed, uploading original:', error);
    }
  }

  const fileExt = fileToUpload.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadMultipleImages(
  files: FileList | File[],
  options?: { resize?: boolean; context?: ImageContext }
): Promise<string[]> {
  const uploadPromises = Array.from(files).map(file => uploadImage(file, options));
  return Promise.all(uploadPromises);
}

export async function uploadVideo(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteFile(url: string, bucket: 'images' | 'videos'): Promise<void> {
  const urlParts = url.split(`/${bucket}/`);
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('Delete failed:', error);
  }
}