import { format, addMonths, subMonths, parseISO } from 'date-fns'
import { useStore } from '../../stores/useStore'
import { useDatesWithTodos } from '../../hooks/useDatesWithTodos'
import { MonthNavigation } from './MonthNavigation'
import { WeekdayHeader } from './WeekdayHeader'
import { CalendarGrid } from './CalendarGrid'

export function CalendarPanel() {
  const { selectedDate, currentMonth, setSelectedDate, setCurrentMonth } = useStore()

  const currentMonthDate = parseISO(`${currentMonth}-01`)
  const { data: datesData } = useDatesWithTodos(currentMonth)
  const indicatorDates = datesData?.dates ?? []

  const handlePrevMonth = () => {
    const prev = subMonths(currentMonthDate, 1)
    setCurrentMonth(format(prev, 'yyyy-MM'))
  }

  const handleNextMonth = () => {
    const next = addMonths(currentMonthDate, 1)
    setCurrentMonth(format(next, 'yyyy-MM'))
  }

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
  }

  const monthLabel = format(currentMonthDate, 'yyyy년 M월')

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <MonthNavigation label={monthLabel} onPrev={handlePrevMonth} onNext={handleNextMonth} />
      <WeekdayHeader />
      <CalendarGrid
        currentMonth={currentMonthDate}
        selectedDate={selectedDate}
        indicatorDates={indicatorDates}
        onSelectDate={handleSelectDate}
      />
    </div>
  )
}
