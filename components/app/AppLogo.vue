<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  iconOnly?: boolean
}
const { size = 'md', iconOnly = false } = defineProps<Props>()

const sizes = { sm: 32, md: 44, lg: 60 }
const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' }
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2 no-underline select-none">
    <img
      src="~/assets/images/logo.svg"
      alt="Mèo Trà"
      :width="sizes[size]"
      :height="sizes[size]"
      class="animate-float"
    />
    <span
      v-if="!iconOnly"
      :class="[textSizes[size], 'font-bold text-gradient leading-tight']"
    >
      Mèo Trà
    </span>
  </NuxtLink>
</template>
