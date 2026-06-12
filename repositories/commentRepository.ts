import type { Comment, PaginationMeta, Paginated } from '~/types'

const defaultMeta: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 1 }

export interface CommentPayload {
  content: string
}

export function useCommentRepository() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string
  const { post: apiPost } = useApiClient()

  function getComments(
    postId: ComputedRef<number | undefined>,
    params: ComputedRef<{ page: number; limit: number }>,
  ) {
    const key = `comments-${postId.value ?? 'none'}`
    return useFetch(
      () => postId.value ? `${baseUrl}/posts/${postId.value}/comments` : (null as any),
      {
        key,
        params,
        watch: [postId, params],
        transform: (res: any): Paginated<Comment> => ({
          items: res.data?.items ?? [],
          meta: res.data?.meta ?? defaultMeta,
        }),
      },
    )
  }

  async function addComment(postId: number, body: CommentPayload): Promise<Comment | null> {
    return apiPost<Comment>(`/posts/${postId}/comments`, body as unknown as Record<string, unknown>)
  }

  return { getComments, addComment }
}
