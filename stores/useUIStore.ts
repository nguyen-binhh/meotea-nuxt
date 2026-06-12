import { defineStore } from 'pinia'
import type { PopupOptions, PopupType } from '~/types'

interface UIState {
  popup: {
    show: boolean
    type: PopupType
    title: string
    message: string
    image?: string
    confirmText: string
    cancelText: string
    showCancel: boolean
    loading: boolean
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
    onClose?: () => void
  }
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    popup: {
      show: false,
      type: 'info',
      title: '',
      message: '',
      image: undefined,
      confirmText: 'Xác nhận',
      cancelText: 'Hủy',
      showCancel: false,
      loading: false,
      onConfirm: undefined,
      onCancel: undefined,
    },
    cartDrawerOpen: false,
    mobileMenuOpen: false,
  }),

  actions: {
    openPopup(options: PopupOptions) {
      this.popup = {
        show: true,
        type: options.type ?? 'info',
        title: options.title ?? '',
        message: options.message,
        image: options.image,
        confirmText: options.confirmText ?? 'Xác nhận',
        cancelText: options.cancelText ?? 'Hủy',
        showCancel: options.showCancel ?? options.type === 'confirm',
        loading: false,
        onConfirm: options.onConfirm,
        onCancel: options.onCancel,
        onClose: options.onClose,
      }
    },

    closePopup() {
      this.popup.show = false
      this.popup.loading = false
      if (this.popup.type !== 'confirm') {
        const cb = this.popup.onClose
        this.popup.onClose = undefined
        cb?.()
      }
    },

    async confirmPopup() {
      if (this.popup.onConfirm) {
        this.popup.loading = true
        try {
          await this.popup.onConfirm()
        } finally {
          if (this.popup.type === 'confirm') {
            this.closePopup()
          } else {
            this.popup.loading = false
          }
        }
      } else {
        this.closePopup()
      }
    },

    cancelPopup() {
      this.popup.onCancel?.()
      this.closePopup()
    },

    // Convenience shortcuts
    showSuccess(message: string, title?: string, onClose?: () => void) {
      this.openPopup({ type: 'success', title: title ?? 'Thành công', message, onClose })
    },

    showError(message: string, title?: string, onClose?: () => void) {
      this.openPopup({ type: 'error', title: title ?? 'Lỗi', message, onClose })
    },

    showInfo(message: string, title?: string, onClose?: () => void) {
      this.openPopup({ type: 'info', title: title ?? 'Thông báo', message, onClose })
    },

    showWarning(message: string, title?: string, onClose?: () => void) {
      this.openPopup({ type: 'warning', title: title ?? 'Cảnh báo', message, onClose })
    },

    showConfirm(options: Omit<PopupOptions, 'type'>) {
      this.openPopup({ ...options, type: 'confirm', showCancel: true })
    },

    toggleCart() {
      this.cartDrawerOpen = !this.cartDrawerOpen
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
  },
})
