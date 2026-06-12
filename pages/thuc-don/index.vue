<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const popup = usePopup()

const {
  products,
  categories,
  loading,
  activeCategory,
  searchQuery,
  page,
  totalPages,
  selectCategory,
} = useProductListViewModel()

onMounted(() => {
  const cat = route.query.category as string | undefined
  if (cat) selectCategory(cat)
})

function handleSelectCategory(slug: string) {
  selectCategory(slug)
  router.replace({ query: slug !== 'all' ? { category: slug } : {} })
}

function quickAddToCart(product: Product) {
  const defaultSize = product.sizes[0]
  const defaultSweetness = product.sweetnessLevels.find(s => s === 50) ?? product.sweetnessLevels[0] ?? 50
  const defaultIce = product.iceLevels[1] ?? 'Bình thường'

  popup.confirm({
    title: t('product.quick_add_title'),
    message: t('product.quick_add_message', { name: product.name }),
    confirmText: t('product.add_to_cart'),
    cancelText: t('product.customize'),
    onConfirm: async () => {
      const ok = await cartStore.addItem({
        product,
        quantity: 1,
        selectedSize: defaultSize,
        selectedSweetness: defaultSweetness,
        selectedIce: defaultIce,
        selectedToppings: [],
      })
      if (ok) popup.success(t('product.added_to_cart'))
    },
    onCancel: () => router.push(`/san-pham/${product.slug}`),
  })
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="bg-surface py-10">
      <v-container>
        <AppBreadcrumb />
        <h1 class="text-3xl font-bold mb-2">{{ t('nav.menu') }}</h1>
        <p class="opacity-60">{{ t('product.menu_subtitle') }}</p>
      </v-container>
    </div>

    <v-container class="py-8">
      <ProductFilter
        :categories="categories ?? []"
        :active-category="activeCategory"
        :search-query="searchQuery"
        @update:active-category="handleSelectCategory"
        @update:search-query="searchQuery = $event"
      />

      <!-- Loading -->
      <v-row v-if="loading">
        <v-col v-for="i in 12" :key="i" cols="12" sm="6" md="3">
          <v-skeleton-loader type="card" rounded="xl" />
        </v-col>
      </v-row>

      <!-- Empty state -->
      <div
        v-else-if="products.length === 0"
        class="text-center py-20 opacity-50"
      >
        <v-icon size="64" class="mb-4">mdi-cup-off-outline</v-icon>
        <p>{{ t('product.no_products') }}</p>
      </div>

      <!-- Products grid -->
      <template v-else>
        <v-row>
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ProductCard :product="product" @add-to-cart="quickAddToCart" />
          </v-col>
        </v-row>

        <div class="d-flex justify-center mt-8">
          <v-pagination
            v-if="totalPages > 1"
            v-model="page"
            :length="totalPages"
            :total-visible="7"
            rounded="lg"
            active-color="primary"
          />
        </div>
      </template>
    </v-container>
  </div>
</template>
