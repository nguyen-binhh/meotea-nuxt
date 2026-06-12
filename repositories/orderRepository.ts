import type { Order } from '~/types'

export function useOrderRepository() {
  const { post, isMock } = useApiClient()

  async function createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order | null> {
    if (isMock) {
      await new Promise(r => setTimeout(r, 800))
      return {
        ...order,
        id: `MT-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    }

    const dto = {
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      customerAddress: order.customer.address,
      customerNote: order.customer.note,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      items: order.items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        selectedSizeCode: item.selectedSize.id,
        selectedSizeName: item.selectedSize.name,
        selectedSweetness: item.selectedSweetness,
        selectedIce: item.selectedIce,
        selectedToppings: item.selectedToppings,
        note: item.note,
      })),
    }

    const result = await post<{ id: string; status: string; createdAt: string }>('/orders', dto)
    if (!result) return null

    return {
      ...order,
      id: result.id,
      status: result.status as Order['status'],
      createdAt: result.createdAt,
    }
  }

  return { createOrder }
}
