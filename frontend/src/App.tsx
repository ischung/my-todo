import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { CalendarPanel } from './components/calendar/CalendarPanel'
import { TodoPanel } from './components/todo/TodoPanel'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 p-4">
          <CalendarPanel />
        </div>
        <div className="w-full md:w-3/5 p-4">
          <TodoPanel />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
