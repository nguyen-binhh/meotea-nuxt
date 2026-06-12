import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { CartItem, Product, ProductSize, ProductTopping } from '~/types'

type AddItemPayload = {
  product: Product
  quantity: number
  selectedSize: ProductSize
  selectedSweetness: number
  selectedIce: string
  selectedToppings: ProductTopping[]
  note?: string
}

function calcUnitPrice(product: Product, size: ProductSize, toppings: ProductTopping[]) {
  return product.price + size.priceModifier + toppings.reduce((s, t) => s + t.price, 0)
}

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()

  // ─── Guest cart (localStorage, unauthenticated) ─────────────────
  const guestItems = useLocalStorage<CartItem[]>('meotea_cart_guest', [])

  // ─── Server cart (authenticated) ────────────────────────────────
  const serverItems = ref<CartItem[]>([])
  const loading = ref(false)

  // ─── Active items — switches by auth state ───────────────────────
  const items = computed<CartItem[]>(() =>
    authStore.isLoggedIn ? serverItems.value : guestItems.value,
  )

  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.unitPrice * i.quantity, 0))

  // ─── Fetch server cart (no auto-merge) ───────────────────────────
  async function fetchCart() {
    if (!authStore.isLoggedIn) return
    loading.value = true
    try {
      const repo = useCartRepository()
      const cart = await repo.getCart()
      serverItems.value = cart?.items ?? []
    } finally {
      loading.value = false
    }
  }

  // ─── Merge confirmed guest items into server cart ────────────────
  async function mergeGuestCart(confirmedItems: CartItem[]) {
    const repo = useCartRepository()
    loading.value = true
    try {
      await Promise.all(
        confirmedItems.map(item =>
          repo.addItem({
            productId: item.product.id,
            sizeCode: item.selectedSize.id,
            sweetness: item.selectedSweetness,
            ice: item.selectedIce,
            toppingIds: item.selectedToppings.map(t => t.id as number),
            quantity: item.quantity,
            note: item.note,
          }),
        ),
      )
      guestItems.value = []
      const cart = await repo.getCart()
      serverItems.value = cart?.items ?? []
    } finally {
      loading.value = false
    }
  }

  // ─── Discard guest cart without merging ──────────────────────────
  function discardGuestCart() {
    guestItems.value = []
  }

  // ─── Add item ────────────────────────────────────────────────────
  async function addItem(payload: AddItemPayload): Promise<boolean> {
    if (!authStore.isLoggedIn) {
      _addToGuest(payload)
      return true
    }

    const repo = useCartRepository()
    const result = await repo.addItem({
      productId: payload.product.id,
      sizeCode: payload.selectedSize.id,
      sweetness: payload.selectedSweetness,
      ice: payload.selectedIce,
      toppingIds: payload.selectedToppings.map(t => t.id as number),
      quantity: payload.quantity,
      note: payload.note,
    })

    if (result) {
      const existing = serverItems.value.find(i => i.id === result.id)
      if (existing) {
        existing.quantity = result.quantity
      } else {
        serverItems.value.push(result)
      }
      return true
    }
    return false
  }

  function _addToGuest(payload: AddItemPayload) {
    const unitPrice = calcUnitPrice(payload.product, payload.selectedSize, payload.selectedToppings)
    const sortedIds = payload.selectedToppings.map(t => t.id).sort()

    const existing = guestItems.value.find(
      i =>
        i.product.id === payload.product.id &&
        i.selectedSize.id === payload.selectedSize.id &&
        i.selectedSweetness === payload.selectedSweetness &&
        i.selectedIce === payload.selectedIce &&
        JSON.stringify(i.selectedToppings.map(t => t.id).sort()) === JSON.stringify(sortedIds),
    )

    if (existing) {
      existing.quantity += payload.quantity
    } else {
      guestItems.value.push({
        id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        product: payload.product,
        quantity: payload.quantity,
        selectedSize: payload.selectedSize,
        selectedSweetness: payload.selectedSweetness,
        selectedIce: payload.selectedIce,
        selectedToppings: payload.selectedToppings,
        note: payload.note,
        unitPrice,
      })
    }
  }

  // ─── Update quantity ─────────────────────────────────────────────
  async function updateQuantity(cartItemId: string, quantity: number) {
    if (!authStore.isLoggedIn) {
      if (quantity <= 0) {
        guestItems.value = guestItems.value.filter(i => i.id !== cartItemId)
      } else {
        const item = guestItems.value.find(i => i.id === cartItemId)
        if (item) item.quantity = quantity
      }
      return
    }

    if (quantity <= 0) return removeItem(cartItemId)
    const repo = useCartRepository()
    await repo.updateItem(cartItemId, quantity)
    const item = serverItems.value.find(i => i.id === cartItemId)
    if (item) item.quantity = quantity
  }

  // ─── Remove item ─────────────────────────────────────────────────
  async function removeItem(cartItemId: string) {
    if (!authStore.isLoggedIn) {
      guestItems.value = guestItems.value.filter(i => i.id !== cartItemId)
      return
    }
    const repo = useCartRepository()
    await repo.removeItem(cartItemId)
    serverItems.value = serverItems.value.filter(i => i.id !== cartItemId)
  }

  // ─── Clear cart ──────────────────────────────────────────────────
  async function clearCart() {
    if (!authStore.isLoggedIn) {
      guestItems.value = []
      return
    }
    const repo = useCartRepository()
    await repo.clearCart()
    serverItems.value = []
  }

  return {
    items,
    guestItems,
    loading,
    itemCount,
    subtotal,
    fetchCart,
    mergeGuestCart,
    discardGuestCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
})
