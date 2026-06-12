import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale('vi')

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,
    },
  }
})
