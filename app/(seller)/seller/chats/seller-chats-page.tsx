'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, ArrowLeft, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerLayout } from '@/components/seller-layout'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

// ─── Types ───────────────────────────────────────────────────

type ConversationRow = Database['public']['Tables']['conversations']['Row']
type MessageRow = Database['public']['Tables']['messages']['Row']

interface ConversationWithBuyer extends ConversationRow {
  buyer: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface MessageWithSender extends MessageRow {
  sender: {
    full_name: string | null
    avatar_url: string | null
  }
}

// ─── Helpers ─────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
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

// ─── Component ───────────────────────────────────────────────

export default function SellerChatsPage() {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationWithBuyer[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [showConversation, setShowConversation] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null

  // ── Load user + store ──
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (store) setStoreId(store.id)
    }
    init()
  }, [])

  // ── Load conversations for the store ──
  useEffect(() => {
    if (!storeId) return

    const load = async () => {
      setLoadingConvs(true)
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          buyer:profiles!buyer_id(full_name, avatar_url)
        `)
        .eq('store_id', storeId)
        .order('last_message_at', { ascending: false })

      if (!error && data) {
        setConversations(data as ConversationWithBuyer[])
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id)
        }
      }
      setLoadingConvs(false)
    }

    load()

    // Realtime: watch conversation updates for this store
    const channel = supabase
      .channel('seller-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `store_id=eq.${storeId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // New conversation started by a buyer — reload to get buyer info
            load()
          } else if (payload.eventType === 'UPDATE') {
            setConversations((prev) =>
              prev
                .map((c) =>
                  c.id === payload.new.id ? { ...c, ...(payload.new as ConversationRow) } : c
                )
                .sort(
                  (a, b) =>
                    new Date(b.last_message_at ?? 0).getTime() -
                    new Date(a.last_message_at ?? 0).getTime()
                )
            )
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [storeId])

  // ── Load messages ──
  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true)
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(full_name, avatar_url)
      `)
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data as MessageWithSender[])
    }
    setLoadingMsgs(false)

    // Mark seller unreads as read
    if (storeId) {
      await supabase
        .from('conversations')
        .update({ seller_unread: 0 })
        .eq('id', convId)
        .eq('store_id', storeId)
    }
  }, [storeId])

  useEffect(() => {
    if (!selectedId) return
    loadMessages(selectedId)

    const channel = supabase
      .channel(`seller-messages-${selectedId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedId}`,
        },
        async (payload) => {
          const { data: sender } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single()

          const newMsg: MessageWithSender = {
            ...(payload.new as MessageRow),
            sender: sender ?? { full_name: null, avatar_url: null },
          }
          setMessages((prev) => [...prev, newMsg])

          if (payload.new.sender_id !== userId && storeId) {
            await supabase
              .from('conversations')
              .update({ seller_unread: 0 })
              .eq('id', selectedId)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedId, userId])

  // ── Scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send message ──
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedId || !userId || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    const optimistic: MessageWithSender = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedId,
      sender_id: userId,
      content,
      created_at: new Date().toISOString(),
      sender: { full_name: null, avatar_url: null },
    }
    setMessages((prev) => [...prev, optimistic])

    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedId,
      sender_id: userId,
      content,
    })

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setNewMessage(content)
      console.error('Error sending message:', error.message)
    }

    setSending(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
    setShowConversation(true)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, seller_unread: 0 } : c))
    )
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <SellerLayout>
      <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

        {/* ── Conversation list ── */}
        <aside
          className={`w-full md:w-[350px] lg:w-[400px] border-r bg-card flex flex-col ${
            showConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Mensajes</h1>
          </div>

          <ScrollArea className="flex-1">
            {loadingConvs ? (
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <p>Aún no tienes mensajes de clientes.</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => {
                  const buyerName = conv.buyer.full_name ?? 'Cliente'
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedId === conv.id ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={conv.buyer.avatar_url ?? undefined}
                            alt={buyerName}
                          />
                          <AvatarFallback>{buyerName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{buyerName}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatRelative(conv.last_message_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {conv.last_message ?? 'Sin mensajes aún'}
                          </p>
                        </div>
                        {conv.seller_unread > 0 && (
                          <Badge className="self-start flex-shrink-0">{conv.seller_unread}</Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </aside>

        {/* ── Chat view ── */}
        <div
          className={`flex-1 flex flex-col bg-muted/30 overflow-hidden ${
            showConversation ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="bg-card border-b p-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setShowConversation(false)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConv.buyer.avatar_url ?? undefined}
                      alt={selectedConv.buyer.full_name ?? 'Cliente'}
                    />
                    <AvatarFallback>
                      {(selectedConv.buyer.full_name ?? 'C').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {selectedConv.buyer.full_name ?? 'Cliente'}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {loadingMsgs ? (
                  <div className="space-y-3 max-w-2xl mx-auto">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                      >
                        <Skeleton className="h-10 w-48 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    <p>Aún no hay mensajes en esta conversación.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {messages.map((msg) => {
                      const isOwn = msg.sender_id === userId
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-card rounded-bl-md shadow-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}
                            >
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="bg-card border-t p-4 flex-shrink-0">
                <div className="max-w-2xl mx-auto flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    disabled={sending}
                    maxLength={2000}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Selecciona una conversación para responder
              </p>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  )
}
