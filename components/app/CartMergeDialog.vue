<script setup lang="ts">
import type { CartItem } from '~/types'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const cartStore = useCartStore()
const { t } = useI18n()
const loading = ref(false)

// Local editable copy — not touching guestItems until confirmed
const pendingItems = ref<CartItem[]>([])

watch(() => props.modelValue, (open) => {
  if (open) {
    pendingItems.value = cartStore.guestItems.map(i => ({ ...i }))
  }
})

const pendingSubtotal = computed(() =>
  pendingItems.value.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
)

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

function updateQty(id: string, delta: number) {
  const item = pendingItems.value.find(i => i.id === id)
  if (!item) return
  const next = item.quantity + delta
  if (next <= 0) {
    pendingItems.value = pendingItems.value.filter(i => i.id !== id)
  } else {
    item.quantity = next
  }
}

function removeItem(id: string) {
  pendingItems.value = pendingItems.value.filter(i => i.id !== id)
}

async function onConfirm() {
  loading.value = true
  try {
    await cartStore.mergeGuestCart(pendingItems.value)
  } finally {
    loading.value = false
    emit('update:modelValue', false)
  }
}

function onDecline() {
  cartStore.discardGuestCart()
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    persistent
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="2xl" class="overflow-hidden">
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b border-pink-100">
        <div class="flex items-center gap-3 mb-1">
          <v-icon color="primary" size="28">mdi-cart-arrow-down</v-icon>
          <span class="font-bold text-lg">{{ t('cart.merge_title') }}</span>
        </div>
        <p class="text-sm opacity-60 ml-10">{{ t('cart.merge_subtitle') }}</p>
      </div>

      <!-- Items list -->
      <v-card-text class="px-6 py-4" style="max-height: 380px">
        <div v-if="pendingItems.length === 0" class="text-center py-8 opacity-40">
          <v-icon size="48" class="mb-2">mdi-cart-off</v-icon>
          <p class="text-sm">{{ t('cart.merge_empty') }}</p>
        </div>

        <div v-else class="flex flex-col gap-3">
          <v-card
            v-for="item in pendingItems"
            :key="item.id"
            variant="outlined"
            rounded="lg"
            class="pa-3"
          >
            <div class="flex gap-3 items-start">
              <!-- Icon -->
              <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                <v-icon size="24" color="primary">mdi-cup-outline</v-icon>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm leading-tight">{{ item.product.name }}</p>
                <p class="text-xs opacity-55 mt-0.5">
                  {{ item.selectedSize.name }} · {{ item.selectedSweetness }}% {{ t('product.sugar_unit') }} · {{ item.selectedIce }}
                </p>
                <p v-if="item.selectedToppings.length" class="text-xs opacity-55">
                  + {{ item.selectedToppings.map(tp => tp.name).join(', ') }}
                </p>

                <div class="flex items-center justify-between mt-2">
                  <!-- Quantity control -->
                  <div class="flex items-center gap-1.5">
                    <v-btn
                      icon="mdi-minus"
                      variant="tonal"
                      size="x-small"
                      color="primary"
                      rounded="lg"
                      @click="updateQty(item.id, -1)"
                    />
                    <span class="text-sm font-semibold w-5 text-center">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      variant="tonal"
                      size="x-small"
                      color="primary"
                      rounded="lg"
                      @click="updateQty(item.id, 1)"
                    />
                  </div>
                  <span class="text-sm font-semibold text-primary">
                    {{ formatPrice(item.unitPrice * item.quantity) }}
                  </span>
                </div>
              </div>

              <!-- Remove -->
              <v-btn
                icon="mdi-close"
                variant="text"
                size="x-small"
                color="error"
                class="flex-shrink-0"
                @click="removeItem(item.id)"
              />
            </div>
          </v-card>
        </div>
      </v-card-text>

      <!-- Subtotal -->
      <div v-if="pendingItems.length > 0" class="px-6 py-3 bg-surface border-t border-pink-100">
        <div class="flex justify-between items-center">
          <span class="text-sm opacity-60">{{ t('cart.subtotal') }}</span>
          <span class="font-bold text-primary">{{ formatPrice(pendingSubtotal) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <v-card-actions class="px-6 py-4 gap-3">
        <v-btn
          variant="outlined"
          color="error"
          rounded="xl"
          class="flex-1"
          :disabled="loading"
          @click="onDecline"
        >
          {{ t('cart.merge_decline') }}
        </v-btn>
        <v-btn
          color="primary"
          rounded="xl"
          class="flex-1"
          :loading="loading"
          :disabled="pendingItems.length === 0"
          @click="onConfirm"
        >
          <v-icon start size="18">mdi-cart-check</v-icon>
          {{ t('cart.merge_confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
