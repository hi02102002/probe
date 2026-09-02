import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'

dayjs.extend(relativeTime)

export { dayjs }

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date)
    return 'Never'
  return dayjs(date).fromNow()
}

export function formatDate(date: Date | string | null | undefined, formatStr = 'MMM D, YYYY'): string {
  if (!date)
    return 'Never'
  return dayjs(date).format(formatStr)
}
