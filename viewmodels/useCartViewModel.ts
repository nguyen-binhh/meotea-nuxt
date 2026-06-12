import type { CustomerInfo } from '~/types'

export function useCartViewModel() {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const popup = usePopup()
  const router = useRouter()
  const { t } = useI18n()

  const { items, itemCount, subtotal } = storeToRefs(cartStore)

  function removeItem(id: string) {
    popup.confirm({
      title: t('cart.remove_title'),
      message: t('cart.remove_message'),
      confirmText: t('common.remove'),
      cancelText: t('common.cancel'),
      onConfirm: async () => {
        await cartStore.removeItem(id)
        popup.success(t('cart.item_removed'))
      },
    })
  }

  function clearCart() {
    popup.confirm({
      title: t('cart.clear_title'),
      message: t('cart.clear_message'),
      confirmText: t('common.clear'),
      cancelText: t('common.cancel'),
      onConfirm: async () => {
        await cartStore.clearCart()
        popup.success(t('cart.cleared'))
      },
    })
  }

  function proceedToOrder() {
    if (cartStore.items.length === 0) {
      popup.info(t('cart.empty_message'))
      return
    }
    if (!authStore.isLoggedIn) {
      router.push('/dang-nhap')
      return
    }
    router.push('/dat-hang')
  }

  return {
    items,
    itemCount,
    subtotal,
    removeItem,
    clearCart,
    updateQuantity: cartStore.updateQuantity,
    proceedToOrder,
  }
}

export function useOrderViewModel() {
  const cartStore = useCartStore()
  const orderRepo = useOrderRepository()
  const authStore = useAuthStore()
  const popup = usePopup()
  const router = useRouter()
  const { t } = useI18n()

  const loading = ref(false)


  const customer = reactive<CustomerInfo>({
    name: authStore.user?.name ?? '',
    phone: authStore.user?.phone ?? '',
    address: '',
    note: '',
  })

  const paymentMethod = ref<'cash' | 'transfer' | 'momo'>('cash')

  const discount = ref(0)

  const { items, subtotal } = storeToRefs(cartStore)

  const total = computed(() => subtotal.value - discount.value)

  async function placeOrder() {
    if (!authStore.isLoggedIn) {
      await router.push('/dang-nhap')
      return
    }
    if (cartStore.items.length === 0) {
      popup.error(t('order.empty_cart'))
      return
    }

    popup.confirm({
      title: t('order.confirm_title'),
      message: t('order.confirm_message'),
      confirmText: t('order.place_order'),
      cancelText: t('common.cancel'),
      onConfirm: async () => {
        loading.value = true
        const order = await orderRepo.createOrder({
          items: cartStore.items,
          customer,
          paymentMethod: paymentMethod.value,
          subtotal: cartStore.subtotal,
          discount: discount.value,
          total: total.value,
        })
        loading.value = false

        if (order) {
          await cartStore.clearCart()
          await popup.success(t('order.success', { id: order.id }), t('order.success_title'))
          await router.push('/')
        } else {
          popup.error(t('order.error'))
        }
      },
    })
  }

  return {
    customer,
    paymentMethod,
    discount,
    total,
    loading,
    placeOrder,
    items,
    subtotal,
  }
}
