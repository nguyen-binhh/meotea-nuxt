import type { Category, ApiResponse } from '~/types'
import { mockCategories } from '~/mock/categories'
import { buildCacheKey } from '~/utils/cacheConfig'

export function useCategoryRepository() {
  const { isMock } = useApiClient()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string

  function getCategories() {
    if (isMock) {
      return { data: ref<Category[]>(mockCategories), pending: ref(false), error: ref(null), refresh: async () => {} }
    }

    const key = buildCacheKey('/categories') ?? 'categories'
    return useFetch(`${baseUrl}/categories`, {
      key,
      transform: (res: ApiResponse<any[]>) => res.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        color: c.color,
      })) as Category[],
    })
  }

  return { getCategories }
}
