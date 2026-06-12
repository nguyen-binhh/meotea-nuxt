<script setup lang="ts">
const { heroSlides } = useHomeViewModel()
const { t } = useI18n()

const current = ref(0)
const timer = ref<ReturnType<typeof setInterval> | null>(null)

function startTimer() {
  timer.value = setInterval(() => {
    current.value = (current.value + 1) % heroSlides.value.length
  }, 5000)
}

function resetTimer() {
  if (timer.value) clearInterval(timer.value)
  startTimer()
}

function prev() {
  current.value = (current.value - 1 + heroSlides.value.length) % heroSlides.value.length
  resetTimer()
}

function next() {
  current.value = (current.value + 1) % heroSlides.value.length
  resetTimer()
}

function goTo(i: number) {
  current.value = i
  resetTimer()
}

onMounted(startTimer)
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

const slide = computed(() => heroSlides.value[current.value])
const dots = computed((): Array<{ idx: number; label: string }> =>
  heroSlides.value.map((_, i) => ({ idx: i, label: `Slide ${i + 1}` }))
)
</script>

<template>
  <section
    class="hero-section relative flex items-center overflow-hidden"
    :style="{ background: slide.bgColor }"
  >
    <!-- Decorative blobs -->
    <div
      class="blob blob--top-right pointer-events-none"
      :style="{ background: slide.accentColor }"
    />
    <div
      class="blob blob--bottom-left pointer-events-none"
      :style="{ background: slide.accentColor }"
    />

    <v-container class="relative z-10 py-16 md:py-20">
      <v-row align="center">
        <!-- Text -->
        <v-col cols="12" md="6" class="text-center md:text-left">
          <transition name="hero-text" mode="out-in">
            <div :key="current">
              <p
                class="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                :style="{ color: slide.accentColor }"
              >
                {{ slide.subtitle }}
              </p>

              <h1 class="text-4xl md:text-[3.5rem] font-black leading-tight mb-5 text-gradient">
                {{ slide.title }}
              </h1>

              <p class="hero-desc text-base md:text-lg max-w-md leading-relaxed mb-8">
                {{ slide.description }}
              </p>

              <div class="flex gap-3 justify-center md:justify-start flex-wrap">
                <v-btn
                  :to="slide.cta.to"
                  color="primary"
                  size="large"
                  rounded="xl"
                  elevation="2"
                >
                  {{ slide.cta.text }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>

                <v-btn
                  to="/gioi-thieu"
                  variant="outlined"
                  color="primary"
                  size="large"
                  rounded="xl"
                >
                  {{ t('home.about_us') }}
                </v-btn>
              </div>
            </div>
          </transition>
        </v-col>

        <!-- Illustration -->
        <v-col cols="12" md="6" class="flex justify-center mt-8 md:mt-0">
          <transition name="hero-img" mode="out-in">
            <div :key="current" class="animate-float">
              <svg width="280" height="320" viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="140" cy="290" rx="70" ry="12" fill="#F48FB1" opacity="0.15"/>
                <rect x="134" y="60" width="12" height="100" rx="6" :fill="slide.accentColor" opacity="0.6"/>
                <path d="M70,130 Q68,128 70,128 L210,128 Q212,128 210,130 L200,260 Q198,270 140,270 Q82,270 80,260 Z" fill="white" stroke="#F48FB1" stroke-width="3"/>
                <path d="M84,175 Q84,173 86,173 L194,173 Q196,173 196,175 L190,260 Q188,268 140,268 Q92,268 90,260 Z" :fill="slide.accentColor" opacity="0.15"/>
                <path d="M68,128 Q68,120 72,120 L208,120 Q212,120 212,128" stroke="#F48FB1" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="112" cy="230" r="14" fill="#F48FB1" opacity="0.7"/>
                <circle cx="140" cy="245" r="14" fill="#EC407A" opacity="0.8"/>
                <circle cx="168" cy="230" r="14" fill="#F48FB1" opacity="0.7"/>
                <circle cx="125" cy="208" r="12" fill="#F8BBD0" opacity="0.6"/>
                <circle cx="155" cy="208" r="12" fill="#F8BBD0" opacity="0.6"/>
                <circle cx="140" cy="165" r="28" fill="#FCE4EC" opacity="0.8"/>
                <path d="M116,150 L110,132 L126,146" fill="#FCE4EC" opacity="0.9" stroke="#F48FB1" stroke-width="1.5"/>
                <path d="M154,146 L170,132 L164,150" fill="#FCE4EC" opacity="0.9" stroke="#F48FB1" stroke-width="1.5"/>
                <path d="M130,163 Q133,160 136,163" stroke="#F48FB1" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M144,163 Q147,160 150,163" stroke="#F48FB1" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M133,172 Q140,177 147,172" stroke="#F48FB1" stroke-width="2" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
          </transition>
        </v-col>
      </v-row>
    </v-container>

    <!-- Prev arrow -->
    <button v-if="heroSlides.length > 1" class="nav-arrow nav-arrow--left" :aria-label="t('home.slide_prev')" @click="prev">
      <v-icon size="22">mdi-chevron-left</v-icon>
    </button>

    <!-- Next arrow -->
    <button v-if="heroSlides.length > 1" class="nav-arrow nav-arrow--right" :aria-label="t('home.slide_next')" @click="next">
      <v-icon size="22">mdi-chevron-right</v-icon>
    </button>

    <!-- Dot navigation -->
    <div v-if="heroSlides.length > 1" class="dots-bar">
      <button
        v-for="dot in dots"
        :key="dot.idx"
        class="dot"
        :class="{ 'dot--active': current === dot.idx }"
        :style="current === dot.idx ? { background: slide.accentColor } : {}"
        :aria-label="dot.label"
        @click="goTo(dot.idx)"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 580px;
  transition: background 0.7s ease;
}

@media (min-width: 768px) {
  .hero-section {
    min-height: 660px;
  }
}

/* Decorative blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  transition: background 0.7s ease;
  pointer-events: none;
}
.blob--top-right {
  top: 0; right: 0;
  width: 380px; height: 380px;
  opacity: 0.18;
  transform: translate(30%, -30%);
}
.blob--bottom-left {
  bottom: 0; left: 0;
  width: 240px; height: 240px;
  opacity: 0.12;
  transform: translate(-30%, 30%);
}

/* Nav arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(244, 143, 177, 0.35);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 16px rgba(244, 143, 177, 0.25);
  color: #EC407A;
}
.nav-arrow:hover {
  background: #ffffff;
  box-shadow: 0 4px 24px rgba(244, 143, 177, 0.4);
  border-color: #F48FB1;
  transform: translateY(-50%) scale(1.08);
}
.nav-arrow:active {
  transform: translateY(-50%) scale(0.96);
}
.nav-arrow--left  { left: 12px; }
.nav-arrow--right { right: 12px; }

@media (min-width: 768px) {
  .nav-arrow--left  { left: 20px; }
  .nav-arrow--right { right: 20px; }
}

/* Dots */
.dots-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 7px 14px;
  border-radius: 24px;
  border: 1px solid rgba(244, 143, 177, 0.25);
  box-shadow: 0 2px 12px rgba(244, 143, 177, 0.15);
}

.dot {
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background: rgba(244, 143, 177, 0.45);
  cursor: pointer;
  border: none;
  padding: 0;
  transition: width 0.35s ease, background 0.35s ease;
}
.dot--active {
  width: 28px;
}
.dot:hover:not(.dot--active) {
  background: rgba(244, 143, 177, 0.75);
}

/* Text desc */
.hero-desc {
  color: rgba(var(--v-theme-on-surface), 0.78);
}

/* Slide transitions */
.hero-text-enter-active,
.hero-text-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.hero-text-enter-from { opacity: 0; transform: translateX(-24px); }
.hero-text-leave-to   { opacity: 0; transform: translateX(24px); }

.hero-img-enter-active,
.hero-img-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.hero-img-enter-from { opacity: 0; transform: scale(0.88); }
.hero-img-leave-to   { opacity: 0; transform: scale(1.06); }
</style>
