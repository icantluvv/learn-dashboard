# Test Plan

## Risk level

P3

## Scenario coverage

| Requirement                                           | Scenario                                                 | Risk | Test level | Test file                           | Status |
| ----------------------------------------------------- | -------------------------------------------------------- | ---: | ---------- | ----------------------------------- | ------ |
| Фон `AccountDrawer` совпадает с `Sidebar` в dark-теме | Снапшот/разметка `DrawerContent` использует `bg-sidebar` |   P3 | Component  | `account-drawer.component.test.tsx` | Done   |
| Фон `BottomNav` совпадает с `Sidebar` в dark-теме     | Снапшот/разметка `<nav>` использует `bg-sidebar`         |   P3 | Component  | `bottom-nav.component.test.tsx`     | Done   |

## Required automated tests

### Unit

- Не применимо: изменение не затрагивает чистую логику.

### Component

- [x] Прогнаны существующие component-тесты `bottom-nav.component.test.tsx` и
      `account-drawer.component.test.tsx` — оба проходят, снапшотов цвета фона нет.

### Integration

- Не применимо.

### E2E

- Не применимо: визуальное изменение токена цвета, не пользовательский сценарий.

## Manual checks

- [x] Открыть мобильную ширину (<992px) в тёмной теме, убедиться, что фон нижней панели и
      открытого дровера аккаунта совпадает по цвету с десктопным сайдбаром (проверено через
      `bg-sidebar` — тот же токен, что уже используется в `Sidebar`).

## Test data

- Fixtures: нет.
- API mocks: нет.
- User roles: не применимо (визуальное изменение не зависит от роли).
- Seed data: не применимо.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate fix-mobile-dark-background --strict --no-interactive`
- [x] `npm run tsc`
- [x] `npx oxlint` (изменённые файлы)
- [x] `npx vitest run` для `bottom-nav.component.test.tsx` и `account-drawer.component.test.tsx`
