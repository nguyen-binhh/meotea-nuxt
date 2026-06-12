<script setup lang="ts">
const { isDark, toggle: toggleTheme } = useAppTheme()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ui = useUIStore()
const { locale, locales, setLocale } = useI18n()
const { t } = useI18n()

const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 60)

const navItems = computed(() => [
  { label: t('nav.home'),     to: '/' },
  { label: t('nav.menu'),     to: '/thuc-don' },
  { label: t('nav.brand'),    to: '/thuong-hieu' },
  { label: t('nav.about'),    to: '/gioi-thieu' },
  { label: t('nav.partners'), to: '/doi-tac' },
])

const langOptions = computed(() =>
  (locales.value as { code: string; name: string }[]).map(l => ({
    title: l.name,
    value: l.code,
  })),
)

function onLangChange(code: string) {
  setLocale(code)
}

const mobileMenuOpen = computed({
  get: () => ui.mobileMenuOpen,
  set: (val: boolean) => { ui.mobileMenuOpen = val },
})
</script>

<template>
  <v-app-bar
    :elevation="isScrolled ? 2 : 0"
    :color="isDark ? 'surface' : 'white'"
    :style="{
      borderBottom: isScrolled ? 'none' : '1px solid #F8BBD0',
      transition: 'all 0.3s ease',
      backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    }"
    height="68"
  >
    <v-container class="flex items-center h-full py-0 gap-4">
      <!-- Logo -->
      <AppLogo size="sm" />

      <v-spacer />

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-1">
        <v-btn
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          variant="text"
          rounded="lg"
          size="small"
          active-class="text-primary font-semibold"
        >
          {{ item.label }}
        </v-btn>
      </nav>

      <v-spacer class="hidden md:block" />

      <!-- Right controls -->
      <div class="flex items-center gap-1">
        <!-- Language selector -->
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              variant="text"
              size="small"
              rounded="lg"
              class="text-uppercase font-semibold"
              min-width="0"
            >
              {{ locale }}
              <v-icon end size="14">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list density="compact" rounded="lg" min-width="140">
            <v-list-item
              v-for="lang in langOptions"
              :key="lang.value"
              :value="lang.value"
              :title="lang.title"
              :active="locale === lang.value"
              color="primary"
              rounded="lg"
              @click="onLangChange(lang.value)"
            />
          </v-list>
        </v-menu>

        <!-- User menu -->
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-if="!authStore.isLoggedIn"
              v-bind="menuProps"
              icon
              variant="text"
              size="small"
              rounded="lg"
            >
              <v-icon>mdi-account-outline</v-icon>
            </v-btn>
            <v-btn
              v-else
              v-bind="menuProps"
              variant="text"
              size="small"
              rounded="lg"
              min-width="0"
              class="font-medium px-2"
            >
              <v-avatar v-if="authStore.user?.media" size="24" class="mr-1">
                <v-img :src="authStore.user.media" cover />
              </v-avatar>
              <v-icon v-else start size="18">mdi-account-circle</v-icon>
              <span class="hidden sm:inline text-sm">{{ authStore.user?.name }}</span>
            </v-btn>
          </template>

          <v-list density="compact" rounded="lg" min-width="180" class="py-1">
            <template v-if="authStore.isLoggedIn">
              <v-list-item
                rounded="lg"
                to="/ho-so"
                color="primary"
              >
                <template #prepend>
                  <v-avatar v-if="authStore.user?.media" size="32" class="mr-2">
                    <v-img :src="authStore.user.media" cover />
                  </v-avatar>
                  <v-icon v-else size="32" class="mr-2">mdi-account-circle-outline</v-icon>
                </template>
                <v-list-item-title class="font-semibold text-sm">{{ authStore.user?.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-xs">{{ authStore.user?.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider class="my-1" />
              <v-list-item
                :title="t('auth.logout')"
                prepend-icon="mdi-logout"
                rounded="lg"
                color="error"
                @click="authStore.logout()"
              />
            </template>
            <template v-else>
              <v-list-item
                :title="t('auth.login')"
                prepend-icon="mdi-login"
                rounded="lg"
                color="primary"
                to="/dang-nhap"
              />
              <v-list-item
                :title="t('auth.register')"
                prepend-icon="mdi-account-plus-outline"
                rounded="lg"
                color="primary"
                to="/dang-ky"
              />
            </template>
          </v-list>
        </v-menu>

        <!-- Theme toggle -->
        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          size="small"
          rounded="lg"
          @click="toggleTheme"
        />

        <!-- Cart button -->
        <v-btn
          icon
          variant="text"
          size="small"
          rounded="lg"
          @click="ui.toggleCart"
        >
          <v-badge
            :content="cartStore.itemCount"
            :model-value="cartStore.itemCount > 0"
            color="primary"
            floating
          >
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>

        <!-- Mobile menu toggle -->
        <v-btn
          class="md:!hidden"
          :icon="mobileMenuOpen ? 'mdi-close' : 'mdi-menu'"
          variant="text"
          size="small"
          rounded="lg"
          @click="ui.toggleMobileMenu"
        />
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="mobileMenuOpen"
    temporary
    location="right"
    width="260"
  >
    <div class="p-4">
      <AppLogo size="sm" class="mb-6" />
      <v-list nav density="compact">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :title="item.label"
          rounded="lg"
          color="primary"
          @click="mobileMenuOpen = false"
        />
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
