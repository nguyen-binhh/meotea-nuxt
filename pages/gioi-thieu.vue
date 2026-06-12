<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()

useSeoMeta({
  title: () => t('about.seo_title'),
  description: () => t('about.seo_desc'),
  ogTitle: () => t('about.seo_title'),
})

const values = computed(() => [
  { icon: 'mdi-leaf',          title: t('about.val1_title'), desc: t('about.val1_desc') },
  { icon: 'mdi-heart-outline', title: t('about.val2_title'), desc: t('about.val2_desc') },
  { icon: 'mdi-earth',         title: t('about.val3_title'), desc: t('about.val3_desc') },
  { icon: 'mdi-account-group', title: t('about.val4_title'), desc: t('about.val4_desc') },
])
</script>

<template>
  <div>
    <div class="bg-surface py-16">
      <v-container>
        <AppBreadcrumb />
        <div class="text-center max-w-2xl mx-auto mt-4">
          <h1 class="text-4xl font-bold mb-4 text-gradient">{{ t('nav.about') }}</h1>
          <p class="text-lg leading-relaxed hero-desc">{{ t('about.hero_desc') }}</p>
        </div>
      </v-container>
    </div>

    <!-- Values -->
    <v-container class="py-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-2 text-primary">{{ t('about.values_title') }}</h2>
        <p class="section-sub">{{ t('about.values_subtitle') }}</p>
      </div>
      <v-row>
        <v-col v-for="val in values" :key="val.title" cols="12" sm="6" md="3">
          <v-card variant="tonal" color="surface-variant" rounded="xl" class="h-full pa-6 text-center">
            <v-icon :icon="val.icon" color="primary" size="40" class="mb-4" />
            <h3 class="font-bold mb-2 text-primary">{{ val.title }}</h3>
            <p class="text-sm leading-relaxed card-desc">{{ val.desc }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Mission -->
    <div class="bg-gradient-brand py-16">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h2 class="text-3xl font-bold mb-4">{{ t('about.mission_title') }}</h2>
            <p class="mission-text leading-relaxed mb-4">{{ t('about.mission_p1') }}</p>
            <p class="mission-text leading-relaxed">{{ t('about.mission_p2') }}</p>
          </v-col>
          <v-col cols="12" md="6" class="flex justify-center">
            <img src="~/assets/images/logo.svg" alt="Mèo Trà mission" width="200" class="animate-float" />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- CTA -->
    <v-container class="py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">{{ t('about.cta_title') }}</h2>
      <p class="section-sub mb-6">{{ t('about.cta_subtitle') }}</p>
      <v-btn to="/thuc-don" color="primary" size="large" rounded="xl">
        {{ t('about.cta_btn') }}
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<style scoped>
.hero-desc {
  color: rgba(var(--v-theme-on-surface), 0.85);
}

.section-sub {
  color: rgba(var(--v-theme-on-surface), 0.75);
}

.card-desc {
  color: rgba(var(--v-theme-on-surface), 0.82);
}

.mission-text {
  color: rgba(var(--v-theme-on-surface), 0.85);
}
</style>
