// @ts-nocheck - Supabase query builder type narrowing
import { Suspense } from "react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { FiltersSidebar } from "@/components/catalog/FiltersSidebar"
import { FiltersSheet } from "@/components/catalog/FiltersSheet"
import { SortDropdown } from "@/components/catalog/SortDropdown"
import { SearchInput } from "@/components/catalog/SearchInput"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { Pagination } from "@/components/catalog/Pagination"
import { FilterPill } from "@/components/catalog/FilterPill"
import { createClient } from "@/lib/supabase/server"
import { PRODUCT_CATEGORY_LABELS } from "@/lib/validations/product"

const ITEMS_PER_PAGE = 24

async function getCatalogData(searchParams: Record<string, string | string[] | undefined>) {
  const supabase = await createClient()

  // Get current user for favorites
  const { data: { user } } = await supabase.auth.getUser()

  // Parse search params
  const q = typeof searchParams.q === "string" ? searchParams.q : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const gender = typeof searchParams.gender === "string" ? searchParams.gender.split(",").filter(Boolean) : []
  const size = typeof searchParams.size === "string" ? searchParams.size.split(",").filter(Boolean) : []
  const condition = typeof searchParams.condition === "string" ? searchParams.condition.split(",").filter(Boolean) : []
  const province = typeof searchParams.province === "string" ? searchParams.province : ""
  const minPrice = typeof searchParams.min_price === "string" ? parseInt(searchParams.min_price) : 0
  const maxPrice = typeof searchParams.max_price === "string" ? parseInt(searchParams.max_price) : 100000
  const verified = searchParams.verified === "true"
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "recent"
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) || 1 : 1

  // Build query
  let query = supabase
    .from("products")
    .select("*,product_images(url,position),stores(name,slug,is_verified,province,status)", { count: "exact" })
    .eq("status", "active")
    .eq("stores.status", "active")
    .gte("price", minPrice)
    .lte("price", maxPrice)

  // Apply text search if query provided
  if (q) {
    query = query.textSearch("search_vector", q, { type: "websearch", config: "spanish" })
  }

  // Apply filters
  if (category) query = query.eq("category", category)
  if (gender.length > 0) query = query.in("gender", gender)
  if (size.length > 0) query = query.in("size", size)
  if (condition.length > 0) query = query.in("condition", condition)
  if (province) query = query.eq("stores.province", province)
  if (verified) query = query.eq("stores.is_verified", true)

  // Apply sorting
  let orderColumn = "created_at"
  let orderAscending = false

  if (sort === "price_asc") {
    orderColumn = "price"
    orderAscending = true
  } else if (sort === "price_desc") {
    orderColumn = "price"
    orderAscending = false
  } else if (sort === "popular") {
    orderColumn = "views_count"
    orderAscending = false
  } else {
    // recent (default)
    orderColumn = "created_at"
    orderAscending = false
  }

  query = query.order(orderColumn, { ascending: orderAscending })

  // Pagination
  const offset = (page - 1) * ITEMS_PER_PAGE
  const { data: products, count } = await query.range(offset, offset + ITEMS_PER_PAGE - 1)

  // Get user favorites
  let userFavorites: string[] = []
  if (user) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .not("product_id", "is", null)

    userFavorites = favorites?.map((f) => f.product_id).filter(Boolean) as string[]
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return {
    products: products || [],
    count: count || 0,
    totalPages,
    page,
    user,
    userFavorites,
    filters: {
      q,
      category,
      gender,
      size,
      condition,
      province,
      minPrice,
      maxPrice,
      verified,
      sort,
    },
  }
}

interface CatalogPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { products, count, totalPages, page, user, userFavorites, filters } = await getCatalogData(searchParams)

  const categoryLabel = filters.category ? PRODUCT_CATEGORY_LABELS[filters.category as any] : null

  // Build active filter pills
  const activeFilters: { label: string; param: string; value: string }[] = []
  if (filters.q) activeFilters.push({ label: `Búsqueda: "${filters.q}"`, param: "q", value: filters.q })
  if (filters.category) activeFilters.push({ label: categoryLabel || filters.category, param: "category", value: filters.category })
  if (filters.province) activeFilters.push({ label: filters.province, param: "province", value: filters.province })

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-gray-50">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Productos</BreadcrumbItem>
              {filters.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>{categoryLabel}</BreadcrumbItem>
                </>
              )}
              {filters.province && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>{filters.province}</BreadcrumbItem>
                </>
              )}
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar (Desktop Only) */}
            <aside className="hidden lg:block">
              <FiltersSidebar />
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Top Bar */}
              <div className="space-y-4">
                {/* Search & Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <SearchInput />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <SortDropdown currentSort={filters.sort} />
                    <FiltersSheet />
                  </div>
                </div>

                {/* Active Filter Pills */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                      <FilterPill
                        key={`${filter.param}-${filter.value}`}
                        filter={filter}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Grid */}
              <Suspense fallback={<div className="text-center py-12">Cargando productos...</div>}>
                <ProductGrid
                  products={products}
                  userId={user?.id}
                  favorites={userFavorites}
                />
              </Suspense>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination total={count} page={page} perPage={ITEMS_PER_PAGE} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

