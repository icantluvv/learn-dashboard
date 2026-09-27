## Context

Текущая оболочка (`src/components/layout.tsx`) рендерит: `Header` (десктоп, `hidden lg:flex`,
логотип + `MainNav` + `AuthStatusSlot` в одну строку), контент, `PwaInstallBanner`, `BottomNav`
(мобильный, `lg:hidden`, ссылки `NAV_LINKS` + `BOTTOM_NAV_ACCOUNT_LINK` на `/profile`). Ручного
переключателя темы нет: `app/globals.css` уже содержит `.dark`-класс и
`@custom-variant dark (&:is(.dark *))` (от shadcn base), но ничего не выставляет `.dark` на
`<html>` — тема следует только `@media (prefers-color-scheme: dark)`.

Конфликт с существующим планированием: незаархивированный `openspec/changes/dark-theme-support`
содержит спеку `ui-theming` с требованием «Тема определяется системной настройкой» и явным SHALL NOT
на ручной переключатель/`.dark`-класс. Пользователь подтвердил (см. `AskUserQuestion` в рамках этого
change): курс — модифицировать это решение, а не оставлять свитч визуальной заглушкой. Поскольку
`ui-theming` ещё не заархивирован в `openspec/specs/`, формальный `MODIFIED Requirements` delta
против него создать нельзя (архивной спеки не существует) — вместо этого:

- новая capability `theme-switching` в этом change фиксирует актуальное, ручное поведение;
- как отдельная task (см. `tasks.md`, раздел 0) — точечно обновить
  `openspec/changes/dark-theme-support/specs/ui-theming/spec.md` и его `proposal.md`, убрав
  формулировку «без ручного переключателя», чтобы при будущем архивировании оба change не
  противоречили друг другу. Это правка только планировочных markdown-файлов
  `dark-theme-support` (сам change уже полностью реализован и не архивирован), исходный код внутри
  него не трогается.

`ProfilePopover` (`src/components/auth-status/profile-popover.tsx`) уже содержит всю логику аватара,
имени, email и выхода — её нужно расшарить, а не продублировать, между тремя местами: попап в
`Sidebar`, содержимое `AccountDrawer`.

`Drawer` в `@repo/core` (`packages/core/src/ui/drawer`) уже умеет `swipeDirection="left"/"right"`
(x-axis), z-index `50` (выше, чем `BottomNav` `z-40`), и по умолчанию ширину `24rem` на `sm+` /
`75%` на мобильных — для этого change нужно full-bleed на мобильных, что потребует явного override
через `className`/CSS-переменные компонента, а не изменения самого примитива.

## Goals / Non-Goals

**Goals:**

- Заменить `Header` вертикальным `Sidebar` (SSR, статичный) с пропорцией `1:5` к контенту на `lg+`.
- Мобильная нижняя навигация остаётся без изменений внешнего вида, кроме поведения кнопки
  «Аккаунт»: вместо `Link` на `/profile` — триггер `AccountDrawer` справа, full-screen, поверх
  `BottomNav`.
- Добавить рабочий ручной переключатель темы, синхронный между `Sidebar` и `AccountDrawer`,
  персистентный между визитами.
- Переиспользовать существующую auth-логику (`AuthStatusSlot`, `useCurrentUser`, `authClient`) без
  дублирования запросов/состояния.

**Non-Goals:**

- Не меняем содержимое страницы `/profile` и не удаляем маршрут — только убираем на неё прямую
  ссылку из `BottomNav`.
- Не вводим тему как серверное/per-request состояние (нет персонализации на бэкенде) — только
  клиентское хранение выбора.
- Не переносим существующую логику каталога/фильтров — их grid и `sidebar-filters` не относятся к
  этому change.
- Не архивируем `dark-theme-support` в рамках этого change — только устраняем формулировку-конфликт
  в его ещё не заархивированных планировочных файлах.

## Decisions

### 1. Grid-раскладка `(main)` layout вместо `flex`+`hidden lg:flex`

`src/components/layout.tsx` переходит с вертикального `flex`-стека на `lg+` на grid с двумя
колонками: `lg:grid lg:grid-cols-[1fr_5fr]` (`Sidebar` — `1fr`, контент — `5fr`, что даёт точную
пропорцию `1:5` независимо от breakpoint-ширины контейнера). Ниже `lg` — одна колонка, `Sidebar`
не рендерится (компонент сам возвращает `null` ниже `lg` нельзя — SSR не знает viewport; вместо
этого `Sidebar` рендерится всегда, но скрыт через `hidden lg:flex` на корневом элементе, как раньше
делал `Header`, а grid-колонка на `Sidebar` — `hidden lg:block`, чтобы не резервировать место на
мобильных). `PwaInstallBanner` и `BottomNav` остаются вне grid, как раньше.

Альтернатива — `flex` с фиксированной `width` для sidebar: отклонена, т.к. явное `1:5` через
`grid-template-columns` проще проверяется и не требует магических `px`/`%`.

### 2. `Sidebar` — Server Component, композиция трёх частей

`src/components/sidebar/sidebar.tsx`: server component, structurally идентичен по данным старому
`Header` — `Logo`, `MainNav` (тот же компонент, но с вертикальным `className` через существующий
проп `className`/`linkClassName`, без изменения самого `MainNav`), и нижний блок — `AuthStatusSlot`
(без изменений: та же `Suspense`+`HydrationBoundary`+`getCurrentUser` серверная логика) плюс
`ThemeSwitch` (client) под ним. `Sidebar` сам не помечен `'use client'` — интерактивность инкапсулирована
в `MainNav` (уже client, использует `usePathname`) и `ThemeSwitch`.

### 3. Общий аккаунт-блок вместо дублирования `ProfilePopover`

Извлекаем из `profile-popover.tsx` презентационные куски:

- `AccountSummary` (аватар + имя/email) — уже почти линейно копируется в `PopoverContent`;
- `Avatar` — уже отдельная функция, поднимается в `src/components/auth-status/avatar.tsx` (или
  остаётся файлом `profile-popover.tsx`, но экспортируется) для переиспользования в `AccountDrawer`.

`Sidebar` продолжает использовать `AuthStatusSlot` → `AuthStatus` → `ProfilePopover`/`GuestLinks`
без изменений публичного контракта (`ProfilePopover` остаётся popover-триггером с аватаром+именем,
открывающим по клику мини-попап с email и кнопкой «Выйти» — то же поведение, что было в `Header`).

`AccountDrawer` — новый клиентский компонент, использует `useCurrentUser` (тот же хук, что и
`AuthStatus`) напрямую (без вложенного `Popover` внутри `Drawer` — вложенные оверлеи избыточны),
рендерит `AccountSummary` инлайн и кнопку «Выйти» с той же логикой `authClient.signOut()`, что и в
`ProfilePopover` (вызов вынесен в общий хук `useSignOut()` в `src/components/auth-status/`, чтобы не
дублировать побочные эффекты — `removeQueries`, `router.refresh()`, закрытие оверлея).

### 4. Тема: `next-themes` + shadcn `Switch`

- Добавляем `next-themes` как точную (exact) зависимость в корневой `package.json` (per `.npmrc`
  `save-exact`), устанавливаем через `npm install next-themes` (без `bun` — проект зафиксирован на
  npm, см. `AGENTS.md`).
- `src/components/providers/theme-provider.tsx` — тонкая обёртка над `ThemeProvider` из
  `next-themes` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`,
  `disableTransitionOnChange`), монтируется в `app/layout.tsx` рядом с `QueryProvider`; на
  `<html>` добавляется `suppressHydrationWarning` (стандартное требование `next-themes` при SSR,
  чтобы React не ругался на класс `.dark`/`.light`, проставляемый inline-скриптом до гидрации).
- `Switch` добавляется в `@repo/core` через `shadcn` CLI, команда пользователя
  (`bunx --bun shadcn@latest add switch`) заменяется на npm-эквивалент
  `npx shadcn@latest add switch` (репозиторий не использует `bun`, см. `AGENTS.md` →
  «Единственный пакетный менеджер — npm»), запускается из `packages/core` (там же, где уже стоит
  `components.json` с `aliases.ui: "@repo/core/src/ui"`).
- `src/components/theme-toggle/theme-switch.tsx` — `'use client'`, использует `useTheme()` из
  `next-themes`, оборачивает сгенерированный `Switch` в pill с текстовыми лейблами «Light»/«Dark» по
  референсу (двух-позиционный сегмент, а не классический on/off тумблер): `checked = theme ===
'dark'`, `onCheckedChange` вызывает `setTheme(...)`. До монтирования на клиенте (`useEffect`
  guard) рендерится skeleton-заглушка того же размера, чтобы избежать hydration mismatch (тема на
  сервере неизвестна).

### 5. `AccountDrawer` поверх `BottomNav`, full-bleed на мобильных

`Drawer` из `@repo/core` уже даёт `z-50` для `Viewport`/`Popup`, что выше `BottomNav` (`z-40`) —
дополнительный z-index не нужен. Для full-screen на мобильных `DrawerContent` получает
`className`, переопределяющий CSS-переменные компонента:
`[--drawer-content-width:100vw] [--drawer-content-max-height:100dvh]
[--drawer-content-height:100dvh] rounded-none border-l-0 sm:[--drawer-content-width:24rem]` —
на `sm+` (если Drawer вообще будет открываться там, хотя в этом change триггер есть только в
`BottomNav`, который сам `lg:hidden`) сохраняется дефолтная более узкая ширина примитива.

### 6. Кнопка «Аккаунт» в `BottomNav`: из `Link` в `DrawerTrigger`

`BOTTOM_NAV_ACCOUNT_LINK` (`nav-links.ts`) перестаёт использоваться как элемент, рендерящийся через
общий `Link`-цикл `BOTTOM_NAV_LINKS.map(...)`. `BottomNav` выделяет последний пункт отдельно:
`NAV_LINKS.map(...)` рендерится как раньше (обычные `Link`), а «Аккаунт» — как
`<DrawerTrigger render={<button>...</button>} />` с той же иконкой/классами, но без `aria-current`
(это уже не маршрут) и оборачивается в `<AccountDrawer>` (компонент-обёртка над `Drawer` +
`DrawerContent`, монтируемый в самом `BottomNav`).

## Test strategy

- **Static**: `npm run tsc`, `npm run lint`, `npm run fmt:check` — обязательны после любых правок
  TS/TSX и `globals.css`.
- **Unit**: нет новой чистой логики без React-рендера, кроме, возможно, `useSignOut()` — если он
  тривиален, отдельный unit не требуется, достаточно component-теста потребителя.
- **Component** (`vitest-browser-react`, real browser):
    - `Sidebar` — SSR-рендер, наличие `Logo`, `MainNav` со ссылками, блока аккаунта (гость/авторизован
      через мок `AuthStatusSlot`/`getCurrentUser`).
    - `ThemeSwitch` — переключение вызывает `setTheme`, отражает текущее состояние, доступно с
      клавиатуры (роль `switch`/`radiogroup`, `aria-checked`/`aria-pressed`).
    - `AccountDrawer` — открытие/закрытие, содержимое для гостя и авторизованного пользователя,
      фокус-ловушка (уже покрыта `Drawer` component test, здесь — специфика контента).
    - `BottomNav` — кнопка «Аккаунт» открывает `AccountDrawer`, а не переходит по ссылке (обновление
      существующего `bottom-nav.component.test.tsx`).
- **Integration/E2E** (Playwright, `src/tests/e2e`): один сценарий на десктопном viewport
  (`lg+`) — `Sidebar` виден, `Header` отсутствует, переключение темы сохраняется после `reload`;
  один сценарий на мобильном viewport — клик «Аккаунт» открывает full-screen `AccountDrawer` поверх
  `BottomNav`, переключатель темы работает и внутри Drawer.
- **Manual**: визуальная сверка пропорции `1:5` и pill-стиля переключателя с референсным скриншотом
  на реальном брaузере (light/dark, разные ширины `lg`/`xl`).

## Risks / Trade-offs

- [Риск] Добавление `next-themes` — новая рантайм-зависимость с inline-скриптом до гидрации →
  Митигация: `next-themes` — стандартный, широко используемый пакет для Next.js App Router,
  `suppressHydrationWarning` документирован как требуемый паттерн, риск минимален.
- [Риск] Конфликт с незаархивированным `dark-theme-support` может запутать будущих читателей
  истории change'ей → Митигация: явная task на правку планировочных файлов `dark-theme-support`
  (раздел 0 `tasks.md`) в рамках этого же change, а не тихое расхождение.
- [Риск] Вынос общего аккаунт-блока из `ProfilePopover` может случайно изменить поведение
  существующего попапа (регрессия для уже стабильного UI) → Митигация: `profile-popover.test.tsx`/
  `.component.test.tsx` остаются зелёными без изменений ожиданий (только рефакторинг источника, не
  поведения), плюс визуальный regression через существующие screenshot-тесты в
  `__screenshots__/profile-popover.component.test.tsx`.
- [Trade-off] `Sidebar` всегда рендерится в DOM (просто `hidden` ниже `lg`), а не условно на
  сервере — цена: лишняя, но дешёвая серверная разметка на мобильных; выгода: нет layout shift и
  hydration-развилок по ширине экрана (тот же паттерн, что уже использовался для `Header`).
