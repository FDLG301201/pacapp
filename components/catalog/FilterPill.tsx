"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

interface FilterPillProps {
  filter: {
    label: string
    param: string
    value: string
  }
}

export function FilterPill({ filter }: FilterPillProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleRemove = () => {
    const params = new URLSearchParams(searchParams)

    if (filter.param === "q" || filter.param === "category" || filter.param === "province") {
      // Simple string parameters
      params.delete(filter.param)
    } else {
      // Multi-select parameters (gender, size, condition)
      const currentValues = params.get(filter.param)?.split(",") || []
      const newValues = currentValues.filter((v) => v !== filter.value)
      if (newValues.length > 0) {
        params.set(filter.param, newValues.join(","))
      } else {
        params.delete(filter.param)
      }
    }

    params.set("page", "1")
    router.push(`/productos?${params.toString()}`)
  }

  return (
    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm">
      <span>{filter.label}</span>
      <button
        className="ml-1 hover:text-emerald-600 transition-colors"
        onClick={handleRemove}
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
