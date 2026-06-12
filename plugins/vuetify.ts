import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            background:          '#FFFFFF',
            surface:             '#FFF5F8',
            'surface-bright':    '#FFFFFF',
            'surface-variant':   '#FCE4EC',
            'on-surface-variant':'#9C4567',
            primary:             '#F48FB1',
            'primary-darken-1':  '#EC407A',
            secondary:           '#F8BBD0',
            'secondary-darken-1':'#F48FB1',
            accent:              '#FF80AB',
            error:               '#EF5350',
            info:                '#42A5F5',
            success:             '#66BB6A',
            warning:             '#FFA726',
          },
        },
        dark: {
          dark: true,
          colors: {
            background:          '#1A1A2E',
            surface:             '#16213E',
            'surface-bright':    '#1E2D4F',
            'surface-variant':   '#2A1628',
            'on-surface-variant':'#F8BBD0',
            primary:             '#F48FB1',
            'primary-darken-1':  '#EC407A',
            secondary:           '#F8BBD0',
            accent:              '#FF80AB',
            error:               '#EF5350',
            info:                '#42A5F5',
            success:             '#66BB6A',
            warning:             '#FFA726',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'lg',
        elevation: 0,
        style: "text-transform: none; letter-spacing: 0.3px; font-family: 'Nunito', sans-serif;",
      },
      VCard: {
        rounded: 'xl',
      },
      VTextField: {
        rounded: 'lg',
        variant: 'outlined',
        density: 'comfortable',
      },
      VSelect: {
        rounded: 'lg',
        variant: 'outlined',
        density: 'comfortable',
      },
      VChip: {
        rounded: 'lg',
      },
      VDialog: {
        maxWidth: '480',
        rounded: 'xl',
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
