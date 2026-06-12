import type { Post } from '~/types'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function usePostListViewModel() {
  const repo = usePostRepository()
  const { data: posts, pending: loading } = repo.getPosts()

  const featuredPost = computed<Post | null>(() => (posts.value as Post[] | null)?.[0] ?? null)
  const otherPosts = computed<Post[]>(() => (posts.value as Post[] | null)?.slice(1) ?? [])

  return { posts, featuredPost, otherPosts, loading, formatDate }
}

export function usePostDetailViewModel(slug: string) {
  const repo = usePostRepository()
  const { data: post, pending: loading, error } = repo.getPostBySlug(slug)
  const { data: allPosts } = repo.getPosts()

  const relatedPosts = computed<Post[]>(() =>
    ((allPosts.value as Post[] | null) ?? []).filter((p: Post) => p.slug !== slug).slice(0, 3),
  )

  return { post, loading, error, relatedPosts, formatDate }
}
