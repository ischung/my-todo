import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'

interface DatesResponse {
  month: string
  dates: string[]
}

export function useDatesWithTodos(month: string) {
  return useQuery({
    queryKey: queryKeys.datesWithTodos(month),
    queryFn: () => apiClient.get<DatesResponse>(`/api/v1/todos/dates?month=${month}`),
    enabled: !!month,
  })
}
