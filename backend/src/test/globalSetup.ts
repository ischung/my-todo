import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.resolve(__dirname, '../..')

const TEST_DB_PATH = path.resolve(backendRoot, 'prisma', 'test.db')
const TEST_DB_URL = `file:${TEST_DB_PATH}`
const PRISMA_BIN = path.join(backendRoot, 'node_modules', '.bin', 'prisma')

export async function setup() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }
  execSync(`${PRISMA_BIN} db push --skip-generate`, {
    cwd: backendRoot,
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: 'pipe',
  })
  // 환경 변수 설정 — 메인 프로세스 및 워커 모두에 적용
  process.env['DATABASE_URL'] = TEST_DB_URL
}

export async function teardown() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }
}
