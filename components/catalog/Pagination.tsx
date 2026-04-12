"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number
  page: number
  perPage: number
}

export function Pagination({ total, page, perPage }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / perPage)

  if (totalPages <= 1) return null

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`/productos?${params.toString()}`)
  }

  // Generate page numbers to display (max 7 pages visible)
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7
    const halfVisible = 3

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (page > halfVisible + 1) pages.push("...")

      for (
        let i = Math.max(2, page - halfVisible);
        i <= Math.min(totalPages - 1, page + halfVisible);
        i++
      ) {
        pages.push(i)
      }

      if (page < totalPages - halfVisible - 1) pages.push("...")
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex gap-1">
        {pageNumbers.map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                ...
              </span>
            )
          }

          const num = pageNum as number
          return (
            <Button
              key={num}
              variant={num === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(num)}
              className="w-10"
            >
              {num}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="gap-1"
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
