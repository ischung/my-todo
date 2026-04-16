import { useState, useRef, useEffect } from 'react'
import type { Todo } from '../../types/todo'
import { useUpdateTodo } from '../../hooks/useUpdateTodo'
import { useDeleteTodo } from '../../hooks/useDeleteTodo'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const enterEditMode = () => {
    setEditValue(todo.title)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditValue(todo.title)
    setIsEditing(false)
  }

  const saveEdit = () => {
    const trimmed = editValue.trim()
    if (!trimmed) return
    updateTodo.mutate({ id: todo.id, date: todo.date, title: trimmed })
    setIsEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const handleToggleComplete = () => {
    updateTodo.mutate({ id: todo.id, date: todo.date, completed: !todo.completed })
  }

  const handleDelete = () => {
    deleteTodo.mutate({ id: todo.id, date: todo.date })
  }

  return (
    <li className="group flex items-center gap-3 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors">
      {/* 체크박스 */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
        aria-label={`${todo.title} 완료 체크`}
        aria-checked={todo.completed}
        disabled={updateTodo.isPending}
      />

      {/* 제목: 읽기 모드 / 편집 모드 */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={cancelEdit}
          className="flex-1 bg-white border border-primary rounded px-2 py-0.5 outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="할일 내용 편집"
        />
      ) : (
        // role="button" + tabIndex + onKeyDown으로 키보드 접근성 확보
        <span
          role="button"
          tabIndex={0}
          className={`flex-1 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${todo.completed ? 'line-through text-neutral-400' : ''}`}
          onClick={enterEditMode}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterEditMode() } }}
          aria-label={`${todo.title} 편집`}
        >
          {todo.title}
        </span>
      )}

      {/* 액션 버튼 (hover/focus 시 표시) */}
      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
          <button
            onClick={enterEditMode}
            className="p-1 rounded hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`${todo.title} 수정`}
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTodo.isPending}
            className="p-1 rounded hover:bg-red-100 text-neutral-500 hover:text-red-600 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`${todo.title} 삭제`}
          >
            🗑️
          </button>
        </div>
      )}

      {/* 편집 모드: 저장 버튼 */}
      {isEditing && (
        <button
          onMouseDown={(e) => { e.preventDefault(); saveEdit() }}
          disabled={!editValue.trim()}
          className="px-2 py-0.5 text-xs bg-primary text-white rounded disabled:opacity-40 disabled:cursor-not-allowed shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          aria-label="할일 저장"
        >
          저장
        </button>
      )}
    </li>
  )
}
