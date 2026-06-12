<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const {
  product,
  loading,
  selectedSize,
  selectedSweetness,
  selectedIce,
  selectedToppings,
  quantity,
  note,
  unitPrice,
  toggleTopping,
  addToCart,
} = useProductDetailViewModel(slug.value)

const { t } = useI18n()

// Dynamic SEO
useSeoMeta({
  title: () => product.value ? `${product.value.name} – Mèo Trà` : 'Sản phẩm – Mèo Trà',
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.name ?? '',
  ogDescription: () => product.value?.description ?? '',
})

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

const sweetnessLabel = computed(() => `${selectedSweetness.value}%`)
</script>

<template>
  <div>
    <!-- Loading state -->
    <v-container v-if="loading" class="py-10">
      <AppBreadcrumb />
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-skeleton-loader type="image" rounded="xl" height="320" />
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="article" />
        </v-col>
      </v-row>
    </v-container>

    <!-- Not found -->
    <v-container v-else-if="!product" class="py-20 text-center">
      <v-icon size="64" class="mb-4 opacity-30">mdi-cup-off-outline</v-icon>
      <h2 class="text-xl font-semibold mb-2">{{ t('product.not_found') }}</h2>
      <v-btn to="/thuc-don" color="primary" rounded="lg" class="mt-4">
        {{ t('product.back_to_menu') }}
      </v-btn>
    </v-container>

    <!-- Product detail -->
    <template v-else>
      <v-container class="py-6">
        <AppBreadcrumb
          :items="[
            { title: t('nav.home'), to: '/' },
            { title: t('nav.menu'), to: '/thuc-don' },
            { title: product.name, disabled: true },
          ]"
        />

        <v-row class="mt-2" align="start">
          <!-- Product image -->
          <v-col cols="12" md="5">
            <v-card
              rounded="xl"
              :elevation="0"
              class="flex items-center justify-center"
              style="background: #FCE4EC; min-height: 320px;"
            >
              <svg width="180" height="220" viewBox="0 0 180 220" fill="none">
                <line x1="90" y1="20" x2="90" y2="45" stroke="#F48FB1" stroke-width="4" stroke-linecap="round"/>
                <path d="M40,50 Q38,46 42,46 L138,46 Q142,46 140,50 L130,160 Q128,166 90,166 Q52,166 50,160 Z"
                      stroke="#F48FB1" stroke-width="3" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="38" y1="68" x2="142" y2="68" stroke="#F48FB1" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="70" cy="138" r="12" stroke="#F48FB1" stroke-width="2.5" fill="#FCE4EC"/>
                <circle cx="90" cy="148" r="12" stroke="#F48FB1" stroke-width="2.5" fill="#FCE4EC"/>
                <circle cx="110" cy="138" r="12" stroke="#F48FB1" stroke-width="2.5" fill="#FCE4EC"/>
              </svg>
            </v-card>

            <!-- Badges -->
            <div class="flex gap-2 mt-3">
              <v-chip v-if="product.isBestseller" color="primary" size="small">🔥 {{ t('product.bestseller') }}</v-chip>
              <v-chip v-if="product.isNew" color="secondary" size="small">✨ {{ t('product.new_badge') }}</v-chip>
            </div>
          </v-col>

          <!-- Product info & options -->
          <v-col cols="12" md="7">
            <div class="flex items-center gap-1 mb-1">
              <v-icon size="14" color="warning">mdi-star</v-icon>
              <span class="text-sm font-medium">{{ product.rating }}</span>
              <span class="text-sm opacity-50">({{ product.reviews }} {{ t('product.reviews') }})</span>
            </div>

            <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ product.name }}</h1>
            <p class="text-body-2 opacity-70 leading-relaxed mb-4">{{ product.description }}</p>

            <!-- Size -->
            <p class="font-semibold text-sm mb-2">{{ t('product.size') }}</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <v-btn
                v-for="size in product.sizes"
                :key="size.id"
                :variant="selectedSize?.id === size.id ? 'elevated' : 'outlined'"
                :color="selectedSize?.id === size.id ? 'primary' : undefined"
                rounded="lg"
                size="small"
                @click="selectedSize = size"
              >
                {{ size.name }}
                <span v-if="size.priceModifier > 0" class="ml-1 opacity-70">
                  +{{ formatPrice(size.priceModifier) }}
                </span>
              </v-btn>
            </div>

            <!-- Sweetness -->
            <p class="font-semibold text-sm mb-2">
              {{ t('product.sweetness') }}: <span class="text-primary">{{ sweetnessLabel }}</span>
            </p>
            <div class="flex flex-wrap gap-2 mb-5">
              <v-btn
                v-for="level in product.sweetnessLevels"
                :key="level"
                :variant="selectedSweetness === level ? 'elevated' : 'outlined'"
                :color="selectedSweetness === level ? 'primary' : undefined"
                rounded="lg"
                size="small"
                @click="selectedSweetness = level"
              >
                {{ level }}%
              </v-btn>
            </div>

            <!-- Ice -->
            <p class="font-semibold text-sm mb-2">{{ t('product.ice') }}</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <v-btn
                v-for="ice in product.iceLevels"
                :key="ice"
                :variant="selectedIce === ice ? 'elevated' : 'outlined'"
                :color="selectedIce === ice ? 'primary' : undefined"
                rounded="lg"
                size="small"
                @click="selectedIce = ice"
              >
                {{ ice }}
              </v-btn>
            </div>

            <!-- Toppings -->
            <p class="font-semibold text-sm mb-2">{{ t('product.toppings') }}</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <v-chip
                v-for="topping in product.toppings"
                :key="topping.id"
                :color="selectedToppings.some(tp => tp.id === topping.id) ? 'primary' : undefined"
                :variant="selectedToppings.some(tp => tp.id === topping.id) ? 'elevated' : 'outlined'"
                rounded="lg"
                class="cursor-pointer"
                @click="toggleTopping(topping)"
              >
                {{ topping.name }}
                <span class="ml-1 opacity-70">+{{ formatPrice(topping.price) }}</span>
              </v-chip>
            </div>

            <!-- Note -->
            <v-text-field
              v-model="note"
              :label="t('product.note')"
              variant="outlined"
              density="compact"
              rounded="lg"
              prepend-inner-icon="mdi-note-text-outline"
              hide-details
              class="mb-5"
            />

            <!-- Quantity + Price + Add to cart -->
            <v-card variant="tonal" color="surface-variant" rounded="xl" class="pa-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <v-btn
                    icon="mdi-minus"
                    variant="tonal"
                    color="primary"
                    size="small"
                    rounded="lg"
                    :disabled="quantity <= 1"
                    @click="quantity--"
                  />
                  <span class="text-lg w-8 text-center text-black">{{ quantity }}</span>
                  <v-btn
                    icon="mdi-plus"
                    variant="tonal"
                    color="primary"
                    size="small"
                    rounded="lg"
                    @click="quantity++"
                  />
                </div>
                <div class="text-right">
                  <p class="text-xs opacity-60">{{ t('product.total') }}</p>
                  <p class="text-xl font-bold text-primary">{{ formatPrice(unitPrice * quantity) }}</p>
                </div>
              </div>

              <v-btn
                color="primary"
                block
                size="large"
                rounded="xl"
                @click="addToCart"
              >
                <v-icon start>mdi-cart-plus</v-icon>
                {{ t('product.add_to_cart') }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>
