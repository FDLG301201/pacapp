"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { getCategoryIcon } from "@/lib/utils/icons"
import type { ProductCategory } from "@/types/database.types"

interface CategoryChipProps {
  category: ProductCategory
  label: string
  active?: boolean
}

export function CategoryChip({
  category,
  label,
  active = false,
}: CategoryChipProps) {
  const Icon = getCategoryIcon(category)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = () => {
    const params = new URLSearchParams(searchParams)
    if (active) {
      params.delete("category")
    } else {
      params.set("category", category)
      params.set("page", "1")
    }
    router.push(`/productos?${params.toString()}`)
  }

  return (
    <Button
      onClick={handleClick}
      variant={active ? "default" : "outline"}
      className={`gap-2 rounded-full whitespace-nowrap ${
        active
          ? "bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          : "border border-gray-200 hover:border-emerald-600"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  )
}
