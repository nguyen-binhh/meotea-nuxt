<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>()
const { t } = useI18n()

const is404 = computed(() => props.error?.statusCode === 404)

const title = computed(() =>
  is404.value ? t('error.not_found_title') : t('error.generic_title'),
)
const description = computed(() =>
  is404.value ? t('error.not_found_desc') : t('error.generic_desc'),
)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <v-app>
    <v-main>
      <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">

        <!-- Decorative boba cup SVG -->
        <svg
          width="120"
          height="150"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mb-8 opacity-30"
        >
          <line x1="40" y1="10" x2="40" y2="22" stroke="#F48FB1" stroke-width="3" stroke-linecap="round"/>
          <path
            d="M20,24 Q20,22 22,22 L58,22 Q60,22 60,24 L56,72 Q56,74 40,74 Q24,74 24,72 Z"
            stroke="#F48FB1" stroke-width="2.5" fill="#FFF0F5" stroke-linecap="round" stroke-linejoin="round"
          />
          <line x1="19" y1="34" x2="61" y2="34" stroke="#F48FB1" stroke-width="2" stroke-linecap="round"/>
          <circle cx="33" cy="58" r="5" stroke="#F48FB1" stroke-width="2" fill="#FCE4EC"/>
          <circle cx="40" cy="62" r="5" stroke="#F48FB1" stroke-width="2" fill="#FCE4EC"/>
          <circle cx="47" cy="58" r="5" stroke="#F48FB1" stroke-width="2" fill="#FCE4EC"/>
          <!-- sad face on cup -->
          <circle cx="34" cy="46" r="2" fill="#F48FB1"/>
          <circle cx="46" cy="46" r="2" fill="#F48FB1"/>
          <path d="M34,53 Q40,49 46,53" stroke="#F48FB1" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>

        <!-- Status code -->
        <div class="text-8xl font-black text-primary opacity-20 leading-none mb-4 select-none">
          {{ error?.statusCode ?? '?' }}
        </div>

        <!-- Title -->
        <h1 class="text-2xl font-bold mb-3">{{ title }}</h1>

        <!-- Description -->
        <p class="opacity-60 text-base max-w-sm mb-8">{{ description }}</p>

        <!-- Home button -->
        <v-btn
          color="primary"
          size="large"
          rounded="xl"
          prepend-icon="mdi-home-outline"
          @click="goHome"
        >
          {{ t('error.go_home') }}
        </v-btn>

      </div>
    </v-main>
  </v-app>
</template>
