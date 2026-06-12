<script setup lang="ts">
import type { Product } from '~/types'

const { featuredProducts, loadingFeatured } = useHomeViewModel()
const cartStore = useCartStore()
const popup = usePopup()
const router = useRouter()
const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useScrollReveal(sectionRef)

function quickAddToCart(product: Product) {
  // Quick add with default options (M size, 50% sugar, normal ice)
  const defaultSize = product.sizes[0]
  const defaultSweetness = product.sweetnessLevels.find(s => s === 50) ?? product.sweetnessLevels[0] ?? 50
  const defaultIce = product.iceLevels[1] ?? 'Bình thường'

  popup.confirm({
    title: t('product.quick_add_title'),
    message: t('product.quick_add_message', { name: product.name }),
    confirmText: t('product.add_to_cart'),
    cancelText: t('product.customize'),
    onConfirm: () => {
      cartStore.addItem({
        product,
        quantity: 1,
        selectedSize: defaultSize,
        selectedSweetness: defaultSweetness,
        selectedIce: defaultIce,
        selectedToppings: [],
      })
      popup.success(t('product.added_to_cart'))
    },
    onCancel: () => router.push(`/san-pham/${product.slug}`),
  })
}
</script>

<template>
  <section ref="sectionRef" class="py-16" :class="{ 'reveal is-visible': isVisible, reveal: !isVisible }">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-10">
        <p class="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          {{ t('home.featured_label') }}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold mb-3">
          {{ t('home.featured_title') }}
        </h2>
        <p class="opacity-60 max-w-md mx-auto">{{ t('home.featured_desc') }}</p>
      </div>

      <!-- Loading skeleton -->
      <v-row v-if="loadingFeatured">
        <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="3">
          <v-skeleton-loader type="card" rounded="xl" />
        </v-col>
      </v-row>

      <!-- Product grid -->
      <v-row v-else>
        <v-col
          v-for="product in featuredProducts"
          :key="product.id"
          cols="12"
          sm="6"
          md="3"
        >
          <ProductCard
            :product="product"
            @add-to-cart="quickAddToCart"
          />
        </v-col>
      </v-row>

      <!-- See all button -->
      <div class="text-center mt-10">
        <v-btn
          to="/thuc-don"
          variant="outlined"
          color="primary"
          size="large"
          rounded="xl"
        >
          {{ t('home.see_all_menu') }}
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>
