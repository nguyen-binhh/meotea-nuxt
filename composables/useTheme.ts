import { useTheme as useVuetifyTheme } from 'vuetify'

export function useAppTheme() {
  const vuetifyTheme = useVuetifyTheme()
  const isDarkState = useState('meotea_dark', () => false)

  onMounted(() => {
    const stored = localStorage.getItem('meotea_theme')
    const dark = stored === 'dark'
    isDarkState.value = dark
    vuetifyTheme.global.name.value = dark ? 'dark' : 'light'
  })

  function toggle() {
    const dark = !isDarkState.value
    isDarkState.value = dark
    const theme = dark ? 'dark' : 'light'
    vuetifyTheme.global.name.value = theme
    localStorage.setItem('meotea_theme', theme)
  }

  function setTheme(mode: 'light' | 'dark') {
    isDarkState.value = mode === 'dark'
    vuetifyTheme.global.name.value = mode
    localStorage.setItem('meotea_theme', mode)
  }

  return {
    isDark: computed(() => isDarkState.value),
    toggle,
    setTheme,
  }
}
