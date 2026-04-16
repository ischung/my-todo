import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <h1 className="text-xl font-semibold text-neutral-900">Calendar Todo App</h1>
      </div>
    </QueryClientProvider>
  )
}

export default App
