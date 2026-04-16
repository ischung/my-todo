import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from '../components/todo/TodoInput'

describe('TodoInput', () => {
  it('입력 필드와 추가 버튼을 렌더링한다', () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '할일 추가' })).toBeInTheDocument()
  })

  it('초기 상태에서 추가 버튼이 비활성화된다', () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByRole('button', { name: '할일 추가' })).toBeDisabled()
  })

  it('공백만 입력하면 추가 버튼이 비활성화 상태를 유지한다', async () => {
    render(<TodoInput onAdd={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), '   ')
    expect(screen.getByRole('button', { name: '할일 추가' })).toBeDisabled()
  })

  it('텍스트 입력 시 추가 버튼이 활성화된다', async () => {
    render(<TodoInput onAdd={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), '새 할일')
    expect(screen.getByRole('button', { name: '할일 추가' })).not.toBeDisabled()
  })

  it('추가 버튼 클릭 시 onAdd가 trim된 값으로 호출된다', async () => {
    const handleAdd = vi.fn()
    render(<TodoInput onAdd={handleAdd} />)
    await userEvent.type(screen.getByRole('textbox'), '  할일  ')
    await userEvent.click(screen.getByRole('button', { name: '할일 추가' }))
    expect(handleAdd).toHaveBeenCalledWith('할일')
  })

  it('추가 후 입력 필드가 초기화된다', async () => {
    render(<TodoInput onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '할일')
    await userEvent.click(screen.getByRole('button', { name: '할일 추가' }))
    expect(input).toHaveValue('')
  })

  it('Enter 입력 시 onAdd가 호출된다', async () => {
    const handleAdd = vi.fn()
    render(<TodoInput onAdd={handleAdd} />)
    await userEvent.type(screen.getByRole('textbox'), '엔터 할일{Enter}')
    expect(handleAdd).toHaveBeenCalledWith('엔터 할일')
  })

  it('공백만 입력 후 Enter를 눌러도 onAdd가 호출되지 않는다', async () => {
    const handleAdd = vi.fn()
    render(<TodoInput onAdd={handleAdd} />)
    await userEvent.type(screen.getByRole('textbox'), '   {Enter}')
    expect(handleAdd).not.toHaveBeenCalled()
  })

  it('disabled=true일 때 입력 필드와 버튼이 모두 비활성화된다', () => {
    render(<TodoInput onAdd={vi.fn()} disabled={true} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: '할일 추가' })).toBeDisabled()
  })
})
