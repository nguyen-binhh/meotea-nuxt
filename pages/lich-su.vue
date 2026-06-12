<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()

useSeoMeta({
  title: () => t('history.seo_title'),
  description: () => t('history.seo_desc'),
  ogTitle: () => t('history.seo_title'),
})

const milestones = computed(() => [
  { isEven: true,  month: t('history.m1_month'), title: t('history.m1_title'), desc: t('history.m1_desc'), icon: 'mdi-lightbulb-outline' },
  { isEven: false, month: t('history.m2_month'), title: t('history.m2_title'), desc: t('history.m2_desc'), icon: 'mdi-store-outline' },
  { isEven: true,  month: t('history.m3_month'), title: t('history.m3_title'), desc: t('history.m3_desc'), icon: 'mdi-account-group-outline' },
  { isEven: false, month: t('history.m4_month'), title: t('history.m4_title'), desc: t('history.m4_desc'), icon: 'mdi-map-marker-plus-outline' },
  { isEven: true,  month: t('history.m5_month'), title: t('history.m5_title'), desc: t('history.m5_desc'), icon: 'mdi-cellphone-check' },
  { isEven: false, month: t('history.m6_month'), title: t('history.m6_title'), desc: t('history.m6_desc'), icon: 'mdi-trophy-outline' },
])
</script>

<template>
  <div>
    <div class="bg-surface py-16">
      <v-container>
        <AppBreadcrumb />
        <div class="mt-4 max-w-2xl">
          <h1 class="text-4xl font-bold mb-4 text-gradient">{{ t('history.title') }}</h1>
          <p class="text-lg opacity-70 leading-relaxed">{{ t('history.subtitle') }}</p>
        </div>
      </v-container>
    </div>

    <v-container class="py-16">
      <div class="relative max-w-3xl mx-auto">
        <!-- Vertical line -->
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-pink-200 md:left-1/2 md:-translate-x-px" />

        <div class="flex flex-col gap-8">
          <div
            v-for="m in milestones"
            :key="m.month"
            class="relative flex gap-6 md:gap-0"
            :class="m.isEven ? 'md:flex-row' : 'md:flex-row-reverse'"
          >
            <!-- Dot on timeline -->
            <div class="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md" />

            <!-- Card -->
            <div
              class="ml-16 md:ml-0 w-full md:w-[calc(50%-2rem)]"
              :class="m.isEven ? 'md:pr-8 md:text-right' : 'md:pl-8'"
            >
              <v-card rounded="xl" :elevation="0" class="border border-pink-100 pa-5">
                <div
                  class="flex items-center gap-2 mb-2"
                  :class="m.isEven ? 'md:flex-row-reverse' : ''"
                >
                  <v-icon :icon="m.icon" color="primary" size="20" />
                  <span class="text-xs font-semibold text-primary uppercase tracking-wider">
                    {{ m.month }}
                  </span>
                </div>
                <h3 class="font-bold mb-1">{{ m.title }}</h3>
                <p class="text-sm opacity-70 leading-relaxed">{{ m.desc }}</p>
              </v-card>
            </div>

            <!-- Spacer for opposite side -->
            <div class="hidden md:block w-[calc(50%-2rem)]" />
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
