## 0. Разрешение конфликта с dark-theme-support

- [x] 0.1 В `openspec/changes/dark-theme-support/specs/ui-theming/spec.md` убрать/переформулировать
      требование «Тема определяется системной настройкой» так, чтобы оно не запрещало ручной
      переключатель (например, переименовать в «Тема по умолчанию следует системной настройке» и
      явно допустить ручной override)
- [x] 0.2 В `openspec/changes/dark-theme-support/proposal.md` убрать формулировку «без введения
      ручного переключателя темы» из `## Why`/`## What Changes`, если она там осталась

## 1. Зависимости и Switch-примитив

- [x] 1.1 Установить `next-themes` в корневой `package.json` (`npm install next-themes`, exact
      version, обновить `package-lock.json`)
- [x] 1.2 Сгенерировать `Switch` в `@repo/core` (`npx shadcn@latest add switch`, запуск из
      `packages/core`), проверить итоговый файл на соответствие Oxlint/Oxfmt правилам проекта
      (кавычки, отступы, `interface` вместо `type` где применимо) — **отклонение**: shadcn registry
      недоступен в этой среде (нет исходящей сети), `Switch` написан вручную на основе
      `@base-ui/react/switch` по конвенции существующего `Slider`-примитива
- [x] 1.3 Экспортировать `Switch` из `packages/core` public API (там же, где остальные UI-примитивы)

## 2. ThemeProvider

- [x] 2.1 Создать `src/components/providers/theme-provider.tsx` — обёртка над `ThemeProvider` из
      `next-themes` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`,
      `disableTransitionOnChange`)
- [x] 2.2 Подключить `ThemeProvider` в `app/layout.tsx`, добавить `suppressHydrationWarning` на
      `<html>`
- [x] 2.3 Убедиться, что `app/globals.css` уже корректно применяет токены при наличии `.dark` на
      `<html>` (класс и `@custom-variant dark` уже существуют — новых токенов не требуется)

## 3. ThemeSwitch компонент

- [x] 3.1 Создать `src/components/theme-toggle/theme-switch.tsx` (`'use client'`) на основе
      `Switch` из `@repo/core`, стилизовать как pill Light/Dark по референсному скриншоту
- [x] 3.2 Добавить guard для пред-монтирования (skeleton того же размера до определения темы на
      клиенте), чтобы избежать hydration mismatch — переиспользован существующий `useIsHydrated`
- [x] 3.3 Экспортировать `ThemeSwitch` из `index.ts` модуля
- [x] 3.4 Component test: клик/клавиатура переключают тему, `aria`-состояние отражает текущий выбор

## 4. Общий аккаунт-блок

- [x] 4.1 Вынести презентационную часть аватара из `profile-popover.tsx` в переиспользуемый
      `Avatar`/`AccountSummary` (аватар + имя/email), сохранив существующее поведение и тесты
      `ProfilePopover` без изменений ожиданий
- [x] 4.2 Вынести логику выхода (`authClient.signOut()` + `removeQueries` + `router.refresh()` +
      закрытие оверлея) в переиспользуемый хук `useSignOut()` в `src/components/auth-status/`
- [x] 4.3 Обновить `ProfilePopover`, чтобы использовать `AccountSummary`/`useSignOut()`, не меняя
      публичный контракт и визуальное поведение попапа
- [x] 4.4 Прогнать существующие `profile-popover.test.tsx`/`.component.test.tsx` (включая
      screenshot-тесты) без изменения ожиданий — 12/12 тестов зелёные

## 5. Sidebar

- [x] 5.1 Создать `src/components/sidebar/sidebar.tsx` (Server Component): `Logo` → `MainNav`
      (вертикальный вариант через существующие пропсы `className`/`linkClassName`) → нижний блок
      (`AuthStatusSlot` с `Suspense`, как в старом `Header`) → `ThemeSwitch`
- [x] 5.2 Стилизовать `Sidebar` как `hidden lg:flex`, `sticky top-0 h-screen`, колонка `flex-col`
      с `justify-between`/`mt-auto` для нижнего блока
- [x] 5.3 Component test: SSR-рендер содержит `Logo`, ссылки `MainNav`, блок аккаунта для гостя и
      для авторизованного пользователя (мок `getCurrentUser`) — **отклонение**: `AuthStatusSlot`
      сам является async Server Component (как и `Dashboard` до него, см. `dashboard.test.tsx`) и
      непосредственно не рендерится в client-side тестовом харнессе; в component test он замокан
      через `vi.mock('#/components/auth-status', ...)`, проверяется только то, что `Sidebar`
      корректно его монтирует. Реальное поведение для гостя/авторизованного пользователя проверяется
      в E2E (раздел 8)

## 6. Grid-раскладка (main) layout и удаление Header

- [x] 6.1 Обновить `src/components/layout.tsx`: заменить `<Header />` на `<Sidebar />`, перейти на
      `lg:grid lg:grid-cols-[1fr_5fr]` для колонок sidebar/контент, колонка `Sidebar` — `hidden
lg:block`
- [x] 6.2 Удалить `src/components/header/` целиком (`header.tsx`, `index.ts`) и любые оставшиеся
      импорты `Header`
- [x] 6.3 Проверить `npm run build`, что маршруты `app/(main)/**` компилируются без ссылок на
      удалённый `Header`

## 7. AccountDrawer и BottomNav

- [x] 7.1 Создать `src/components/account-drawer/account-drawer.tsx` (`'use client'`): `Drawer`
      (`swipeDirection="right"`) с содержимым — `Logo`, `AccountSummary`/кнопка входа, `ThemeSwitch`
      внизу; `DrawerContent` — full-bleed на мобильных (`100vw`/`100dvh`, `rounded-none`,
      `border-l-0`)
- [x] 7.2 Обновить `BottomNav`: последний пункт («Аккаунт») рендерится как `DrawerTrigger` внутри
      `AccountDrawer` вместо `Link` на `/profile`; убрать `aria-current` для этой кнопки
- [x] 7.3 Проверить/обновить `BOTTOM_NAV_ACCOUNT_LINK` в `nav-links.ts` (оставить иконку/лейбл,
      убрать использование как маршрута в `BottomNav`, если структура типа этого требует правки) —
      `href` оставлен в типе `NavLink` (не используется `AccountDrawer`, только icon+label),
      комментарий обновлён
- [x] 7.4 Component test: клик «Аккаунт» в `BottomNav` открывает `AccountDrawer` (не роутит),
      содержимое корректно для гостя/авторизованного пользователя, Escape/оверлей закрывают Drawer
      — закрытие по Escape/оверлею уже покрыто общим `drawer.component.test.tsx` в `@repo/core`,
      здесь проверено специфичное для `AccountDrawer` содержимое и выход
- [x] 7.5 Обновить существующий `bottom-nav.component.test.tsx` под новое поведение кнопки
      «Аккаунт»

## 8. E2E

- [x] 8.1 Playwright: десктопный viewport — `Sidebar` виден, `Header` отсутствует в DOM,
      переключение темы через `Sidebar` сохраняется после `reload` — `sidebar-nav.spec.ts` (замена
      `header-nav.spec.ts`) + `theme-switching.spec.ts`
- [x] 8.2 Playwright: мобильный viewport — клик «Аккаунт» в `BottomNav` открывает full-screen
      `AccountDrawer` поверх `BottomNav`, переключатель темы работает внутри Drawer —
      `mobile-account-drawer.spec.ts` (замена `mobile-account-tab.spec.ts`) + `theme-switching.spec.ts`
      (синхронизация Sidebar/Drawer); `header-auth.spec.ts` переименован в `sidebar-auth.spec.ts`
      без изменения поведения

## 9. Верификация и test-plan

- [x] 9.1 `npm run tsc`, `npm run lint`, `npm run fmt:check` — только по изменённым/новым файлам,
      затем целиком для затронутых пакетов (`@repo/core`, корень) — оба чистые, оставшиеся
      lint-ошибки предсуществующие вне diff (error-boundary test, `search-params.ts`, `env.ts`,
      `ttFors.ts`, `postcss.config.mjs`)
- [x] 9.2 `npm run test` (unit + component) — все новые и обновлённые тесты зелёные — unit 15/15
      файлов (107 тестов), component 37/37 файлов (114 тестов)
- [x] 9.3 `npm run test:e2e` — новые сценарии из раздела 8 проходят — 22/22 e2e-теста зелёные
      (включая ранее существовавшие, не затронутые этим change)
- [x] 9.4 `npm run build` — успешная сборка после удаления `Header` и добавления `next-themes`
- [x] 9.5 Обновить `test-plan.md` — отметить статус выполненных сценариев после прогона тестов
- [x] 9.6 `openspec validate add-app-sidebar-navigation --strict --no-interactive`
