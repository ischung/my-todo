import type { Todo } from '../../types/todo'
import { TodoItem } from './TodoItem'
import { EmptyState } from '../common/EmptyState'

interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
}

export function TodoList({ todos, isLoading }: TodoListProps) {
  if (isLoading) return null

  if (todos.length === 0) return <EmptyState />

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
