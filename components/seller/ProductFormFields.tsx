'use client'

import { type UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { SegmentedControl } from '@/components/seller/SegmentedControl'
import { CategoryPicker } from '@/components/seller/CategoryPicker'
import {
  PRODUCT_CONDITIONS,
  PRODUCT_CONDITION_LABELS,
  PRODUCT_CONDITION_DESCRIPTIONS,
  PRODUCT_GENDERS,
  PRODUCT_GENDER_LABELS,
  getSizesForCategory,
  getSizeLabel,
  type ProductInput,
} from '@/lib/validations/product'
import type { ProductCategory } from '@/types/database.types'

interface ProductFormFieldsProps {
  form: UseFormReturn<ProductInput>
  photoSlot: React.ReactNode
}

export function ProductFormFields({ form, photoSlot }: ProductFormFieldsProps) {
  const selectedCategory = form.watch('category') as ProductCategory | undefined
  const { sizes, labels } = getSizesForCategory(selectedCategory ?? null)

  return (
    <div className="space-y-6">
      {/* Photos */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Fotos * <span className="text-muted-foreground font-normal">(hasta 5)</span>
        </p>
        {photoSlot}
      </div>

      {/* Price */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio *</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  RD$
                </span>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  className="pl-12"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría *</FormLabel>
            <FormControl>
              <CategoryPicker
                value={field.value ?? null}
                onChange={(v) => {
                  field.onChange(v)
                  // Reset size when category changes since size sets change
                  form.setValue('size', '' as never)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Size */}
      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Talla *</FormLabel>
            <FormControl>
              <SegmentedControl
                options={sizes.map((s) => ({ value: s, label: labels[s] ?? getSizeLabel(s) }))}
                value={field.value ?? null}
                onChange={field.onChange}
                columns={sizes.length <= 7 ? sizes.length : undefined}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Condition */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado *</FormLabel>
            <FormControl>
              <SegmentedControl
                options={PRODUCT_CONDITIONS.map((c) => ({
                  value: c,
                  label: PRODUCT_CONDITION_LABELS[c],
                  description: PRODUCT_CONDITION_DESCRIPTIONS[c],
                }))}
                value={field.value ?? null}
                onChange={field.onChange}
                columns={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Género *</FormLabel>
            <FormControl>
              <SegmentedControl
                options={PRODUCT_GENDERS.map((g) => ({
                  value: g,
                  label: PRODUCT_GENDER_LABELS[g],
                }))}
                value={field.value ?? null}
                onChange={field.onChange}
                columns={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Optional details */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
          Detalles opcionales
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Se auto-genera si lo dejas vacío" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalles adicionales sobre esta prenda…"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Zara, H&M, Tommy…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Azul marino" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. 100% algodón" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
