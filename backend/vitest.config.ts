import { defineConfig } from 'vitest/config'
import path from 'path'

// 절대 경로 사용 — 워커 프로세스에서도 동일한 파일을 가리킴
const TEST_DB_PATH = path.resolve(process.cwd(), 'prisma', 'test.db')

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      DATABASE_URL: `file:${TEST_DB_PATH}`,
      NODE_ENV: 'test',
    },
    globalSetup: './src/test/globalSetup.ts',
    // setupFiles는 API 통합 테스트 파일 내부에서 직접 처리
    sequence: { concurrent: false },
  },
})
