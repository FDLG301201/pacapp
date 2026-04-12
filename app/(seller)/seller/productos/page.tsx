'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Plus, Search, Pencil, Eye, EyeOff, ShoppingBag, Trash2,
  MoreHorizontal, PackageOpen, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/shared/EmptyState'
import { createClient } from '@/lib/supabase/client'
import { deleteStorageFile } from '@/lib/utils/image'
import {
  PRODUCT_CATEGORY_LABELS, PRODUCT_STATUS_LABELS,
} from '@/lib/validations/product'
import type { ProductCategory, ProductStatus } from '@/types/database.types'

interface Product {
  id: string
  title: string | null
  price: number
  size: string
  category: ProductCategory
  status: ProductStatus
  views_count: number
  brand: string | null
  created_at: string
  product_images: { url: string }[]
}

const PAGE_SIZE = 20

const STATUS_OPTIONS: { value: ProductStatus | 'all'; label: string }[] = [
  { value: 'all',    label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'hidden', label: 'Escondidos' },
  { value: 'sold',   label: 'Vendidos' },
]

const STATUS_VARIANTS: Record<ProductStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  sold:   'secondary',
  hidden: 'outline',
}

export default function ProductListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all')
  const [page, setPage] = useState(0)
  const [storeId, setStoreId] = useState<string | null>(null)

  // Fetch the seller's store id once
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()
        .then(({ data }) => setStoreId(data?.id ?? null))
    })
  }, [router])

  const fetchProducts = useCallback(async () => {
    if (!storeId) return
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('products')
      .select('id, title, price, size, category, status, views_count, brand, created_at, product_images(url)', { count: 'exact' })
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search.trim()}%,brand.ilike.%${search.trim()}%`
      )
    }

    const { data, count, error } = await query
    if (error) {
      console.error('Products fetch error:', error.message)
      toast.error('Error al cargar los productos')
    } else {
      setProducts((data ?? []) as Product[])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [storeId, page, statusFilter, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Debounce search
  useEffect(() => {
    setPage(0)
  }, [search, statusFilter])

  async function handleStatusChange(id: string, newStatus: ProductStatus) {
    const supabase = createClient()
    const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', id)
    if (error) { toast.error('No se pudo actualizar el estado'); return }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p))
    toast.success(
      newStatus === 'sold' ? 'Marcado como vendido'
      : newStatus === 'hidden' ? 'Producto escondido'
      : 'Producto visible'
    )
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    const supabase = createClient()

    const { data: images } = await supabase
      .from('product_images')
      .select('storage_path')
      .eq('product_id', id)

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('No se pudo eliminar el producto'); return }

    if (images) {
      await Promise.all(images.map((img) => deleteStorageFile('product-images', img.storage_path)))
    }

    setProducts((prev) => prev.filter((p) => p.id !== id))
    setTotal((t) => t - 1)
    toast.success('Producto eliminado')
    router.refresh()
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mis productos</h1>
            <p className="text-sm text-muted-foreground">{total} productos en total</p>
          </div>
          <Button asChild>
            <Link href="/seller/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Agregar producto
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o marca…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={statusFilter === opt.value ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Table — desktop */}
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Cargando…</div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No hay productos"
            description={
              search || statusFilter !== 'all'
                ? 'Prueba cambiando los filtros de búsqueda'
                : 'Sube tu primer producto en menos de 1 minuto'
            }
            actionLabel={!search && statusFilter === 'all' ? '+ Agregar producto' : undefined}
            actionHref="/seller/productos/nuevo"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden rounded-lg border bg-card sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Foto</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Vistas</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                          {product.product_images?.[0]?.url ? (
                            <Image
                              src={product.product_images[0].url}
                              alt={product.title ?? ''}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.title ?? 'Sin título'}</p>
                        {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {PRODUCT_CATEGORY_LABELS[product.category] ?? product.category}
                      </TableCell>
                      <TableCell className="font-medium">
                        RD${product.price.toLocaleString('es-DO', { minimumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[product.status]}>
                          {PRODUCT_STATUS_LABELS[product.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {product.views_count}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Acciones">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/seller/productos/${product.id}/editar`}>
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                              </Link>
                            </DropdownMenuItem>
                            {product.status !== 'sold' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'sold')}>
                                <ShoppingBag className="mr-2 h-4 w-4" /> Marcar como vendido
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(
                                  product.id,
                                  product.status === 'hidden' ? 'active' : 'hidden'
                                )
                              }
                            >
                              {product.status === 'hidden' ? (
                                <><Eye className="mr-2 h-4 w-4" /> Mostrar</>
                              ) : (
                                <><EyeOff className="mr-2 h-4 w-4" /> Esconder</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card list */}
            <div className="flex flex-col gap-3 sm:hidden">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.product_images?.[0]?.url ? (
                      <Image
                        src={product.product_images[0].url}
                        alt={product.title ?? ''}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{product.title ?? 'Sin título'}</p>
                    <p className="text-base font-bold text-primary">
                      RD${product.price.toLocaleString('es-DO', { minimumFractionDigits: 0 })}
                    </p>
                    <Badge variant={STATUS_VARIANTS[product.status]} className="mt-1 text-xs">
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/seller/productos/${product.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </Link>
                      </DropdownMenuItem>
                      {product.status !== 'sold' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'sold')}>
                          <ShoppingBag className="mr-2 h-4 w-4" /> Marcar como vendido
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(product.id, product.status === 'hidden' ? 'active' : 'hidden')
                        }
                      >
                        {product.status === 'hidden'
                          ? <><Eye className="mr-2 h-4 w-4" /> Mostrar</>
                          : <><EyeOff className="mr-2 h-4 w-4" /> Esconder</>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Página {page + 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
