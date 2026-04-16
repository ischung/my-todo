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
    /*
      flex flex-col h-full: 부모(App의 flex-1)를 완전히 채움
      목록 영역이 flex-1 + overflow-y-auto로 독립 스크롤
    */
    <div className="bg-white rounded-2xl shadow-sm p-4 h-full flex flex-col">
      <TodoPanelHeader date={selectedDate} />
      <TodoInput onAdd={handleAdd} disabled={createTodo.isPending} />

      {/* 목록 영역: 남은 공간을 차지하고 내용이 넘치면 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading && <SkeletonLoader variant="todoList" />}
        {isError && <ErrorState onRetry={refetch} />}
        {!isLoading && !isError && (
          <TodoList todos={data?.todos ?? []} isLoading={false} />
        )}
      </div>
    </div>
  )
}
