import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '../components/todo/TodoItem'
import type { Todo } from '../types/todo'

// 실제 네트워크 호출 없이 mutation 훅 대체
const mockUpdateMutate = vi.fn()
const mockDeleteMutate = vi.fn()

vi.mock('../hooks/useUpdateTodo', () => ({
  useUpdateTodo: () => ({ mutate: mockUpdateMutate, isPending: false }),
}))

vi.mock('../hooks/useDeleteTodo', () => ({
  useDeleteTodo: () => ({ mutate: mockDeleteMutate, isPending: false }),
}))

const SAMPLE_TODO: Todo = {
  id: 'todo-1',
  title: '테스트 할일',
  date: '2026-04-16',
  order: 1,
  completed: false,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TodoItem', () => {
  it('할일 제목을 렌더링한다', () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    expect(screen.getByText('테스트 할일')).toBeInTheDocument()
  })

  it('체크박스 클릭 시 useUpdateTodo mutate가 completed 반전 값으로 호출된다', async () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'todo-1', completed: true })
    )
  })

  it('완료 상태 todo의 체크박스는 checked다', () => {
    render(<TodoItem todo={{ ...SAMPLE_TODO, completed: true }} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('완료 상태일 때 제목에 line-through 클래스가 적용된다', () => {
    render(<TodoItem todo={{ ...SAMPLE_TODO, completed: true }} />)
    expect(screen.getByText('테스트 할일').className).toContain('line-through')
  })

  it('제목 클릭 시 인라인 편집 모드로 전환된다', async () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    await userEvent.click(screen.getByText('테스트 할일'))
    // 편집 모드: input이 나타남
    expect(screen.getByRole('textbox', { name: '할일 내용 편집' })).toBeInTheDocument()
  })

  it('편집 모드에서 Enter 입력 시 useUpdateTodo mutate가 호출된다', async () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    await userEvent.click(screen.getByText('테스트 할일'))
    const input = screen.getByRole('textbox', { name: '할일 내용 편집' })
    await userEvent.clear(input)
    await userEvent.type(input, '수정된 할일{Enter}')
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'todo-1', title: '수정된 할일' })
    )
  })

  it('편집 모드에서 Esc 입력 시 원래 값으로 복원되고 읽기 모드로 돌아온다', async () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    await userEvent.click(screen.getByText('테스트 할일'))
    const input = screen.getByRole('textbox', { name: '할일 내용 편집' })
    await userEvent.clear(input)
    await userEvent.type(input, '수정 중{Escape}')
    // 편집 input 사라지고 원래 제목 복원
    expect(screen.queryByRole('textbox', { name: '할일 내용 편집' })).not.toBeInTheDocument()
    expect(screen.getByText('테스트 할일')).toBeInTheDocument()
    expect(mockUpdateMutate).not.toHaveBeenCalled()
  })

  it('삭제 버튼 클릭 시 useDeleteTodo mutate가 호출된다', async () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    // 삭제 버튼은 hover 시 표시되지만 DOM에는 존재함 (opacity만 0)
    const deleteBtn = screen.getByRole('button', { name: '테스트 할일 삭제' })
    await userEvent.click(deleteBtn)
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'todo-1' })
    )
  })

  it('수정 버튼 클릭 시 편집 모드로 전환된다', async () => {
    render(<TodoItem todo={SAMPLE_TODO} />)
    await userEvent.click(screen.getByRole('button', { name: '테스트 할일 수정' }))
    expect(screen.getByRole('textbox', { name: '할일 내용 편집' })).toBeInTheDocument()
  })
})
