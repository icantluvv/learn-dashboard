## Why

`AccountDrawer` хардкодил `bg-white`, а `BottomNav` использовал `bg-card` для фона — в тёмной теме
оба оставались светлыми вместо тёмных, хотя `Sidebar` (их десктопный аналог) уже корректно
использует токен `bg-sidebar` и темнеет вместе с темой.

## What Changes

- `AccountDrawer`: фон `DrawerContent` меняется с хардкодного `bg-white` на токен `bg-sidebar`.
- `BottomNav`: фон `<nav>` меняется с `bg-card` на `bg-sidebar`.
- Визуальное поведение в светлой теме не меняется (токен `bg-sidebar` в светлой теме совпадает по
  восприятию с прежним фоном); меняется только тёмная тема.

## Capabilities

### New Capabilities

_(нет)_

### Modified Capabilities

_(нет — чисто визуальное исправление токена цвета, существующие требования `app-header` не
описывают конкретный цвет фона мобильного дровера и нижней панели)_

## Impact

- Затронутые файлы: `src/components/account-drawer/account-drawer.tsx`,
  `src/components/bottom-nav/bottom-nav.tsx`.
- Публичные API, поведение навигации, env contract и generated-код не затрагиваются.
- Откат: вернуть прежние классы (`bg-white`, `bg-card`).
