# Test Plan

## Risk level

P2

## Scenario coverage

| Requirement                     | Scenario                                               | Risk | Test level | Test file                 | Status   |
| ------------------------------- | ------------------------------------------------------ | ---: | ---------- | ------------------------- | -------- |
| Иконки приложения (pwa-install) | Все объявленные иконки существуют                      |   P1 | E2E        | src/tests/e2e/pwa.spec.ts | Пройдено |
| Иконки приложения (pwa-install) | Маскируемая иконка объявлена                           |   P2 | E2E        | src/tests/e2e/pwa.spec.ts | Пройдено |
| Иконки приложения (pwa-install) | URL apple-touch-icon содержит метку версии содержимого |   P1 | E2E        | src/tests/e2e/pwa.spec.ts | Пройдено |

## Required automated tests

### Unit

- (нет — изменение не затрагивает чистую логику)

### Component

- (нет — изменение не затрагивает интерактивные React-компоненты)

### Integration

- (нет)

### E2E

- [x] `src/tests/e2e/pwa.spec.ts`: каждая иконка из манифеста отдаётся как изображение (без
      изменений в этой части).
- [x] `src/tests/e2e/pwa.spec.ts`: манифест содержит `maskable`-иконку (без изменений).
- [x] `src/tests/e2e/pwa.spec.ts` (новое/изменённое): `<link rel="apple-touch-icon">` и
      `<link rel="icon">` в HTML содержат хешированный `href` (query-параметр), запрос по этому
      `href` возвращает изображение.

## Manual checks

- [x] `npm run build && npm run prod` — осмотреть `<head>` в браузере, убедиться, что `href`
      иконок содержит хеш.
- [x] Временно изменить содержимое `app/icon.png`, пересобрать, убедиться что хеш в `href`
      изменился (подтверждение самого механизма cache-busting) — после проверки файл вернут.

## Test data

- Fixtures: нет (статичные файлы иконок).
- API mocks: не требуются.
- User roles: не применимо.
- Seed data: не применимо.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices
- Решение кэширования для `app/manifest.ts.icons` (см. design.md Non-Goals) — отдельный risk,
  не покрывается этим change.

## Verification commands

- [ ] openspec validate migrate-icons-to-file-convention --strict --no-interactive
- [ ] npm run tsc
- [ ] npm run lint
- [ ] npm run build
- [ ] npx playwright test src/tests/e2e/pwa.spec.ts
