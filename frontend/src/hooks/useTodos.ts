import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import type { Todo } from '../types/todo'

interface TodosResponse {
  date: string
  todos: Todo[]
}

export function useTodos(date: string) {
  return useQuery({
    queryKey: queryKeys.todos(date),
    queryFn: () => apiClient.get<TodosResponse>(`/api/v1/todos?date=${date}`),
    enabled: !!date,
  })
}
