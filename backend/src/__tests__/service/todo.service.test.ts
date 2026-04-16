import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock은 호이스팅됨 — 실제 DB 없이 repository를 완전히 대체
vi.mock('../../repositories/todo.repository.js', () => ({
  todoRepository: {
    findByDate: vi.fn(),
    findById: vi.fn(),
    getMaxOrder: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findDistinctDatesByMonth: vi.fn(),
  },
}))

// mock 설정 후 import
import { todoRepository } from '../../repositories/todo.repository.js'
import { todoService, NotFoundError } from '../../services/todo.service.js'

const mockRepo = todoRepository as {
  findByDate: ReturnType<typeof vi.fn>
  findById: ReturnType<typeof vi.fn>
  getMaxOrder: ReturnType<typeof vi.fn>
  create: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
  findDistinctDatesByMonth: ReturnType<typeof vi.fn>
}

const SAMPLE_TODO = {
  id: 'test-id-1',
  date: '2026-04-16',
  title: '테스트 할일',
  completed: false,
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ──────────────────────────────────────────────
// createTodo
// ──────────────────────────────────────────────
describe('todoService.create', () => {
  it('order가 자동으로 maxOrder + 1로 설정된다', async () => {
    mockRepo.getMaxOrder.mockResolvedValue(2)
    mockRepo.create.mockResolvedValue({ ...SAMPLE_TODO, order: 3 })

    await todoService.create({ date: '2026-04-16', title: '새 할일' })

    expect(mockRepo.getMaxOrder).toHaveBeenCalledWith('2026-04-16')
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ order: 3 })
    )
  })

  it('첫 번째 할일의 order는 1이다 (maxOrder=0)', async () => {
    mockRepo.getMaxOrder.mockResolvedValue(0)
    mockRepo.create.mockResolvedValue({ ...SAMPLE_TODO, order: 1 })

    await todoService.create({ date: '2026-04-16', title: '첫 할일' })

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ order: 1 })
    )
  })

  it('생성된 todo를 반환한다', async () => {
    mockRepo.getMaxOrder.mockResolvedValue(0)
    mockRepo.create.mockResolvedValue(SAMPLE_TODO)

    const result = await todoService.create({ date: '2026-04-16', title: '할일' })

    expect(result).toEqual(SAMPLE_TODO)
  })
})

// ──────────────────────────────────────────────
// updateTodo
// ──────────────────────────────────────────────
describe('todoService.update', () => {
  it('존재하지 않는 id → NotFoundError를 던진다', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(
      todoService.update('non-existent', { title: '수정' })
    ).rejects.toThrow(NotFoundError)
  })

  it('부분 업데이트(title만)가 정상 동작한다', async () => {
    mockRepo.findById.mockResolvedValue(SAMPLE_TODO)
    mockRepo.update.mockResolvedValue({ ...SAMPLE_TODO, title: '수정된 제목' })

    const result = await todoService.update('test-id-1', { title: '수정된 제목' })

    expect(mockRepo.update).toHaveBeenCalledWith('test-id-1', { title: '수정된 제목' })
    expect(result.title).toBe('수정된 제목')
  })

  it('부분 업데이트(completed만)가 정상 동작한다', async () => {
    mockRepo.findById.mockResolvedValue(SAMPLE_TODO)
    mockRepo.update.mockResolvedValue({ ...SAMPLE_TODO, completed: true })

    const result = await todoService.update('test-id-1', { completed: true })

    expect(result.completed).toBe(true)
  })
})

// ──────────────────────────────────────────────
// deleteTodo
// ──────────────────────────────────────────────
describe('todoService.delete', () => {
  it('존재하지 않는 id → NotFoundError를 던진다', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(todoService.delete('non-existent')).rejects.toThrow(NotFoundError)
  })

  it('정상 삭제 시 { id }를 반환한다', async () => {
    mockRepo.findById.mockResolvedValue(SAMPLE_TODO)
    mockRepo.delete.mockResolvedValue(SAMPLE_TODO)

    const result = await todoService.delete('test-id-1')

    expect(mockRepo.delete).toHaveBeenCalledWith('test-id-1')
    expect(result).toEqual({ id: 'test-id-1' })
  })
})

// ──────────────────────────────────────────────
// getDatesByMonth
// ──────────────────────────────────────────────
describe('todoService.getDatesByMonth', () => {
  it('해당 월의 날짜 목록을 중복 없이 반환한다', async () => {
    mockRepo.findDistinctDatesByMonth.mockResolvedValue(['2026-04-01', '2026-04-10'])

    const result = await todoService.getDatesByMonth('2026-04')

    expect(result).toEqual({ month: '2026-04', dates: ['2026-04-01', '2026-04-10'] })
  })

  it('할일이 없는 월은 빈 배열을 반환한다', async () => {
    mockRepo.findDistinctDatesByMonth.mockResolvedValue([])

    const result = await todoService.getDatesByMonth('2026-01')

    expect(result.dates).toHaveLength(0)
  })
})
