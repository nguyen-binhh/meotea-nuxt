import type { CartItem } from '~/types'

interface ApiCartItem {
  id: number
  product: any
  selectedSize: any
  selectedSweetness: number
  selectedIce: string
  selectedToppings: any[]
  note: string
  quantity: number
  unitPrice: number
}

function mapCartItem(item: ApiCartItem): CartItem {
  return {
    id: String(item.id),
    product: item.product,
    selectedSize: item.selectedSize,
    selectedSweetness: item.selectedSweetness,
    selectedIce: item.selectedIce,
    selectedToppings: item.selectedToppings ?? [],
    note: item.note ?? '',
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
  }
}

export function useCartRepository() {
  const api = useApiClient()

  async function getCart(): Promise<{ id: number; items: CartItem[] } | null> {
    const data = await api.get<{ id: number; items: ApiCartItem[] }>('/cart')
    if (!data) return null
    return { id: data.id, items: data.items.map(mapCartItem) }
  }

  async function addItem(payload: {
    productId: number
    sizeCode: string
    sweetness: number
    ice: string
    toppingIds: number[]
    quantity: number
    note?: string
  }): Promise<CartItem | null> {
    const data = await api.post<ApiCartItem>('/cart/items', payload)
    return data ? mapCartItem(data) : null
  }

  async function updateItem(itemId: string, quantity: number): Promise<CartItem | null> {
    const data = await api.patch<ApiCartItem>(`/cart/items/${itemId}`, { quantity })
    return data ? mapCartItem(data) : null
  }

  async function removeItem(itemId: string): Promise<void> {
    await api.del(`/cart/items/${itemId}`)
  }

  async function clearCart(): Promise<void> {
    await api.del('/cart')
  }

  return { getCart, addItem, updateItem, removeItem, clearCart }
}
