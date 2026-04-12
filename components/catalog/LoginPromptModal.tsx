"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LoginPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginPromptModal({ open, onOpenChange }: LoginPromptModalProps) {
  const pathname = usePathname()
  const returnTo = encodeURIComponent(pathname)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Regístrate para guardar tus favoritos</DialogTitle>
          <DialogDescription>
            Crea una cuenta gratis y guarda las prendas que te gustan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button asChild variant="default" size="lg">
            <Link href={`/login?redirectTo=${returnTo}`}>
              Iniciar sesión
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/registro?redirectTo=${returnTo}`}>
              Registrarme
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
