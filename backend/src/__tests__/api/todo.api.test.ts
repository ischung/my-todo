import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import request from 'supertest'
import app from '../../app.js'
import { prisma } from '../../lib/prisma.js'

// 각 테스트 후 DB 초기화 — 테스트 간 데이터 격리
afterEach(async () => {
  await prisma.todo.deleteMany()
})

// ──────────────────────────────────────────────
// POST /api/v1/todos
// ──────────────────────────────────────────────
describe('POST /api/v1/todos', () => {
  it('정상 요청 시 201과 생성된 todo를 반환한다', async () => {
    const res = await request(app)
      .post('/api/v1/todos')
      .send({ date: '2026-04-16', title: '통합 테스트 할일' })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      date: '2026-04-16',
      title: '통합 테스트 할일',
      completed: false,
      order: 1,
    })
    expect(res.body.data.id).toBeDefined()
  })

  it('title 없이 요청하면 400을 반환한다', async () => {
    const res = await request(app)
      .post('/api/v1/todos')
      .send({ date: '2026-04-16' })

    expect(res.status).toBe(400)
  })

  it('잘못된 date 형식이면 400을 반환한다', async () => {
    const res = await request(app)
      .post('/api/v1/todos')
      .send({ date: '2026/04/16', title: '할일' })

    expect(res.status).toBe(400)
  })
})

// ──────────────────────────────────────────────
// GET /api/v1/todos?date=
// ──────────────────────────────────────────────
describe('GET /api/v1/todos', () => {
  beforeAll(async () => {
    await prisma.todo.create({ data: { date: '2026-04-16', title: '할일1', order: 1 } })
    await prisma.todo.create({ data: { date: '2026-04-16', title: '할일2', order: 2 } })
  })

  it('날짜별 할일 목록을 order 오름차순으로 반환한다', async () => {
    const res = await request(app).get('/api/v1/todos?date=2026-04-16')

    expect(res.status).toBe(200)
    expect(res.body.data.date).toBe('2026-04-16')
    expect(res.body.data.todos).toHaveLength(2)
    expect(res.body.data.todos[0].title).toBe('할일1')
  })

  it('date 파라미터 없으면 400을 반환한다', async () => {
    const res = await request(app).get('/api/v1/todos')
    expect(res.status).toBe(400)
  })

  it('해당 날짜에 할일이 없으면 빈 배열을 반환한다', async () => {
    const res = await request(app).get('/api/v1/todos?date=2026-01-01')
    expect(res.status).toBe(200)
    expect(res.body.data.todos).toHaveLength(0)
  })
})

// ──────────────────────────────────────────────
// PATCH /api/v1/todos/:id
// ──────────────────────────────────────────────
describe('PATCH /api/v1/todos/:id', () => {
  it('title 부분 업데이트가 정상 동작한다', async () => {
    const todo = await prisma.todo.create({ data: { date: '2026-04-17', title: '원래 제목', order: 1 } })

    const res = await request(app)
      .patch(`/api/v1/todos/${todo.id}`)
      .send({ title: '수정된 제목' })

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('수정된 제목')
  })

  it('completed 토글이 정상 동작한다', async () => {
    const todo = await prisma.todo.create({ data: { date: '2026-04-17', title: '완료 테스트', order: 2 } })

    const res = await request(app)
      .patch(`/api/v1/todos/${todo.id}`)
      .send({ completed: true })

    expect(res.status).toBe(200)
    expect(res.body.data.completed).toBe(true)
  })

  it('존재하지 않는 id → 404를 반환한다', async () => {
    const res = await request(app)
      .patch('/api/v1/todos/non-existent-id')
      .send({ title: '수정' })

    expect(res.status).toBe(404)
  })
})

// ──────────────────────────────────────────────
// DELETE /api/v1/todos/:id
// ──────────────────────────────────────────────
describe('DELETE /api/v1/todos/:id', () => {
  it('정상 삭제 시 200과 { id }를 반환한다', async () => {
    const todo = await prisma.todo.create({ data: { date: '2026-04-18', title: '삭제 대상', order: 1 } })

    const res = await request(app).delete(`/api/v1/todos/${todo.id}`)

    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(todo.id)
  })

  it('삭제 후 DB에서 실제로 제거된다', async () => {
    const todo = await prisma.todo.create({ data: { date: '2026-04-18', title: 'DB 삭제 확인', order: 2 } })

    await request(app).delete(`/api/v1/todos/${todo.id}`)
    const deleted = await prisma.todo.findUnique({ where: { id: todo.id } })

    expect(deleted).toBeNull()
  })

  it('존재하지 않는 id → 404를 반환한다', async () => {
    const res = await request(app).delete('/api/v1/todos/non-existent-id')
    expect(res.status).toBe(404)
  })
})

// ──────────────────────────────────────────────
// GET /api/v1/todos/dates?month=
// ──────────────────────────────────────────────
describe('GET /api/v1/todos/dates', () => {
  beforeAll(async () => {
    await prisma.todo.createMany({
      data: [
        { date: '2026-05-01', title: 'A', order: 1 },
        { date: '2026-05-01', title: 'B', order: 2 }, // 같은 날 중복
        { date: '2026-05-15', title: 'C', order: 1 },
      ],
    })
  })

  it('해당 월의 날짜 목록을 중복 없이 반환한다', async () => {
    const res = await request(app).get('/api/v1/todos/dates?month=2026-05')

    expect(res.status).toBe(200)
    expect(res.body.data.month).toBe('2026-05')
    expect(res.body.data.dates).toEqual(['2026-05-01', '2026-05-15'])
  })

  it('month 파라미터 없으면 400을 반환한다', async () => {
    const res = await request(app).get('/api/v1/todos/dates')
    expect(res.status).toBe(400)
  })

  it('해당 월에 할일이 없으면 빈 배열을 반환한다', async () => {
    const res = await request(app).get('/api/v1/todos/dates?month=2020-01')
    expect(res.status).toBe(200)
    expect(res.body.data.dates).toHaveLength(0)
  })
})
