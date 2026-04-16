import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import { useStore } from '../stores/useStore'
import type { Todo } from '../types/todo'

interface UpdateTodoInput {
  id: string
  date: string
  title?: string
  completed?: boolean
}

interface TodosCache {
  date: string
  todos: Todo[]
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  const addToast = useStore((s) => s.addToast)

  return useMutation({
    mutationFn: ({ id, title, completed }: UpdateTodoInput) =>
      apiClient.patch<Todo>(`/api/v1/todos/${id}`, { title, completed }),

    onMutate: async (variables) => {
      const key = queryKeys.todos(variables.date)
      // 진행 중인 refetch 취소 (race condition 방지)
      await queryClient.cancelQueries({ queryKey: key })
      // 현재 캐시 스냅샷 저장
      const snapshot = queryClient.getQueryData<TodosCache>(key)
      // 즉시 UI 반영
      queryClient.setQueryData<TodosCache>(key, (old) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo.id === variables.id
              ? {
                  ...todo,
                  ...(variables.title !== undefined ? { title: variables.title } : {}),
                  ...(variables.completed !== undefined ? { completed: variables.completed } : {}),
                }
              : todo
          ),
        }
      })
      return { snapshot }
    },

    onError: (_err, variables, context) => {
      // 롤백
      if (context?.snapshot) {
        queryClient.setQueryData(queryKeys.todos(variables.date), context.snapshot)
      }
      addToast('변경에 실패했습니다. 다시 시도해 주세요.')
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos(variables.date) })
    },
  })
}
