import { useEffect } from 'react'
import { useStore } from '../../stores/useStore'

const AUTO_DISMISS_MS = 4000

function ToastItem({ id, message }: { id: number; message: string }) {
  const removeToast = useStore((s) => s.removeToast)

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [id, removeToast])

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 bg-neutral-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg min-w-[240px] max-w-xs animate-fade-in"
    >
      <span className="shrink-0" aria-hidden="true">⚠️</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 text-white/60 hover:text-white transition-colors"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} />
      ))}
    </div>
  )
}
