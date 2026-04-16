import { parseISO, format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface TodoPanelHeaderProps {
  date: string // 'YYYY-MM-DD'
}

export function TodoPanelHeader({ date }: TodoPanelHeaderProps) {
  const parsed = parseISO(date)
  const label = format(parsed, 'M월 d일 EEEE', { locale: ko })

  return (
    <h2 className="text-lg font-semibold text-neutral-800 mb-4">{label}</h2>
  )
}
