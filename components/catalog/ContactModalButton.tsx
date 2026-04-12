"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ContactModal } from "./ContactModal"
import { MessageCircle } from "lucide-react"

interface ContactModalButtonProps {
  store: {
    id: string
    name: string
    whatsapp?: string | null
    phone?: string | null
  }
  className?: string
}

export function ContactModalButton({ store, className }: ContactModalButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={`bg-emerald-600 hover:bg-emerald-700 gap-2 ${className || ""}`}
        size="lg"
      >
        <MessageCircle className="w-4 h-4" />
        Contactar vendedor
      </Button>
      <ContactModal open={open} onOpenChange={setOpen} store={store} />
    </>
  )
}
