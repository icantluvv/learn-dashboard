# Test Plan

## Risk level

P2

## Scenario coverage

| Requirement                           | Scenario                                        | Risk | Test level | Test file                                                     | Status                                                            |
| ------------------------------------- | ----------------------------------------------- | ---: | ---------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Профиль в Sidebar без Popover         | Клик по блоку профиля не открывает меню         |   P2 | Component  | src/components/auth-status/profile-popover.component.test.tsx | Done                                                              |
| Прямая кнопка выхода рядом с профилем | Кнопка выхода видна сразу                       |   P2 | Component  | src/components/auth-status/profile-popover.component.test.tsx | Done                                                              |
| Прямая кнопка выхода рядом с профилем | Клик по кнопке выхода завершает сессию          |   P1 | Component  | src/components/auth-status/profile-popover.component.test.tsx | Done                                                              |
| Прямая кнопка выхода рядом с профилем | Выход из аккаунта через Sidebar (сквозной путь) |   P1 | E2E        | src/tests/e2e/sidebar-auth.spec.ts                            | Updated (не запускался в этой сессии — см. Verification commands) |
| Индикация ожидания при выходе         | Лоадер отображается во время запроса выхода     |   P2 | Component  | src/components/auth-status/profile-popover.component.test.tsx | Done                                                              |
| Индикация ожидания при выходе         | Лоадер исчезает после завершения запроса        |   P2 | Component  | src/components/auth-status/profile-popover.component.test.tsx | Done                                                              |

## Required automated tests

### Unit

- [ ] (нет — изменение чисто UI-композиции, без изолируемой чистой логики)

### Component

- [x] `profile-popover.component.test.tsx`: авторизованный пользователь видит `AccountSummary` и кнопку выхода без предварительного клика
- [x] `profile-popover.component.test.tsx`: клик по кнопке выхода вызывает `useSignOut`
- [x] `sidebar.component.test.tsx`: проверено — мокает `AuthStatusSlot`, не зависит от Popover-поведения, изменений не потребовалось
- [x] `profile-popover.component.test.tsx`: во время незавершённого `signOut()` кнопка показывает `Spinner` (`role="status"`, `aria-label="Загрузка"`) и заблокирована; после завершения индикатор скрывается и кнопка снова доступна

### Integration

- [ ] —

### E2E

- [x] `sidebar-auth.spec.ts`: сценарий обновлён на прямой клик по иконке выхода без открытия меню (не запускался в этой сессии — Playwright требует dev/prod сервер)

## Manual checks

- [ ] Визуальная проверка light/dark темы: кнопка выхода без фона/границы в покое, корректные hover/focus состояния (не выполнена в этой сессии — нет запущенного браузера для ручного смоука)

## Test data

- Fixtures: существующие auth fixtures/session mocks, используемые в `profile-popover.component.test.tsx` и `sidebar-auth.spec.ts`
- API mocks: существующий mock текущего пользователя (`useCurrentUser`) и sign-out эндпоинта
- User roles: авторизованный пользователь
- Seed data: не требуется

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] openspec validate sidebar-signout-icon-button --strict --no-interactive
- [x] npx vitest run src/components/auth-status/profile-popover.component.test.tsx --project component
- [x] npx vitest run src/components/sidebar/sidebar.component.test.tsx --project component
- [x] npm run tsc (в изменённых файлах ошибок нет; репозиторий содержит 3 предсуществующих несвязанных ошибки в незакоммиченной работе по avatar-загрузке — вне scope этого change)
- [x] npm run lint (в изменённых файлах ошибок нет; репозиторий содержит предсуществующие несвязанные ошибки в незакоммиченной работе по avatar-загрузке — вне scope этого change)
- [ ] npx playwright test src/tests/e2e/sidebar-auth.spec.ts (не запускался — требует поднятого dev/prod сервера)
