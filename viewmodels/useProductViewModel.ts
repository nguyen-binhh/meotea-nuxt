import type { Product, Category, ProductSize, ProductTopping } from '~/types'
import type { ProductQueryParams } from '~/repositories/productRepository'

export function useProductListViewModel() {
  const productRepo = useProductRepository()
  const categoryRepo = useCategoryRepository()

  const page = ref(1)
  const limit = ref(8)
  const activeCategory = ref<string>('all')
  const searchQuery = ref('')

  const params = computed<ProductQueryParams>(() => ({
    page: page.value,
    limit: limit.value,
    ...(activeCategory.value !== 'all' ? { categorySlug: activeCategory.value } : {}),
    ...(searchQuery.value.trim() ? { search: searchQuery.value.trim() } : {}),
  }))

  const { data, pending: loading } = productRepo.getProducts(params)
  const { data: categories } = categoryRepo.getCategories()

  const products = computed<Product[]>(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const totalItems = computed(() => data.value?.meta?.total ?? 0)

  function selectCategory(slug: string) {
    activeCategory.value = slug
    page.value = 1
  }

  watch(searchQuery, () => { page.value = 1 })

  return {
    products,
    categories: categories as Ref<Category[]>,
    loading,
    activeCategory,
    searchQuery,
    page,
    limit,
    totalPages,
    totalItems,
    selectCategory,
  }
}

export function useProductDetailViewModel(slug: string) {
  const productRepo = useProductRepository()
  const cartStore = useCartStore()
  const popup = usePopup()
  const { t } = useI18n()

  const { data: product, pending: loading } = productRepo.getProductBySlug(slug)

  const selectedSize = ref<ProductSize | null>(null)
  const selectedSweetness = ref<number>(50)
  const selectedIce = ref<string>('Bình thường')
  const selectedToppings = ref<ProductTopping[]>([])
  const quantity = ref(1)
  const note = ref('')

  watch(product, (p) => {
    if (p) {
      selectedSize.value = p.sizes[0] ?? null
      selectedSweetness.value = p.sweetnessLevels.includes(50) ? 50 : p.sweetnessLevels[0] ?? 50
      selectedIce.value = p.iceLevels[1] ?? 'Bình thường'
    }
  }, { immediate: true })

  const unitPrice = computed(() => {
    if (!product.value || !selectedSize.value) return 0
    return (
      product.value.price +
      selectedSize.value.priceModifier +
      selectedToppings.value.reduce((sum, t) => sum + t.price, 0)
    )
  })

  function toggleTopping(topping: ProductTopping) {
    const idx = selectedToppings.value.findIndex(t => t.id === topping.id)
    if (idx >= 0) {
      selectedToppings.value.splice(idx, 1)
    } else {
      selectedToppings.value.push(topping)
    }
  }

  async function addToCart() {
    if (!product.value || !selectedSize.value) return

    const ok = await cartStore.addItem({
      product: product.value,
      quantity: quantity.value,
      selectedSize: selectedSize.value,
      selectedSweetness: selectedSweetness.value,
      selectedIce: selectedIce.value,
      selectedToppings: selectedToppings.value,
      note: note.value,
    })

    if (ok) popup.success(t('product.added_to_cart'))
  }

  return {
    product: product as Ref<Product | null>,
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
  }
}
