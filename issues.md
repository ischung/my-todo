# Issues — Calendar Todo App

> **원본 TechSpec**: `calendar-todo-techspec.md`
> **생성일**: 2026-04-16
> **총 이슈 수**: 16개
> **총 예상 소요**: 11일

---

## #1 [Setup] FE 프로젝트 초기화 (Vite + React + Tailwind + TypeScript)

**레이블**: Setup
**예상 소요**: 0.5일
**의존성**: 없음

### 설명

현재 빈 디렉토리 상태에서 Frontend 개발 환경을 구성한다.
Vite 기반 React + TypeScript 프로젝트를 생성하고, Tailwind CSS와 커스텀 디자인 토큰을 설정한다.
ESLint + Prettier 규칙을 포함하여 코드 품질 기준을 초기부터 확립한다.

구성 항목:
- `frontend/` 디렉토리에 `npm create vite@latest` 로 React+TS 프로젝트 생성
- Tailwind CSS v3 설치 및 `tailwind.config.js`에 디자인 토큰 추가 (TechSpec §7-1 참고)
- ESLint + Prettier 설정
- `src/` 디렉토리 구조 초기 세팅 (`components/`, `hooks/`, `stores/`, `lib/`)
- `README.md`에 로컬 실행 방법 기술

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run dev` 실행 시 브라우저에서 React 앱이 정상 렌더링된다
- [ ] `tailwind.config.js`에 `primary`, `success`, `danger`, `neutral` 토큰이 정의되어 있다
- [ ] `npm run lint` 실행 시 오류 없이 통과한다
- [ ] TypeScript strict 모드가 활성화되어 있다

### 참고

- TechSpec 섹션: §3 기술 스택, §7-1 디자인 토큰
- 관련 이슈: 없음

---

## #2 [Setup] BE 프로젝트 초기화 (Express + TypeScript + Zod + 공통 응답 구조)

**레이블**: Setup
**예상 소요**: 0.5일
**의존성**: 없음

### 설명

Backend 개발 환경을 구성한다.
Express + TypeScript 기반 프로젝트를 생성하고, 레이어드 아키텍처 디렉토리 구조와
공통 응답 형식(`{ data, error }`)을 초기에 정립한다.
Zod 기반 입력 검증 미들웨어와 전역 에러 핸들러를 미리 구현하여 이후 API 개발의 일관성을 보장한다.

구성 항목:
- `backend/` 디렉토리에 Express + TypeScript 프로젝트 설정 (`tsconfig.json`, `nodemon`)
- 디렉토리 구조 생성: `routes/`, `services/`, `repositories/`, `middlewares/`, `schemas/`
- 공통 응답 헬퍼 구현: `success(data)` / `fail(code, message)`
- Zod 검증 미들웨어 (`middlewares/validate.ts`) 구현
- 전역 에러 핸들러 (`middlewares/errorHandler.ts`) 구현
- CORS 설정 (개발 환경: 모든 origin 허용, 프로덕션: 환경변수로 FE 도메인 지정)
- `GET /health` 헬스체크 엔드포인트

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run dev` 실행 시 Express 서버가 정상 기동된다
- [ ] `GET /health` 가 `{ data: { status: "ok" }, error: null }` 를 반환한다
- [ ] 존재하지 않는 라우트 요청 시 `{ data: null, error: { code: "NOT_FOUND", ... } }` 형식으로 응답한다
- [ ] Zod 검증 실패 시 `VALIDATION_ERROR` 400 응답이 반환된다
- [ ] TypeScript strict 모드가 활성화되어 있다

### 참고

- TechSpec 섹션: §5-1 공통 응답 규칙, §6-2 레이어 책임 분리
- 관련 이슈: 없음

---

## #3 [DB] Prisma 스키마 정의 및 SQLite 초기 마이그레이션

**레이블**: DB
**예상 소요**: 0.5일
**의존성**: Depends on #2

### 설명

Backend 프로젝트에 Prisma를 설치하고 Todo 엔티티 스키마를 정의한 뒤, 초기 마이그레이션을 실행한다.
`date` 컬럼 인덱스를 포함하여 날짜별 조회 성능을 초기부터 확보한다.

구성 항목:
- Prisma 설치 및 `prisma/schema.prisma` 작성 (TechSpec §4-2 스키마 그대로 적용)
- `DATABASE_URL=file:./dev.db` 환경변수 설정 (`.env.example` 포함)
- `npx prisma migrate dev --name init` 으로 초기 마이그레이션 실행
- `PrismaClient` 싱글턴 인스턴스 파일 생성 (`src/lib/prisma.ts`)
- `.gitignore`에 `*.db`, `*.db-journal` 추가

### 수락 기준 (Acceptance Criteria)

- [ ] `prisma/migrations/` 디렉토리에 초기 마이그레이션 파일이 생성된다
- [ ] `dev.db` 파일이 생성되고 `Todo` 테이블이 존재한다
- [ ] `date` 컬럼에 인덱스가 적용되어 있다
- [ ] `PrismaClient`를 import하여 쿼리를 실행할 수 있다
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있다

### 참고

- TechSpec 섹션: §4-2 Prisma 스키마, §4-3 ERD
- 관련 이슈: Depends on #2

---

## #4 [Infra] GitHub Actions CI 파이프라인 구성 (lint + 타입체크)

**레이블**: Infra
**예상 소요**: 0.5일
**의존성**: Depends on #1, #2

### 설명

GitHub 저장소에 CI 파이프라인을 구성한다.
`main` 브랜치에 PR이 생성되거나 push될 때 자동으로 lint와 타입체크를 실행하여
코드 품질 기준을 자동으로 검증한다.

구성 항목:
- `.github/workflows/ci.yml` 작성
- Trigger: `push` to `main`, `pull_request` to `main`
- Jobs:
  - `lint-fe`: `cd frontend && npm run lint`
  - `typecheck-fe`: `cd frontend && npm run typecheck`
  - `lint-be`: `cd backend && npm run lint`
  - `typecheck-be`: `cd backend && npm run typecheck`
- Node.js 20.x, 캐시 설정 (`actions/cache` for `node_modules`)

### 수락 기준 (Acceptance Criteria)

- [ ] PR 생성 시 GitHub Actions가 자동으로 실행된다
- [ ] lint 오류가 있으면 CI가 실패한다
- [ ] TypeScript 타입 오류가 있으면 CI가 실패한다
- [ ] `node_modules` 캐시가 적용되어 2회차 실행 시 설치 단계가 단축된다

### 참고

- TechSpec 섹션: §2-3 배포 환경 (CI/CD: GitHub Actions)
- 관련 이슈: Depends on #1, #2

---

## #5 [Backend] Todo CRUD API 구현 (GET · POST · PATCH · DELETE /api/v1/todos)

**레이블**: Backend
**예상 소요**: 1.5일
**의존성**: Depends on #3

### 설명

핵심 Todo CRUD 엔드포인트 4개를 레이어드 아키텍처로 구현한다.
Router → Service → Repository 구조를 엄격히 따르며, 각 레이어의 책임을 분리한다.

구현 대상:
- `GET /api/v1/todos?date=YYYY-MM-DD` — 날짜별 할일 목록 (`order` 오름차순)
- `POST /api/v1/todos` — 할일 추가 (order 자동 설정: 해당 날짜 max order + 1)
- `PATCH /api/v1/todos/:id` — 제목 또는 완료 상태 부분 업데이트
- `DELETE /api/v1/todos/:id` — 영구 삭제

비즈니스 규칙:
- title: trim 후 1~100자, 공백 전용 불가 (Zod로 검증)
- date: `YYYY-MM-DD` 형식 검증
- PATCH 시 body가 비어있으면 `VALIDATION_ERROR` 반환
- 존재하지 않는 id로 PATCH/DELETE 시 `NOT_FOUND` 반환

### 수락 기준 (Acceptance Criteria)

- [ ] `GET /api/v1/todos?date=2026-04-16` 이 해당 날짜 할일을 `order` 오름차순으로 반환한다
- [ ] `POST /api/v1/todos` 성공 시 201과 생성된 Todo 객체를 반환한다
- [ ] 공백만 있는 title로 POST 시 400 `VALIDATION_ERROR`를 반환한다
- [ ] `PATCH /api/v1/todos/:id` 로 title 단독·completed 단독·둘 다 업데이트가 모두 동작한다
- [ ] 존재하지 않는 id로 PATCH/DELETE 시 404 `NOT_FOUND`를 반환한다
- [ ] 모든 응답이 `{ data, error }` 공통 형식을 따른다

### 참고

- TechSpec 섹션: §5-2 엔드포인트 목록, §5-3 엔드포인트 상세, §6-2 레이어 책임 분리
- 관련 이슈: Depends on #3

---

## #6 [Backend] 캘린더 인디케이터 API 구현 (GET /api/v1/todos/dates)

**레이블**: Backend
**예상 소요**: 0.5일
**의존성**: Depends on #3

### 설명

월간 캘린더에서 할일이 있는 날짜에 인디케이터 점을 표시하기 위한 API를 구현한다.
`YYYY-MM` 파라미터로 해당 월에 할일이 1개 이상 존재하는 날짜 목록을 반환한다.
DB에서 `SELECT DISTINCT date` 방식으로 집계하여 애플리케이션 레이어 루프를 최소화한다.

구현 사항:
- `GET /api/v1/todos/dates?month=YYYY-MM`
- Prisma 쿼리: `date LIKE 'YYYY-MM-%'` 패턴으로 필터 후 distinct 추출
- 결과 오름차순 정렬하여 반환

### 수락 기준 (Acceptance Criteria)

- [ ] `GET /api/v1/todos/dates?month=2026-04` 가 해당 월에 할일이 있는 날짜 배열을 반환한다
- [ ] 할일이 없는 달에는 `{ data: { dates: [] }, error: null }` 을 반환한다
- [ ] `month` 파라미터가 없거나 형식 오류 시 400 `VALIDATION_ERROR`를 반환한다
- [ ] 같은 날짜에 할일이 여러 개여도 해당 날짜는 한 번만 포함된다

### 참고

- TechSpec 섹션: §5-3 GET /todos/dates, §6-2 성능 고려사항
- 관련 이슈: Depends on #3

---

## #7 [Frontend] CalendarPanel 컴포넌트 구현 (월 이동 + DayCell 선택)

**레이블**: Frontend
**예상 소요**: 1일
**의존성**: Depends on #1, #8

### 설명

좌측(데스크탑) / 상단(모바일) 영역의 월간 캘린더 UI를 구현한다.
date-fns를 활용하여 월 계산 로직을 처리하고, DayCell 상태(기본·오늘·선택·인디케이터)별 스타일을 적용한다.
캘린더 인디케이터 데이터는 이 이슈에서는 mock 배열로 대체하고, 실제 API 연동은 #9에서 처리한다.

구현 컴포넌트:
- `CalendarPanel`: 전체 캘린더 래퍼
- `MonthNavigation`: `< 2026년 4월 >` 이전·다음 월 이동 버튼
- `WeekdayHeader`: 일~토 헤더 행
- `CalendarGrid`: 6×7 그리드 (빈 셀 포함)
- `DayCell`: 날짜 숫자 + 인디케이터 점, 상태별 Tailwind 클래스 적용 (TechSpec §7-3)

### 수락 기준 (Acceptance Criteria)

- [ ] 앱 진입 시 현재 월 캘린더가 표시된다
- [ ] `<` / `>` 버튼 클릭 시 이전/다음 월로 이동하고 날짜가 정확히 렌더링된다
- [ ] 오늘 날짜가 `text-primary font-bold` 스타일로 표시된다
- [ ] DayCell 클릭 시 해당 날짜가 `bg-primary text-white rounded-full`로 하이라이트된다
- [ ] 선택 날짜가 Zustand `selectedDate`에 저장된다
- [ ] 인디케이터 mock 배열에 포함된 날짜 아래에 점이 표시된다
- [ ] `aria-selected`, `aria-label` 속성이 DayCell에 적용된다

### 참고

- TechSpec 섹션: §6-1 컴포넌트 트리, §6-1 날짜 선택 시퀀스, §7-3 DayCell 상태별 스타일
- 관련 이슈: Depends on #1, #8

---

## #8 [Frontend] Zustand 스토어 + TanStack Query 기반 설정

**레이블**: Frontend
**예상 소요**: 0.5일
**의존성**: Depends on #1

### 설명

전역 클라이언트 상태(Zustand)와 서버 상태(TanStack Query) 기반 인프라를 설정한다.
이후 모든 컴포넌트가 이 설정을 기반으로 동작한다.

구현 항목:
- Zustand 스토어 생성: `selectedDate` (초기값: 오늘), `currentMonth` (초기값: 현재 월)
  - `setSelectedDate(date: string)`, `setCurrentMonth(month: string)` 액션 포함
- TanStack Query `QueryClient` 설정 (staleTime: 30초, retry: 2회)
- `QueryClientProvider`를 `App.tsx` 루트에 적용
- API 기본 URL 환경변수 (`VITE_API_URL`) 기반 axios 또는 fetch 클라이언트 생성
- 쿼리 키 상수 파일 (`src/lib/queryKeys.ts`) 작성

### 수락 기준 (Acceptance Criteria)

- [ ] `useStore()` 훅으로 `selectedDate`, `currentMonth` 를 읽고 변경할 수 있다
- [ ] `QueryClientProvider`가 앱 전체를 감싸고 있다
- [ ] API 클라이언트가 `VITE_API_URL` 환경변수를 base URL로 사용한다
- [ ] `queryKeys.todos(date)`, `queryKeys.datesWithTodos(month)` 함수가 정의되어 있다

### 참고

- TechSpec 섹션: §6-1 상태 관리 분리, §6-1 핵심 쿼리 키 설계
- 관련 이슈: Depends on #1

---

## #9 [Frontend] TodoPanel 기본 구현 (TodoInput + TodoList + API 연동)

**레이블**: Frontend
**예상 소요**: 1일
**의존성**: Depends on #5, #6, #8

### 설명

우측(데스크탑) / 하단(모바일) 영역의 TodoPanel을 구현하고 실제 API와 연동한다.
TanStack Query로 날짜별 할일 목록을 fetch하고, CalendarPanel의 날짜 선택 변경에 자동으로 반응한다.
캘린더 인디케이터도 실제 `/todos/dates` API와 연동하여 #7의 mock을 대체한다.

구현 컴포넌트:
- `TodoPanelHeader`: 선택된 날짜를 `4월 16일 수요일` 형식으로 표시
- `TodoInput`: 텍스트 입력 + 추가 버튼 (Enter 지원, 공백 전용 시 비활성화)
- `TodoList`: `useQuery`로 목록 로드, `order` 오름차순 렌더링
- `useTodos(date)` 커스텀 훅: `GET /api/v1/todos?date=` 연동
- `useDatesWithTodos(month)` 커스텀 훅: `GET /api/v1/todos/dates?month=` 연동
- `useCreateTodo()` mutation 훅: `POST /api/v1/todos` 연동, 성공 시 목록 쿼리 invalidate

### 수락 기준 (Acceptance Criteria)

- [ ] 날짜 선택 시 해당 날짜의 할일 목록이 자동으로 로드된다
- [ ] TodoInput에 텍스트 입력 후 Enter 또는 추가 버튼 클릭 시 할일이 추가된다
- [ ] 추가 후 입력 필드가 초기화되고 새 항목이 목록 하단에 나타난다
- [ ] 공백만 입력 시 추가 버튼이 비활성화되고 Enter가 무시된다
- [ ] 월 이동 시 인디케이터가 실제 API 데이터를 반영하여 갱신된다
- [ ] 할일이 없는 날짜 선택 시 EmptyState가 표시된다 (컴포넌트는 #12에서 스타일 완성)

### 참고

- TechSpec 섹션: §6-1 컴포넌트 트리, §5-3 엔드포인트 상세
- 관련 이슈: Depends on #5, #6, #8

---

## #10 [Frontend] TodoItem CRUD 인터랙션 구현 (인라인수정 · 삭제 · 완료체크)

**레이블**: Frontend
**예상 소요**: 1일
**의존성**: Depends on #9

### 설명

TodoItem 컴포넌트에 수정·삭제·완료 체크 인터랙션을 구현한다.
인라인 편집은 클릭 시 `<input>`으로 전환되는 방식으로 구현하며,
편집 모드 진입·확인·취소 상태 전환을 명확히 처리한다.

구현 사항:
- `Checkbox`: 클릭 시 `PATCH completed` 호출
- `TodoTitle`: 읽기 모드 / 편집 모드(로컬 state `editingId`) 전환
  - 편집 모드: Enter → PATCH title, Esc → 취소(원래 값 복원)
  - 저장 버튼: 공백 전용이면 비활성화
- `ActionButtons`: hover 시 표시 (`group-hover:opacity-100 opacity-0`)
  - 수정 버튼: 편집 모드 진입
  - 삭제 버튼: `DELETE /api/v1/todos/:id` 호출, 성공 시 목록에서 즉시 제거
- `useUpdateTodo()`, `useDeleteTodo()` mutation 훅 구현
- 완료 항목 스타일: `line-through text-neutral-500`

### 수락 기준 (Acceptance Criteria)

- [ ] 체크박스 클릭 시 완료 상태가 즉시 시각적으로 변경된다 (Optimistic은 #11에서)
- [ ] TodoItem 클릭 시 인라인 편집 모드로 전환된다
- [ ] 편집 중 Enter 시 PATCH API가 호출되고 읽기 모드로 복귀한다
- [ ] 편집 중 Esc 시 원래 값으로 복원되고 읽기 모드로 복귀한다
- [ ] hover 시 수정·삭제 버튼이 나타나고, 삭제 클릭 시 항목이 목록에서 제거된다
- [ ] 공백만 남긴 상태로 저장 시 버튼이 비활성화된다

### 참고

- TechSpec 섹션: §6-1 인라인 편집 상태 전환, §6-1 엣지 케이스 처리 요약, §7-3 TodoItem 상태별 스타일
- 관련 이슈: Depends on #9

---

## #11 [Frontend] Optimistic Update 적용 (완료 체크 · 삭제)

**레이블**: Frontend
**예상 소요**: 0.5일
**의존성**: Depends on #10

### 설명

완료 체크와 삭제 동작에 TanStack Query의 Optimistic Update를 적용한다.
API 응답을 기다리지 않고 UI를 즉시 업데이트하고, 실패 시 이전 상태로 자동 롤백한다.

구현 사항:
- `useUpdateTodo()` mutation에 `onMutate` / `onError` 콜백 추가
  - `onMutate`: 캐시 snapshot 저장 후 즉시 완료 상태 반영
  - `onError`: snapshot으로 롤백 + Toast 메시지 트리거
- `useDeleteTodo()` mutation에 동일 패턴 적용
- Toast 트리거 메커니즘 연동 (Toast 컴포넌트는 #12에서 구현)

### 수락 기준 (Acceptance Criteria)

- [ ] 체크박스 클릭 시 API 응답 전에 UI가 즉시 변경된다
- [ ] API 실패를 시뮬레이션(네트워크 차단)했을 때 체크박스 상태가 이전으로 롤백된다
- [ ] 삭제 클릭 시 API 응답 전에 목록에서 항목이 즉시 사라진다
- [ ] API 실패 시 삭제된 항목이 목록에 복원된다
- [ ] 롤백 발생 시 Toast 메시지가 표시되도록 트리거된다

### 참고

- TechSpec 섹션: §6-1 Optimistic Update — 완료 체크 시퀀스
- 관련 이슈: Depends on #10

---

## #12 [Frontend] 피드백 컴포넌트 구현 (SkeletonLoader · EmptyState · ErrorState · Toast)

**레이블**: Frontend
**예상 소요**: 1일
**의존성**: Depends on #9

### 설명

사용자 피드백을 위한 4가지 컴포넌트를 구현한다.
각 컴포넌트는 독립적으로 재사용 가능하도록 설계하며, TechSpec §7-3 사양을 따른다.

구현 컴포넌트:
- `SkeletonLoader`: 캘린더(6×7 원형 플레이스홀더) + 할일 목록(3개 바) `animate-pulse`
- `EmptyState`: "이 날은 할일이 없어요. 첫 번째 할일을 추가해보세요!" 안내
- `ErrorState`: 오류 메시지 + 재시도 버튼 (`role="alert"`)
- `Toast`: 우하단 고정, 4초 자동 사라짐, `bg-neutral-900 text-white` 스타일
  - Zustand 토스트 큐 또는 간단한 Context로 전역 트리거 지원

### 수락 기준 (Acceptance Criteria)

- [ ] 데이터 로딩 중 SkeletonLoader가 표시되고, 로드 완료 후 실제 콘텐츠로 교체된다
- [ ] 선택한 날짜에 할일이 없으면 EmptyState가 표시된다
- [ ] API 오류 시 ErrorState가 표시되고, 재시도 버튼 클릭 시 쿼리를 다시 실행한다
- [ ] `useUpdateTodo` 실패 시 Toast가 "변경하지 못했어요." 메시지와 함께 표시된다
- [ ] Toast는 4초 후 자동으로 사라진다
- [ ] ErrorState에 `role="alert"` 속성이 적용되어 있다

### 참고

- TechSpec 섹션: §7-3 공통 컴포넌트 사양 (SkeletonLoader, Toast)
- 관련 이슈: Depends on #9

---

## #13 [UI/UX] 반응형 레이아웃 적용 (모바일 768px 브레이크포인트)

**레이블**: UI/UX
**예상 소요**: 0.5일
**의존성**: Depends on #12

### 설명

데스크탑(좌우 분할)과 모바일(상하 스택) 레이아웃을 Tailwind 반응형 클래스로 구현한다.
768px 미만에서 캘린더가 상단, 할일 패널이 하단에 표시되어야 한다.

구현 사항:
- `App.tsx` 루트 레이아웃: `flex flex-col md:flex-row`
- CalendarPanel: `w-full md:w-2/5`
- TodoPanel: `w-full md:w-3/5`
- 모바일에서 캘린더 높이 제한으로 스크롤 없이 두 패널이 모두 보이도록 조정
- 터치 인터랙션 확인 (DayCell tap, 체크박스 tap)

### 수락 기준 (Acceptance Criteria)

- [ ] 768px 이상 화면에서 캘린더(좌측 40%)와 할일 패널(우측 60%)이 가로로 배치된다
- [ ] 768px 미만 화면에서 캘린더(상단)와 할일 패널(하단)이 세로로 배치된다
- [ ] 모바일에서 캘린더 날짜 탭이 정상 동작한다
- [ ] Chrome DevTools 모바일 시뮬레이터(iPhone 14 Pro, Galaxy S21)에서 레이아웃이 깨지지 않는다

### 참고

- TechSpec 섹션: §7-4 반응형 브레이크포인트
- 관련 이슈: Depends on #12

---

## #14 [UI/UX] 접근성(aria-*) 및 키보드 인터랙션 적용

**레이블**: UI/UX
**예상 소요**: 0.5일
**의존성**: Depends on #12

### 설명

키보드만으로 앱의 핵심 기능을 모두 사용할 수 있도록 접근성 속성과 키보드 인터랙션을 적용한다.

구현 사항:
- DayCell: `aria-selected={isSelected}`, `aria-label="2026년 4월 16일"`, `role="gridcell"`, `tabIndex={0}`, `onKeyDown: Enter → 선택`
- Checkbox: `aria-label="할일 완료 체크"`, `aria-checked={completed}`
- TodoInput: `aria-label="새 할일 입력"`
- ActionButtons (수정·삭제): 각각 `aria-label="할일 수정"`, `aria-label="할일 삭제"`
- ErrorState: `role="alert"`
- 월 이동 버튼: `aria-label="이전 달"`, `aria-label="다음 달"`
- Tab 순서 확인: 캘린더 날짜 → 입력 필드 → 할일 목록 순서가 논리적으로 이어짐

### 수락 기준 (Acceptance Criteria)

- [ ] DayCell에서 Tab으로 포커스 이동 후 Enter로 날짜 선택이 가능하다
- [ ] 스크린 리더(macOS VoiceOver)에서 날짜 셀을 "2026년 4월 16일, 선택됨"으로 읽는다
- [ ] ErrorState에 `role="alert"`가 적용되어 있다
- [ ] 모든 버튼에 시각적 레이블이 없어도 `aria-label`이 제공된다

### 참고

- TechSpec 섹션: §7-5 접근성
- 관련 이슈: Depends on #12

---

## #15 [Test] BE 단위·통합 테스트 작성 (Vitest + Supertest)

**레이블**: Test
**예상 소요**: 1일
**의존성**: Depends on #5, #6

### 설명

Backend의 Service 레이어 단위 테스트와 API 레이어 통합 테스트를 작성한다.
테스트용 인메모리 SQLite DB를 사용하여 실제 DB 의존성을 격리한다.

테스트 대상:

**Service 단위 테스트 (Vitest)**
- `createTodo`: 공백 title 거부, order 자동 증가, 정상 생성
- `updateTodo`: 존재하지 않는 id → NotFoundError, 부분 업데이트 동작
- `deleteTodo`: 존재하지 않는 id → NotFoundError
- `getDatesWithTodos`: 해당 월 날짜 중복 없이 반환

**API 통합 테스트 (Supertest)**
- `POST /api/v1/todos`: 201 반환, 검증 실패 400
- `GET /api/v1/todos?date=`: 정상 목록, date 파라미터 누락 시 400
- `PATCH /api/v1/todos/:id`: 부분 업데이트, 없는 id 404
- `DELETE /api/v1/todos/:id`: 정상 삭제, 없는 id 404
- `GET /api/v1/todos/dates?month=`: 정상 반환, 파라미터 누락 400

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run test` 실행 시 모든 테스트가 통과한다
- [ ] Service 레이어 테스트 커버리지가 핵심 비즈니스 로직 경로를 모두 포함한다
- [ ] 각 API 엔드포인트에 대해 정상 케이스와 에러 케이스가 각 1개 이상 작성된다
- [ ] 테스트 실행이 실제 `dev.db` 파일에 영향을 주지 않는다

### 참고

- TechSpec 섹션: §6-2 핵심 비즈니스 로직, §5-3 엔드포인트 상세
- 관련 이슈: Depends on #5, #6

---

## #16 [Test] FE 컴포넌트 테스트 작성 (Vitest + React Testing Library)

**레이블**: Test
**예상 소요**: 1일
**의존성**: Depends on #10, #12

### 설명

Frontend의 핵심 컴포넌트에 대한 행동 기반 테스트를 작성한다.
API 호출은 MSW(Mock Service Worker) 또는 vi.mock으로 처리하여 네트워크 의존성을 제거한다.

테스트 대상:

**DayCell**
- 기본 렌더링 (날짜 숫자, aria 속성)
- 클릭 시 `setSelectedDate` 호출 확인
- 선택 상태일 때 `bg-primary` 클래스 적용 확인
- 인디케이터 점 렌더링 확인

**TodoItem**
- 완료 체크박스 클릭 시 `useUpdateTodo` mutation 호출 확인
- 클릭 시 인라인 편집 모드 전환 확인
- 편집 중 Enter → 저장 호출, Esc → 값 복원 확인
- 삭제 버튼 클릭 시 `useDeleteTodo` mutation 호출 확인

**TodoInput**
- 공백 입력 시 버튼 비활성화 확인
- Enter 입력 시 `useCreateTodo` mutation 호출 + 입력 필드 초기화 확인

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run test` 실행 시 모든 컴포넌트 테스트가 통과한다
- [ ] DayCell, TodoItem, TodoInput 각각 정상 케이스 + 엣지 케이스 1개 이상 작성된다
- [ ] API 호출이 실제 네트워크를 사용하지 않는다 (mock 처리)
- [ ] 테스트 설명(`it`/`test` 블록)이 사용자 행동 관점으로 작성된다 (예: "사용자가 체크박스를 클릭하면 완료 상태가 변경된다")

### 참고

- TechSpec 섹션: §6-1 컴포넌트 트리, §6-1 엣지 케이스 처리 요약
- 관련 이슈: Depends on #10, #12
