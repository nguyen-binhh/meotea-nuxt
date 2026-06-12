<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useScrollReveal(sectionRef)
const { t } = useI18n()
</script>

<template>
  <section ref="sectionRef" :class="{ 'reveal is-visible': isVisible, reveal: !isVisible }">
    <div class="bg-gradient-brand py-20">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="5" class="flex justify-center mb-8 md:mb-0">
            <img src="~/assets/images/logo.svg" alt="Mèo Trà" width="200" height="240" class="animate-float" />
          </v-col>

          <v-col cols="12" md="7">
            <p class="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
              {{ t('home.brand_label') }}
            </p>
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
              {{ t('home.brand_title') }}
            </h2>
            <p class="opacity-70 leading-relaxed mb-6 max-w-lg">
              {{ t('home.brand_desc') }}
            </p>

            <div class="grid grid-cols-3 gap-4 mb-8">
              <div
                v-for="stat in [
                  { icon: 'mdi-cup-outline', value: '50+', label: t('home.stat_products') },
                  { icon: 'mdi-star-outline', value: '4.9', label: t('home.stat_rating') },
                  { icon: 'mdi-account-group-outline', value: '10K+', label: t('home.stat_customers') },
                ]"
                :key="stat.label"
                class="text-center"
              >
                <v-icon :icon="stat.icon" color="primary" size="24" class="mb-1" />
                <p class="font-bold text-xl text-primary">{{ stat.value }}</p>
                <p class="text-xs opacity-60">{{ stat.label }}</p>
              </div>
            </div>

            <v-btn to="/thuong-hieu" color="primary" size="large" rounded="xl">
              {{ t('home.learn_more') }}
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </section>
</template>
