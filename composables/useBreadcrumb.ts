export interface BreadcrumbItem {
  title: string
  to?: string
  disabled?: boolean
}

// Maps URL path segments to i18n keys
const PATH_LABELS: Record<string, string> = {
  'thuc-don':   'nav.menu',
  'san-pham':   'nav.product_detail',
  'tin-tuc':    'post.news',
  'gio-hang':   'nav.cart',
  'dat-hang':   'nav.order',
  'thanh-toan': 'nav.checkout',
  'gioi-thieu': 'nav.about',
  'thuong-hieu':'nav.brand',
  'lich-su':    'nav.history',
  'doi-tac':    'nav.partners',
  'ho-so':      'profile.title',
  'dang-nhap':  'auth.login',
  'dang-ky':    'auth.register',
}

export function useBreadcrumb() {
  const route = useRoute()
  const { t } = useI18n()

  function buildBreadcrumbs(extra?: BreadcrumbItem[]): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [
      { title: t('nav.home'), to: '/' },
    ]

    const pathParts = route.path.split('/').filter(Boolean)

    pathParts.forEach((part, index) => {
      const path = '/' + pathParts.slice(0, index + 1).join('/')
      const labelKey = PATH_LABELS[part]
      const title = labelKey ? t(labelKey) : decodeURIComponent(part)

      crumbs.push({
        title,
        to: index < pathParts.length - 1 ? path : undefined,
        disabled: index === pathParts.length - 1,
      })
    })

    if (extra) crumbs.push(...extra)

    return crumbs
  }

  return { buildBreadcrumbs }
}
