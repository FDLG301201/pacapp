'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle2, XCircle, Clock, ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AdminLayout } from '@/components/admin-layout'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────

interface SubRequest {
  id: string
  store_id: string
  plan: string
  proof_url: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
  reviewed_at: string | null
  created_at: string
  store: {
    name: string
    slug: string
    owner: {
      full_name: string | null
      email: string | null
    } | null
  } | null
}

// ─── Helpers ──────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
}

const PLAN_LABELS: Record<string, string> = { basic: 'Básico', pro: 'Pro', free: 'Gratis' }
const PLAN_PRICES: Record<string, string> = { basic: 'RD$500/mes', pro: 'RD$1,500/mes' }

// ─── Component ────────────────────────────────────────────────

export default function PagosPage() {
  const supabase = createClient()

  const [requests, setRequests] = useState<SubRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [adminId, setAdminId] = useState<string | null>(null)

  // Per-row action state
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionResult, setActionResult] = useState<Record<string, 'success' | 'error'>>({})

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) setAdminId(user.id)

    const { data, error } = await supabase
      .from('subscription_requests')
      .select(`
        *,
        store:stores!subscription_requests_store_id_fkey(
          name,
          slug,
          owner:profiles!stores_owner_id_fkey(full_name, email)
        )
      `)
      .order('status', { ascending: true })   // pending first
      .order('created_at', { ascending: false })

    if (error) console.error('load requests error:', error.message)
    else setRequests((data ?? []) as unknown as SubRequest[])

    setLoading(false)
  }

  const handleAction = async (req: SubRequest, action: 'approve' | 'reject') => {
    if (!adminId) return
    setActionLoading(req.id)
    setActionResult((prev) => { const n = { ...prev }; delete n[req.id]; return n })

    try {
      const now = new Date().toISOString()

      // 1. Update request
      const { error: reqErr } = await supabase
        .from('subscription_requests')
        .update({
          status: action,
          notes: notes[req.id]?.trim() || null,
          reviewed_by: adminId,
          reviewed_at: now,
        })
        .eq('id', req.id)

      if (reqErr) throw reqErr

      // 2. If approved → update store subscription
      let endsAt: string | null = null
      if (action === 'approve') {
        const d = new Date()
        d.setDate(d.getDate() + 30)
        endsAt = d.toISOString()

        const { error: storeErr } = await supabase
          .from('stores')
          .update({
            subscription_plan: req.plan as 'free' | 'basic' | 'pro',
            subscription_status: 'active',
            subscription_ends_at: endsAt,
            is_verified: true,
          })
          .eq('id', req.store_id)

        if (storeErr) throw storeErr
      }

      // 3. Send email
      const sellerEmail = req.store?.owner?.email
      if (sellerEmail) {
        await fetch('/api/admin/send-subscription-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            sellerEmail,
            storeName: req.store?.name ?? 'Tu tienda',
            plan: req.plan,
            notes: notes[req.id]?.trim() || null,
            endsAt,
          }),
        })
      }

      setActionResult((prev) => ({ ...prev, [req.id]: 'success' }))
      await loadAll()
    } catch (err: unknown) {
      console.error('action error:', err instanceof Error ? err.message : err)
      setActionResult((prev) => ({ ...prev, [req.id]: 'error' }))
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Status badge ──────────────────────────────────────────

  function statusBadge(status: string) {
    if (status === 'pending') return <Badge variant="outline" className="gap-1 text-yellow-700 border-yellow-300"><Clock className="h-3 w-3" />Pendiente</Badge>
    if (status === 'approved') return <Badge className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" />Aprobado</Badge>
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rechazado</Badge>
  }

  const pending = requests.filter(r => r.status === 'pending')
  const reviewed = requests.filter(r => r.status !== 'pending')

  // ─── Render ────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Comprobantes de pago</h1>
            <p className="text-muted-foreground mt-1">Revisa y aprueba las solicitudes de suscripción</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadAll} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">Aprobados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-destructive">{requests.filter(r => r.status === 'rejected').length}</p>
              <p className="text-sm text-muted-foreground">Rechazados</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending requests */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pending.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">No hay comprobantes pendientes de revisión.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Pendientes ({pending.length})</h2>
            {pending.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                note={notes[req.id] ?? ''}
                onNoteChange={(v) => setNotes((prev) => ({ ...prev, [req.id]: v }))}
                onAction={(action) => handleAction(req, action)}
                isLoading={actionLoading === req.id}
                result={actionResult[req.id]}
                statusBadge={statusBadge}
              />
            ))}
          </div>
        )}

        {/* Reviewed requests */}
        {reviewed.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-muted-foreground">Historial</h2>
            {reviewed.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                note={notes[req.id] ?? ''}
                onNoteChange={() => {}}
                onAction={() => {}}
                isLoading={false}
                result={undefined}
                statusBadge={statusBadge}
                readOnly
              />
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

// ─── Request card sub-component ────────────────────────────────

function RequestCard({
  req,
  note,
  onNoteChange,
  onAction,
  isLoading,
  result,
  statusBadge,
  readOnly = false,
}: {
  req: SubRequest
  note: string
  onNoteChange: (v: string) => void
  onAction: (action: 'approve' | 'reject') => void
  isLoading: boolean
  result: 'success' | 'error' | undefined
  statusBadge: (s: string) => React.ReactNode
  readOnly?: boolean
}) {
  const storeName = req.store?.name ?? 'Tienda desconocida'
  const sellerName = req.store?.owner?.full_name ?? '—'
  const sellerEmail = req.store?.owner?.email ?? '—'
  const planLabel = PLAN_LABELS[req.plan] ?? req.plan
  const planPrice = PLAN_PRICES[req.plan] ?? ''
  const isImage = /\.(jpe?g|png|webp|gif)$/i.test(req.proof_url)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">{storeName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {sellerName} · {sellerEmail}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {statusBadge(req.status)}
            <Badge variant="secondary">Plan {planLabel} {planPrice && `— ${planPrice}`}</Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Enviado el {formatDate(req.created_at)}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proof preview */}
        <div>
          <p className="text-sm font-medium mb-2">Comprobante:</p>
          {isImage ? (
            <div className="relative h-48 w-full max-w-sm rounded-lg overflow-hidden border bg-muted">
              <Image src={req.proof_url} alt="Comprobante" fill className="object-contain" unoptimized />
            </div>
          ) : null}
          <a
            href={req.proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
          >
            <ExternalLink className="h-3 w-3" />
            Abrir comprobante
          </a>
        </div>

        {/* Notes */}
        {req.notes && (
          <div className="text-sm">
            <span className="font-medium">Notas: </span>
            <span className="text-muted-foreground">{req.notes}</span>
          </div>
        )}

        {/* Action area */}
        {!readOnly && (
          <div className="space-y-3 pt-2 border-t">
            <Textarea
              placeholder="Notas para el vendedor (opcional)..."
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={2}
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => onAction('approve')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Aprobar
              </Button>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => onAction('reject')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Rechazar
              </Button>
            </div>
            {result === 'success' && <p className="text-sm text-green-600">Acción realizada correctamente.</p>}
            {result === 'error' && <p className="text-sm text-destructive">Ocurrió un error. Intenta de nuevo.</p>}
          </div>
        )}

        {readOnly && req.reviewed_at && (
          <p className="text-xs text-muted-foreground">Revisado el {formatDate(req.reviewed_at)}</p>
        )}
      </CardContent>
    </Card>
  )
}
