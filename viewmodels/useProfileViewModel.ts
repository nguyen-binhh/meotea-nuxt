export function useProfileViewModel() {
  const authStore = useAuthStore()
  const { uploadPatch } = useApiClient()
  const popup = usePopup()
  const { t } = useI18n()

  const loading = ref(false)
  const error = ref('')
  const avatarPreview = ref<string | null>(authStore.user?.media ?? null)
  const avatarFile = ref<File | null>(null)

  const form = reactive({
    name: authStore.user?.name ?? '',
    phone: '',
  })

  async function fetchProfile() {
    const { get } = useApiClient()
    const result = await get<{ name: string; phone: string; email: string; media: string }>('/users/me')
    if (result) {
      form.name = result.name ?? ''
      form.phone = result.phone ?? ''
      avatarPreview.value = result.media ?? null
    }
  }

  function onAvatarPick(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
  }

  async function saveProfile() {
    if (!form.name.trim()) {
      error.value = t('auth.name_required')
      return
    }
    error.value = ''
    loading.value = true

    try {
      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('phone', form.phone.trim())
      if (avatarFile.value) fd.append('avatar', avatarFile.value)

      const result = await uploadPatch<{ name: string; email: string; media: string; phone: string }>(
        '/users/me',
        fd,
      )
      if (result) {
        authStore.updateUser({
          name: result.name,
          media: result.media ?? undefined,
        })
        avatarPreview.value = result.media ?? null
        avatarFile.value = null
        await popup.success(t('profile.saved'))
      }
    } catch (err: any) {
      error.value = err?.data?.message ?? t('common.error')
    } finally {
      loading.value = false
    }
  }

  return { form, loading, error, avatarPreview, onAvatarPick, saveProfile, fetchProfile }
}
