import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
} from 'date-fns'
import { DayCell } from './DayCell'

interface CalendarGridProps {
  currentMonth: Date
  selectedDate: string
  indicatorDates: string[]
  onSelectDate: (date: string) => void
}

export function CalendarGrid({
  currentMonth,
  selectedDate,
  indicatorDates,
  onSelectDate,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  while (days.length < 42) {
    const last = days[days.length - 1]
    const next = new Date(last)
    next.setDate(next.getDate() + 1)
    days.push(next)
  }

  const indicatorSet = new Set(indicatorDates)

  // 42개 날짜를 6행 × 7열로 분할
  const weeks: Date[][] = []
  for (let i = 0; i < 42; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const monthLabel = format(currentMonth, 'yyyy년 M월')

  return (
    <div
      role="grid"
      aria-label={`${monthLabel} 달력`}
      className="flex flex-col gap-y-1"
    >
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} role="row" className="grid grid-cols-7">
          {week.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            if (!isCurrentMonth) {
              return (
                <div
                  key={dayIdx}
                  role="gridcell"
                  aria-hidden="true"
                  className="w-9 h-9 mx-auto"
                />
              )
            }
            const dateStr = format(day, 'yyyy-MM-dd')
            return (
              <div key={dayIdx} role="gridcell" className="flex justify-center">
                <DayCell
                  date={day}
                  isSelected={dateStr === selectedDate}
                  hasIndicator={indicatorSet.has(dateStr)}
                  onClick={onSelectDate}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
