<script setup lang="ts">
const ui = useUIStore()
const { items, itemCount, subtotal, removeItem, updateQuantity, proceedToOrder } = useCartViewModel()
const { t } = useI18n()

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}
</script>

<template>
  <v-navigation-drawer
    v-model="ui.cartDrawerOpen"
    temporary
    location="right"
    width="360"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-pink-200">
        <div class="flex items-center gap-2">
          <v-icon color="primary">mdi-cart-outline</v-icon>
          <span class="font-semibold text-base">{{ t('nav.cart') }}</span>
          <v-chip size="x-small" color="primary">{{ itemCount }}</v-chip>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="ui.cartDrawerOpen = false" />
      </div>

      <!-- Cart items -->
      <div class="flex-1 overflow-y-auto px-4 py-3">
        <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full gap-4 opacity-50">
          <v-icon size="64">mdi-cart-outline</v-icon>
          <p class="text-sm">{{ t('cart.empty') }}</p>
        </div>

        <div v-else class="flex flex-col gap-3">
          <v-card
            v-for="item in items"
            :key="item.id"
            variant="outlined"
            rounded="lg"
            class="pa-3"
          >
            <div class="flex gap-3">
              <!-- Product placeholder icon -->
              <div class="w-14 h-14 rounded-xl bg-surface-variant flex items-center justify-center flex-shrink-0">
                <v-icon size="28" color="primary">mdi-cup-outline</v-icon>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm leading-tight truncate">{{ item.product.name }}</p>
                <p class="text-xs opacity-60 mt-0.5">
                  {{ item.selectedSize.name }} · {{ item.selectedSweetness }}% đường · {{ item.selectedIce }}
                </p>
                <p v-if="item.selectedToppings.length" class="text-xs opacity-60">
                  + {{ item.selectedToppings.map(t => t.name).join(', ') }}
                </p>

                <div class="flex items-center justify-between mt-2">
                  <!-- Quantity control -->
                  <div class="flex items-center gap-1">
                    <v-btn
                      icon="mdi-minus"
                      variant="tonal"
                      size="x-small"
                      color="primary"
                      rounded="lg"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                    />
                    <span class="text-sm font-medium w-6 text-center">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      variant="tonal"
                      size="x-small"
                      color="primary"
                      rounded="lg"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                    />
                  </div>

                  <span class="text-sm font-semibold text-primary">
                    {{ formatPrice(item.unitPrice * item.quantity) }}
                  </span>
                </div>
              </div>

              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="x-small"
                color="error"
                class="self-start"
                @click="removeItem(item.id)"
              />
            </div>
          </v-card>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="items.length > 0" class="px-4 py-4 border-t border-pink-200">
        <div class="flex justify-between items-center mb-4">
          <span class="font-medium">{{ t('cart.subtotal') }}</span>
          <span class="text-lg font-bold text-primary">{{ formatPrice(subtotal) }}</span>
        </div>
        <v-btn
          color="primary"
          block
          rounded="lg"
          size="large"
          @click="proceedToOrder"
        >
          {{ t('cart.checkout') }}
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>
