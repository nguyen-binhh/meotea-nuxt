// ─── Cache Configuration ──────────────────────────────────────────
// Controls which API endpoints use useFetch caching.
// Set enabled: false to always fetch fresh data.
// ttl is in seconds (used as a hint; Nuxt useFetch uses key-based caching).

export interface CacheEntry {
  key: string
  ttl?: number  // seconds; undefined = session lifetime
  enabled: boolean
}

export const cacheConfig: Record<string, CacheEntry> = {
  '/products':          { key: 'products-list',       ttl: 300,   enabled: true },
  '/products/:slug':    { key: 'product-detail',       ttl: 600,   enabled: true },
  '/categories':        { key: 'categories',           ttl: 3600,  enabled: true },
  '/banners':           { key: 'banners',              ttl: 1800,  enabled: true },
  '/partners':          { key: 'partners',             ttl: 3600,  enabled: true },
  '/orders':            { key: 'orders',               ttl: 0,     enabled: false },
}

export function getCacheEntry(path: string): CacheEntry | undefined {
  return cacheConfig[path]
}

export function buildCacheKey(path: string, suffix?: string): string | undefined {
  const entry = getCacheEntry(path)
  if (!entry || !entry.enabled) return undefined
  return suffix ? `${entry.key}-${suffix}` : entry.key
}
