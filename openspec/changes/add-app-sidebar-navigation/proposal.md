## Why

Десктопная навигация сейчас живёт в горизонтальном `Header` (`src/components/header`), а переключателя
темы в приложении нет вовсе — тема следует только `prefers-color-scheme`. Нужно заменить `Header` на
вертикальный sidebar (по референсу дизайна), перенести в него ручной Light/Dark переключатель, и
привести кнопку профиля в мобильной нижней навигации к тому же паттерну: полноэкранный Drawer справа
с логотипом, аккаунтом и переключателем темы, вместо перехода на `/profile`.

## What Changes

- **BREAKING**: полностью удалить `src/components/header` (`Header`, экспорт из `index.ts`) и его
  использование в `src/components/layout.tsx`.
- Добавить `Sidebar` — Server Component, виден только на `lg+`, фиксирован слева, колонка сверху вниз:
  `Logo` → `MainNav` (вертикальный список) → нижний блок аккаунта (`AuthStatusSlot`, без изменений
  логики) → `ThemeSwitch` (client).
- Перестроить `(main)` layout на CSS grid с колонками sidebar:content = `1:5` на `lg+`; на меньших
  экранах — одна колонка, `Sidebar` не рендерится, `BottomNav` остаётся как есть.
- Заменить кнопку «Аккаунт» в `BottomNav` (сейчас `Link` на `/profile`) на кнопку, открывающую
  `AccountDrawer` — Drawer справа (`swipeDirection="right"`), на мобильных full-height/full-width,
  поверх `BottomNav` по z-index. Содержимое Drawer сверху вниz: `Logo`, аккаунт-блок (аватар + имя,
  либо кнопка «Войти» для гостя), внизу `ThemeSwitch`.
- Добавить ручное переключение темы: `ThemeProvider` (`next-themes`, `attribute="class"`,
  `defaultTheme="system"`, `enableSystem`) в корневом `app/layout.tsx`, и `ThemeSwitch` — клиентский
  компонент на основе shadcn `Switch` (`packages/core/src/ui/switch`), стилизованный как pill
  Light/Dark по референсу.
- Извлечь общий презентационный блок аккаунта (аватар, имя/email, кнопка выхода либо гостевая кнопка
  входа) из `ProfilePopover`, чтобы переиспользовать его и в `Sidebar`/`AuthStatusSlot`-flow, и в
  `AccountDrawer`, без дублирования разметки.
- Страница `/profile` не удаляется (остаётся доступной по прямой ссылке/из истории), но перестаёт
  быть целью навигации из `BottomNav`.

## Capabilities

### New Capabilities

- `app-shell-navigation`: десктопный `Sidebar` (замена `Header`), grid-раскладка `(main)` layout,
  мобильный `AccountDrawer` вместо перехода на `/profile` из `BottomNav`.
- `theme-switching`: ручное переключение светлой/тёмной темы (`ThemeProvider`, `ThemeSwitch`),
  доступное из `Sidebar` (десктоп) и `AccountDrawer` (мобильные).

### Modified Capabilities

(нет — `ui-theming` из `openspec/changes/dark-theme-support` ещё не заархивирован в
`openspec/specs/`, формального delta не создаём; см. `design.md` про конфликт требований и его
разрешение)

## Impact

- Удаляется: `src/components/header/*` и импорт `Header` в `src/components/layout.tsx`.
- Изменяется: `src/components/layout.tsx`, `app/layout.tsx` (провайдер темы), `BottomNav`,
  `nav-links.ts`, `ProfilePopover` (рефакторинг общего аккаунт-блока).
- Добавляется: `src/components/sidebar/*`, `src/components/account-drawer/*`,
  `src/components/theme-toggle/*` (или аналог), `src/components/providers/theme-provider.tsx`,
  `packages/core/src/ui/switch/*` (сгенерирован shadcn CLI).
- Новая прямая зависимость: `next-themes` (точная версия, `package.json` + `package-lock.json`).
- Затронутые маршруты: все страницы под `app/(main)/**` (используют общий `Layout`).
- Требует согласования с незаархивированным `openspec/changes/dark-theme-support` (конфликт по
  запрету ручного переключателя темы).
