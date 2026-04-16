import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { CalendarPanel } from './components/calendar/CalendarPanel'
import { TodoPanel } from './components/todo/TodoPanel'
import { ToastContainer } from './components/common/Toast'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/*
        h-screen + overflow-hidden: 뷰포트를 벗어나지 않도록 고정
        flex-col (mobile): 캘린더 상단 → TodoPanel 하단
        md:flex-row (desktop): 캘린더 좌측 40% | TodoPanel 우측 60%
      */}
      <div className="h-screen overflow-hidden bg-neutral-50 flex flex-col md:flex-row">
        {/* 캘린더 패널: 모바일에서 높이 자동(shrink-0), 데스크탑에서 전체 높이 */}
        <div className="shrink-0 w-full md:w-2/5 p-3 md:p-4 md:h-full md:overflow-y-auto">
          <CalendarPanel />
        </div>

        {/*
          TodoPanel: 남은 공간을 모두 차지(flex-1)
          min-h-0: flexbox에서 overflow-y-auto가 작동하려면 필수
        */}
        <div className="flex-1 min-h-0 w-full md:w-3/5 px-3 pb-3 md:p-4 md:h-full">
          <TodoPanel />
        </div>
      </div>
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
