export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <span className="text-4xl mb-3" aria-hidden="true">📋</span>
      <p className="text-sm font-medium">이 날은 할일이 없어요.</p>
      <p className="text-xs mt-1 text-neutral-500">첫 번째 할일을 추가해보세요!</p>
    </div>
  )
}
