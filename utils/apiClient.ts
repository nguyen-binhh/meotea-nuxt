import type { ApiResponse, PopupOptions } from '~/types'

export function useApiClient() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl as string
  const isMock = (config.public.useMock as string) === 'true'
  const authStore = useAuthStore()
  const router = useRouter()

  function authHeaders(): Record<string, string> {
    return authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
  }

  function dispatchError(message: string) {
    if (import.meta.client) {
      window.dispatchEvent(
        new CustomEvent('api-error', {
          detail: { message } satisfies Pick<PopupOptions, 'message'>,
        }),
      )
    }
  }

  function handleError(err: unknown): void {
    const fetchError = err as { status?: number; data?: { message?: string } }

    if (fetchError.status === 401) {
      if (authStore.isLoggedIn) {
        authStore.logout()
        router.push('/dang-nhap')
      }
      dispatchError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      return
    }

    let message = 'Có lỗi xảy ra. Vui lòng thử lại.'
    if (fetchError.status === 403) {
      message = 'Bạn không có quyền thực hiện hành động này.'
    } else if (fetchError.status === 404) {
      message = 'Không tìm thấy dữ liệu yêu cầu.'
    } else if (fetchError.status && fetchError.status >= 500) {
      message = 'Lỗi máy chủ. Vui lòng thử lại sau.'
    } else if (fetchError.data?.message) {
      message = fetchError.data.message
    }

    dispatchError(message)
  }

  async function get<T>(path: string, params?: Record<string, unknown>): Promise<T | null> {
    if (isMock) return null
    try {
      const res = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        params,
        headers: authHeaders(),
      })
      return res.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  async function post<T>(path: string, body: Record<string, unknown> | BodyInit | null): Promise<T | null> {
    if (isMock) return null
    try {
      const res = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        method: 'POST',
        body,
        headers: authHeaders(),
      })
      return res.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  async function put<T>(path: string, body: Record<string, unknown> | BodyInit | null): Promise<T | null> {
    if (isMock) return null
    try {
      const res = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        method: 'PUT',
        body,
        headers: authHeaders(),
      })
      return res.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  async function patch<T>(path: string, body: Record<string, unknown> | BodyInit | null): Promise<T | null> {
    if (isMock) return null
    try {
      const res = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        method: 'PATCH',
        body,
        headers: authHeaders(),
      })
      return res.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  async function uploadPatch<T>(path: string, formData: FormData): Promise<T | null> {
    if (isMock) return null
    try {
      const res = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        method: 'PATCH',
        body: formData,
        headers: authHeaders(),
      })
      return res.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  async function del<T>(path: string): Promise<T | null> {
    if (isMock) return null
    try {
      const res = await $fetch<ApiResponse<T>>(`${baseUrl}${path}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      return res.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  return { get, post, put, patch, del, uploadPatch, isMock }
}
