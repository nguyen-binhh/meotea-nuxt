import type { Comment } from '~/types'

export function usePostCommentViewModel(postId: ComputedRef<number | undefined>) {
  const repo = useCommentRepository()
  const authStore = useAuthStore()
  const popup = usePopup()
  const { t } = useI18n()

  const page = ref(1)
  const limit = ref(10)
  const submitting = ref(false)

  const params = computed(() => ({ page: page.value, limit: limit.value }))

  const { data, pending: loading, refresh } = repo.getComments(postId, params)

  const comments = computed<Comment[]>(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const total = computed(() => data.value?.meta?.total ?? 0)

  const form = reactive({
    content: '',
    authorName: '',
    authorEmail: '',
  })

  const isFormValid = computed(() => {
    if (form.content.trim().length < 2) return false
    if (!authStore.isLoggedIn && !form.authorName.trim()) return false
    return true
  })

  async function submitComment() {
    if (!postId.value || !isFormValid.value) return
    submitting.value = true

    try {
      const body: Record<string, string> = { content: form.content.trim() }
      if (!authStore.isLoggedIn) {
        body.authorName = form.authorName.trim()
        if (form.authorEmail.trim()) body.authorEmail = form.authorEmail.trim()
      }

      const result = await repo.addComment(postId.value, body)
      if (result) {
        form.content = ''
        form.authorName = ''
        form.authorEmail = ''
        popup.success(t('comment.submitted'))
        await refresh()
      }
    }
    finally {
      submitting.value = false
    }
  }

  return {
    comments, loading, page, totalPages, total,
    form, isFormValid, submitting,
    submitComment, authStore,
  }
}
