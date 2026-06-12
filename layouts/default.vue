<script setup lang="ts">
const cartStore = useCartStore()
const authStore = useAuthStore()
const showMergeDialog = ref(false)

onMounted(() => cartStore.fetchCart())

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
