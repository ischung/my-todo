import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import type { Todo } from '../types/todo'

interface CreateTodoInput {
  date: string
  title: string
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTodoInput) =>
      apiClient.post<Todo>('/api/v1/todos', input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos(variables.date) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.datesWithTodos(variables.date.slice(0, 7)),
      })
    },
  })
}
