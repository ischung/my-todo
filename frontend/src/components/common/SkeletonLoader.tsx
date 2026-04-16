function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      {/* 월 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-6 h-6 bg-neutral-200 rounded" />
        <div className="w-24 h-5 bg-neutral-200 rounded" />
        <div className="w-6 h-6 bg-neutral-200 rounded" />
      </div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex justify-center">
            <div className="w-5 h-4 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
      {/* 6×7 날짜 그리드 */}
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="grid grid-cols-7 mb-1">
          {Array.from({ length: 7 }).map((_, col) => (
            <div key={col} className="flex justify-center py-1">
              <div className="w-8 h-8 bg-neutral-200 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function TodoListSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
          <div className="w-4 h-4 bg-neutral-200 rounded" />
          <div className={`h-4 bg-neutral-200 rounded flex-1 ${i === 1 ? 'w-3/4' : ''}`} />
        </div>
      ))}
    </div>
  )
}

interface SkeletonLoaderProps {
  variant: 'calendar' | 'todoList'
}

export function SkeletonLoader({ variant }: SkeletonLoaderProps) {
  return variant === 'calendar' ? <CalendarSkeleton /> : <TodoListSkeleton />
}
