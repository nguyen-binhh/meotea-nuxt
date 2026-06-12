<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { items, subtotal, removeItem, updateQuantity, clearCart, proceedToOrder } = useCartViewModel()

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}
</script>

<template>
  <div>
    <div class="bg-surface py-10">
      <v-container>
        <AppBreadcrumb />
        <h1 class="text-3xl font-bold">{{ t('nav.cart') }}</h1>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Empty cart -->
      <div v-if="items.length === 0" class="text-center py-20">
        <v-icon size="80" class="mb-4 opacity-30" color="primary">mdi-cart-outline</v-icon>
        <h2 class="text-xl font-semibold mb-2 opacity-60">{{ t('cart.empty') }}</h2>
        <v-btn to="/thuc-don" color="primary" rounded="xl" size="large" class="mt-4">
          {{ t('cart.start_shopping') }}
        </v-btn>
      </div>

      <v-row v-else>
        <!-- Cart items -->
        <v-col cols="12" md="8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-lg">{{ t('cart.items', { count: items.length }) }}</h2>
            <v-btn variant="text" color="error" size="small" @click="clearCart">
              <v-icon start size="16">mdi-delete-outline</v-icon>
              {{ t('cart.clear') }}
            </v-btn>
          </div>

          <div class="flex flex-col gap-4">
            <v-card
              v-for="item in items"
              :key="item.id"
              rounded="xl"
              :elevation="0"
              class="border border-pink-100 pa-4"
            >
              <div class="flex gap-4 items-start">
                <div class="w-20 h-20 rounded-xl bg-surface-variant flex items-center justify-center flex-shrink-0">
                  <v-icon size="36" color="primary">mdi-cup-outline</v-icon>
                </div>

                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold">{{ item.product.name }}</h3>
                      <p class="text-sm opacity-60 mt-0.5">
                        {{ item.selectedSize.name }} · {{ item.selectedSweetness }}% {{ t('product.sugar_unit') }} · {{ item.selectedIce }}
                      </p>
                      <p v-if="item.selectedToppings.length" class="text-sm opacity-60">
                        {{ t('product.toppings_label') }}: {{ item.selectedToppings.map(tp => tp.name).join(', ') }}
                      </p>
                      <p v-if="item.note" class="text-sm opacity-60">
                        {{ t('product.note_label') }}: {{ item.note }}
                      </p>
                    </div>
                    <v-btn icon="mdi-delete-outline" variant="text" color="error" size="small" @click="removeItem(item.id)" />
                  </div>

                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      <v-btn icon="mdi-minus" variant="tonal" color="primary" size="x-small" rounded="lg"
                             @click="updateQuantity(item.id, item.quantity - 1)" />
                      <span class="font-medium w-6 text-center">{{ item.quantity }}</span>
                      <v-btn icon="mdi-plus" variant="tonal" color="primary" size="x-small" rounded="lg"
                             @click="updateQuantity(item.id, item.quantity + 1)" />
                    </div>
                    <span class="font-bold text-primary">{{ formatPrice(item.unitPrice * item.quantity) }}</span>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>

        <!-- Order summary -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" :elevation="0" class="border border-pink-200 pa-6 sticky top-24">
            <h3 class="font-bold text-lg mb-4">{{ t('cart.summary') }}</h3>

            <div class="flex justify-between mb-2 text-sm">
              <span class="opacity-70">{{ t('cart.subtotal') }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between mb-4 text-sm">
              <span class="opacity-70">{{ t('cart.shipping') }}</span>
              <span class="text-success font-medium">{{ t('cart.free') }}</span>
            </div>

            <v-divider class="mb-4" />

            <div class="flex justify-between font-bold text-lg mb-5">
              <span>{{ t('cart.total') }}</span>
              <span class="text-primary">{{ formatPrice(subtotal) }}</span>
            </div>

            <v-btn color="primary" block size="large" rounded="xl" @click="proceedToOrder">
              {{ t('cart.checkout') }}
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn to="/thuc-don" variant="text" color="primary" block class="mt-2">
              {{ t('cart.continue_shopping') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
