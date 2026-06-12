<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

if (!authStore.isLoggedIn) {
  await navigateTo('/dang-nhap')
}

const { form, loading, error, avatarPreview, onAvatarPick, saveProfile, fetchProfile } = useProfileViewModel()

useSeoMeta({ title: () => `${t('profile.title')} – Mèo Trà` })

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFilePick() {
  fileInput.value?.click()
}

onMounted(fetchProfile)
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="bg-surface py-10">
      <v-container>
        <AppBreadcrumb :items="[
          { title: t('nav.home'), to: '/' },
          { title: t('profile.title'), disabled: true },
        ]" />
        <h1 class="text-3xl font-bold mt-2">{{ t('profile.title') }}</h1>
        <p class="opacity-60 mt-1">{{ t('profile.subtitle') }}</p>
      </v-container>
    </div>

    <v-container class="py-10">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="7" lg="5">
          <v-card rounded="2xl" elevation="0" class="border border-pink-100 pa-8">

            <!-- Avatar section -->
            <div class="flex flex-col items-center mb-8">
              <div class="relative cursor-pointer group" @click="triggerFilePick">
                <v-avatar size="100" class="ring-4 ring-pink-100">
                  <v-img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    :alt="form.name"
                    cover
                  />
                  <v-icon v-else size="52" color="primary">mdi-account-circle</v-icon>
                </v-avatar>

                <!-- Overlay on hover -->
                <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <v-icon color="white" size="24">mdi-camera</v-icon>
                </div>
              </div>

              <v-btn
                variant="text"
                color="primary"
                size="small"
                class="mt-3"
                prepend-icon="mdi-camera-outline"
                @click="triggerFilePick"
              >
                {{ t('profile.change_avatar') }}
              </v-btn>
              <p class="text-xs opacity-40 mt-0.5">{{ t('profile.upload_hint') }}</p>

              <!-- Hidden file input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                class="hidden"
                @change="onAvatarPick"
              />
            </div>

            <v-divider class="mb-6" />

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
            <form @submit.prevent="saveProfile">
              <div class="flex flex-col gap-4">
                <!-- Email (read-only) -->
                <v-text-field
                  :model-value="authStore.user?.email"
                  :label="t('profile.email')"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  prepend-inner-icon="mdi-email-outline"
                  hide-details
                  readonly
                  class="opacity-70"
                />

                <!-- Name -->
                <v-text-field
                  v-model="form.name"
                  :label="t('profile.name')"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  prepend-inner-icon="mdi-account-outline"
                  hide-details="auto"
                  autocomplete="name"
                />

                <!-- Phone -->
                <v-text-field
                  v-model="form.phone"
                  :label="t('profile.phone')"
                  type="tel"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  prepend-inner-icon="mdi-phone-outline"
                  hide-details="auto"
                  autocomplete="tel"
                />
              </div>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                rounded="xl"
                :loading="loading"
                class="mt-7 font-semibold"
              >
                <v-icon start>mdi-content-save-outline</v-icon>
                {{ t('profile.save') }}
              </v-btn>
            </form>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
