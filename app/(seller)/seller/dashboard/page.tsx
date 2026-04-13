'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Eye, MessageCircle, CreditCard, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerLayout } from '@/components/seller-layout'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type ConversationRow = Database['public']['Tables']['conversations']['Row']

interface ConversationWithBuyer extends ConversationRow {
  buyer: { full_name: string | null; avatar_url: string | null }
}

function formatRelative(iso: string | null) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs}h`
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
}

function planLabel(plan: string) {
  if (plan === 'basic') return 'Básico'
  if (plan === 'pro') return 'Pro'
  return 'Gratis'
}

export default function SellerDashboardPage() {
  const supabase = createClient()

  const [storeName, setStoreName] = useState<string | null>(null)
  const [plan, setPlan] = useState<string>('Gratis')
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [conversations, setConversations] = useState<ConversationWithBuyer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Take the oldest store if there are duplicates
      const { data: storeRows } = await supabase
        .from('stores')
        .select('id, name, subscription_plan')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)

      const store = storeRows?.[0] ?? null
      if (!store) { setLoading(false); return }

      setStoreName(store.name)
      setPlan(planLabel(store.subscription_plan))

      // Fetch recent conversations with buyer info
      const { data: convData } = await supabase
        .from('conversations')
        .select(`*, buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url)`)
        .eq('store_id', store.id)
        .order('last_message_at', { ascending: false })
        .limit(3)

      if (convData) {
        setConversations(convData as ConversationWithBuyer[])
        const total = convData.reduce((acc, c) => acc + (c.seller_unread ?? 0), 0)
        setUnreadTotal(total)
      }

      setLoading(false)
    }
    init()
  }, [])

  return (
    <SellerLayout>
      <div className="space-y-6">

        {/* Welcome Header */}
        <div>
          {loading ? (
            <Skeleton className="h-9 w-72 mb-2" />
          ) : (
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Hola, {storeName ?? 'vendedor'}
            </h1>
          )}
          <p className="text-muted-foreground mt-1">Aquí tienes un resumen de tu tienda</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensajes sin leer</p>
                {loading ? (
                  <Skeleton className="h-7 w-8 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{unreadTotal}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan actual</p>
                {loading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{plan}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conversaciones recientes</CardTitle>
            <Link href="/seller/chats">
              <Button variant="ghost" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10">
                <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Aún no tienes mensajes de clientes</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => {
                  const buyerName = conv.buyer.full_name ?? 'Cliente'
                  return (
                    <Link key={conv.id} href="/seller/chats">
                      <div className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={conv.buyer.avatar_url ?? undefined} alt={buyerName} />
                          <AvatarFallback>{buyerName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{buyerName}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatRelative(conv.last_message_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.last_message ?? 'Sin mensajes aún'}
                          </p>
                        </div>
                        {conv.seller_unread > 0 && (
                          <Badge className="flex-shrink-0">{conv.seller_unread}</Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/seller/productos/nuevo">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Agregar producto</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Publica una nueva prenda en tu tienda
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/seller/tienda">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Ver mi tienda</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Así te ven tus compradores
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/seller/suscripcion">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Mejorar plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Desbloquea más funciones para tu tienda
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

      </div>
    </SellerLayout>
  )
}
