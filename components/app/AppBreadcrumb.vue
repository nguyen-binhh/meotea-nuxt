<script setup lang="ts">
import type { BreadcrumbItem } from '~/composables/useBreadcrumb'

const props = defineProps<{
  items?: BreadcrumbItem[]
}>()

const { buildBreadcrumbs } = useBreadcrumb()
const crumbs = computed(() => props.items ?? buildBreadcrumbs())
</script>

<template>
  <nav aria-label="Breadcrumb" class="py-3">
    <v-breadcrumbs :items="crumbs" density="compact" class="pa-0">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="14" class="opacity-50" />
      </template>
      <template #item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          :disabled="item.disabled"
          :title="item.title"
          class="text-sm"
          :class="item.disabled ? 'font-medium' : 'opacity-70'"
        />
      </template>
    </v-breadcrumbs>
  </nav>
</template>
