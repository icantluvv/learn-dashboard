## Context

Мотивация — см. `proposal.md` → «Why». Требования — см. `specs/app-header/spec.md` и
`specs/ui-primitives/spec.md`.

Текущее состояние, которое формирует подход:

- `src/components/header.tsx` — Client Component, вызывающий `useBreakpoints()` (обёртка над
  `useMediaQuery`) и при `!gtLg` рендерящий `<MobileHeader />`, иначе `null`. То есть обе шапки уже
  сейчас выбираются на клиенте после гидрации.
- `src/components/layout.tsx` — Server Component; рендерит `<Header />`, `<MobileHeader />` (дважды
  на мобильной ширине) и отдельную строку с `<Suspense><AuthStatusSlot /></Suspense>`.
- `AuthStatusSlot` — async Server Component: читает `getCurrentUser()` (server-only, better-auth),
  кладёт результат в `queryClient` под `getAuthMeQueryKey()` и отдаёт `<AuthStatus initialUser>` под
  `HydrationBoundary`. `AuthStatus` — Client Component на `useGetAuthMe`.
- `@repo/core` экспортирует `Button`, `Card`, `Drawer`, `Input`, `InputGroup`, `Select`, `Skeleton`,
  `Slider`, `Textarea`, `Toast`, `cn`. Примитива `Popover` нет; `@base-ui/react@1.8.0` уже
  в зависимостях пакета.
- Брейкпоинт `lg` в `useBreakpoints` — 992px. Tailwind 4 по умолчанию использует `lg = 1024px`, то
  есть числа не совпадают.
- `useMediaQuery` не «слепой» на сервере: `app/layout.tsx` кладёт в `SsrWidthProvider` ширину,
  угаданную `getSsrWidthFromUserAgent` по user-agent (375 / 768 / 1280), и `useMediaQuery` использует
  её как `getServerSnapshot`. То есть грубого мерцания «мобильная → десктопная шапка» при типовом UA
  не происходит; проблема в точности эвристики, а не в её отсутствии.
- `public/` в репозитории отсутствует — готового ассета логотипа нет.
- Маршрута `/catalog` сейчас нет: есть только `/catalog/[id]`, а каталог со списком и фильтрами
  находится на главной `/`. Перенос содержимого главной в `/catalog` выделен в отдельный change
  `move-catalog-to-route` — см. «Зависимости» ниже.
- `src/tests/allure-labels.ts` уже маппит `/src/components/header/` → feature «Навигация» и
  `/src/components/header/notifications/` → «Уведомления».

## Зависимости

Ссылка «Каталог» → `/catalog` требует существующего маршрута `/catalog`, которого сейчас нет. Этот
маршрут создаёт отдельный change `move-catalog-to-route` (перенос содержимого главной в `/catalog`,
главная становится дашбордом). Порядок раската: `move-catalog-to-route` → `rework-app-header`.

Следствия для реализации:

- Typed routes не пропустят `href="/catalog"` до появления `app/catalog/page.tsx`, поэтому
  `npm run tsc` в этом change зелёный только после применения `move-catalog-to-route`.
- Сценарии подсветки активной ссылки на `/catalog` и E2E-навигация «Главная ↔ Каталог» проверяемы
  только после того же условия.
- Правило `isActiveRoute` для `/catalog` выбрано с учётом будущей структуры: активна и на
  `/catalog`, и на `/catalog/[id]`.

## Goals / Non-Goals

**Goals:**

- Убрать выбор варианта шапки из JS-рантайма: обе шапки в SSR-разметке, видимость — через CSS.
- Дать `@repo/core` минимальный примитив `Popover`, пригодный для попапа профиля и будущих меню.
- Сохранить существующий серверный путь определения авторизации (`AuthStatusSlot` +
  `HydrationBoundary`) без переноса логики в клиент.
- Держать client boundary на листьях: сама шапка остаётся серверной, клиентские только
  интерактивные части (активная ссылка, попап, бургер).

**Non-Goals:**

- Реальный ассет логотипа и брендинг.
- Уведомления в шапке (директория `header/notifications/` из allure-маппинга остаётся пустым
  заделом — не создаём).
- Sticky/скрывающаяся при скролле шапка.
- Расширение навигации сверх двух ссылок и any-роль-based меню.
- Создание маршрута `/catalog` и перенос содержимого главной — это отдельный change
  `move-catalog-to-route`.
- Тёмная тема шапки сверх того, что даёт существующая палитра токенов (за неё отвечает отдельный
  change `dark-theme-support`).

## Decisions

### 1. CSS-брейкпоинт вместо `useBreakpoints`

Выбираем видимость через Tailwind-утилиты на контейнерах: десктопная шапка `hidden lg:flex`,
мобильная — `flex lg:hidden`. `Header` перестаёт импортировать `MobileHeader` и `useBreakpoints`;
`Layout` рендерит оба компонента как соседей (сейчас он уже так делает, но с дублированием
`MobileHeader` на мобильной ширине — это уходит).

Почему: `getSsrWidthFromUserAgent` — эвристика по трём значениям (375 / 768 / 1280). Она даёт верный
результат для типового мобильного и десктопного UA, но ошибается там, где UA не говорит о ширине:
десктопный браузер в узком окне или в half-screen получает SSR-снапшот 1280px и на первом рендере
покажет десктопную шапку, а после гидрации переключится на мобильную. Неизвестный UA даёт 1280px по
умолчанию. CSS-граница таких расхождений не имеет по построению и заодно снимает лишний client
boundary с шапки, содержимое которой статично.

Альтернативы:

- Оставить `useBreakpoints` — отвергнуто: остаётся окно расхождения SSR-эвристики с реальной шириной
  и лишний client boundary там, где он не нужен. Сам хук не удаляем — он используется в других
  местах.
- Рендерить только один вариант шапки по SSR-ширине — отвергнуто по той же причине: точность
  ограничена user-agent.

Про несовпадение чисел: используем Tailwind-брейкпоинт `lg`. Спека формулирует границу как 992px, а
Tailwind `lg` — 1024px, поэтому `lg` Tailwind-темы переопределяется в `app/globals.css` как
`--breakpoint-lg: 62rem` (= 992px), чтобы CSS-граница и `useBreakpoints.gtLg` совпадали и в проекте
осталось одно число.

Единица именно `rem`, а не `px`: правило `tailwindcss(enforce-consistent-class-order)` в Oxlint
читает объявленную шкалу и при смешении `px` с `rem` перестаёт корректно упорядочивать варианты —
`lg:` начинает сортироваться перед `sm:` даже в файлах, которых change не касается.

### 2. `Popover` в `@repo/core` на Base UI

Новый примитив `packages/core/src/ui/popover/` (`popover.tsx`, `index.ts`,
`popover.component.test.tsx`) поверх `@base-ui/react/popover`, по образцу существующего `Drawer`:
тонкая обёртка, проброс props, `cn` для `className`, экспорт `Popover`, `PopoverTrigger`,
`PopoverContent` (плюс `PopoverPortal`/`PopoverPositioner`, если они нужны наружу) из
`packages/core/index.ts`.

Почему не `Drawer`: `Drawer` модальный, с focus trap и backdrop, выезжает снизу — это не поведение
попапа профиля. Почему не ad-hoc `div` с ручным позиционированием: потеряем Escape, outside-click,
возврат фокуса и `aria-*`-связку триггера с попапом.

Ширина 300px задаётся потребителем через `className="w-[300px]"` на `PopoverContent`, а не
зашивается в примитив — примитив остаётся общего назначения.

### 3. Структура компонентов

```
src/components/navigation/       общий для обеих шапок слой
  index.ts                       публичный API: Logo, MainNav
  logo.tsx                       server, Link на / со слотом под иконку
  main-nav.tsx                   client, ссылки + usePathname
  nav-links.ts                   данные навигации (единый источник для desktop и mobile)
  is-active-route.ts             чистая функция определения активной ссылки
  is-active-route.unit.test.ts
  main-nav.test.tsx
  logo.test.tsx
src/components/header/
  index.ts                       публичный API: Header
  header.tsx                     server, десктопная шапка (hidden lg:flex)
src/components/mobile-header/
  index.ts
  mobile-header.tsx              server, мобильная шапка (flex lg:hidden)
  burger-menu.tsx                client, Drawer + MainNav
  burger-menu.component.test.tsx
src/components/auth-status/
  auth-status.tsx                client, ветвление гость/пользователь (существует)
  guest-links.tsx                → одна кнопка «Войти» на /sign-in
  profile-popover.tsx            client, Popover: аватар-триггер + данные + выход
  profile-popover.component.test.tsx
  auth-status.component.test.tsx (существует, обновляется)
```

`Logo` и `MainNav` вынесены в отдельный модуль `src/components/navigation/`, а не оставлены внутри
`src/components/header/`. Причина конкретная: `src/components/header/index.ts` экспортирует `Header`,
который тянет серверный `AuthStatusSlot` → `#/lib/auth/get-session` (`server-only`). Клиентское
бургер-меню импортирует `MainNav`, и импорт через индекс шапки затягивал бы server-only код в
клиентский бандл — сборка падает с `module-not-found`. Отдельный модуль с собственным публичным API
решает это без deep import.

`nav-links.ts` — один массив `{ href, label }`, потребляемый и десктопной навигацией, и
бургер-меню. Это прямое следствие требования «бургер-меню повторяет навигацию десктопа»: два
независимых списка разойдутся.

Оба каталога — `src/components/*`, а не `src/modules/*`: шапка не содержит доменной логики и
используется из общего layout, это инфраструктурный shared-компонент. Директория
`src/components/header/` также приводит структуру в соответствие с уже существующим маппингом в
`src/tests/allure-labels.ts`.

### 4. Определение активной ссылки

Чистая функция `isActiveRoute(pathname, href)`: для `href === '/'` — строгое равенство; иначе
`pathname === href || pathname.startsWith(href + '/')`. Это даёт «Каталог» активным на
`/catalog/[id]` и ничего не подсвечивает на `/sign-in`, как требует спека. Функция вынесена
отдельно, чтобы покрываться unit-тестом без рендера.

`usePathname()` делает `MainNav` клиентским — это единственная причина client boundary в навигации,
и она локализована в листе.

### 5. Бургер-меню на существующем `Drawer`

Переиспользуем `Drawer` из `@repo/core` (`swipeDirection`, focus trap, Escape, backdrop уже есть) —
новый примитив под меню не нужен. Закрытие при переходе по ссылке — через контролируемое
`open`-состояние: `onClick` на ссылке закрывает Drawer, навигацию выполняет сам `Link`.

Альтернатива — `Popover` и для бургера: отвергнуто, на мобильной ширине нужен модальный слой с
блокировкой фона.

### 6. Блок авторизации переезжает в шапку

`Layout` теряет строку `<div className="page-wrapper flex justify-end pb-4">` с `AuthStatusSlot`.
`<Suspense fallback={...}><AuthStatusSlot /></Suspense>` переносится внутрь `Header` в правую зону.
Fallback перестаёт быть `null` и становится `Skeleton` размера кнопки — иначе правая зона шапки
схлопывается на время стриминга и раскладка прыгает.

`AuthStatusSlot` остаётся async Server Component без изменений: он уже отдаёт ровно то, что нужно
(`initialUser` + dehydrated query state). Меняется только `AuthStatus`: вместо inline-аватара, имени
и icon-кнопки выхода — ветвление на `GuestLinks` / `ProfilePopover`. Логика `signOut` +
`queryClient.removeQueries({ queryKey: getAuthMeQueryKey() })` + `router.refresh()` переезжает в
`ProfilePopover` без изменения поведения.

На мобильной шапке блок авторизации по спеке не показывается — `AuthStatusSlot` рендерится один раз,
внутри десктопного `Header`.

### 7. Фолбэк аватара

`CurrentUser.image` опционален. При отсутствии — круглая кнопка с инициалом из `user.name` (первый
символ, uppercase) на фоне из палитры. `next/image` используется с `unoptimized`, как уже сделано в
текущем `AuthStatus` (static image imports в проекте отключены, источник — внешний URL).

Accessible name кнопки-триггера — `aria-label` вида «Профиль: {name}»; сам `<Image alt="">` остаётся
декоративным, чтобы имя не дублировалось.

## Test strategy

Уровни выбираются по самому дешёвому слою, на котором поведение наблюдаемо. Полная матрица
сценарий → уровень → файл — в `test-plan.md`.

- **Static**: `npm run tsc`, `npm run lint`, `npx oxfmt` по изменённым файлам. Покрывает
  типобезопасность props шапки и запрет неизвестных Tailwind-классов.
- **Unit** (`*.unit.test.ts`, Node env): `isActiveRoute` — таблица решений по `pathname × href`,
  включая граничные случаи `/`, `/catalog`, `/catalog/x`, `/catalogue` (префикс без слеша не должен
  считаться вложенным), `/sign-in`.
- **Component** (`*.component.test.tsx` / `*.test.tsx`, реальный Chromium через
  `@vitest/browser-playwright`): `Popover` (открытие, Escape + возврат фокуса, outside-click),
  `MainNav` (состав ссылок, `aria-current` на `/`, `/catalog/[id]`, `/sign-in`), `AuthStatus`
  (гость → «Войти» и отсутствие «Регистрация»; пользователь → кнопка-аватар; пользователь без
  `image` → текстовый фолбэк), `ProfilePopover` (открытие, ширина 300px, имя/email/кнопка выхода,
  выход переводит в гостевое состояние), `BurgerMenu` (открытие, состав ссылок, `aria-current`,
  Escape, закрытие при переходе). Next navigation подменяется существующими aliases из
  `src/tests/mocks`; `usePathname` параметризуется через них.
- **Integration**: отдельного уровня не заводим — граница «серверный `AuthStatusSlot` → клиентский
  `AuthStatus`» наблюдаема только в реальном браузере с реальной сессией, поэтому она закрывается
  E2E, а не промежуточным уровнем. Component-тесты работают с `AuthStatus` напрямую, передавая
  `initialUser` и мок-клиент `@repo/api`.
- **E2E** (Playwright, Chromium): сквозной путь P0 — гость видит «Войти» → вход через `/sign-in` →
  в шапке появляется кнопка-аватар → попап показывает имя и email → выход → в шапке снова «Войти»,
  без ручной перезагрузки. Второй E2E — навигация «Главная ↔ Каталог» с проверкой `aria-current`.
- **Performance**: не требуется — изменение не затрагивает data fetching и размер бандла значимо
  (новый примитив — часть уже подключённого `@base-ui/react`).
- **Manual**: раскладка на 1280px и 375px, отсутствие мерцания шапки при первой загрузке (сценарий
  наблюдается только глазами/видеозаписью, автоматизация нестабильна), фактическая ширина попапа
  300px, поведение при длинном имени/email в попапе.

## Risks / Trade-offs

- **Смена Tailwind `lg` с 1024px на 992px затрагивает существующую вёрстку** → фактическое
  использование `lg:` в проекте оказалось минимальным (два `lg:gap-6` в каталоге и `max-width` у
  `page-wrapper`), поэтому смена принята. Остаётся непроверенным вручную поведение каталога на
  ширинах 992–1024px.
- **Обе шапки в DOM одновременно** → незначительный рост разметки; взамен исчезает зависимость от
  точности UA-эвристики.
  Дублирования фокусируемых элементов для screen readers не возникает, так как скрытый контейнер
  скрыт `display: none` через `hidden`, а не только визуально.
- **`Popover` — новый публичный примитив `@repo/core`** → фиксируем минимальный API (Root/Trigger/
  Content) и не выносим наружу то, что не нужно попапу профиля; расширение — по мере появления
  второго потребителя.
- **Попап профиля 300px на узких экранах** → на мобильной ширине блок авторизации в шапке не
  показывается, поэтому конфликт не возникает; если позже аватар добавят в мобильную шапку,
  фиксированная ширина потребует пересмотра.
- **Перенос `AuthStatusSlot` внутрь `Header`** → при медленной сессии правая зона шапки какое-то
  время занята скелетоном; это осознанный размен на стабильную раскладку вместо `null`-fallback.
- **Зависимость от `move-catalog-to-route`** → если тот change не применён, `href="/catalog"` не
  проходит typed routes и ссылка ведёт в 404. Реализовывать шапку только после него; при
  необходимости разъединить — временно оставить в навигации одну ссылку «Главная» и добавить
  «Каталог» отдельным коммитом.
- **Удаление ссылки «Регистрация» из шапки** → путь на `/sign-up` остаётся только со страницы
  `/sign-in`; проверить, что эта ссылка там действительно есть, прежде чем убирать её из шапки.

## Migration Plan

Сначала применяется change `move-catalog-to-route` (он создаёт `/catalog`), затем этот change —
единым коммитом в `master`, без флагов и поэтапного раската: изменение чисто презентационное,
серверный контракт авторизации не трогается. Откат — `git revert`; схема БД, env и generated API не
затрагиваются.

Порядок работ: сначала `Popover` в `@repo/core` с собственным component-тестом (он не зависит от
остального), затем структура шапки и навигация, затем блок авторизации и попап профиля, затем
бургер-меню, в конце — правка `Layout` и удаление `useBreakpoints` из `Header`.
