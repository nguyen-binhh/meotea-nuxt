// ─── Category ────────────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  color?: string
}

// ─── Product ─────────────────────────────────────────────────────
export interface ProductSize {
  id: string
  name: string
  priceModifier: number
}

export interface ProductTopping {
  id: number
  name: string
  price: number
}

export interface Product {
  id: number
  name: string
  slug: string
  categorySlug: string
  price: number
  image: string
  description: string
  rating: number
  reviews: number
  isBestseller?: boolean
  isNew?: boolean
  tags?: string[]
  sizes: ProductSize[]
  sweetnessLevels: number[]   // e.g. [0, 25, 50, 75, 100]
  iceLevels: string[]         // e.g. ['Không đá', 'Ít đá', 'Bình thường', 'Nhiều đá']
  toppings: ProductTopping[]
}

// ─── Cart ─────────────────────────────────────────────────────────
export interface CartItem {
  id: string              // unique cart item id
  product: Product
  quantity: number
  selectedSize: ProductSize
  selectedSweetness: number
  selectedIce: string
  selectedToppings: ProductTopping[]
  note?: string
  unitPrice: number       // computed: product.price + size modifier + toppings
}

// ─── Order ────────────────────────────────────────────────────────
export interface CustomerInfo {
  name: string
  phone: string
  address: string
  note?: string
}

export interface Order {
  id?: string
  items: CartItem[]
  customer: CustomerInfo
  paymentMethod: 'cash' | 'transfer' | 'momo'
  subtotal: number
  discount: number
  total: number
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'
  createdAt?: string
}

// ─── Popup ────────────────────────────────────────────────────────
export type PopupType = 'info' | 'success' | 'error' | 'warning' | 'confirm'

export interface PopupOptions {
  type?: PopupType
  title?: string
  message: string
  image?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  onClose?: () => void
}

// ─── Partner ──────────────────────────────────────────────────────
export interface Partner {
  id: number
  name: string
  logo: string
  description: string
  url?: string
}

// ─── Post ─────────────────────────────────────────────────────────
export interface Post {
  id: number
  title: string
  subtitle?: string
  content: string
  image?: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─── API Response ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}
