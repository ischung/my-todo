# Calendar Todo App — Frontend

React + Vite + Tailwind CSS 기반 프론트엔드.

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env

# 3. 개발 서버 실행 (http://localhost:5173)
npm run dev
```

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (HMR) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run preview` | 빌드 결과물 미리보기 |

## 디렉토리 구조

```
src/
├── components/   # UI 컴포넌트
├── hooks/        # 커스텀 훅 (API 연동 등)
├── stores/       # Zustand 전역 상태
├── lib/          # 유틸리티, 쿼리 키, API 클라이언트
├── App.tsx
└── main.tsx
```

## 기술 스택

- **React 18** — 컴포넌트 프레임워크
- **Vite 5** — 빌드 도구
- **Tailwind CSS 3** — 스타일링
- **TypeScript 5 (strict)** — 타입 안정성
