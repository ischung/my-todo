import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import type { Todo } from '../types/todo'

interface UpdateTodoInput {
  id: string
  date: string
  title?: string
  completed?: boolean
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title, completed }: UpdateTodoInput) =>
      apiClient.patch<Todo>(`/api/v1/todos/${id}`, { title, completed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos(variables.date) })
    },
  })
}
