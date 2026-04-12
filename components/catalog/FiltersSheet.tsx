"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { FiltersSidebar } from "./FiltersSidebar"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function FiltersSheet() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 lg:hidden"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtrar productos</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FiltersSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
