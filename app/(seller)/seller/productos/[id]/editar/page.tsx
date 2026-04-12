import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditProductForm } from './EditProductForm'
import type { ProductCategory, ProductCondition, ProductGender, ProductSize, ProductStatus } from '@/types/database.types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch product + images — verify ownership via the join to stores
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, title, price, size, category, condition, gender,
      description, brand, color, material, status,
      store_id,
      product_images(id, url, storage_path, position)
    `)
    .eq('id', id)
    .maybeSingle()

  if (error || !product) notFound()

  // Verify seller owns this product's store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('id', product.store_id)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!store) notFound()

  // Sort images by position
  const sortedImages = [...(product.product_images ?? [])].sort(
    (a, b) => a.position - b.position
  )

  return (
    <EditProductForm
      productId={product.id}
      storeId={store.id}
      sellerId={user.id}
      initialValues={{
        price: product.price as number,
        size: product.size as ProductSize,
        category: product.category as ProductCategory,
        condition: product.condition as ProductCondition,
        gender: product.gender as ProductGender,
        title: product.title ?? '',
        description: (product.description as string | null) ?? '',
        brand: (product.brand as string | null) ?? '',
        color: (product.color as string | null) ?? '',
        material: (product.material as string | null) ?? '',
      }}
      initialStatus={product.status as ProductStatus}
      existingImages={sortedImages as Array<{ id: string; url: string; storage_path: string; position: number }>}
    />
  )
}
