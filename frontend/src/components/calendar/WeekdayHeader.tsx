const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function WeekdayHeader() {
  return (
    <div className="grid grid-cols-7 mb-1">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="flex items-center justify-center h-8 text-xs text-neutral-500 font-medium"
        >
          {day}
        </div>
      ))}
    </div>
  )
}
