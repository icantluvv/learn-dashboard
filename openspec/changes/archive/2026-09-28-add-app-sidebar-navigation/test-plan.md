# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                                     | Scenario                                              | Risk | Test level      | Test file                                                                                                                       | Status |
| ----------------------------------------------- | ----------------------------------------------------- | ---: | --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Десктопный Sidebar заменяет Header              | Десктопный экран показывает Sidebar                   |   P1 | Component       | `src/components/sidebar/sidebar.component.test.tsx`                                                                             | Done   |
| Десктопный Sidebar заменяет Header              | Sidebar скрыт на экранах уже lg                       |   P2 | E2E             | `src/tests/e2e/sidebar-nav.spec.ts`                                                                                             | Done   |
| Пропорция ширины Sidebar к контенту             | Ширина колонок sidebar и контента                     |   P2 | E2E             | `src/tests/e2e/sidebar-nav.spec.ts`                                                                                             | Done   |
| Основная навигация в Sidebar                    | Переход по ссылке из Sidebar                          |   P1 | Component + E2E | `src/components/sidebar/sidebar.component.test.tsx`, `src/tests/e2e/sidebar-nav.spec.ts`                                        | Done   |
| Блок аккаунта в Sidebar                         | Sidebar для авторизованного пользователя              |   P1 | Component + E2E | `src/components/sidebar/sidebar.component.test.tsx` (замокан), `src/tests/e2e/sidebar-auth.spec.ts` (реальный `AuthStatusSlot`) | Done   |
| Блок аккаунта в Sidebar                         | Sidebar для гостя                                     |   P1 | Component + E2E | `src/components/sidebar/sidebar.component.test.tsx`, `src/tests/e2e/sidebar-auth.spec.ts`                                       | Done   |
| Кнопка аккаунта в BottomNav открывает Drawer    | Открытие AccountDrawer из BottomNav                   |   P0 | Component       | `src/components/bottom-nav/bottom-nav.component.test.tsx`                                                                       | Done   |
| AccountDrawer занимает весь экран на мобильных  | Размер и порядок наложения AccountDrawer              |   P1 | E2E             | `src/tests/e2e/mobile-account-drawer.spec.ts`                                                                                   | Done   |
| Содержимое AccountDrawer                        | Содержимое Drawer для авторизованного пользователя    |   P1 | Component       | `src/components/account-drawer/account-drawer.component.test.tsx`                                                               | Done   |
| Содержимое AccountDrawer                        | Содержимое Drawer для гостя                           |   P1 | Component + E2E | `src/components/account-drawer/account-drawer.component.test.tsx`, `src/tests/e2e/mobile-account-drawer.spec.ts`                | Done   |
| Содержимое AccountDrawer                        | Закрытие AccountDrawer                                |   P2 | Component       | `packages/core/src/ui/drawer/drawer.component.test.tsx` (общее поведение примитива, переиспользуется `AccountDrawer`)           | Done   |
| Ручной переключатель темы                       | Переключение на тёмную/светлую тему                   |   P0 | Component       | `src/components/theme-toggle/theme-switch.component.test.tsx`                                                                   | Done   |
| Выбор темы сохраняется между визитами           | Тема сохраняется после перезагрузки страницы          |   P1 | E2E             | `src/tests/e2e/theme-switching.spec.ts`                                                                                         | Done   |
| Переключатель темы доступен из Sidebar и Drawer | Синхронизация состояния между Sidebar и AccountDrawer |   P2 | E2E             | `src/tests/e2e/theme-switching.spec.ts`                                                                                         | Done   |
| Переключатель доступен с клавиатуры             | Переключение с клавиатуры                             |   P1 | Component       | `src/components/theme-toggle/theme-switch.component.test.tsx`                                                                   | Done   |

## Required automated tests

### Unit

- [x] нет новой чистой логики, выделяемой отдельно от компонентов (см. `design.md` → Test strategy)

### Component

- [x] `src/components/sidebar/sidebar.component.test.tsx`: логотип, ссылки `MainNav`, монтирование
      блока аккаунта (`AuthStatusSlot` замокан — см. design.md, сам async Server Component не
      рендерится в client-side харнессе, как и `Dashboard` ранее)
- [x] `src/components/theme-toggle/theme-switch.component.test.tsx`: клик и клавиатура переключают
      тему, `aria-label` отражает состояние
- [x] `src/components/account-drawer/account-drawer.component.test.tsx`: содержимое для гостя и
      авторизованного пользователя, переключатель темы, выход из аккаунта
- [x] `src/components/bottom-nav/bottom-nav.component.test.tsx` (обновлён): кнопка «Аккаунт» —
      `<button>` без `href`, открывает `AccountDrawer` вместо роутинга
- [x] `src/components/auth-status/profile-popover.component.test.tsx` (регрессия после
      рефакторинга `AccountSummary`/`useSignOut`): без изменения ожиданий, зелёные

### Integration

- [x] нет отдельного integration-уровня — покрыто component + E2E

### E2E

- [x] `src/tests/e2e/sidebar-nav.spec.ts` (замена `header-nav.spec.ts`): десктоп — навигация,
      `Sidebar` в SSR-разметке, `<header` отсутствует, пропорция колонок `1:5`
- [x] `src/tests/e2e/sidebar-auth.spec.ts` (переименован из `header-auth.spec.ts`, поведение не
      менялось): вход показывает аватар в `Sidebar`, выход возвращает кнопку входа
- [x] `src/tests/e2e/mobile-account-drawer.spec.ts` (замена `mobile-account-tab.spec.ts`):
      мобильный viewport — `AccountDrawer` full-screen поверх `BottomNav`, содержимое для гостя
- [x] `src/tests/e2e/theme-switching.spec.ts`: тема сохраняется после `reload`, синхронизирована
      между `Sidebar` и `AccountDrawer`

## Manual checks

- [ ] Визуальная сверка пропорции колонок `1:5` и стиля pill-переключателя с референсным скриншотом
      (light и dark, ширины `lg`/`xl`) — не выполнено в рамках этой сессии (нет доступа к реальному
      браузеру пользователя для сравнения с макетом), рекомендуется перед мержем
- [x] Проверка отсутствия hydration warning: `npm run build` прошёл без ошибок компиляции/типов;
      `next-themes` использует задокументированный паттерн (`suppressHydrationWarning` на `<html>`)

## Test data

- Fixtures: существующие generated Faker-фабрики `@repo/api` для `CurrentUser` (гость/авторизован)
- API mocks: deep-mock `@repo/api/base/codegen/clients/meController/getAuthMe` (тот же паттерн, что
  в `auth-status.component.test.tsx`/`profile-popover.component.test.tsx`), без изменений схемы
- User roles: гость (unauthenticated), авторизованный пользователь
- Seed data: не требуется (нет серверного состояния темы)

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] openspec validate add-app-sidebar-navigation --strict --no-interactive
- [x] frontend: npm run tsc / npm run lint / npm run test / npm run build
- [x] api: не затронут — не требуется
- [x] npm run test:e2e (все 22 сценария, включая новые/переименованные)
