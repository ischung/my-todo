import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
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

  // date-fns eachDayOfInterval gives exactly the right range, but we need 6 rows (42 cells)
  // Pad to 42 cells if necessary
  while (days.length < 42) {
    const last = days[days.length - 1]
    const next = new Date(last)
    next.setDate(next.getDate() + 1)
    days.push(next)
  }

  const indicatorSet = new Set(indicatorDates)

  return (
    <div className="grid grid-cols-7 gap-y-1" role="grid">
      {days.map((day, idx) => {
        const isCurrentMonth = isSameMonth(day, currentMonth)
        if (!isCurrentMonth) {
          return <div key={idx} className="w-9 h-9 mx-auto" role="gridcell" aria-hidden="true" />
        }
        const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
        return (
          <div key={idx} className="flex justify-center" role="gridcell">
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
  )
}
