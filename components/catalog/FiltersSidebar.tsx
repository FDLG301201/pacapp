"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GENDERS,
  PRODUCT_GENDER_LABELS,
  PRODUCT_CONDITIONS,
  PRODUCT_CONDITION_LABELS,
  getSizesForCategory,
} from "@/lib/validations/product"
import { PROVINCES_RD } from "@/lib/constants/provinces"
import { X } from "lucide-react"

export function FiltersSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse current filters
  const currentCategory = searchParams.get("category") || ""
  const currentGenders = searchParams.get("gender")?.split(",") || []
  const currentSizes = searchParams.get("size")?.split(",") || []
  const currentConditions = searchParams.get("condition")?.split(",") || []
  const currentProvince = searchParams.get("province") || ""
  const currentMinPrice = searchParams.get("min_price") ? parseInt(searchParams.get("min_price")!) : 0
  const currentMaxPrice = searchParams.get("max_price") ? parseInt(searchParams.get("max_price")!) : 100000
  const currentVerified = searchParams.get("verified") === "true"

  const updateFilters = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","))
      } else {
        params.set(key, value.toString())
      }
    })

    router.push(`/productos?${params.toString()}`)
  }

  const toggleMultiSelect = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateFilters({ [key]: newValues })
  }

  const sizeResult = currentCategory
    ? getSizesForCategory(currentCategory as any)
    : { sizes: [], labels: {} }
  const availableSizes = sizeResult.sizes

  const clearFilters = () => {
    router.push("/productos")
  }

  const hasActiveFilters =
    currentCategory ||
    currentGenders.length > 0 ||
    currentSizes.length > 0 ||
    currentConditions.length > 0 ||
    currentProvince ||
    currentMinPrice !== 0 ||
    currentMaxPrice !== 100000 ||
    currentVerified

  return (
    <div className="space-y-6 pb-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full justify-center text-emerald-600 hover:text-emerald-700"
        >
          <X className="w-4 h-4 mr-2" />
          Limpiar filtros
        </Button>
      )}

      {/* Category */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Categoría</h3>
        <Select value={currentCategory || "all"} onValueChange={(value) => updateFilters({ category: value === "all" ? "" : value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {PRODUCT_CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Género</h3>
        <div className="space-y-2">
          {PRODUCT_GENDERS.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={currentGenders.includes(gender)}
                onCheckedChange={() =>
                  toggleMultiSelect("gender", gender, currentGenders)
                }
              />
              <Label htmlFor={`gender-${gender}`} className="font-normal cursor-pointer">
                {PRODUCT_GENDER_LABELS[gender]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Talla</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableSizes.map((size) => (
              <Button
                key={size}
                variant={currentSizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  toggleMultiSelect("size", size, currentSizes)
                }
              >
                {sizeResult.labels[size] || size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Condition */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Condición</h3>
        <div className="space-y-2">
          {PRODUCT_CONDITIONS.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={currentConditions.includes(condition)}
                onCheckedChange={() =>
                  toggleMultiSelect("condition", condition, currentConditions)
                }
              />
              <Label
                htmlFor={`condition-${condition}`}
                className="font-normal cursor-pointer"
              >
                {PRODUCT_CONDITION_LABELS[condition]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Rango de precio</h3>
        <div className="space-y-2">
          <Slider
            value={[currentMinPrice, currentMaxPrice]}
            onValueChange={([min, max]) =>
              updateFilters({ min_price: min, max_price: max })
            }
            min={0}
            max={100000}
            step={500}
            className="w-full"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={currentMinPrice}
              onChange={(e) =>
                updateFilters({
                  min_price: e.target.value ? parseInt(e.target.value) : 0,
                })
              }
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Máx"
              value={currentMaxPrice}
              onChange={(e) =>
                updateFilters({
                  max_price: e.target.value ? parseInt(e.target.value) : 100000,
                })
              }
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Province */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Provincia</h3>
        <Select value={currentProvince || "all"} onValueChange={(value) => updateFilters({ province: value === "all" ? "" : value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {PROVINCES_RD.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Verified Only */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={currentVerified}
            onCheckedChange={(checked) =>
              updateFilters({ verified: checked ? "true" : null })
            }
          />
          <Label htmlFor="verified" className="font-normal cursor-pointer">
            Solo tiendas verificadas
          </Label>
        </div>
      </div>
    </div>
  )
}
