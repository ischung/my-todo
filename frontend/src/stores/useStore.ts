import { create } from 'zustand'
import { format } from 'date-fns'

interface AppState {
  selectedDate: string // 'YYYY-MM-DD'
  currentMonth: string // 'YYYY-MM'
  setSelectedDate: (date: string) => void
  setCurrentMonth: (month: string) => void
}

const today = new Date()

export const useStore = create<AppState>((set) => ({
  selectedDate: format(today, 'yyyy-MM-dd'),
  currentMonth: format(today, 'yyyy-MM'),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentMonth: (month) => set({ currentMonth: month }),
}))
