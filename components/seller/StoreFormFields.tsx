'use client'

import { type UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import {
  PROVINCES_RD,
  STORE_CATEGORIES,
  STORE_CATEGORY_LABELS,
  type StoreInput,
} from '@/lib/validations/store'

interface StoreFormFieldsProps {
  form: UseFormReturn<StoreInput>
  coverImageSlot: React.ReactNode
}

export function StoreFormFields({ form, coverImageSlot }: StoreFormFieldsProps) {
  const selectedCategories = form.watch('categories') ?? []

  function toggleCategory(value: string) {
    const current = form.getValues('categories') ?? []
    if (current.includes(value)) {
      form.setValue(
        'categories',
        current.filter((c) => c !== value),
        { shouldValidate: true }
      )
    } else {
      form.setValue('categories', [...current, value], { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-5">
      {/* Cover image */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Foto de portada *</p>
        {coverImageSlot}
      </div>

      {/* Store name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de la tienda *</FormLabel>
            <FormControl>
              <Input placeholder="Ej. Pacas La Bendición" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción corta</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Cuéntale a los compradores qué tipo de ropa vendes…"
                className="resize-none"
                maxLength={200}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormDescription>{(field.value ?? '').length}/200</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección *</FormLabel>
            <FormControl>
              <Input placeholder="Ej. Calle Duarte #45, Los Mina" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Province */}
      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provincia *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una provincia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROVINCES_RD.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono *</FormLabel>
            <FormControl>
              <Input placeholder="809-555-0000" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* WhatsApp */}
      <FormField
        control={form.control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <Input placeholder="809-555-0000 (opcional)" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Instagram */}
      <FormField
        control={form.control}
        name="instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input placeholder="@tupacas (opcional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Facebook */}
      <FormField
        control={form.control}
        name="facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input placeholder="URL de tu página (opcional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Categories */}
      <FormField
        control={form.control}
        name="categories"
        render={() => (
          <FormItem>
            <FormLabel>Categorías principales *</FormLabel>
            <FormDescription>
              Selecciona las categorías que mejor describen tu tienda.
            </FormDescription>
            <div className="flex flex-wrap gap-2 pt-1">
              {STORE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:border-primary/50'
                    }`}
                  >
                    {STORE_CATEGORY_LABELS[cat]}
                  </button>
                )
              })}
            </div>
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="gap-1">
                    {STORE_CATEGORY_LABELS[cat] ?? cat}
                    <button
                      type="button"
                      aria-label={`Quitar ${cat}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
