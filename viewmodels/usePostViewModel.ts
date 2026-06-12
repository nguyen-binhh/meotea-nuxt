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
  const categoryRepo = usePostCategoryRepository()

  const page = ref(1)
  const limit = ref(6)
  const activeCategory = ref<string>('all')

  const params = computed<PostQueryParams>(() => ({
    page: page.value,
    limit: limit.value,
    ...(activeCategory.value !== 'all' ? { categorySlug: activeCategory.value } : {}),
  }))

  const { data, pending: loading } = repo.getPosts(params)
  const { data: postCategories } = categoryRepo.getCategories()

  const posts = computed<Post[]>(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const totalItems = computed(() => data.value?.meta?.total ?? 0)

  function selectCategory(slug: string) {
    activeCategory.value = slug
    page.value = 1
  }

  return { posts, loading, postCategories, page, limit, totalPages, totalItems, activeCategory, selectCategory, formatDate }
}

export function usePostDetailViewModel(slug: string) {
  const repo = usePostRepository()
  const { data: post, pending: loading, error } = repo.getPostBySlug(slug)
  const limit = ref(6)

  const relatedParams = computed<PostQueryParams>(() => ({
    page: 1,
    limit: limit.value,
    ...(post.value?.category?.slug ? { categorySlug: post.value.category.slug } : {}),
  }))

  const { data: pagedPosts } = repo.getPosts(relatedParams, 'posts-related')

  const relatedPosts = computed<Post[]>(() =>
    (pagedPosts.value?.items ?? []).filter((p: Post) => p.slug !== slug).slice(0, 3),
  )

  return { post, loading, error, limit, relatedPosts, formatDate }
}
