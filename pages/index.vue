<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

useSeoMeta({
  title: 'Mèo Trà – Trà Sữa Yêu Thương',
  description: 'Thương hiệu trà sữa với tình yêu từ những chú mèo dễ thương. Hương vị đặc biệt, nguyên liệu tươi ngon.',
  ogTitle: 'Mèo Trà – Trà Sữa Yêu Thương',
  ogDescription: 'Thương hiệu trà sữa với tình yêu từ những chú mèo dễ thương.',
})
</script>

<template>
  <main>
    <HeroBanner />
    <FeaturedProducts />
    <BrandTeaser />
    <TestimonialSection />
  </main>
</template>
