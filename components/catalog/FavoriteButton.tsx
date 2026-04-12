"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { LoginPromptModal } from "./LoginPromptModal"

interface FavoriteButtonProps {
  productId?: string
  storeId?: string
  initialFavorited?: boolean
  userId: string | null
}

export function FavoriteButton({
  productId,
  storeId,
  initialFavorited = false,
  userId,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const supabase = createClient()

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If not logged in, show login prompt
    if (!userId) {
      setShowLoginPrompt(true)
      return
    }

    setIsLoading(true)

    try {
      if (isFavorited) {
        // Delete favorite
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq(productId ? "product_id" : "store_id", (productId || storeId) as string)

        if (error) throw error
        setIsFavorited(false)
        toast.success("Eliminado de favoritos")
      } else {
        // Add favorite
        const { error } = await supabase.from("favorites").insert({
          user_id: userId,
          product_id: productId || null,
          store_id: storeId || null,
        })

        if (error) throw error
        setIsFavorited(true)
        toast.success("Agregado a favoritos")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Error al guardar favorito")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className="rounded-full bg-white/80 hover:bg-white transition-all"
        aria-label={isFavorited ? "Eliminar de favoritos" : "Agregar a favoritos"}
      >
        <Heart
          className={`w-6 h-6 transition-colors ${
            isFavorited
              ? "fill-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
        />
      </Button>
      <LoginPromptModal open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
    </>
  )
}
