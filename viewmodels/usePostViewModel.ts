import type { Post } from '~/types'
import type { PostQueryParams } from '~/repositories/postRepository'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function usePostListViewModel() {
  const repo = usePostRepository()

  const page = ref(1)
  const limit = ref(6)

  const params = computed<PostQueryParams>(() => ({ page: page.value, limit: limit.value }))

  const { data, pending: loading } = repo.getPosts(params)

  const posts = computed<Post[]>(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const totalItems = computed(() => data.value?.meta?.total ?? 0)

  return { posts, loading, page, limit, totalPages, totalItems, formatDate }
}

export function usePostDetailViewModel(slug: string) {
  const repo = usePostRepository()
  const { data: post, pending: loading, error } = repo.getPostBySlug(slug)
  const limit = ref(6)

  const detailParams = computed<PostQueryParams>(() => ({ page: 1, limit: limit.value }))
  const { data: pagedPosts } = repo.getPosts(detailParams)

  const relatedPosts = computed<Post[]>(() =>
    ((pagedPosts.value?.items as Post[] | null) ?? []).filter((p: Post) => p.slug !== slug).slice(0, 3),
  )

  return { post, loading, error, limit, relatedPosts, formatDate }
}
