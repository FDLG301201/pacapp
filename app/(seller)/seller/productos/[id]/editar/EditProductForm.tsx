'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ProductFormFields } from '@/components/seller/ProductFormFields'
import { PhotoUploader, type PhotoFile } from '@/components/seller/PhotoUploader'
import { SegmentedControl } from '@/components/seller/SegmentedControl'
import { productSchema, PRODUCT_STATUS_LABELS, type ProductInput } from '@/lib/validations/product'
import { uploadImage, deleteStorageFile } from '@/lib/utils/image'
import { createClient } from '@/lib/supabase/client'
import type { ProductStatus } from '@/types/database.types'

interface ExistingImage {
  id: string
  url: string
  storage_path: string
  position: number
}

interface EditProductFormProps {
  productId: string
  storeId: string
  sellerId: string
  initialValues: ProductInput
  initialStatus: ProductStatus
  existingImages: ExistingImage[]
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: PRODUCT_STATUS_LABELS.active },
  { value: 'hidden', label: PRODUCT_STATUS_LABELS.hidden },
  { value: 'sold',   label: PRODUCT_STATUS_LABELS.sold },
]

export function EditProductForm({
  productId,
  storeId: _storeId,
  sellerId,
  initialValues,
  initialStatus,
  existingImages,
}: EditProductFormProps) {
  const router = useRouter()
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const [keptImages, setKeptImages] = useState<ExistingImage[]>(existingImages)
  const [removedImages, setRemovedImages] = useState<ExistingImage[]>([])
  const [status, setStatus] = useState<ProductStatus>(initialStatus)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  })

  function removeExistingImage(image: ExistingImage) {
    setKeptImages((prev) => prev.filter((img) => img.id !== image.id))
    setRemovedImages((prev) => [...prev, image])
  }

  async function onSubmit(values: ProductInput) {
    if (keptImages.length === 0 && photos.length === 0) {
      setPhotoError('El producto debe tener al menos una foto')
      return
    }
    setPhotoError(null)
    setSubmitting(true)

    const supabase = createClient()

    try {
      // Update product fields
      const { error: updateError } = await supabase
        .from('products')
        .update({
          title: values.title?.trim() || null,
          price: values.price,
          size: values.size,
          category: values.category,
          condition: values.condition,
          gender: values.gender,
          description: values.description?.trim() || null,
          brand: values.brand?.trim() || null,
          color: values.color?.trim() || null,
          material: values.material?.trim() || null,
          status,
        })
        .eq('id', productId)

      if (updateError) {
        console.error('Product update error:', updateError.message)
        throw new Error('Error al actualizar el producto')
      }

      // Delete removed images from DB (cascades to nothing) + Storage
      for (const img of removedImages) {
        await supabase.from('product_images').delete().eq('id', img.id)
        await deleteStorageFile('product-images', img.storage_path)
      }

      // Re-assign positions to kept images
      for (let i = 0; i < keptImages.length; i++) {
        await supabase
          .from('product_images')
          .update({ position: i })
          .eq('id', keptImages[i].id)
      }

      // Upload new photos
      const startPosition = keptImages.length
      for (let i = 0; i < photos.length; i++) {
        const position = startPosition + i
        const storagePath = `${sellerId}/${productId}/${Date.now()}_${i}.jpg`
        const { publicUrl, storagePath: savedPath } = await uploadImage(
          photos[i].file,
          'product-images',
          storagePath
        )
        await supabase.from('product_images').insert({
          product_id: productId,
          url: publicUrl,
          storage_path: savedPath,
          position,
        })
      }

      toast.success('Producto actualizado')
      router.push('/seller/productos')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
      console.error('Product edit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/seller/productos"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a productos
          </Link>
          <h1 className="mt-3 text-2xl font-bold">Editar producto</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photos — show existing + new uploader */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Fotos</p>

              {/* Existing images */}
              {keptImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {keptImages.map((img, index) => (
                    <div key={img.id} className="group relative aspect-square">
                      <img
                        src={img.url}
                        alt={`Foto existente ${index + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        aria-label="Eliminar foto"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-xs text-white">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* New photos uploader */}
              <PhotoUploader
                photos={photos}
                onChange={setPhotos}
                maxPhotos={5 - keptImages.length}
                error={photoError ?? undefined}
              />
            </div>

            <ProductFormFields form={form} photoSlot={null} />

            {/* Status toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado</Label>
              <SegmentedControl
                options={STATUS_OPTIONS}
                value={status}
                onChange={setStatus}
                columns={3}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
