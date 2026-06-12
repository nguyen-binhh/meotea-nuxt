import type { Product, ApiResponse, PaginationMeta, Paginated } from '~/types'
import { mockProducts } from '~/mock/products'
import { buildCacheKey } from '~/utils/cacheConfig'

function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categorySlug: p.category?.slug ?? '',
    price: Number(p.price),
    image: p.image ?? '',
    description: p.description ?? '',
    rating: Number(p.rating),
    reviews: p.reviews ?? 0,
    isBestseller: p.isBestseller,
    isNew: p.isNew,
    tags: p.tags ?? [],
    sweetnessLevels: p.sweetnessLevels ?? [],
    iceLevels: p.iceLevels ?? [],
    sizes: (p.sizes ?? []).map((s: any) => ({
      id: s.sizeCode,
      name: s.name,
      priceModifier: Number(s.priceModifier),
    })),
    toppings: (p.toppings ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      price: Number(t.price),
    })),
  }
}

const defaultMeta: PaginationMeta = { page: 1, limit: 12, total: 0, totalPages: 1 }

export interface ProductQueryParams {
  page?: number
  limit?: number
  categorySlug?: string
  search?: string
}

export function useProductRepository() {
  const { isMock } = useApiClient()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string

  function getProducts(params: ComputedRef<ProductQueryParams>) {
    if (isMock) {
      const p = params.value
      let items = [...mockProducts]
      if (p.categorySlug) items = items.filter(x => x.categorySlug === p.categorySlug)
      if (p.search) {
        const q = p.search.toLowerCase()
        items = items.filter(x => x.name.toLowerCase().includes(q))
      }
      const page = p.page ?? 1
      const limit = p.limit ?? 12
      const total = items.length
      const totalPages = Math.ceil(total / limit) || 1
      const pageItems = items.slice((page - 1) * limit, page * limit)
      return {
        data: ref<Paginated<Product>>({ items: pageItems, meta: { page, limit, total, totalPages } }),
        pending: ref(false),
        error: ref(null),
        refresh: async () => {},
      }
    }

    return useFetch(`${baseUrl}/products`, {
      key: 'products-list',
      params,
      watch: [params],
      transform: (res: any): Paginated<Product> => ({
        items: (res.data?.items ?? []).map(mapProduct),
        meta: res.data?.meta ?? defaultMeta,
      }),
    })
  }

  function getProductBySlug(slug: string) {
    if (isMock) {
      const product = mockProducts.find(p => p.slug === slug) ?? null
      return { data: ref<Product | null>(product), pending: ref(false), error: ref(null), refresh: async () => {} }
    }

    const key = buildCacheKey('/products/:slug', slug) ?? `product-${slug}`
    return useFetch(`${baseUrl}/products/${slug}`, {
      key,
      transform: (res: ApiResponse<any>) => mapProduct(res.data) as Product,
    })
  }

  function getFeaturedProducts() {
    if (isMock) {
      const featured = mockProducts.filter(p => p.isBestseller || p.isNew).slice(0, 6)
      return { data: ref<Product[]>(featured), pending: ref(false), error: ref(null), refresh: async () => {} }
    }

    const key = buildCacheKey('/products', 'featured') ?? 'products-featured'
    return useFetch(`${baseUrl}/products`, {
      key,
      query: { featured: 'true', limit: 6 },
      transform: (res: any): Product[] => (res.data?.items ?? []).map(mapProduct),
    })
  }

  return { getProducts, getProductBySlug, getFeaturedProducts }
}
