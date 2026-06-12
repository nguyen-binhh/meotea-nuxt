export function useAuthGuard() {
  const authStore = useAuthStore()

  async function requireAuth(redirectTo = '/dang-nhap') {
    if (!authStore.isLoggedIn) {
      await navigateTo(redirectTo)
    }
  }

  async function requireGuest(redirectTo = '/') {
    if (authStore.isLoggedIn) {
      await navigateTo(redirectTo)
    }
  }

  return { requireAuth, requireGuest }
}
