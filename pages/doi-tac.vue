<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()

useSeoMeta({
  title: () => t('partners.seo_title'),
  description: () => t('partners.seo_desc'),
  ogTitle: () => t('partners.seo_title'),
})

const partners = computed(() => [
  { id: 1, name: t('partners.p1_name'), category: t('partners.p1_cat'), desc: t('partners.p1_desc'), icon: 'mdi-tea',           color: '#FCE4EC' },
  { id: 2, name: t('partners.p2_name'), category: t('partners.p2_cat'), desc: t('partners.p2_desc'), icon: 'mdi-bottle-tonic',  color: '#FCE4EC' },
  { id: 3, name: t('partners.p3_name'), category: t('partners.p3_cat'), desc: t('partners.p3_desc'), icon: 'mdi-leaf',          color: '#F3E5F5' },
  { id: 4, name: t('partners.p4_name'), category: t('partners.p4_cat'), desc: t('partners.p4_desc'), icon: 'mdi-recycle',       color: '#E8F5E9' },
  { id: 5, name: t('partners.p5_name'), category: t('partners.p5_cat'), desc: t('partners.p5_desc'), icon: 'mdi-moped-outline', color: '#E3F2FD' },
  { id: 6, name: t('partners.p6_name'), category: t('partners.p6_cat'), desc: t('partners.p6_desc'), icon: 'mdi-cat',           color: '#FFF8E1' },
])
</script>

<template>
  <div>
    <div class="bg-surface py-16">
      <v-container>
        <AppBreadcrumb />
        <div class="mt-4 max-w-2xl">
          <h1 class="text-4xl font-bold mb-4 text-gradient">{{ t('partners.title') }}</h1>
          <p class="text-lg opacity-70 leading-relaxed">{{ t('partners.subtitle') }}</p>
        </div>
      </v-container>
    </div>

    <v-container class="py-16">
      <v-row>
        <v-col
          v-for="partner in partners"
          :key="partner.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            rounded="xl"
            :elevation="0"
            class="border border-pink-100 h-full pa-6 card-hover"
          >
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              :style="{ background: partner.color }"
            >
              <v-icon :icon="partner.icon" color="primary" size="28" />
            </div>
            <v-chip size="x-small" color="primary" variant="tonal" rounded="lg" class="mb-2">
              {{ partner.category }}
            </v-chip>
            <h3 class="font-bold text-base mb-2">{{ partner.name }}</h3>
            <p class="text-sm opacity-70 leading-relaxed">{{ partner.desc }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Become a partner -->
      <div class="text-center mt-16 py-12 bg-surface rounded-3xl">
        <v-icon size="48" color="primary" class="mb-4">mdi-handshake-outline</v-icon>
        <h2 class="text-2xl font-bold mb-3">{{ t('partners.become_title') }}</h2>
        <p class="opacity-60 mb-6 max-w-md mx-auto">{{ t('partners.become_desc') }}</p>
        <v-btn color="primary" size="large" rounded="xl">
          <v-icon start>mdi-email-outline</v-icon>
          {{ t('partners.become_btn') }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>
