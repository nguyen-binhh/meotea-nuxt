<script setup lang="ts">
import type { Category } from '~/types'

defineProps<{
  categories: Category[]
  activeCategory: string
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:activeCategory': [val: string]
  'update:searchQuery': [val: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-4 mb-6">
    <!-- Search -->
    <v-text-field
      :model-value="searchQuery"
      :placeholder="t('product.search_placeholder')"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      rounded="lg"
      hide-details
      clearable
      @update:model-value="emit('update:searchQuery', $event ?? '')"
    />

    <!-- Category chips -->
    <div class="flex flex-wrap gap-2">
      <v-chip
        :color="activeCategory === 'all' ? 'primary' : undefined"
        :variant="activeCategory === 'all' ? 'elevated' : 'tonal'"
        rounded="lg"
        size="default"
        class="cursor-pointer"
        @click="emit('update:activeCategory', 'all')"
      >
        {{ t('product.all_categories') }}
      </v-chip>

      <v-chip
        v-for="cat in categories"
        :key="cat.slug"
        :color="activeCategory === cat.slug ? 'primary' : undefined"
        :variant="activeCategory === cat.slug ? 'elevated' : 'tonal'"
        rounded="lg"
        size="default"
        class="cursor-pointer"
        @click="emit('update:activeCategory', cat.slug)"
      >
        {{ cat.icon }} {{ cat.name }}
      </v-chip>
    </div>
  </div>
</template>
