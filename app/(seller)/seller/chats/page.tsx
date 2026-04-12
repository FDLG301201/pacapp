"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Image as ImageIcon, MoreVertical, Phone, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const mockChats = [
  {
    id: "1",
    buyerName: "Maria Garcia",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "Hola, todavia tienes disponible el vestido azul?",
    timestamp: "Hace 5 min",
    unread: 2,
    product: {
      name: "Vestido Midi Floral",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop",
      price: 850
    }
  },
  {
    id: "2",
    buyerName: "Carlos Rodriguez",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "Perfecto, paso manana a recogerlo",
    timestamp: "Hace 1 hora",
    unread: 0,
    product: {
      name: "Chaqueta Denim Vintage",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop",
      price: 1200
    }
  },
  {
    id: "3",
    buyerName: "Ana Martinez",
    buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Gracias por la informacion!",
    timestamp: "Hace 3 horas",
    unread: 0,
    product: null
  }
]

const mockMessages = [
  {
    id: "1",
    senderId: "buyer",
    content: "Hola! Vi el vestido azul en tu tienda y me encanto",
    timestamp: "10:30 AM"
  },
  {
    id: "2",
    senderId: "seller",
    content: "Hola Maria! Si, todavia esta disponible. Es talla M.",
    timestamp: "10:32 AM"
  },
  {
    id: "3",
    senderId: "buyer",
    content: "Perfecto! Soy talla M. Cuanto cuesta el envio a Santo Domingo?",
    timestamp: "10:33 AM"
  },
  {
    id: "4",
    senderId: "seller",
    content: "El envio a Santo Domingo es RD$150. Tambien puedes pasar a recogerlo a la tienda sin costo adicional.",
    timestamp: "10:35 AM"
  },
  {
    id: "5",
    senderId: "buyer",
    content: "Hola, todavia tienes disponible el vestido azul?",
    timestamp: "10:40 AM"
  }
]

export default function SellerChatsPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = mockChats.filter(chat =>
    chat.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-lg border bg-card">
        {/* Chat List */}
        <div className="w-full border-r md:w-80 lg:w-96">
          <div className="border-b p-4">
            <h2 className="mb-4 text-lg font-semibold">Mensajes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-88px)]">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-muted/50",
                  selectedChat.id === chat.id && "bg-muted"
                )}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.buyerAvatar} alt={chat.buyerName} />
                  <AvatarFallback>{chat.buyerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{chat.buyerName}</p>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                  {chat.product && (
                    <p className="mt-1 truncate text-xs text-primary">
                      Re: {chat.product.name}
                    </p>
                  )}
                </div>
                {chat.unread > 0 && (
                  <Badge className="bg-primary">{chat.unread}</Badge>
                )}
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="hidden flex-1 flex-col md:flex">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedChat.buyerAvatar} alt={selectedChat.buyerName} />
                    <AvatarFallback>{selectedChat.buyerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedChat.buyerName}</p>
                    <p className="text-sm text-muted-foreground">En linea</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Context */}
              {selectedChat.product && (
                <div className="border-b bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <img
                        src={selectedChat.product.image}
                        alt={selectedChat.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedChat.product.name}</p>
                      <p className="text-sm text-primary">RD${selectedChat.product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.senderId === "seller" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-4 py-2",
                          msg.senderId === "seller"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn(
                          "mt-1 text-xs",
                          msg.senderId === "seller" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (message.trim()) {
                      setMessage("")
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Button type="button" variant="ghost" size="icon">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground">Selecciona una conversacion</p>
            </div>
          )}
        </div>
      </div>
  )
}
