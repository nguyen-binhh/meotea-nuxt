<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ 'add-to-cart': [product: Product] }>()
const { t } = useI18n()

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

// Category color map for the placeholder icon background
const categoryColors: Record<string, string> = {
  'tra-sua':     '#FCE4EC',
  'tra-trai-cay':'#F3E5F5',
  'ca-phe':      '#EFEBE9',
  'dac-biet':    '#EDE7F6',
}
const bgColor = computed(() => categoryColors[props.product.categorySlug] ?? '#FCE4EC')
</script>

<template>
  <v-card
    rounded="xl"
    :elevation="0"
    class="card-hover border border-pink-100 overflow-hidden"
    :to="`/san-pham/${product.slug}`"
  >
    <!-- Product image / placeholder -->
    <div
      class="relative flex items-center justify-center"
      :style="{ background: bgColor, height: '180px' }"
    >
      <!-- Simple SVG boba cup placeholder -->
      <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="10" x2="40" y2="22" stroke="#F48FB1" stroke-width="3" stroke-linecap="round"/>
        <path d="M20,24 Q20,22 22,22 L58,22 Q60,22 60,24 L56,72 Q56,74 40,74 Q24,74 24,72 Z"
              stroke="#F48FB1" stroke-width="2.5" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="19" y1="34" x2="61" y2="34" stroke="#F48FB1" stroke-width="2" stroke-linecap="round"/>
        <circle cx="33" cy="58" r="5" stroke="#F48FB1" stroke-width="2" fill="#FCE4EC"/>
        <circle cx="40" cy="62" r="5" stroke="#F48FB1" stroke-width="2" fill="#FCE4EC"/>
        <circle cx="47" cy="58" r="5" stroke="#F48FB1" stroke-width="2" fill="#FCE4EC"/>
      </svg>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-1.5">
        <v-chip v-if="product.isBestseller" size="x-small" color="primary" rounded="lg">
          {{ t('product.bestseller') }}
        </v-chip>
        <v-chip v-if="product.isNew" size="x-small" color="secondary" rounded="lg">
          {{ t('product.new_badge') }}
        </v-chip>
      </div>
    </div>

    <v-card-text class="px-4 pt-3 pb-4">
      <h3 class="font-semibold text-sm leading-tight line-clamp-2 mb-1.5">
        {{ product.name }}
      </h3>

      <div class="flex items-center gap-1 mb-3">
        <v-icon size="12" color="warning">mdi-star</v-icon>
        <span class="text-xs font-medium">{{ product.rating }}</span>
        <span class="text-xs opacity-50">({{ product.reviews }})</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="font-bold text-base text-primary">{{ formatPrice(product.price) }}</span>
        <v-btn
          icon="mdi-plus"
          color="primary"
          variant="tonal"
          size="small"
          rounded="lg"
          @click.prevent="emit('add-to-cart', product)"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
