<script setup lang="ts">
const cartStore = useCartStore()
const authStore = useAuthStore()
const ui = useUIStore()
const showMergeDialog = ref(false)

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function onApiError(e: Event) {
  const message = (e as CustomEvent<{ message: string }>).detail.message
  ui.showError(message)
}

onMounted(() => {
  if (authStore.token && isTokenExpired(authStore.token)) {
    authStore.logout()
  }

  cartStore.fetchCart()

  window.addEventListener('api-error', onApiError)
})

onUnmounted(() => {
  window.removeEventListener('api-error', onApiError)
})

watch(() => authStore.isLoggedIn, async (isLoggedIn) => {
  if (isLoggedIn) {
    await cartStore.fetchCart()
    if (cartStore.guestItems.length > 0) {
      showMergeDialog.value = true
    }
  }
})
</script>

<template>
  <v-app>
    <AppHeader />
    <CartDrawer />
    <AppPopup />
    <CartMergeDialog v-model="showMergeDialog" />

    <v-main>
      <slot />
    </v-main>

    <AppFooter />
  </v-app>
</template>
