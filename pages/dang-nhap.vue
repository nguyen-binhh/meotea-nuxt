<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { requireGuest } = useAuthGuard()
await requireGuest()

const { t } = useI18n()
const { form, loading, error, showPassword, login } = useLoginViewModel()

useSeoMeta({
  title: () => `${t('auth.login')} – Mèo Trà`,
})

async function onSubmit() {
  await login()
}
</script>

<template>
  <div class="auth-page min-h-screen flex items-center justify-center py-12 px-4">
    <!-- Decorative blobs -->
    <div class="blob blob--tr" />
    <div class="blob blob--bl" />

    <div class="w-full max-w-[420px] relative z-10">
      <!-- Card -->
      <v-card rounded="2xl" elevation="0" class="auth-card pa-8">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <AppLogo size="sm" />
        </div>

        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-black text-gradient mb-1">{{ t('auth.login_title') }}</h1>
          <p class="text-sm opacity-60">{{ t('auth.login_desc') }}</p>
        </div>

        <!-- Error alert -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          rounded="lg"
          density="compact"
          class="mb-5 text-sm"
          closable
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <!-- Form -->
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col gap-4">
            <v-text-field
              v-model="form.email"
              :label="t('auth.email')"
              type="email"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              prepend-inner-icon="mdi-email-outline"
              hide-details="auto"
              autocomplete="email"
            />

            <v-text-field
              v-model="form.password"
              :label="t('auth.password')"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              hide-details="auto"
              autocomplete="current-password"
              @click:append-inner="showPassword = !showPassword"
            />
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            rounded="xl"
            :loading="loading"
            class="mt-6 font-semibold"
          >
            {{ t('auth.login') }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <v-divider />
          <span class="text-xs opacity-40 whitespace-nowrap">{{ t('auth.no_account') }}</span>
          <v-divider />
        </div>

        <!-- Register link -->
        <v-btn
          to="/dang-ky"
          variant="outlined"
          color="primary"
          block
          rounded="xl"
          size="large"
        >
          {{ t('auth.register') }}
        </v-btn>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #fff0f5 0%, #f8f0ff 100%);
  position: relative;
  overflow: hidden;
}

.auth-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(244, 143, 177, 0.2);
  box-shadow: 0 8px 40px rgba(244, 143, 177, 0.18);
}

.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.blob--tr {
  top: -80px; right: -80px;
  width: 320px; height: 320px;
  background: rgba(244, 143, 177, 0.15);
}
.blob--bl {
  bottom: -60px; left: -60px;
  width: 240px; height: 240px;
  background: rgba(206, 147, 216, 0.12);
}
</style>
