export function useLoginViewModel() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string
  const router = useRouter()
  const popup = usePopup()
  const { t } = useI18n()

  const form = reactive({ email: '', password: '' })
  const loading = ref(false)
  const error = ref('')
  const showPassword = ref(false)

  function validate() {
    if (!form.email) return t('auth.email_required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('auth.email_invalid')
    if (!form.password) return t('auth.password_required')
    if (form.password.length < 6) return t('auth.password_min')
    return ''
  }

  async function login() {
    error.value = validate()
    if (error.value) return

    loading.value = true
    try {
      const res = await $fetch<{ success: boolean; data: { user: { name: string; email: string; phone?: string; media?: string }; access_token: string } }>(
        `${baseUrl}/auth/login`,
        { method: 'POST', body: { email: form.email, password: form.password } },
      )
      const u = res.data.user
      authStore.setAuth({ name: u.name, email: u.email, phone: u.phone, media: u.media }, res.data.access_token)
      await popup.success(t('auth.login_success', { name: res.data.user.name }))
      await router.push('/')
    } catch (err: any) {
      error.value = err?.data?.data?.message ?? err?.data?.message ?? t('common.error')
    } finally {
      loading.value = false
    }
  }

  return { form, loading, error, showPassword, login }
}

export function useRegisterViewModel() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string
  const router = useRouter()
  const popup = usePopup()
  const { t } = useI18n()

  const form = reactive({ name: '', email: '', password: '', phone: '' })
  const loading = ref(false)
  const error = ref('')
  const showPassword = ref(false)

  function validate() {
    if (!form.name.trim()) return t('auth.name_required')
    if (!form.email) return t('auth.email_required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('auth.email_invalid')
    if (!form.password) return t('auth.password_required')
    if (form.password.length < 6) return t('auth.password_min')
    return ''
  }

  async function register() {
    error.value = validate()
    if (error.value) return

    loading.value = true
    try {
      const body: Record<string, string> = { name: form.name, email: form.email, password: form.password }
      if (form.phone.trim()) body.phone = form.phone.trim()

      const res = await $fetch<{ success: boolean; data: { user: { name: string; email: string; phone?: string; media?: string }; access_token: string } }>(
        `${baseUrl}/auth/register`,
        { method: 'POST', body },
      )
      const u = res.data.user
      authStore.setAuth({ name: u.name, email: u.email, phone: u.phone, media: u.media }, res.data.access_token)
      await popup.success(t('auth.register_success', { name: res.data.user.name }))
      await router.push('/')
    } catch (err: any) {
      error.value = err?.data?.data?.message ?? err?.data?.message ?? t('common.error')
    } finally {
      loading.value = false
    }
  }

  return { form, loading, error, showPassword, register }
}
