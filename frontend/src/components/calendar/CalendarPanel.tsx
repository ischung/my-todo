import { format, addMonths, subMonths, parseISO } from 'date-fns'
import { useStore } from '../../stores/useStore'
import { MonthNavigation } from './MonthNavigation'
import { WeekdayHeader } from './WeekdayHeader'
import { CalendarGrid } from './CalendarGrid'

// Mock indicator dates — will be replaced by real API in issue #9
const MOCK_INDICATOR_DATES: string[] = []

export function CalendarPanel() {
  const { selectedDate, currentMonth, setSelectedDate, setCurrentMonth } = useStore()

  const currentMonthDate = parseISO(`${currentMonth}-01`)

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
        indicatorDates={MOCK_INDICATOR_DATES}
        onSelectDate={handleSelectDate}
      />
    </div>
  )
}
