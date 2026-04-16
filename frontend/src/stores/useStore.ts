import { create } from 'zustand'
import { format } from 'date-fns'

export interface ToastMessage {
  id: number
  message: string
  type: 'error' | 'success'
}

interface AppState {
  selectedDate: string // 'YYYY-MM-DD'
  currentMonth: string // 'YYYY-MM'
  setSelectedDate: (date: string) => void
  setCurrentMonth: (month: string) => void
  // Toast — trigger mechanism for issue #12
  toasts: ToastMessage[]
  addToast: (message: string, type?: ToastMessage['type']) => void
  removeToast: (id: number) => void
}

const today = new Date()

export const useStore = create<AppState>((set) => ({
  selectedDate: format(today, 'yyyy-MM-dd'),
  currentMonth: format(today, 'yyyy-MM'),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentMonth: (month) => set({ currentMonth: month }),
  toasts: [],
  addToast: (message, type = 'error') =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
