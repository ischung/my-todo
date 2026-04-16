import type { Todo } from '../../types/todo'

interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
}

export function TodoList({ todos, isLoading }: TodoListProps) {
  if (isLoading) {
    return <p className="text-sm text-neutral-400 text-center py-8">불러오는 중...</p>
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <span className="text-3xl mb-2">📝</span>
        <p className="text-sm">등록된 할일이 없습니다</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-700"
        >
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-neutral-400' : ''}`}
          >
            {todo.title}
          </span>
        </li>
      ))}
    </ul>
  )
}
