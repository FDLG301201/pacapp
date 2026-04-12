// TODO (phase 3): Rewrite with real Supabase data — mock-data types suppressed until then
// @ts-nocheck
"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StoreCard } from "@/components/store-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MapPin, Star, Store } from "lucide-react"
import { stores, provinces } from "@/lib/mock-data"

export default function TiendasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvince = selectedProvince === "all" || store.location === selectedProvince
    return matchesSearch && matchesProvince
  })

  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "products":
        return b.productCount - a.productCount
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const stats = {
    totalStores: stores.length,
    verifiedStores: stores.filter(s => s.verified).length,
    totalProducts: stores.reduce((acc, s) => acc + s.productCount, 0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Tiendas de Pacas</h1>
            <p className="mt-2 text-muted-foreground">
              Encuentra las mejores tiendas de ropa de segunda mano en tu zona
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStores}</p>
                <p className="text-sm text-muted-foreground">Tiendas Registradas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.verifiedStores}</p>
                <p className="text-sm text-muted-foreground">Tiendas Verificadas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <MapPin className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Productos Disponibles</p>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar tiendas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Provincias</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mejor Rating</SelectItem>
                <SelectItem value="products">Mas Productos</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            {sortedStores.length} tiendas encontradas
          </div>

          {sortedStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Store className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No se encontraron tiendas</h3>
              <p className="mt-2 text-muted-foreground">
                Intenta buscar en otra provincia o con otro nombre
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedProvince("all")
                }} 
                className="mt-4"
              >
                Limpiar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
