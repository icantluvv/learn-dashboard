## 0. Предусловие

- [x] 0.1 Убедиться, что change `move-catalog-to-route` применён и маршрут `app/catalog/page.tsx`
      существует — без него `href="/catalog"` не проходит typed routes (design.md → «Зависимости»)
- [x] 0.2 Зафиксировать исходное состояние рабочего дерева через `git status --short`

## 1. Примитив Popover в @repo/core

- [x] 1.1 Создать `packages/core/src/ui/popover/popover.tsx` — тонкая обёртка над
      `@base-ui/react/popover` по образцу `packages/core/src/ui/drawer/drawer.tsx`: `Popover`,
      `PopoverTrigger`, `PopoverContent`, `className` через `cn`, проброс props
- [x] 1.2 Создать `packages/core/src/ui/popover/index.ts` и добавить экспорты в
      `packages/core/index.ts` (в алфавитном порядке между `InputGroup` и `Select`)
- [x] 1.3 Написать `packages/core/src/ui/popover/popover.component.test.tsx`: открытие по триггеру,
      Escape закрывает и возвращает фокус, клик вне закрывает, icon-only триггер имеет accessible
      name
- [x] 1.4 Прогнать `npx vitest run packages/core/src/ui/popover/popover.component.test.tsx --project component`

## 2. Брейкпоинт

- [x] 2.1 Прогнать `grep -rn "lg:" app src packages --include=*.tsx --include=*.css` и составить
      список мест, затрагиваемых сменой Tailwind `lg` с 1024px на 992px
- [x] 2.2 Задать `--breakpoint-lg: 62rem` (= 992px) в Tailwind-теме; именно `rem`, иначе
      сортировка Tailwind-вариантов в Oxlint ломается на смешении единиц, чтобы CSS-граница совпадала с
      `useBreakpoints.gtLg` (design.md → решение 1)
- [ ] 2.3 Визуально проверить каталог и детальную страницу навыка на ширинах 992px и 1024px; при
      широком регрессе откатить 2.2 и вместо темы использовать локальную utility-границу в шапке,
      отметив это в design.md

## 3. Навигация

- [x] 3.0 Вынести общий для обеих шапок слой в `src/components/navigation/` с собственным
      `index.ts` — импорт `MainNav` через индекс `header` затягивал бы server-only `AuthStatusSlot`
      в клиентский бандл бургер-меню (design.md → решение 3)
- [x] 3.1 Создать `src/components/navigation/nav-links.ts` — единый массив `{ href, label }` с
      «Главная» → `/` и «Каталог» → `/catalog`
- [x] 3.2 Создать `src/components/navigation/is-active-route.ts` — чистая функция
      `isActiveRoute(pathname, href)`: строгое равенство для `/`, иначе `pathname === href` или
      `pathname.startsWith(href + '/')`
- [x] 3.3 Написать `src/components/navigation/is-active-route.unit.test.ts` — таблица решений
      `pathname × href`, включая `/`, `/catalog`, `/catalog/x`, `/catalogue`, `/sign-in`
- [x] 3.4 Создать `src/components/navigation/main-nav.tsx` — Client Component на `usePathname()`,
      рендерит ссылки из `nav-links.ts`, ставит `aria-current="page"` активной, принимает
      `onNavigate` для закрытия бургер-меню и `className` для мобильной раскладки
- [x] 3.5 Написать `src/components/navigation/main-nav.test.tsx` — состав ссылок и
      `aria-current` для `/`, `/catalog/[id]`, `/sign-in` (через alias `usePathname` из
      `src/tests/mocks`)

## 4. Десктопная шапка

- [x] 4.1 Создать `src/components/navigation/logo.tsx` — `Link` на `/` со слотом под иконку-логотип и
      непустым accessible name (реального ассета нет, слот-плейсхолдер)
- [x] 4.2 Переписать шапку как `src/components/header/header.tsx` — Server Component с классами
      `hidden lg:flex` и тремя зонами: `Logo` слева, `MainNav` в середине, блок авторизации справа;
      удалить `useBreakpoints` и импорт `MobileHeader`
- [x] 4.3 Перенести `<Suspense><AuthStatusSlot /></Suspense>` в правую зону `header.tsx`, заменив
      `fallback={null}` на `Skeleton` размера кнопки
- [x] 4.4 Создать `src/components/header/index.ts` с публичным экспортом `Header` и удалить
      `src/components/header.tsx`

## 5. Блок авторизации и попап профиля

- [x] 5.1 Проверить, что на `/sign-in` есть ссылка на `/sign-up`, затем сократить
      `src/components/auth-status/guest-links.tsx` до одной кнопки-ссылки «Войти» → `/sign-in`
- [x] 5.2 Создать `src/components/auth-status/profile-popover.tsx` — `Popover` с круглой
      кнопкой-аватаром в триггере (`aria-label` «Профиль: {name}», `next/image` с `unoptimized`,
      текстовый фолбэк по первому символу имени при отсутствии `image`) и `PopoverContent`
      `w-[300px]`: аватар, имя, email, кнопка выхода ниже
- [x] 5.3 Перенести в `profile-popover.tsx` существующую логику выхода из `auth-status.tsx`:
      `authClient.signOut()` → `queryClient.removeQueries({ queryKey: getAuthMeQueryKey() })` →
      `router.refresh()`, с закрытием попапа
- [x] 5.4 Упростить `src/components/auth-status/auth-status.tsx` до ветвления
      `GuestLinks` / `ProfilePopover` на основе `initialUser` + `useGetAuthMe`
- [x] 5.5 Написать `src/components/auth-status/profile-popover.component.test.tsx` — открытие по
      клику, ширина 300px, имя/email/кнопка выхода видны, выход переводит в гостевое состояние
- [x] 5.6 Обновить `src/components/auth-status/auth-status.component.test.tsx` — гость видит «Войти»
      и не видит «Регистрация»; пользователь с `image` видит кнопку-аватар; пользователь без `image`
      видит текстовый фолбэк

## 6. Мобильная шапка и бургер-меню (отменено, см. 11.5 — заменено нижней навигацией)

- [x] 6.1 Создать `src/components/mobile-header/burger-menu.tsx` — Client Component: `Drawer` из
      `@repo/core` с кнопкой-бургером (непустой `aria-label`), внутри `MainNav` с `onNavigate`,
      закрывающим меню; контролируемое `open`-состояние
- [x] 6.2 Создать `src/components/mobile-header/mobile-header.tsx` — Server Component с классами
      `flex lg:hidden`, только `Logo` слева и `BurgerMenu` справа
- [x] 6.3 Создать `src/components/mobile-header/index.ts` и удалить `src/components/mobile-header.tsx`
- [x] 6.4 Написать `src/components/mobile-header/burger-menu.component.test.tsx` — открытие
      показывает обе ссылки, `aria-current` на `/catalog/[id]`, Escape закрывает и возвращает фокус
      на бургер, клик по ссылке закрывает меню

## 7. Layout

- [x] 7.1 Обновить `src/components/layout.tsx` — `<Header />` и `<MobileHeader />` как соседи,
      удалить отдельную строку `page-wrapper flex justify-end pb-4` с `AuthStatusSlot` и
      неиспользуемый импорт `Suspense`
- [x] 7.2 Убедиться, что `MobileHeader` больше не рендерится дважды ни на одной ширине

## 8. E2E

- [x] 8.1 Добавить E2E в `src/tests/e2e` — сквозной путь: гость видит «Войти» → вход → кнопка-аватар
      в шапке → попап с именем и email → выход → снова «Войти», без ручной перезагрузки
- [x] 8.2 Добавить E2E-навигацию «Главная ↔ Каталог» с проверкой `aria-current="page"` на
      соответствующей ссылке

## 9. Документация и test-plan

- [x] 9.1 Обновить `test-plan.md` — отметить статус каждого сценария и фактические пути тест-файлов
- [x] 9.2 `docs/architecture.md` в репозитории отсутствует — правки не требуются
- [x] 9.3 Если пункт 2.3 привёл к отказу от смены Tailwind-темы — обновить решение 1 в `design.md`

## 10. Верификация

- [x] 10.1 `npx oxfmt` по всем изменённым файлам
- [x] 10.2 `npm run tsc`
- [x] 10.3 `npm run lint`
- [x] 10.4 `npm run test`
- [x] 10.5 `npm run build`
- [x] 10.6 `npm run test:e2e`
- [x] 10.7 `openspec validate rework-app-header --strict --no-interactive`
- [ ] 10.8 Ручные проверки из `test-plan.md` → «Manual checks» на 1280px и 375px
- [ ] 10.9 Перечитать итоговый diff и перечислить в отчёте выполненные проверки и непроверенные
      риски

## 11. Переработка мобильной навигации (по запросу пользователя после первой реализации)

- [x] 11.1 Десктопная шапка закреплена сверху: `sticky top-0 z-40`, `page-wrapper` заменён на
      `px-5 py-4`, фон `bg-gray-ultralight/85` + `backdrop-blur-md`. Прозрачный
      `--outline-backdrop-tint` для light-темы не подошёл: сквозь блюр просвечивал контент
- [x] 11.2 Создан `src/components/bottom-nav/bottom-nav.tsx` — `fixed inset-x-0 bottom-0`,
      `lg:hidden`, элементы из `NAV_LINKS` иконкой с подписью, `aria-current` на активном,
      нижний отступ под home-indicator через `env(safe-area-inset-bottom)`
- [x] 11.3 Создан `src/components/bottom-nav/profile-tab.tsx` — гость: ссылка «Войти» на
      `/sign-in`; авторизованный: `ProfilePopover` с подписью «Профиль». `ProfilePopover` получил
      опциональный `triggerLabel` для таб-варианта триггера
- [x] 11.4 Создан `src/components/bottom-nav/profile-tab-slot.tsx` — серверный слот с префетчем
      профиля, по образцу `AuthStatusSlot`
- [x] 11.5 `src/components/mobile-header/` удалён целиком (шапка, бургер, его component-тест)
- [x] 11.6 `NAV_LINKS` дополнены иконками (`HouseIcon`, `LayoutGridIcon`); десктопное меню
      осталось текстовым
- [x] 11.7 `Layout`: `Header` + контент + `BottomNav`, нижний отступ контента `pb-28` на мобильной
      ширине, чтобы панель не перекрывала последний блок
- [x] 11.8 `getCurrentUser` обёрнут в `cache()` из React — профиль теперь запрашивают два слота
      (шапка и таб), без дедупликации это два запроса сессии к БД на рендер
- [x] 11.9 Логика «кто залогинен» вынесена в `src/components/auth-status/use-current-user.ts` и
      переиспользуется шапкой и табом
- [x] 11.10 Component-тесты: `bottom-nav.component.test.tsx` (состав, подсветка, нейтральность вне
      разделов) и `profile-tab.component.test.tsx` (гость, авторизованный, истёкшая сессия)
- [x] 11.11 E2E `header-nav.spec.ts` обновлён: проверка разметки бургера заменена на проверку
      наличия обоих вариантов навигации
- [x] 11.12 Визуальная проверка скриншотами Playwright на 390px и 1440px: липкая шапка над
      прокрученным контентом, нижняя панель с активным разделом, гостевое и авторизованное
      состояние профиля
