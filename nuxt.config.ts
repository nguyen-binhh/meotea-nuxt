import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:3001/api',
      useMock: 'false',
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'VI',
    locales: [
      { code: 'VI', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'EN', name: 'English', file: 'en.json' },
      { code: 'JP', name: '日本語', file: 'ja.json' },
      { code: 'ZH', name: '中文', file: 'zh.json' },
    ],
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'meotea_lang',
      redirectOn: 'root',
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/variables";\n',
          silenceDeprecations: ['legacy-js-api', 'global-builtin', 'import'],
        },
      },
    },
    define: {
      'process.env.DEBUG': false,
    },
    optimizeDeps: {
      include: ['dayjs', 'pinia'],
    },
  },

  css: [
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/styles',
    '@/assets/scss/main.scss',
  ],

  imports: {
    dirs: ['stores', 'composables', 'utils', 'viewmodels', 'repositories'],
  },

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: 'Mèo Trà – Trà Sữa Yêu Thương',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        {
          name: 'description',
          content:
            'Mèo Trà – Thương hiệu trà sữa với tình yêu từ những chú mèo dễ thương. Hương vị đặc biệt, nguyên liệu tươi ngon.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Mèo Trà' },
        { property: 'og:locale', content: 'vi_VN' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  nitro: {
    compatibilityDate: '2024-04-03',
  },

  telemetry: false,
})
