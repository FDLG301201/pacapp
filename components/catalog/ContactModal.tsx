"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, Phone, MapPin } from "lucide-react"

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: {
    id: string
    name: string
    whatsapp?: string | null
    phone?: string | null
    address?: string | null
  }
}

export function ContactModal({ open, onOpenChange, store }: ContactModalProps) {
  // Ensure props are properly typed
  const storeData = {
    id: store.id,
    name: store.name,
    whatsapp: store.whatsapp || null,
    phone: store.phone || null,
  }
  const whatsappUrl = storeData.whatsapp
    ? `https://wa.me/${storeData.whatsapp.replace(/\D/g, "")}`
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contactar a {storeData.name}</DialogTitle>
          <DialogDescription>
            El chat estará disponible pronto. Por ahora puedes contactar directamente al vendedor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {whatsappUrl && (
            <Button asChild variant="default" size="lg" className="w-full gap-2">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Link>
            </Button>
          )}

          {storeData.phone && (
            <Button asChild variant="outline" size="lg" className="w-full gap-2">
              <Link href={`tel:${storeData.phone}`}>
                <Phone className="w-4 h-4" />
                {storeData.phone}
              </Link>
            </Button>
          )}

          {!whatsappUrl && !storeData.phone && (
            <Button asChild variant="outline" size="lg" className="w-full gap-2">
              <Link href={`/tiendas/${storeData.id}`}>
                <MapPin className="w-4 h-4" />
                Ver tienda
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
