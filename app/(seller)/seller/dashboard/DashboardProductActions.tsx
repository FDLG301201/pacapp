'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ProductCard } from '@/components/seller/ProductCard'
import { createClient } from '@/lib/supabase/client'
import { deleteStorageFile } from '@/lib/utils/image'
import type { ProductStatus } from '@/types/database.types'

interface Product {
  id: string
  title: string | null
  price: number
  status: ProductStatus
  views_count: number
  product_images: { url: string }[]
}

interface DashboardProductActionsProps {
  initialProducts: Product[]
  storeId: string
}

export function DashboardProductActions({
  initialProducts,
  storeId: _storeId,
}: DashboardProductActionsProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)

  async function handleMarkSold(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ status: 'sold' })
      .eq('id', id)
    if (error) {
      toast.error('No se pudo marcar como vendido')
      return
    }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'sold' as ProductStatus } : p))
    toast.success('Marcado como vendido')
    router.refresh()
  }

  async function handleToggleHide(id: string, currentStatus: ProductStatus) {
    const newStatus: ProductStatus = currentStatus === 'hidden' ? 'active' : 'hidden'
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) {
      toast.error('No se pudo actualizar el estado')
      return
    }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p))
    toast.success(newStatus === 'hidden' ? 'Producto escondido' : 'Producto visible')
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return

    const supabase = createClient()

    // Fetch images to delete from Storage
    const { data: images } = await supabase
      .from('product_images')
      .select('storage_path')
      .eq('product_id', id)

    // Delete product (cascades to product_images rows)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast.error('No se pudo eliminar el producto')
      return
    }

    // Delete Storage files (non-fatal)
    if (images) {
      await Promise.all(
        images.map((img) => deleteStorageFile('product-images', img.storage_path))
      )
    }

    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success('Producto eliminado')
    router.refresh()
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onMarkSold={handleMarkSold}
          onToggleHide={handleToggleHide}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
