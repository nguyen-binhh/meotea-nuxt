import type { Product, Category } from '~/types'

export function useHomeViewModel() {
  const { t } = useI18n()
  const productRepo = useProductRepository()
  const categoryRepo = useCategoryRepository()

  const { data: _featuredProducts, pending: loadingFeatured } = productRepo.getFeaturedProducts()
  const { data: _categories, pending: loadingCategories } = categoryRepo.getCategories()

  const featuredProducts = computed((): Product[] => {
    const val = (_featuredProducts as Ref<unknown>).value
    return Array.isArray(val) ? (val as Product[]) : []
  })

  const categories = computed((): Category[] => {
    const val = (_categories as Ref<unknown>).value
    return Array.isArray(val) ? (val as Category[]) : []
  })

  const heroSlides = computed(() => [
    {
      title: t('home.hero1_title'),
      subtitle: t('home.hero1_subtitle'),
      description: t('home.hero1_desc'),
      cta: { text: t('home.hero1_cta'), to: '/thuc-don' },
      bgColor: '#FFF0F5',
      accentColor: '#F48FB1',
    },
    {
      title: t('home.hero2_title'),
      subtitle: t('home.hero2_subtitle'),
      description: t('home.hero2_desc'),
      cta: { text: t('home.hero2_cta'), to: '/san-pham/meo-tra-dac-biet' },
      bgColor: '#F8F0FF',
      accentColor: '#CE93D8',
    },
  ])

  const testimonials = computed(() => [
    { id: 1, name: t('home.review1_name'), avatar: '', rating: 5, comment: t('home.review1_comment') },
    { id: 2, name: t('home.review2_name'), avatar: '', rating: 5, comment: t('home.review2_comment') },
    { id: 3, name: t('home.review3_name'), avatar: '', rating: 4, comment: t('home.review3_comment') },
  ])

  return {
    featuredProducts,
    categories,
    loadingFeatured,
    loadingCategories,
    heroSlides,
    testimonials,
  }
}
