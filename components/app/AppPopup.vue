<script setup lang="ts">
import type { PopupType } from '~/types'

const ui = useUIStore()
const { popup } = storeToRefs(ui)

const typeConfig: Record<PopupType, { icon: string; color: string; iconColor: string }> = {
  success: { icon: 'mdi-check-circle-outline', color: 'success',  iconColor: '#66BB6A' },
  error:   { icon: 'mdi-alert-circle-outline',  color: 'error',    iconColor: '#EF5350' },
  warning: { icon: 'mdi-alert-outline',          color: 'warning',  iconColor: '#FFA726' },
  info:    { icon: 'mdi-information-outline',    color: 'primary',  iconColor: '#F48FB1' },
  confirm: { icon: 'mdi-help-circle-outline',    color: 'primary',  iconColor: '#F48FB1' },
}

const config = computed(() => typeConfig[popup.value.type])
const isAutoClose = computed(() => popup.value.type !== 'confirm')

// ── Timer ────────────────────────────────────────────────────────────────────
const DURATION = 5000
const timerProgress = ref(100)
let timerId: ReturnType<typeof setInterval> | null = null
let startTime = 0

function clearTimer() {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

function startTimer() {
  clearTimer()
  timerProgress.value = 100
  startTime = Date.now()
  timerId = setInterval(() => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, 1 - elapsed / DURATION)
    timerProgress.value = remaining * 100
    if (remaining === 0) {
      clearTimer()
      ui.closePopup()
    }
  }, 50)
}

watch(
  () => popup.value.show,
  (show) => {
    if (show && isAutoClose.value) {
      startTimer()
    } else {
      clearTimer()
      timerProgress.value = 100
    }
  },
)

onUnmounted(clearTimer)
</script>

<template>
  <v-dialog
    v-model="popup.show"
    max-width="420"
    rounded="xl"
    :persistent="popup.type === 'confirm'"
  >
    <v-card rounded="xl" class="overflow-hidden relative">
      <!-- Colored top bar -->
      <div class="h-1.5 w-full" :style="{ background: config.iconColor }" />

      <!-- Close button -->
      <div class="absolute top-2 right-2 z-10">
        <v-btn
          icon="mdi-close"
          variant="text"
          size="x-small"
          class="opacity-50 hover:opacity-100"
          @click="ui.closePopup()"
        />
      </div>

      <v-card-text class="pt-6 pb-4 px-6 text-center">
        <!-- Custom image OR default icon -->
        <v-avatar v-if="popup.image" size="72" class="mb-4">
          <v-img :src="popup.image" />
        </v-avatar>
        <v-icon
          v-else
          :icon="config.icon"
          :color="config.color"
          size="56"
          class="mb-3 scale-in"
        />

        <h3 v-if="popup.title" class="text-lg font-semibold mb-2">
          {{ popup.title }}
        </h3>

        <p class="text-body-2 opacity-80 leading-relaxed">
          {{ popup.message }}
        </p>
      </v-card-text>

      <!-- Slot for custom content -->
      <slot />

      <!-- Actions: confirm dialog only -->
      <v-card-actions
        v-if="!isAutoClose"
        class="px-6 pb-5 pt-0 gap-3 justify-center"
      >
        <v-btn
          v-if="popup.showCancel"
          variant="outlined"
          :color="config.color"
          min-width="120"
          rounded="lg"
          :disabled="popup.loading"
          @click="ui.cancelPopup"
        >
          {{ popup.cancelText }}
        </v-btn>

        <v-btn
          :color="config.color"
          variant="elevated"
          min-width="120"
          rounded="lg"
          :loading="popup.loading"
          @click="ui.confirmPopup"
        >
          {{ popup.confirmText }}
        </v-btn>
      </v-card-actions>

      <!-- Timer progress bar (non-confirm only) -->
      <v-progress-linear
        v-if="isAutoClose"
        :model-value="timerProgress"
        :color="config.color"
        height="3"
        class="mb-0"
        :style="{ transition: 'none' }"
      />
    </v-card>
  </v-dialog>
</template>
