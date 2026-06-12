import type { Product, ApiResponse } from '~/types'
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

export function useProductRepository() {
  const { isMock } = useApiClient()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string

  function getProducts(params?: { categorySlug?: string; search?: string }) {
    if (isMock) {
      let result = [...mockProducts]
      if (params?.categorySlug) {
        result = result.filter(p => p.categorySlug === params.categorySlug)
      }
      if (params?.search) {
        const q = params.search.toLowerCase()
        result = result.filter(p => p.name.toLowerCase().includes(q))
      }
      return { data: ref<Product[]>(result), pending: ref(false), error: ref(null), refresh: async () => {} }
    }

    const key = buildCacheKey('/products', params ? JSON.stringify(params) : undefined) ?? `products-${Date.now()}`
    return useFetch(`${baseUrl}/products`, {
      key,
      params,
      transform: (res: ApiResponse<any[]>) => res.data.map(mapProduct) as Product[],
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
      query: { featured: 'true' },
      transform: (res: ApiResponse<any[]>) => res.data.map(mapProduct) as Product[],
    })
  }

  return { getProducts, getProductBySlug, getFeaturedProducts }
}
