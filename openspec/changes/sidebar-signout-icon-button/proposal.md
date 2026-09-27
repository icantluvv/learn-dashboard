## Why

В десктопном Sidebar выход из аккаунта спрятан за Popover: пользователю нужно кликнуть по блоку профиля (`AccountSummary`), чтобы открыть всплывающее меню, и только потом нажать кнопку "Выйти". Это лишний шаг для частого действия и не соответствует мобильному `AccountDrawer`, где кнопка выхода уже вынесена рядом с профилем как отдельная иконка.

## What Changes

- В `ProfilePopover` (используется в Sidebar через `AuthStatus`) убрать `Popover`/`PopoverTrigger`/`PopoverContent`.
- `AccountSummary` перестаёт быть кликабельным триггером и отображается как обычный блок профиля.
- Рядом с `AccountSummary` добавляется кнопка выхода в виде одной иконки (`LogOutIcon`), без фона и без бордера (variant `ghost`/эквивалент без outline-стиля), кликабельная сразу, без промежуточного меню.
- Поведение самого выхода (`useSignOut`) не меняется — меняется только точка входа в действие.

## Capabilities

### New Capabilities

- `sidebar-account-signout`: поведение блока профиля и кнопки выхода в десктопном Sidebar (без Popover, прямая иконка выхода).

### Modified Capabilities

_(нет — существующие capabilities не описывают этот UI-механизм)_

## Impact

- `src/components/auth-status/profile-popover.tsx` — основная переработка компонента.
- `src/components/auth-status/profile-popover.component.test.tsx` — тесты на новое поведение.
- `src/components/auth-status/account-summary.tsx` — возможно, потребуется убрать обёртку-кнопку/hover-стили, рассчитанные на кликабельность.
- `src/components/sidebar/sidebar.component.test.tsx`, `src/tests/e2e/sidebar-auth.spec.ts` — могут ссылаться на текущее поведение поповера и потребовать обновления.
- `@repo/core` `Button`/иконки — используются существующие примитивы, новых зависимостей не требуется.
