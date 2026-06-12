import type { Post } from '~/types'

export function usePostRepository() {
  const { isMock } = useApiClient()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string

  function getPosts() {
    if (isMock) {
      return { data: ref<Post[]>([]), pending: ref(false), error: ref(null), refresh: async () => {} }
    }
    return useFetch(`${baseUrl}/posts`, {
      key: 'posts',
      transform: (res: any): Post[] => res.data ?? [],
    })
  }

  function getPostBySlug(slug: string) {
    if (isMock) {
      return { data: ref<Post | null>(null), pending: ref(false), error: ref(null), refresh: async () => {} }
    }
    return useFetch(`${baseUrl}/posts/${slug}`, {
      key: `post-${slug}`,
      transform: (res: any): Post => res.data,
    })
  }

  return { getPosts, getPostBySlug }
}
