<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => ({
  info: [
    { label: t('nav.about'),   to: '/gioi-thieu' },
    { label: t('nav.brand'),   to: '/thuong-hieu' },
    { label: t('nav.history'), to: '/lich-su' },
    { label: t('nav.partners'),to: '/doi-tac' },
  ],
  shop: [
    { label: t('nav.menu'),     to: '/thuc-don' },
    { label: t('nav.cart'),     to: '/gio-hang' },
  ],
}))
</script>

<template>
  <footer class="footer-root mt-auto">
    <div class="footer-top-bar" />

    <v-container class="py-10">
      <v-row>
        <!-- Brand -->
        <v-col cols="12" md="4" class="mb-8 md:mb-0">
          <AppLogo size="md" class="mb-3" />
          <p class="footer-tagline text-body-2 leading-relaxed max-w-xs mb-5">
            {{ t('footer.tagline') }}
          </p>
          <div class="flex gap-2">
            <v-btn icon="mdi-facebook" variant="tonal" size="small" color="primary" rounded="lg" />
            <v-btn icon="mdi-instagram" variant="tonal" size="small" color="primary" rounded="lg" />
            <v-btn icon="mdi-youtube" variant="tonal" size="small" color="primary" rounded="lg" />
          </div>
        </v-col>

        <!-- Links: Về chúng tôi -->
        <v-col cols="6" md="2">
          <p class="footer-col-heading font-semibold text-sm mb-4">{{ t('footer.about_us') }}</p>
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="link in links.info"
              :key="link.to"
              :to="link.to"
              class="footer-link text-body-2"
            >{{ link.label }}</NuxtLink>
          </div>
        </v-col>

        <!-- Links: Mua sắm -->
        <v-col cols="6" md="2">
          <p class="footer-col-heading font-semibold text-sm mb-4">{{ t('footer.shop') }}</p>
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="link in links.shop"
              :key="link.to"
              :to="link.to"
              class="footer-link text-body-2"
            >{{ link.label }}</NuxtLink>
          </div>
        </v-col>

        <!-- Contact -->
        <v-col cols="12" md="4">
          <p class="footer-col-heading font-semibold text-sm mb-4">{{ t('footer.contact') }}</p>
          <div class="flex flex-col gap-3">
            <span class="footer-contact-item text-body-2 flex items-center gap-2">
              <v-icon size="16" color="primary">mdi-map-marker-outline</v-icon>
              123 Đường Mèo Trà, TP.HCM
            </span>
            <span class="footer-contact-item text-body-2 flex items-center gap-2">
              <v-icon size="16" color="primary">mdi-phone-outline</v-icon>
              0901 234 567
            </span>
            <span class="footer-contact-item text-body-2 flex items-center gap-2">
              <v-icon size="16" color="primary">mdi-email-outline</v-icon>
              hello@meotea.vn
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="footer-divider" />

    <v-container class="py-4">
      <p class="footer-copy text-center text-xs">
        © {{ new Date().getFullYear() }} Mèo Trà. {{ t('footer.rights') }}
      </p>
    </v-container>
  </footer>
</template>

<style scoped>
.footer-root {
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-primary), 0.15);
}

.footer-top-bar {
  height: 3px;
  background: linear-gradient(90deg, transparent, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)), rgb(var(--v-theme-primary)), transparent);
}

.footer-col-heading {
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.3px;
}

.footer-tagline,
.footer-contact-item,
.footer-copy {
  color: rgba(var(--v-theme-on-surface), 0.65);
}

.footer-link {
  color: rgba(var(--v-theme-on-surface), 0.65);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
}

.footer-divider {
  height: 1px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  margin: 0 24px;
}
</style>
