'use client'

import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'

interface CompressOptions {
  maxWidthOrHeight?: number
  initialQuality?: number
  maxSizeMB?: number
}

/**
 * Compresses an image file before upload.
 * Defaults: max 1200px wide, quality 0.8, target ≤500 KB.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidthOrHeight = 1200,
    initialQuality = 0.8,
    maxSizeMB = 0.5,
  } = options

  const compressed = await imageCompression(file, {
    maxWidthOrHeight,
    initialQuality,
    maxSizeMB,
    useWebWorker: true,
    fileType: 'image/jpeg',
  })

  // imageCompression returns a Blob — wrap it back into a File
  return new File([compressed], file.name.replace(/\.[^.]+$/, '.jpg'), {
    type: 'image/jpeg',
  })
}

/**
 * Compresses an image then uploads it to Supabase Storage.
 * Returns the public URL and the storage path (needed for future deletion).
 */
export async function uploadImage(
  file: File,
  bucket: string,
  path: string,
  compressOptions?: CompressOptions
): Promise<{ publicUrl: string; storagePath: string }> {
  const compressed = await compressImage(file, compressOptions)
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, compressed, { upsert: true, contentType: 'image/jpeg' })

  if (error) {
    console.error('Storage upload error:', error.message)
    throw new Error(`Error al subir la imagen: ${error.message}`)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return {
    publicUrl: data.publicUrl,
    storagePath: path,
  }
}

/**
 * Deletes a file from Supabase Storage by its storage path.
 */
export async function deleteStorageFile(
  bucket: string,
  storagePath: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).remove([storagePath])
  if (error) {
    console.error('Storage delete error:', error.message)
    // Non-fatal — log and continue; the DB row will still be removed
  }
}
