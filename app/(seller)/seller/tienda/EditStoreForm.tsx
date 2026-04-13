'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Copy, Check, ExternalLink, MapPin } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { StoreFormFields } from '@/components/seller/StoreFormFields'
import { MapProvider } from '@/components/map/MapProvider'
import { storeSchema, type StoreInput } from '@/lib/validations/store'
import { uploadImage, deleteStorageFile } from '@/lib/utils/image'
import { createClient } from '@/lib/supabase/client'

// Lazy load map component
const LocationPicker = dynamic(() =>
  import('@/components/map/LocationPicker').then(mod => ({ default: mod.LocationPicker })),
  { ssr: false, loading: () => <div className="h-96 bg-muted rounded-lg animate-pulse" /> }
)

interface EditStoreFormProps {
  storeId: string
  sellerId: string
  initialValues: StoreInput
  existingBannerUrl: string | null
  initialLatitude?: number
  initialLongitude?: number
}

export function EditStoreForm({
  storeId,
  sellerId,
  initialValues,
  existingBannerUrl,
  initialLatitude,
  initialLongitude,
}: EditStoreFormProps) {
  const router = useRouter()
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(existingBannerUrl)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [location, setLocation] = useState<{
    lat: number
    lng: number
    formattedAddress: string
  } | null>(
    initialLatitude && initialLongitude
      ? { lat: initialLatitude, lng: initialLongitude, formattedAddress: '' }
      : null
  )

  const form = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: initialValues,
  })

  const publicUrl = `pacapp.com/tiendas/${storeId}`

  async function copyUrl() {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setCoverError(null)
  }

  async function onSubmit(values: StoreInput) {
    setSubmitting(true)
    const supabase = createClient()

    try {
      let bannerUrl: string | null = existingBannerUrl

      // Upload new cover if changed
      if (newCoverFile) {
        const storagePath = `${sellerId}/cover.jpg`
        const { publicUrl: newUrl } = await uploadImage(
          newCoverFile,
          'store-assets',
          storagePath,
          { maxWidthOrHeight: 1200, initialQuality: 0.8, maxSizeMB: 0.5 }
        )
        bannerUrl = newUrl

        // Delete old file from Storage (upsert handles this but cleanup is explicit)
        if (existingBannerUrl) {
          await deleteStorageFile('store-assets', `${sellerId}/cover.jpg`)
        }
      }

      const { error } = await supabase
        .from('stores')
        .update({
          name:        values.name,
          description: values.description || null,
          address:     values.address,
          province:    values.province,
          phone:       values.phone,
          whatsapp:    values.whatsapp || null,
          instagram:   values.instagram || null,
          facebook:    values.facebook || null,
          categories:  values.categories,
          banner_url:  bannerUrl,
          latitude:    location?.lat || null,
          longitude:   location?.lng || null,
        })
        .eq('id', storeId)

      if (error) {
        console.error('Store update error:', error.message)
        throw new Error('Error al actualizar la tienda')
      }

      toast.success('Tienda actualizada')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
      console.error('Edit store error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const coverImageSlot = (
    <div className="space-y-2">
      {coverPreview ? (
        <div className="relative">
          <img
            src={coverPreview}
            alt="Portada de la tienda"
            className="h-40 w-full rounded-xl object-cover"
          />
          <label className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80">
            Cambiar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 p-8 hover:border-primary transition-colors">
          <span className="text-sm font-medium">Toca para subir una foto de portada</span>
          <span className="text-xs text-muted-foreground">JPG, PNG, WEBP · Recomendado: 1200×400 px</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </label>
      )}
      {coverError && <p className="text-sm text-destructive">{coverError}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/seller/dashboard"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al dashboard
          </Link>
          <h1 className="mt-3 text-2xl font-bold">Mi tienda</h1>
        </div>

        {/* Public URL preview */}
        <div className="mb-6 flex items-center gap-2 rounded-xl border bg-muted/50 px-4 py-3">
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-sm text-muted-foreground">{publicUrl}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={copyUrl}
            aria-label="Copiar URL"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <StoreFormFields form={form} coverImageSlot={coverImageSlot} />

            {/* Location section */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Ubicación</h3>
              </div>

              {/* Map provider wrapper */}
              <MapProvider>
                <LocationPicker
                  initialLat={initialLatitude}
                  initialLng={initialLongitude}
                  onChange={(data) => {
                    setLocation(data)
                  }}
                />
              </MapProvider>

              {location && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  ✓ Ubicación actualizada: {location.formattedAddress}
                </div>
              )}
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
