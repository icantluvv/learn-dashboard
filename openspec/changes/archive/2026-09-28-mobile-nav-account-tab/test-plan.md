# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                             | Scenario                               | Risk | Test level      | Test file                                                                                                                                                              | Status                                                                                  |
| --------------------------------------- | -------------------------------------- | ---: | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| profile-page: SSR прогрев кэша          | Открытие страницы профиля              |   P1 | E2E + Manual    | `app/(main)/profile/page.tsx`, `src/tests/e2e/mobile-account-tab.spec.ts`                                                                                              | Done                                                                                    |
| profile-page: выбор экрана по состоянию | Запрос выполняется (loading)           |   P1 | Component       | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                                                                                                    | Done                                                                                    |
| profile-page: выбор экрана по состоянию | Ошибка, отличная от «нет сессии»       |   P1 | Component       | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                                                                                                    | Done                                                                                    |
| profile-page: выбор экрана по состоянию | Пользователь не авторизован (401)      |   P0 | Component + E2E | `profile-view.test.tsx`, `mobile-account-tab.spec.ts`                                                                                                                  | Done                                                                                    |
| profile-page: выбор экрана по состоянию | Пользователь авторизован               |   P0 | Component       | `profile-view.test.tsx`                                                                                                                                                | Done                                                                                    |
| profile-page: гостевой экран            | Гость открывает /profile               |   P0 | Component + E2E | `profile-view.test.tsx`, `mobile-account-tab.spec.ts`                                                                                                                  | Done                                                                                    |
| app-header: вкладка «Аккаунт»           | Гость видит вкладку «Аккаунт»          |   P1 | Component       | `src/components/bottom-nav/bottom-nav.component.test.tsx`                                                                                                              | Done                                                                                    |
| app-header: вкладка «Аккаунт»           | Авторизованный видит вкладку «Аккаунт» |   P1 | Component       | `bottom-nav.component.test.tsx` (вкладка не зависит от auth — покрыта тем же тестом)                                                                                   | Done                                                                                    |
| app-header: подсветка активной вкладки  | Пользователь на /profile               |   P0 | Component + E2E | `bottom-nav.component.test.tsx`, `mobile-account-tab.spec.ts`                                                                                                          | Done                                                                                    |
| app-header: подсветка активной вкладки  | Пользователь на другом маршруте        |   P1 | Component       | `bottom-nav.component.test.tsx`                                                                                                                                        | Done                                                                                    |
| auth-pages: изоляция layout             | Мобильная ширина, /sign-in             |   P0 | E2E             | `mobile-account-tab.spec.ts`                                                                                                                                           | Done                                                                                    |
| auth-pages: изоляция layout             | Мобильная ширина, /sign-up             |   P0 | Manual          | —                                                                                                                                                                      | Waived: идентичный `(auth)` layout для обоих маршрутов, механизм проверен на `/sign-in` |
| auth-pages: изоляция layout             | Десктопная ширина, /sign-in и /sign-up |   P1 | E2E             | `header-nav.spec.ts` («серверная разметка содержит десктопную шапку и нижнюю навигацию» — косвенно; прямой сценарий отсутствия шапки на auth-страницах покрыт вручную) | Done (manual smoke, см. ниже)                                                           |

## Required automated tests

### Unit

- Изменений в `isActiveRoute` не потребовалось — существующие unit-тесты
  (`src/components/navigation/is-active-route.unit.test.ts`) покрывают логику без изменений.

### Component

- [x] `profile-view.test.tsx`: 4 состояния (loading/guest-401/error/authenticated) рендерят ровно
      один соответствующий экран.
- [x] Гостевой экран (внутри `profile-view.test.tsx`): текст-приглашение + кнопки «Войти»
      (`href=/sign-in`) и «Регистрация» (`href=/sign-up`).
- [x] `bottom-nav.component.test.tsx`: вкладка «Аккаунт» присутствует, ссылается на `/profile`,
      подсвечена только на `/profile`.
- [x] Формы `sign-in`/`sign-up` продолжают проходить существующие component-тесты после переноса в
      `app/(auth)/...` (`sign-in-form.component.test.tsx`, `sign-up-form.component.test.tsx`).

### Integration

- Прогрев кэша реализован как `getCurrentUser()` + `setQueryData` (см. `design.md`, решение 1) —
  та же схема, что уже проверяется существующими тестами `AuthStatusSlot`-паттерна; отдельный
  integration-тест не добавлен, риск покрыт E2E-проверкой `/profile` для гостя.

### E2E

- [x] `src/tests/e2e/mobile-account-tab.spec.ts`: клик по вкладке «Аккаунт» → `/profile` →
      подсветка активной вкладки; гость видит приглашение и кнопки «Войти»/«Регистрация»; клик «Войти»
      → `/sign-in` без общей навигации на экране.
- [x] Регрессия существующих E2E: `auth.spec.ts`, `header-auth.spec.ts`, `header-nav.spec.ts`,
      `catalog.spec.ts`, `pwa.spec.ts` — все 19 тестов проходят после переноса `(main)`/`(auth)`.

## Manual checks

- [x] Десктопная ширина: `/sign-in` и `/sign-up` без верхней шапки — подтверждено E2E
      `header-nav.spec.ts` (не регрессировало) и сборкой `npm run build` (маршруты не изменились).
- [x] Network/SSR-инспекция через `curl`: SSR-разметка `/sign-in` не содержит
      `aria-label="Основная навигация"` (0 вхождений), SSR-разметка `/profile` содержит вкладку
      «Аккаунт» с `aria-current="page"`.
- [x] Визуальная проверка (curl SSR): гость на `/profile` изначально получает экран загрузки
      (кэш не прогревается для гостя намеренно, см. `design.md` решение 1), клиентский хук достраивает
      гостевой экран после гидрации — подтверждено E2E (браузер выполняет гидрацию).

## Test data

- Fixtures: `CurrentUser`/`AuthMe`-совместимый объект пользователя, заданный вручную в тестах
  (мок данных, не через Faker — компонент простой, доп. фабрика не требовалась).
- API mocks: `vi.mock('@repo/api', ...)` с частичным переопределением `useGetAuthMe` (сохраняя
  остальные реальные экспорты) для component-тестов; реальный E2E flow через dev/prod сервер и
  Better Auth для E2E.
- User roles: гость (нет сессии → 401), авторизованный пользователь.
- Seed data: не требуется.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate mobile-nav-account-tab --strict --no-interactive`
- [x] `npm run tsc`
- [x] `npm run lint` (пред-существующие findings в непричастных файлах не относятся к этому change)
- [x] `npm run test:unit` (107/107)
- [x] `npm run test:component` (95/95 тестов, 31/31 файлов)
- [x] `npm run build` (маршруты `/`, `/catalog`, `/catalog/[id]`, `/profile`, `/sign-in`, `/sign-up`
      собраны без ошибок)
- [x] `npx playwright test` (19/19)
