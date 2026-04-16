import { useStore } from '../../stores/useStore'
import { useTodos } from '../../hooks/useTodos'
import { useCreateTodo } from '../../hooks/useCreateTodo'
import { TodoPanelHeader } from './TodoPanelHeader'
import { TodoInput } from './TodoInput'
import { TodoList } from './TodoList'
import { SkeletonLoader } from '../common/SkeletonLoader'
import { ErrorState } from '../common/ErrorState'

export function TodoPanel() {
  const { selectedDate } = useStore()
  const { data, isLoading, isError, refetch } = useTodos(selectedDate)
  const createTodo = useCreateTodo()

  const handleAdd = (title: string) => {
    createTodo.mutate({ date: selectedDate, title })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 h-full">
      <TodoPanelHeader date={selectedDate} />
      <TodoInput onAdd={handleAdd} disabled={createTodo.isPending} />

      {isLoading && <SkeletonLoader variant="todoList" />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
        <TodoList todos={data?.todos ?? []} isLoading={false} />
      )}
    </div>
  )
}
