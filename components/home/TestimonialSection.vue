<script setup lang="ts">
const { testimonials } = useHomeViewModel()
const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useScrollReveal(sectionRef)
const { t } = useI18n()
</script>

<template>
  <section ref="sectionRef" class="py-16" :class="{ 'reveal is-visible': isVisible, reveal: !isVisible }">
    <v-container>
      <div class="text-center mb-10">
        <p class="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          {{ t('home.reviews_label') }}
        </p>
        <h2 class="text-3xl font-bold">{{ t('home.reviews_title') }}</h2>
      </div>

      <v-row>
        <v-col
          v-for="review in testimonials"
          :key="review.id"
          cols="12"
          md="4"
        >
          <v-card variant="outlined" rounded="xl" class="h-full pa-5 border-pink-200">
            <div class="flex gap-0.5 mb-3">
              <v-icon
                v-for="i in 5"
                :key="i"
                :color="i <= review.rating ? 'warning' : 'grey-lighten-2'"
                size="16"
              >
                mdi-star
              </v-icon>
            </div>
            <p class="text-sm leading-relaxed opacity-80 mb-4">"{{ review.comment }}"</p>
            <div class="flex items-center gap-3">
              <v-avatar color="primary" size="36">
                <v-icon size="20" color="white">mdi-account</v-icon>
              </v-avatar>
              <span class="font-semibold text-sm">{{ review.name }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
