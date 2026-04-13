'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MapPin } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { StoreFormFields } from '@/components/seller/StoreFormFields'
import { MapProvider } from '@/components/map/MapProvider'
import { storeSchema, type StoreInput } from '@/lib/validations/store'
import { uploadImage } from '@/lib/utils/image'
import { createClient } from '@/lib/supabase/client'

// Lazy load map components (reduce bundle size)
const LocationPicker = dynamic(() =>
  import('@/components/map/LocationPicker').then(mod => ({ default: mod.LocationPicker })),
  { ssr: false, loading: () => <div className="h-96 bg-muted rounded-lg animate-pulse" /> }
)

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 40)
  const suffix = Math.random().toString(36).substring(2, 7)
  return `${base}-${suffix}`
}

export function OnboardingForm() {
  const router = useRouter()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [location, setLocation] = useState<{
    lat: number
    lng: number
    formattedAddress: string
  } | null>(null)

  const form = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      province: undefined,
      phone: '',
      whatsapp: '',
      instagram: '',
      facebook: '',
      categories: [],
    },
  })

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setCoverError(null)
  }

  async function onSubmit(values: StoreInput) {
    if (!coverFile) {
      setCoverError('La foto de portada es requerida')
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('No autenticado')

      // Upload cover image to store-assets bucket
      const storagePath = `${user.id}/cover.jpg`
      const { publicUrl } = await uploadImage(
        coverFile,
        'store-assets',
        storagePath,
        { maxWidthOrHeight: 1200, initialQuality: 0.8, maxSizeMB: 0.5 }
      )

      // Insert store
      const { error: insertError } = await supabase.from('stores').insert({
        owner_id: user.id,
        name: values.name,
        slug: generateSlug(values.name),
        description: values.description || null,
        banner_url: publicUrl,
        phone: values.phone,
        whatsapp: values.whatsapp || null,
        instagram: values.instagram || null,
        facebook: values.facebook || null,
        address: values.address,
        province: values.province,
        categories: values.categories,
        latitude: location?.lat || null,
        longitude: location?.lng || null,
        status: 'active',
        subscription_plan: 'free',
        subscription_status: 'active',
      })

      if (insertError) {
        console.error('Store insert error:', insertError.message)
        throw new Error('Error al crear la tienda')
      }

      toast.success('¡Tu tienda está lista!')
      router.refresh()
      router.push('/seller/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado'
      toast.error(message)
      console.error('Onboarding error:', err)
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
          <button
            type="button"
            onClick={() => { setCoverFile(null); setCoverPreview(null) }}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 p-8 hover:border-primary hover:bg-primary/10 transition-colors">
          <span className="text-sm font-medium text-foreground">
            Toca para subir una foto de portada
          </span>
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
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            ¡Bienvenido a PACAPP!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Creemos tu tienda en 1 minuto
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <StoreFormFields form={form} coverImageSlot={coverImageSlot} />

            {/* Location section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Ubicación en el mapa (opcional pero recomendado)
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Al ubicar tu tienda en el mapa, los compradores pueden encontrarte más fácil y ordenar
                resultados por cercanía. Puedes agregarlo ahora o más tarde desde tu dashboard.
              </p>

              {/* Map provider wrapper */}
              <MapProvider>
                <LocationPicker
                  onChange={(data) => {
                    setLocation(data)
                  }}
                />
              </MapProvider>

              {location && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  ✓ Ubicación guardada: {location.formattedAddress}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? 'Creando tu tienda…' : 'Crear mi tienda'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
