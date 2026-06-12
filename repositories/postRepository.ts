import type { Post, PaginationMeta, Paginated } from '~/types'

const defaultMeta: PaginationMeta = { page: 1, limit: 9, total: 0, totalPages: 1 }

export interface PostQueryParams {
  page?: number
  limit?: number
}

export function usePostRepository() {
  const { isMock } = useApiClient()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string

  function getPosts(params: ComputedRef<PostQueryParams>) {
    if (isMock) {
      return {
        data: ref<Paginated<Post>>({ items: [], meta: defaultMeta }),
        pending: ref(false),
        error: ref(null),
        refresh: async () => {},
      }
    }
    return useFetch(`${baseUrl}/posts`, {
      key: 'posts-list',
      params,
      watch: [params],
      transform: (res: any): Paginated<Post> => ({
        items: res.data?.items ?? [],
        meta: res.data?.meta ?? defaultMeta,
      }),
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
