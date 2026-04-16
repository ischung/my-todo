interface MonthNavigationProps {
  label: string
  onPrev: () => void
  onNext: () => void
}

export function MonthNavigation({ label, onPrev, onNext }: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between px-2 mb-3">
      <button
        type="button"
        aria-label="이전 달"
        onClick={onPrev}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-900 transition-colors"
      >
        ‹
      </button>
      <span className="text-sm font-semibold text-neutral-900">{label}</span>
      <button
        type="button"
        aria-label="다음 달"
        onClick={onNext}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-900 transition-colors"
      >
        ›
      </button>
    </div>
  )
}
