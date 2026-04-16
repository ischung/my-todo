import { useState } from 'react'

interface TodoInputProps {
  onAdd: (title: string) => void
  disabled?: boolean
}

export function TodoInput({ onAdd, disabled }: TodoInputProps) {
  const [value, setValue] = useState('')

  const trimmed = value.trim()
  const canSubmit = trimmed.length > 0 && !disabled

  const handleSubmit = () => {
    if (!canSubmit) return
    onAdd(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        placeholder="할일을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="새 할일 입력"
      />
      <button
        className="px-4 py-2 bg-primary text-white text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        onClick={handleSubmit}
        disabled={!canSubmit}
        aria-label="할일 추가"
      >
        추가
      </button>
    </div>
  )
}
