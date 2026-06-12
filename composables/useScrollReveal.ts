export function useScrollReveal(target: Ref<HTMLElement | null>) {
  const isVisible = ref(true)

  onMounted(() => {
    const el = target.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const alreadyInView = rect.bottom > 0 && rect.top < window.innerHeight

    if (alreadyInView) return

    isVisible.value = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )

    observer.observe(el)
    onUnmounted(() => observer.disconnect())
  })

  return { isVisible }
}
