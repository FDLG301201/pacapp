'use client'

import { useRef, useState } from 'react'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { compressImage } from '@/lib/utils/image'

export interface PhotoFile {
  id: string          // local uuid for react key
  file: File          // compressed File ready for upload
  previewUrl: string  // object URL for display
}

interface PhotoUploaderProps {
  photos: PhotoFile[]
  onChange: (photos: PhotoFile[]) => void
  maxPhotos?: number
  compressOptions?: {
    maxWidthOrHeight?: number
    initialQuality?: number
    maxSizeMB?: number
  }
  error?: string
}

export function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 5,
  compressOptions,
  error,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [compressing, setCompressing] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = maxPhotos - photos.length
    const toProcess = Array.from(files).slice(0, remaining)
    if (toProcess.length === 0) return

    setCompressing(true)
    try {
      const newPhotos: PhotoFile[] = await Promise.all(
        toProcess.map(async (file) => {
          const compressed = await compressImage(file, {
            maxWidthOrHeight: 1600,
            initialQuality: 0.82,
            maxSizeMB: 0.4,
            ...compressOptions,
          })
          return {
            id: crypto.randomUUID(),
            file: compressed,
            previewUrl: URL.createObjectURL(compressed),
          }
        })
      )
      onChange([...photos, ...newPhotos])
    } catch (err) {
      console.error('Image compression error:', err)
    } finally {
      setCompressing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removePhoto(id: string) {
    const photo = photos.find((p) => p.id === id)
    if (photo) URL.revokeObjectURL(photo.previewUrl)
    onChange(photos.filter((p) => p.id !== id))
  }

  function movePhoto(index: number, direction: 'left' | 'right') {
    const newPhotos = [...photos]
    const swapIndex = direction === 'left' ? index - 1 : index + 1
    ;[newPhotos[index], newPhotos[swapIndex]] = [newPhotos[swapIndex], newPhotos[index]]
    onChange(newPhotos)
  }

  const canAdd = photos.length < maxPhotos

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canAdd && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Seleccionar fotos"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 p-8 transition-colors hover:border-primary hover:bg-primary/10',
            compressing && 'pointer-events-none opacity-60'
          )}
        >
          <Camera className="h-8 w-8 text-primary" />
          <p className="text-center text-sm font-medium text-foreground">
            {compressing
              ? 'Procesando fotos…'
              : 'Arrastra tus fotos aquí o toca para seleccionar'}
          </p>
          <p className="text-xs text-muted-foreground">
            {photos.length}/{maxPhotos} fotos · JPG, PNG, WEBP
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <div key={photo.id} className="group relative aspect-square">
              <img
                src={photo.previewUrl}
                alt={`Foto ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label="Eliminar foto"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              {/* Reorder arrows */}
              <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => movePhoto(index, 'left')}
                    aria-label="Mover izquierda"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                )}
                {index < photos.length - 1 && (
                  <button
                    type="button"
                    onClick={() => movePhoto(index, 'right')}
                    aria-label="Mover derecha"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              {/* First photo badge */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-xs text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
