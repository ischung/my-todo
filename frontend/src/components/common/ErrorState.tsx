interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = '데이터를 불러오지 못했습니다.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 text-neutral-500"
    >
      <span className="text-4xl mb-3" aria-hidden="true">⚠️</span>
      <p className="text-sm font-medium text-danger">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
