"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"

interface SortDropdownProps {
  currentSort?: string
}

export function SortDropdown({ currentSort = "recent" }: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "recent") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    params.set("page", "1")
    router.push(`/productos?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full sm:w-48 gap-2">
        <ArrowUpDown className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Más reciente</SelectItem>
        <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
        <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
        <SelectItem value="popular">Más vistos</SelectItem>
      </SelectContent>
    </Select>
  )
}
