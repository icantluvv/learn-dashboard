## Context

Текущая реализация (см. `rework-app-header`, ещё не заархивирован, но уже в коде):

- `src/components/bottom-nav/bottom-nav.tsx` рендерит `NAV_LINKS` (главная, каталог) с подсветкой
  через `aria-current="page"` (`isActiveRoute` из `src/components/navigation/is-active-route.ts`) и
  отдельный слот `profile` — третий элемент, переданный снаружи (`Layout`).
- `src/components/bottom-nav/profile-tab-slot.tsx` (Server) вызывает `getCurrentUser()`, кладёт
  результат в кэш через `queryClient.setQueryData(getAuthMeQueryKey(), user)` (не `prefetchQuery`) и
  гидрирует его в `ProfileTab` (Client) через `HydrationBoundary`/`dehydrate`.
- `src/components/bottom-nav/profile-tab.tsx` (Client): гость — `<Link href="/sign-in">` с иконкой и
  текстом «Войти» (без подсветки активности, не входит в `NAV_LINKS`); авторизован —
  `<ProfilePopover>`.
- `/sign-in` и `/sign-up` (`app/sign-in/page.tsx`, `app/sign-up/page.tsx`) — Server Components,
  редиректят авторизованного на `/`, используют общий `RootLayout` → `Layout` → `Header` +
  `BottomNav` на всех маршрутах, включая эти два.
- `getAuthMeQueryOptions`/`getAuthMeQueryKey`/`useGetAuthMe` уже сгенерированы в `@repo/api`
  (`packages/api/base/codegen/hooks/meController/useGetAuthMe.ts`), реэкспортированы из
  `@repo/api`. Каноничного `queryClient.prefetchQuery(getAuthMeQueryOptions())` в проекте пока нет —
  везде используется прямая инъекция уже полученных на сервере данных сессии через `setQueryData`.
- Единственная существующая route group — `app/(home)/` (организационная, layout не меняет).

## Goals / Non-Goals

**Goals:**

- Единая вкладка «Аккаунт» в мобильной нижней навигации с подсветкой активности, ведущая на новую
  страницу `/profile`.
- `/profile` — SSR-страница с реальным prefetch (`prefetchQuery`/`fetchQuery` через
  `getAuthMeQueryOptions`), а не текущим паттерном `setQueryData` из готовой сессии — задача явно
  просит запрос `auth me` в SSR, дублирующий тот же вызов, который затем повторяет клиентский хук.
- Клиентская обёртка страницы профиля читает состояние через `useGetAuthMe` и рендерит один из
  вынесенных экранов (loading/error/guest/authenticated).
- Изоляция layout `/sign-in` и `/sign-up` от `Header`/`BottomNav` через route group `(auth)` с
  собственным layout, без изменения URL.

**Non-Goals:**

- Не меняется контент/дизайн форм входа и регистрации, кроме их layout-обёртки.
- Не меняется десктопная шапка и её поведение (только мобильная нижняя навигация).
- Не меняется `GET /api/me` контракт или generated код `@repo/api`.
- Экран авторизованного профиля переиспользует существующее содержимое попапа (имя, email, аватар,
  выход), но не вводит новую бизнес-логику работы с профилем (редактирование и т.п.) — вне scope.

## Decisions

### 1. Prefetch через `getCurrentUser()` + `setQueryData` (как в `AuthStatusSlot`/`ProfileTabSlot`), а не `prefetchQuery`

Уточнение по ходу реализации: `getBaseUrl` в `packages/api/base/client.ts` считает `/api/me`
same-origin путём и возвращает `''` как базовый URL — то есть `getAuthMe()`/`getAuthMeQueryOptions`
всегда бьёт по относительному `/api/me` независимо от окружения. На клиенте это резолвится браузером
относительно текущего origin; на сервере (Node) у относительного URL нет origin, и вызов через
`queryClient.prefetchQuery(getAuthMeQueryOptions())` ненадёжен. Именно поэтому в этом кодовой базе
уже нет ни одного места, где generated SDK вызывается напрямую с сервера для same-origin путей
(`getSkills`/`getSkillById` в `src/modules/skills/server/skills-repository.ts` читают Supabase
напрямую, а не через `/api/skills`; `AuthStatusSlot`/`ProfileTabSlot` вызывают `getCurrentUser()`,
а не `getAuthMe()`).

`app/profile/page.tsx` (Server Component) повторяет уже проверенный паттерн `AuthStatusSlot`/
`ProfileTabSlot`: `const user = await getCurrentUser()`, затем при `user != null` —
`queryClient.setQueryData(getAuthMeQueryKey(), user)`, и рендер `<HydrationBoundary
state={dehydrate(queryClient)}><ProfileView /></HydrationBoundary>`. Требование задачи («префетч
запрос auth me в сср, чтоб получить данные заранее») выполняется по результату: клиентский
`useGetAuthMe()` находит уже тёплые данные в кэше и не делает повторный запрос при первой отрисовке
для авторизованного пользователя. Для гостя (`user == null`) кэш не прогревается — как и в
`AuthStatusSlot`/`ProfileTabSlot` — клиентский хук выполнит один быстрый запрос сам и получит 401.

Альтернатива — `queryClient.prefetchQuery(getAuthMeQueryOptions())`: отклонена как технически
ненадёжная на сервере для same-origin путей этого клиента (см. выше), а не только как расхождение
со стилем существующего кода.

### 2. Клиентская обёртка и экраны — отдельные компоненты

`app/profile/_components/profile-view.tsx` (Client, `'use client'`) вызывает `useGetAuthMe()` и
рендерит по состоянию один из:

- `app/profile/_components/profile-loading.tsx`
- `app/profile/_components/profile-error.tsx`
- `app/profile/_components/profile-guest.tsx` (текст-приглашение + кнопки «Войти»/«Регистрация»)
- `app/profile/_components/profile-authenticated.tsx` (переиспользует содержимое, аналогичное
  `ProfilePopover`: имя, email, аватар, выход)

`profile-view.tsx` не содержит JSX самих экранов — только выбор компонента по
`isLoading`/`isError`/`data`, как явно указано в задаче.

### 3. `/profile` — Server Component-страница, `ProfileView` — client leaf

`app/profile/page.tsx` остаётся Server Component (SSR по умолчанию, согласно границам
Server/Client из `AGENTS.md`): читает `getCurrentUser()`, прогревает кэш через `setQueryData`
(решение 1), рендерит `<HydrationBoundary>` и внутри —
`<ProfileView />` как единственный клиентский лист. Это соответствует требованию «сама страница
должна быть изначально ssr, а внутри всё остальное может быть уже клиентским».

### 4. Вкладка «Аккаунт» — не отдельный слот, а обычный пункт с подсветкой

Сейчас профиль/вход — отдельный `ReactNode`-слот `profile`, передаваемый в `BottomNav` снаружи
(через `Layout`), в стороне от `NAV_LINKS` и без участия в `isActiveRoute`. Задача требует, чтобы
иконка подсвечивалась как выбранная при нахождении на `/profile` — то есть вкладка «Аккаунт» должна
участвовать в той же логике активности, что «Главная»/«Каталог».

Решение: вкладка «Аккаунт» добавляется как статическая ссылка на `/profile` (аналогично записи в
`NAV_LINKS` — с `href: '/profile'`, своей иконкой и лейблом «Аккаунт»), рендерится в `BottomNav`
через тот же `isActiveRoute`/`aria-current="page"` механизм, что и остальные пункты. Она **не**
зависит от состояния авторизации: и гость, и авторизованный пользователь видят одинаковую вкладку
«Аккаунт» → `/profile` (различие в контенте — только внутри самой страницы `/profile`). Это убирает
необходимость в текущем Server-слоте `ProfileTabSlot` для целей нижней навигации: подсветка вкладки
не требует знания, авторизован пользователь или нет, — только текущий `pathname`.

Существующий `ProfileTabSlot`/`ProfileTab` (попап профиля) может быть удалён из `BottomNav`, так как
его роль (показ состояния авторизации гостю/пользователю) теперь целиком переносится на страницу
`/profile`. Десктопная шапка (`AuthStatusSlot`, `ProfilePopover`) не затрагивается — popover там
остаётся отдельным механизмом для десктопа, вне scope этой задачи.

Альтернатива — оставить `ProfileTab` server-слотом, но добавить туда `aria-current` вручную по
сравнению `pathname === '/profile'`: отклонена как дублирование уже существующей чистой функции
`isActiveRoute`, ведущее к двум местам с похожей, но разной логикой подсветки.

### 5. Route group `(auth)` для `/sign-in` и `/sign-up` — требует также `(main)` для остальных страниц

Уточнение по ходу реализации: в Next.js App Router вложенный layout может только дополнять
разметку родителя, но не может убрать то, что уже отрендерил родительский layout выше по дереву.
Сейчас `app/layout.tsx` (единственный root layout) рендерит `<Layout>{children}</Layout>`
безусловно для всех маршрутов — `Header`/`BottomNav` физически находятся в root layout. Просто
добавить `app/(auth)/layout.tsx` без `Header`/`BottomNav` недостаточно: они всё равно придут из
root layout выше по дереву. Чтобы у `(auth)`-группы не было общей навигации, `<Layout>` нужно
убрать из `app/layout.tsx` и перенести в отдельный layout группы, которая накрывает все страницы
с навигацией.

Итоговая структура:

- `app/layout.tsx` — остаётся единственным root layout (html/body, шрифты, метаданные,
  `SsrWidthProvider`, `NuqsAdapter`, `QueryProvider`, `Toaster`), но больше не рендерит `Layout` —
  только `{children}`.
- `app/(main)/layout.tsx` — новый layout, рендерит `<Layout>{children}</Layout>` (`Header` +
  `BottomNav` + `PwaInstallBanner`, как сейчас). Под эту группу переносятся все страницы, которым
  нужна общая навигация: `app/(home)/` → `app/(main)/(home)/`, `app/catalog/` →
  `app/(main)/catalog/`, новая `app/(main)/profile/`. URL не меняются (`/`, `/catalog`,
  `/catalog/[id]`, `/profile`) — группы не участвуют в маршруте.
- `app/(auth)/layout.tsx` — новый лёгкий layout без `Header`/`BottomNav`/`PwaInstallBanner`:
  минимальная обёртка на всю высоту (`v-stack min-h-screen bg-gray-ultralight`) с тем же безопасным
  отступом сверху, что и `Layout`, но без `pb-32` под нижнюю навигацию (её нет). Под эту группу
  переносятся `app/sign-in/` → `app/(auth)/sign-in/`, `app/sign-up/` → `app/(auth)/sign-up/`.
  Существующая проверка авторизованного редиректа (`getCurrentUser()` + `redirect('/')`) остаётся в
  самих страницах без изменений.
- Импорты через алиас `@/*` (= `app/*`) в перенесённых файлах обновляются на новые пути
  (`@/(home)/...` → `@/(main)/(home)/...`, `@/catalog/...` → `@/(main)/catalog/...`).
- `app/not-found.tsx` (корневой) рендерится только через root layout, и после переноса `Layout` в
  `(main)` теряет `Header`/`BottomNav` для полностью нераспознанных путей. Для реалистичного
  сценария — `notFound()` внутри `catalog/[id]` на несуществующий id — добавляется
  `app/(main)/not-found.tsx` (реэкспорт корневого компонента), чтобы сохранить текущее поведение с
  навигацией для этого пути. Полностью нераспознанный URL вне дерева `(main)`/`(auth)`/`api` —
  редкий край, где навигация пропадает; это принятое, задокументированное следствие переноса
  `Layout` из root layout, а не отдельная регрессия функциональности, затронутой задачей.

Альтернатива — условный рендер `Header`/`BottomNav` в `src/components/layout.tsx` по `pathname`
(например, через заголовок `x-url`, который уже прокидывает `injectHeaders`): отклонена — задача
явно предлагает именно route group («можно... собрать в (auth), чтоб лейауты отделить»), а
pathname-условная логика в общем Server Component добавляет неявную связь между layout и
конкретными маршрутами вместо явного разделения файловой структурой.

## Risks / Trade-offs

- [Удаление `ProfileTab`/`ProfileTabSlot` из нижней навигации меняет UX авторизованного
  пользователя: раньше клик по вкладке открывал popover без перехода, теперь — переход на
  `/profile`] → Явно требуется задачей («страница profile должна открываться при нажатии на эту
  кнопку навигации»); десктопный popover не трогаем, регресс ограничен мобильной навигацией.
- [Перенос `app/(home)`, `app/catalog`, `app/sign-in`, `app/sign-up` в route groups может задеть
  импорты через алиас `@/*` и тесты, ссылающиеся на старые пути файлов] → Найдены и обновлены все
  импорты `@/(home)/...`, `@/catalog/...` (4 файла) перед переносом; `src/tests/allure-labels.ts`
  не ссылается на эти пути напрямую (не затронут).
- [Полностью нераспознанный URL вне `(main)`/`(auth)`/`api` теряет `Header`/`BottomNav` в
  корневом `not-found.tsx`, так как `Layout` больше не в root layout] → Принятое следствие переноса
  `Layout` в `(main)`; `app/(main)/not-found.tsx` покрывает реалистичный случай — 404 внутри
  `catalog/[id]`.

## Migration Plan

1. Убрать `<Layout>` из `app/layout.tsx` (оставить только providers/`{children}`).
2. Создать `app/(main)/layout.tsx` с `<Layout>{children}</Layout>`; перенести `app/(home)/` →
   `app/(main)/(home)/`, `app/catalog/` → `app/(main)/catalog/`, обновить импорты `@/(home)/...` →
   `@/(main)/(home)/...`, `@/catalog/...` → `@/(main)/catalog/...`; добавить
   `app/(main)/not-found.tsx` (реэкспорт корневого `not-found`).
3. Создать `app/(auth)/layout.tsx` (без `Header`/`BottomNav`); перенести `app/sign-in/` →
   `app/(auth)/sign-in/`, `app/sign-up/` → `app/(auth)/sign-up/`.
4. Добавить статическую запись «Аккаунт» → `/profile` в источник ссылок нижней навигации
   (`NAV_LINKS` или отдельный массив рядом), убрать использование `ProfileTab`/`ProfileTabSlot` в
   `BottomNav`/`Layout`.
5. Создать `app/(main)/profile/page.tsx` (SSR + `getCurrentUser`/`setQueryData`) и
   `app/(main)/profile/_components/*` (view + 4 экрана).
6. Удалить неиспользуемые файлы `profile-tab.tsx`, `profile-tab-slot.tsx` и их тесты (десктоп
   использует `AuthStatusSlot`, не их — проверено, что больше нигде не импортируются).
7. Прогнать `npm run tsc`, `npm run lint`, релевантные component-тесты, `npm run build`.

Откат — revert коммита(ов); БД, env-контракт и generated API не затрагиваются.
