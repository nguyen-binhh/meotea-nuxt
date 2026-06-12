<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()

useSeoMeta({
  title: () => t('brand.seo_title'),
  description: () => t('brand.seo_desc'),
  ogTitle: () => t('brand.seo_title'),
})
</script>

<template>
  <div>
    <div class="bg-surface py-16">
      <v-container>
        <AppBreadcrumb />
        <div class="max-w-3xl mt-4">
          <h1 class="text-4xl font-bold mb-4 text-gradient">{{ t('brand.title') }}</h1>
          <p class="text-lg opacity-70 leading-relaxed">{{ t('brand.subtitle') }}</p>
        </div>
      </v-container>
    </div>

    <v-container class="py-16">
      <v-row align="center" class="mb-16">
        <v-col cols="12" md="6">
          <p class="text-primary font-semibold text-sm uppercase tracking-widest mb-2">{{ t('brand.story_label') }}</p>
          <h2 class="text-3xl font-bold mb-4">{{ t('brand.story_title') }}</h2>
          <p class="opacity-70 leading-relaxed mb-4">{{ t('brand.story_p1') }}</p>
          <p class="opacity-70 leading-relaxed">{{ t('brand.story_p2') }}</p>
        </v-col>
        <v-col cols="12" md="6" class="flex justify-center">
          <div class="w-64 h-64 rounded-full bg-surface-variant flex items-center justify-center">
            <img src="~/assets/images/logo.svg" alt="Brand story" width="180" class="animate-float" />
          </div>
        </v-col>
      </v-row>

      <!-- Brand identity -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-center mb-10">{{ t('brand.identity_title') }}</h2>
        <v-row>
          <v-col cols="12" md="4">
            <v-card rounded="xl" :elevation="0" class="border border-pink-100 pa-6 text-center h-full">
              <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <v-icon color="white" size="24">mdi-palette</v-icon>
              </div>
              <h3 class="font-bold mb-2">{{ t('brand.color_title') }}</h3>
              <p class="text-sm opacity-70 leading-relaxed">{{ t('brand.color_desc') }}</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card rounded="xl" :elevation="0" class="border border-pink-100 pa-6 text-center h-full">
              <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <v-icon color="white" size="24">mdi-format-font</v-icon>
              </div>
              <h3 class="font-bold mb-2">{{ t('brand.font_title') }}</h3>
              <p class="text-sm opacity-70 leading-relaxed">{{ t('brand.font_desc') }}</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card rounded="xl" :elevation="0" class="border border-pink-100 pa-6 text-center h-full">
              <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <v-icon color="white" size="24">mdi-emoticon-outline</v-icon>
              </div>
              <h3 class="font-bold mb-2">{{ t('brand.logo_title') }}</h3>
              <p class="text-sm opacity-70 leading-relaxed">{{ t('brand.logo_desc') }}</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
