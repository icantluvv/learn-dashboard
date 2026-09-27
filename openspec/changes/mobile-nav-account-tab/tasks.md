## 1. Route groups `(main)` и `(auth)`

- [x] 1.1 Найти все ссылки/импорты на текущие пути `app/sign-in/*`, `app/sign-up/*`, `app/(home)/*`,
      `app/catalog/*` (алиас `@/*`, тесты, `src/tests/allure-labels.ts`), зафиксировать список для
      правок.
- [x] 1.2 Убрать `<Layout>` из `app/layout.tsx` — оставить только providers и `{children}`.
- [x] 1.3 Создать `app/(main)/layout.tsx`, рендерящий `<Layout>{children}</Layout>`.
- [x] 1.4 Перенести `app/(home)/` → `app/(main)/(home)/`, `app/catalog/` → `app/(main)/catalog/`
      (страницы, `_components/`, `_hooks/`, `_utils/`, тесты), обновить импорты `@/(home)/...` →
      `@/(main)/(home)/...`, `@/catalog/...` → `@/(main)/catalog/...`.
- [x] 1.5 Добавить `app/(main)/not-found.tsx` (реэкспорт корневого `app/not-found.tsx`), чтобы 404
      внутри `(main)` (например `catalog/[id]`) сохранял `Header`/`BottomNav`.
- [x] 1.6 Создать `app/(auth)/layout.tsx` — обёртка на всю высоту без `Header`/`BottomNav`.
- [x] 1.7 Перенести `app/sign-in/` → `app/(auth)/sign-in/`, `app/sign-up/` → `app/(auth)/sign-up/`
      без изменения URL и содержимого страниц/форм.
- [x] 1.8 Обновить найденные в 1.1 ссылки на новые пути (`sign-up-form.tsx`,
      `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`); `src/tests/allure-labels.ts` не
      ссылается на эти пути напрямую — не затронут.
- [x] 1.9 Проверить, что `getCurrentUser()` + `redirect('/')` для авторизованного пользователя
      продолжает работать на новых путях `/sign-in`, `/sign-up` (покрыто E2E
      «авторизованный пользователь не видит страницы входа и регистрации»).

## 2. Вкладка «Аккаунт» в нижней навигации

- [x] 2.1 Добавить запись «Аккаунт» → `/profile` в источник ссылок нижней навигации
      (`BOTTOM_NAV_ACCOUNT_LINK` в `src/components/navigation/nav-links.ts`, используется только в
      `BottomNav`, не в десктопном `MainNav`).
- [x] 2.2 Убедиться, что подсветка активности для `/profile` использует существующую
      `isActiveRoute` и рендерится тем же способом (`aria-current="page"`), что «Главная»/«Каталог».
- [x] 2.3 Убрать использование `ProfileTab`/`ProfileTabSlot` из `src/components/bottom-nav/bottom-nav.tsx`
      и из `src/components/layout.tsx` (проп `profile`).
- [x] 2.4 Проверить десктопную шапку (`AuthStatusSlot`, `ProfilePopover`) — не изменилась (E2E
      `header-auth.spec.ts`, `header-nav.spec.ts` проходят без изменений); удалены `profile-tab.tsx`,
      `profile-tab-slot.tsx` и их тест (нигде больше не использовались).

## 3. Страница `/profile` — SSR + прогрев кэша

- [x] 3.1 Создать `app/(main)/profile/page.tsx` (Server Component): `getCurrentUser()`, при
      наличии пользователя — `queryClient.setQueryData(getAuthMeQueryKey(), user)` (как в
      `AuthStatusSlot`/`ProfileTabSlot`), рендер `<HydrationBoundary
state={dehydrate(queryClient)}><ProfileView /></HydrationBoundary>`.
- [x] 3.2 Создать `app/(main)/profile/_components/profile-view/profile-view.tsx` (`'use client'`):
      `useGetAuthMe()`, `isLoading` → экран загрузки; ошибка 401 → гость, прочая ошибка → экран
      ошибки; иначе — экран авторизованного профиля с `data`.
- [x] 3.3 Создать `profile-loading.tsx` — экран загрузки.
- [x] 3.4 Создать `profile-error.tsx` — экран ошибки.
- [x] 3.5 Создать `profile-guest.tsx` — текст-приглашение авторизоваться + кнопка «Войти»
      (`/sign-in`) + кнопка «Регистрация» (`/sign-up`).
- [x] 3.6 Создать `profile-authenticated.tsx` — данные профиля (имя, email, аватар, выход), по
      образцу `ProfilePopover` (`authClient.signOut()` + `queryClient.removeQueries` +
      `router.refresh()`).

## 4. Тесты

- [x] 4.1 Component-тест `profile-view` на выбор экрана: loading / гость (401) / другая ошибка /
      авторизован.
- [x] 4.2 Component-тест гостевого экрана: наличие текста-приглашения и обеих кнопок с корректными
      `href`.
- [x] 4.3 Component-тест подсветки активной вкладки «Аккаунт» на `/profile` и её отсутствия на
      других маршрутах (расширен `bottom-nav.component.test.tsx`).
- [x] 4.4 Обновить/перенести существующие тесты `sign-in`/`sign-up` форм на новые пути — проходят
      из `app/(auth)/...` без изменений содержимого.
- [x] 4.5 E2E: клик по вкладке «Аккаунт» → переход на `/profile`; на `/profile` гость видит кнопки
      «Войти»/«Регистрация»; клик «Войти» → `/sign-in` без нижней навигации на экране
      (`src/tests/e2e/mobile-account-tab.spec.ts`, 2/2 passed).
- [x] 4.6 Обновить `test-plan.md`: статусы сценариев отмечены.

## 5. Проверка

- [x] 5.1 `npm run tsc` — без ошибок.
- [x] 5.2 `npm run lint` — без новых находок (все существующие findings в непричастных файлах).
- [x] 5.3 `npm run test:unit` (107/107) и `npm run test:component` (95/95, 31/31 файлов).
- [x] 5.4 `npm run build` — успешно, маршруты `/`, `/catalog`, `/catalog/[id]`, `/profile`,
      `/sign-in`, `/sign-up` собраны.
- [x] 5.5 Ручная проверка (dev-сервер + curl SSR-разметки, затем `npx playwright test` полным
      набором 19/19): нет нижней навигации на `/sign-in`; подсветка «Аккаунт» на `/profile`; главная и
      каталог не регрессировали после переноса в `(main)`.
- [x] 5.6 `openspec validate mobile-nav-account-tab --strict --no-interactive` — valid.
