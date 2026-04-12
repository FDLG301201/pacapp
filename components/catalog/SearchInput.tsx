"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") || "")
  const [debouncedValue, setDebouncedValue] = useState(value)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedValue.trim()) {
      params.set("q", debouncedValue.trim())
    } else {
      params.delete("q")
    }
    params.set("page", "1")
    router.push(`/productos?${params.toString()}`)
  }, [debouncedValue, searchParams, router])

  const handleClear = () => {
    setValue("")
  }

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Buscar en catálogo..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
