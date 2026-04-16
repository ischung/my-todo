import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DayCell } from '../components/calendar/DayCell'

const TODAY = new Date()
const FIXED_DATE = new Date(2026, 3, 16) // 2026-04-16

describe('DayCell', () => {
  it('날짜 숫자를 렌더링한다', () => {
    render(
      <DayCell
        date={FIXED_DATE}
        isSelected={false}
        hasIndicator={false}
        onClick={vi.fn()}
      />
    )
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('aria-label이 한국어 날짜 형식으로 설정된다', () => {
    render(
      <DayCell
        date={FIXED_DATE}
        isSelected={false}
        hasIndicator={false}
        onClick={vi.fn()}
      />
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', '2026년 4월 16일')
  })

  it('클릭 시 onClick이 해당 날짜 문자열과 함께 호출된다', async () => {
    const handleClick = vi.fn()
    render(
      <DayCell
        date={FIXED_DATE}
        isSelected={false}
        hasIndicator={false}
        onClick={handleClick}
      />
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith('2026-04-16')
  })

  it('선택 상태일 때 aria-selected="true"이고 bg-primary 클래스가 적용된다', () => {
    render(
      <DayCell
        date={FIXED_DATE}
        isSelected={true}
        hasIndicator={false}
        onClick={vi.fn()}
      />
    )
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-selected', 'true')
    expect(btn.className).toContain('bg-primary')
  })

  it('비선택 상태일 때 aria-selected="false"다', () => {
    render(
      <DayCell
        date={FIXED_DATE}
        isSelected={false}
        hasIndicator={false}
        onClick={vi.fn()}
      />
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-selected', 'false')
  })

  it('hasIndicator=true일 때 인디케이터 점이 렌더링된다', () => {
    const { container } = render(
      <DayCell
        date={FIXED_DATE}
        isSelected={false}
        hasIndicator={true}
        onClick={vi.fn()}
      />
    )
    // 인디케이터는 aria-hidden span
    const indicator = container.querySelector('span[aria-hidden="true"]')
    expect(indicator).toBeInTheDocument()
  })

  it('hasIndicator=false일 때 인디케이터 점이 없다', () => {
    const { container } = render(
      <DayCell
        date={FIXED_DATE}
        isSelected={false}
        hasIndicator={false}
        onClick={vi.fn()}
      />
    )
    const indicator = container.querySelector('span[aria-hidden="true"]')
    expect(indicator).not.toBeInTheDocument()
  })

  it('오늘 날짜에 text-primary 클래스가 적용된다', () => {
    render(
      <DayCell
        date={TODAY}
        isSelected={false}
        hasIndicator={false}
        onClick={vi.fn()}
      />
    )
    expect(screen.getByRole('button').className).toContain('text-primary')
  })
})
