import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'

interface DeleteTodoInput {
  id: string
  date: string
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteTodoInput) =>
      apiClient.delete<{ id: string }>(`/api/v1/todos/${id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos(variables.date) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.datesWithTodos(variables.date.slice(0, 7)),
      })
    },
  })
}
