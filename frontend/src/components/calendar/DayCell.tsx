import { format, isToday } from 'date-fns'

interface DayCellProps {
  date: Date
  isSelected: boolean
  hasIndicator: boolean
  onClick: (dateStr: string) => void
}

export function DayCell({ date, isSelected, hasIndicator, onClick }: DayCellProps) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const today = isToday(date)

  const cellClass = [
    'relative flex flex-col items-center justify-center w-9 h-9 rounded-full cursor-pointer select-none',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
    isSelected
      ? 'bg-primary text-white'
      : today
        ? 'text-primary font-bold hover:bg-primary/10'
        : 'text-neutral-900 hover:bg-neutral-200',
  ].join(' ')

  return (
    <button
      type="button"
      className={cellClass}
      aria-label={format(date, 'yyyy년 M월 d일')}
      aria-selected={isSelected}
      onClick={() => onClick(dateStr)}
    >
      <span className="text-sm leading-none">{format(date, 'd')}</span>
      {hasIndicator && (
        <span
          className={[
            'absolute bottom-1 w-1 h-1 rounded-full',
            isSelected ? 'bg-white' : 'bg-primary',
          ].join(' ')}
          aria-hidden="true"
        />
      )}
    </button>
  )
}
