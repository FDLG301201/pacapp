'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, X, ChevronDown, ChevronUp, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { SellerLayout } from '@/components/seller-layout'
import { categories, conditions, sizes, genders } from '@/lib/mock-data'

export default function NuevoProductoPage() {
  const [images, setImages] = useState<string[]>([])
  const [showOptional, setShowOptional] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  // Mock image uploads
  const mockImages = [
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&h=400&fit=crop',
  ]

  const handleAddImage = () => {
    if (images.length < 5) {
      setImages([...images, mockImages[images.length % mockImages.length]])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const getSizeOptions = () => {
    if (selectedCategory === 'Zapatos') return sizes.shoes
    if (selectedCategory === 'Pantalones') return sizes.pants
    if (selectedCategory === 'Niños') return sizes.kids
    return sizes.clothing
  }

  return (
    <SellerLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/seller/productos" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Volver a productos
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mt-2">
            Agregar producto
          </h1>
          <p className="text-muted-foreground mt-1">
            Sube las fotos y completa los detalles de tu prenda
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  1
                </span>
                Fotos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted group">
                    <Image
                      src={image}
                      alt={`Foto ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    onClick={handleAddImage}
                    className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">Agregar foto</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Sube hasta 5 fotos. La primera será la foto principal.
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Price */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  2
                </span>
                Precio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="price">Precio en pesos dominicanos</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    RD$
                  </span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    className="pl-12 text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Consejo: Revisa precios similares en el catálogo para fijar un precio competitivo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  3
                </span>
                Detalles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Talla</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSizeOptions().map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((cond) => (
                        <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Género</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Details */}
          <Collapsible open={showOptional} onOpenChange={setShowOptional}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base font-medium">Detalles opcionales</span>
                    {showOptional ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del producto</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Blusa Floral Tommy Hilfiger"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe tu prenda: estado, detalles especiales, medidas..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca</Label>
                      <Input id="brand" placeholder="Ej: Zara, Nike, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input id="color" placeholder="Ej: Azul marino" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" placeholder="Ej: Algodón, Poliéster" />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Submit Button */}
          <Button size="lg" className="w-full">
            Publicar producto
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Tu producto estará visible inmediatamente después de publicarlo
          </p>
        </div>
      </div>
    </SellerLayout>
  )
}
