// TODO (phase 2): Rewrite with real Supabase data — mock-data types suppressed until then
// @ts-nocheck
"use client"

import { useState } from "react"
import { SellerLayout } from "@/components/seller-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/mock-data"

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const sellerProducts = products.filter(p => p.storeId === "1")
  
  const filteredProducts = sellerProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...new Set(sellerProducts.map(p => p.category))]

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mis Productos</h1>
            <p className="text-muted-foreground">Gestiona tu inventario de productos</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/seller/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category === "all" ? "Todos" : category}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No se encontraron productos</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>RD${product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 5 ? "default" : "destructive"}>
                        {product.stock} unidades
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Activo
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/productos/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Mostrando {filteredProducts.length} de {sellerProducts.length} productos</p>
        </div>
      </div>
    </SellerLayout>
  )
}
