import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import { useStore } from '../stores/useStore'
import type { Todo } from '../types/todo'

interface DeleteTodoInput {
  id: string
  date: string
}

interface TodosCache {
  date: string
  todos: Todo[]
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  const addToast = useStore((s) => s.addToast)

  return useMutation({
    mutationFn: ({ id }: DeleteTodoInput) =>
      apiClient.delete<{ id: string }>(`/api/v1/todos/${id}`),

    onMutate: async (variables) => {
      const key = queryKeys.todos(variables.date)
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<TodosCache>(key)
      // 즉시 목록에서 제거
      queryClient.setQueryData<TodosCache>(key, (old) => {
        if (!old) return old
        return { ...old, todos: old.todos.filter((t) => t.id !== variables.id) }
      })
      return { snapshot }
    },

    onError: (_err, variables, context) => {
      // 롤백
      if (context?.snapshot) {
        queryClient.setQueryData(queryKeys.todos(variables.date), context.snapshot)
      }
      addToast('삭제에 실패했습니다. 다시 시도해 주세요.')
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos(variables.date) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.datesWithTodos(variables.date.slice(0, 7)),
      })
    },
  })
}
