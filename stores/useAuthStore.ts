import { defineStore } from 'pinia'

interface AuthUser {
  name: string
  email: string
  phone?: string
  media?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<AuthUser | null>('meotea_user', null, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  })

  const token = useLocalStorage<string | null>('meotea_token', null)

  const isLoggedIn = computed(() => !!user.value && !!token.value)

  function setAuth(authUser: AuthUser, authToken: string) {
    user.value = authUser
    token.value = authToken
  }

  function updateUser(patch: Partial<AuthUser>) {
    if (user.value) {
      user.value = { ...user.value, ...patch }
    }
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return { user, token, isLoggedIn, setAuth, updateUser, logout }
})
