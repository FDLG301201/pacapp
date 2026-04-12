'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Send, ArrowLeft, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { conversations, formatPrice } from '@/lib/mock-data'

export default function BuyerChatsPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [showConversation, setShowConversation] = useState(false)

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main className="flex-1 flex">
        {/* Conversation List - Hidden on mobile when viewing a conversation */}
        <aside className={`w-full md:w-[350px] lg:w-[400px] border-r bg-card flex flex-col ${
          showConversation ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Mensajes</h1>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation)
                    setShowConversation(true)
                  }}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                    selectedConversation.id === conversation.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.storeAvatar} alt={conversation.storeName} />
                      <AvatarFallback>{conversation.storeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">{conversation.storeName}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="relative h-6 w-6 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={conversation.productImage}
                            alt={conversation.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {conversation.productName}
                        </span>
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="self-start">{conversation.unreadCount}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Conversation View */}
        <div className={`flex-1 flex flex-col bg-muted/30 ${
          showConversation ? 'flex' : 'hidden md:flex'
        }`}>
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="bg-card border-b p-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setShowConversation(false)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Link href={`/tiendas/${selectedConversation.storeId}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.storeAvatar} alt={selectedConversation.storeName} />
                      <AvatarFallback>{selectedConversation.storeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/tiendas/${selectedConversation.storeId}`} className="font-medium hover:underline">
                      {selectedConversation.storeName}
                    </Link>
                    <p className="text-sm text-muted-foreground">En línea</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Product Card */}
                <Link href={`/productos/${selectedConversation.productId}`}>
                  <Card className="mt-3">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={selectedConversation.productImage}
                          alt={selectedConversation.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedConversation.productName}</p>
                        <p className="text-sm text-primary font-semibold">
                          {formatPrice(selectedConversation.productPrice)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'buyer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.senderType === 'buyer'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-card rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderType === 'buyer' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="bg-card border-t p-4">
                <div className="max-w-2xl mx-auto flex gap-2">
                  <Input 
                    placeholder="Escribe un mensaje..." 
                    className="flex-1"
                  />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </main>
  )
}
