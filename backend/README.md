# Calendar Todo App — Backend

Express + TypeScript + Zod 기반 REST API 서버.

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env

# 3. 개발 서버 실행 (http://localhost:3000)
npm run dev
```

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | tsx watch 개발 서버 실행 |
| `npm run build` | TypeScript 빌드 (dist/) |
| `npm run start` | 빌드 결과물 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 |

## 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/v1/health` | 헬스체크 |

## 공통 응답 형식

```json
// 성공
{ "data": <payload>, "error": null }

// 실패
{ "data": null, "error": { "code": "ERROR_CODE", "message": "설명" } }
```

## 디렉토리 구조

```
src/
├── routes/        # Express 라우터 (HTTP 파싱, 응답 직렬화)
├── services/      # 비즈니스 로직, 유효성 검증
├── repositories/  # Prisma 쿼리, DB 접근
├── middlewares/   # validate.ts, errorHandler.ts
├── schemas/       # Zod 스키마 정의
├── lib/           # 공통 response 헬퍼
└── app.ts         # 앱 진입점
```

## 기술 스택

- **Node.js 20** + **Express 4** — REST API 서버
- **TypeScript 5 (strict)** — 타입 안정성
- **Zod** — 입력 검증
- **tsx** — TypeScript 직접 실행 (개발 환경)
