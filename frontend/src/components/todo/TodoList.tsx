import type { Todo } from '../../types/todo'
import { TodoItem } from './TodoItem'

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
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
