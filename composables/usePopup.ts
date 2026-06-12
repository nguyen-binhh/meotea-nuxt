import type { PopupOptions } from '~/types'

export function usePopup() {
  const ui = useUIStore()

  function success(message: string, title?: string): Promise<void> {
    return new Promise(resolve => ui.showSuccess(message, title, resolve))
  }

  function error(message: string, title?: string): Promise<void> {
    return new Promise(resolve => ui.showError(message, title, resolve))
  }

  function info(message: string, title?: string): Promise<void> {
    return new Promise(resolve => ui.showInfo(message, title, resolve))
  }

  function warning(message: string, title?: string): Promise<void> {
    return new Promise(resolve => ui.showWarning(message, title, resolve))
  }

  return {
    open: (options: PopupOptions) => ui.openPopup(options),
    close: () => ui.closePopup(),
    success,
    error,
    info,
    warning,
    confirm: (options: Omit<PopupOptions, 'type'>) => ui.showConfirm(options),
  }
}
