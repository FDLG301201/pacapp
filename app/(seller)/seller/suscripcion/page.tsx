'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Star, Upload, Clock, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SellerLayout } from '@/components/seller-layout'
import { createClient } from '@/lib/supabase/client'
import type { SubscriptionPlan } from '@/types/database.types'

// ─── Plan definitions ─────────────────────────────────────────

const PLANS = [
  {
    id: 'free' as SubscriptionPlan,
    name: 'Gratis',
    price: 0,
    features: [
      'Hasta 10 productos',
      'Perfil de tienda básico',
      'Chat con compradores',
    ],
    highlighted: false,
  },
  {
    id: 'basic' as SubscriptionPlan,
    name: 'Básico',
    price: 500,
    features: [
      'Hasta 100 productos',
      'Badge verificado',
      'Estadísticas básicas',
      'Chat con compradores',
      'Soporte prioritario',
    ],
    highlighted: true,
  },
  {
    id: 'pro' as SubscriptionPlan,
    name: 'Pro',
    price: 1500,
    features: [
      'Productos ilimitados',
      'Badge verificado',
      'Estadísticas avanzadas',
      'Módulo de mayoreo',
      'Productos destacados',
      'Soporte prioritario',
    ],
    highlighted: false,
  },
]

function formatPrice(n: number) {
  return `RD$${n.toLocaleString('es-DO')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface StoreInfo {
  id: string
  name: string
  subscription_plan: SubscriptionPlan
  subscription_status: string
  subscription_ends_at: string | null
  is_verified: boolean
}

interface SubRequest {
  id: string
  plan: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
  created_at: string
  reviewed_at: string | null
}

// ─── Component ────────────────────────────────────────────────

export default function SuscripcionPage() {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [store, setStore] = useState<StoreInfo | null>(null)
  const [requests, setRequests] = useState<SubRequest[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: storeRows } = await supabase
      .from('stores')
      .select('id, name, subscription_plan, subscription_status, subscription_ends_at, is_verified')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)

    const s = storeRows?.[0] ?? null
    setStore(s as StoreInfo | null)

    if (s) {
      const { data: reqs } = await supabase
        .from('subscription_requests')
        .select('id, plan, status, notes, created_at, reviewed_at')
        .eq('store_id', s.id)
        .order('created_at', { ascending: false })

      setRequests((reqs ?? []) as SubRequest[])
    }

    setLoading(false)
  }

  const hasPendingRequest = requests.some((r) => r.status === 'pending')

  const handleUpload = async () => {
    if (!file || !selectedPlan || !store) return
    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      // Upload to storage
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${store.id}/${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(path)

      // Insert request
      const { error: insertErr } = await supabase
        .from('subscription_requests')
        .insert({ store_id: store.id, plan: selectedPlan, proof_url: publicUrl })

      if (insertErr) throw insertErr

      setUploadSuccess(true)
      setFile(null)
      setSelectedPlan(null)
      if (fileRef.current) fileRef.current.value = ''
      await loadData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Upload error:', msg)
      setUploadError('No se pudo enviar el comprobante. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  // ─── Status badge ──────────────────────────────────────────

  function statusBadge(status: string) {
    if (status === 'pending') return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />En revisión</Badge>
    if (status === 'approved') return <Badge className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" />Aprobado</Badge>
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rechazado</Badge>
  }

  function planLabel(plan: string) {
    if (plan === 'basic') return 'Básico'
    if (plan === 'pro') return 'Pro'
    return 'Gratis'
  }

  // ─── Loading ───────────────────────────────────────────────

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    )
  }

  const currentPlan = store?.subscription_plan ?? 'free'
  const isExpired = store?.subscription_status === 'expired'
  const endsAt = store?.subscription_ends_at

  // ─── Render ────────────────────────────────────────────────

  return (
    <SellerLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Suscripción</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu plan para vender en PACAPP</p>
        </div>

        {/* Current plan status */}
        {store && (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan actual</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">Plan {planLabel(currentPlan)}</p>
                    {isExpired ? (
                      <Badge variant="destructive">Expirado</Badge>
                    ) : currentPlan !== 'free' ? (
                      <Badge className="bg-green-600">Activo</Badge>
                    ) : null}
                  </div>
                  {endsAt && !isExpired && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Válido hasta el {formatDate(endsAt)}
                    </p>
                  )}
                  {isExpired && endsAt && (
                    <p className="text-sm text-destructive mt-1">
                      Venció el {formatDate(endsAt)} — tu tienda ahora es Plan Gratis
                    </p>
                  )}
                </div>
                {store.is_verified && (
                  <Badge className="gap-1 self-start sm:self-auto">
                    <Check className="h-3 w-3" />
                    Tienda verificada
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan && !isExpired
            const isUpgrade = plan.price > (PLANS.find(p => p.id === currentPlan)?.price ?? 0)

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.highlighted ? 'border-primary shadow-lg' : ''} ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Star className="h-3 w-3 mr-1" />
                    Más popular
                  </Badge>
                )}
                {isCurrent && (
                  <Badge variant="secondary" className="absolute -top-3 right-4">
                    Plan actual
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price === 0 ? (
                      <span className="text-3xl font-bold text-foreground">Gratis</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-foreground">{formatPrice(plan.price)}</span>
                        <span className="text-muted-foreground">/mes</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan actual
                    </Button>
                  ) : plan.id === 'free' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan base
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={isUpgrade ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedPlan(plan.id)
                        setUploadSuccess(false)
                        setUploadError(null)
                        setTimeout(() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
                      }}
                    >
                      {isUpgrade ? `Actualizar a ${plan.name}` : `Cambiar a ${plan.name}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Upload section */}
        <div id="upload-section">
          {hasPendingRequest ? (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Tu comprobante está en revisión. El equipo de PACAPP lo verificará en 24–48 horas.
              </AlertDescription>
            </Alert>
          ) : selectedPlan && selectedPlan !== 'free' ? (
            <Card>
              <CardHeader>
                <CardTitle>Subir comprobante de pago</CardTitle>
                <CardDescription>
                  Plan seleccionado: <strong>Plan {planLabel(selectedPlan)} — {formatPrice(PLANS.find(p => p.id === selectedPlan)!.price)}/mes</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bank info */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Instrucciones de pago:</strong><br />
                    Realiza una transferencia o depósito a:<br />
                    Banco Popular · Cuenta de Ahorros · 123-456789-0<br />
                    A nombre de: PACAPP SRL · RNC: 1-23-45678-9<br />
                    <span className="text-muted-foreground">Concepto: Tu nombre de tienda + mes/año</span>
                  </AlertDescription>
                </Alert>

                {/* File input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comprobante (imagen o PDF)</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full text-sm border rounded-lg p-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>

                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="gap-2"
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</>
                  ) : (
                    <><Upload className="h-4 w-4" />Enviar comprobante</>
                  )}
                </Button>
                <Button variant="outline" onClick={() => { setSelectedPlan(null); setFile(null) }}>
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          ) : null}

          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Comprobante enviado! El equipo de PACAPP lo revisará en 24–48 horas y recibirás un correo con la confirmación.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Request history */}
        {requests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de solicitudes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Plan solicitado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="text-sm">{formatDate(req.created_at)}</TableCell>
                      <TableCell className="font-medium">Plan {planLabel(req.plan)}</TableCell>
                      <TableCell>{statusBadge(req.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">
                        {req.notes ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

      </div>
    </SellerLayout>
  )
}
