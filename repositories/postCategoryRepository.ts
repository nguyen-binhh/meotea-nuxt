import type { PostCategory } from '~/types'

export function usePostCategoryRepository() {
  const { isMock } = useApiClient()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string

  function getCategories() {
    if (isMock) {
      return { data: ref<PostCategory[]>([]), pending: ref(false), error: ref(null), refresh: async () => {} }
    }
    return useFetch(`${baseUrl}/post-categories`, {
      key: 'post-categories',
      transform: (res: any): PostCategory[] => res.data ?? [],
    })
  }

  return { getCategories }
}
