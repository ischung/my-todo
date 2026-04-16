export const queryKeys = {
  todos: (date: string) => ['todos', date] as const,
  datesWithTodos: (month: string) => ['datesWithTodos', month] as const,
}
