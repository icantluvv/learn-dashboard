# Test Plan

## Risk level

P1 — шапка видна на всех маршрутах, содержит выход из аккаунта и зависит от состояния авторизации,
но не затрагивает данные, платежи и контракт API. Сквозной путь «вход → аватар → выход» внутри этого
change оценивается как P0-сценарий.

## Scenario coverage

| Requirement                | Scenario                                       | Risk | Test level | Test file                                                       | Status       |
| -------------------------- | ---------------------------------------------- | ---: | ---------- | --------------------------------------------------------------- | ------------ |
| Popover primitive          | Открытие Popover по активации триггера         |   P1 | Component  | `packages/core/src/ui/popover/popover.component.test.tsx`       | done         |
| Popover primitive          | Escape закрывает Popover и возвращает фокус    |   P1 | Component  | `packages/core/src/ui/popover/popover.component.test.tsx`       | done         |
| Popover primitive          | Клик вне попапа закрывает его                  |   P1 | Component  | `packages/core/src/ui/popover/popover.component.test.tsx`       | done         |
| Popover primitive          | Триггер имеет доступное имя                    |   P2 | Component  | `packages/core/src/ui/popover/popover.component.test.tsx`       | done         |
| Состав десктопной шапки    | Все три зоны присутствуют на десктопе          |   P2 | Manual     | —                                                               | не выполнено |
| Состав десктопной шапки    | Логотип ведёт на главную                       |   P2 | Component  | `src/components/navigation/logo.test.tsx`                       | done         |
| Состав десктопной шапки    | Логотип имеет доступное имя                    |   P2 | Component  | `src/components/navigation/logo.test.tsx`                       | done         |
| Навигация шапки            | Состав навигации                               |   P1 | Component  | `src/components/navigation/main-nav.test.tsx`                   | done         |
| Навигация шапки            | Активная ссылка на главной                     |   P1 | Component  | `src/components/navigation/main-nav.test.tsx`                   | done         |
| Навигация шапки            | Активная ссылка на вложенном маршруте каталога |   P1 | Component  | `src/components/navigation/main-nav.test.tsx`                   | done         |
| Навигация шапки            | Маршрут вне навигации не подсвечивает ничего   |   P2 | Unit       | `src/components/navigation/is-active-route.unit.test.ts`        | done         |
| Блок авторизации для гостя | Гость видит кнопку входа                       |   P0 | Component  | `src/components/auth-status/auth-status.component.test.tsx`     | done         |
| Блок авторизации для гостя | Ссылка на регистрацию отсутствует в шапке      |   P2 | Component  | `src/components/auth-status/auth-status.component.test.tsx`     | done         |
| Кнопка-аватар              | Пользователь с аватаром                        |   P0 | Component  | `src/components/auth-status/auth-status.component.test.tsx`     | done         |
| Кнопка-аватар              | Пользователь без аватара                       |   P1 | Component  | `src/components/auth-status/auth-status.component.test.tsx`     | done         |
| Попап профиля              | Открытие попапа по клику на аватар             |   P0 | Component  | `src/components/auth-status/profile-popover.component.test.tsx` | done         |
| Попап профиля              | Escape закрывает попап                         |   P1 | Component  | `src/components/auth-status/profile-popover.component.test.tsx` | done         |
| Попап профиля              | Клик вне попапа закрывает его                  |   P2 | Component  | `src/components/auth-status/profile-popover.component.test.tsx` | done         |
| Выход через попап          | Успешный выход                                 |   P0 | E2E        | `src/tests/e2e/header-auth.spec.ts`                             | done         |
| Выход через попап          | Успешный выход (клиентская ветка)              |   P0 | Component  | `src/components/auth-status/profile-popover.component.test.tsx` | done         |
| Состав десктопной шапки    | Шапка остаётся видимой при прокрутке           |   P1 | Manual     | скриншот Playwright, 1440px                                     | done         |
| Нижняя панель навигации    | Состав нижней панели                           |   P1 | Component  | `src/components/bottom-nav/bottom-nav.component.test.tsx`       | done         |
| Нижняя панель навигации    | Подсветка текущего раздела                     |   P1 | Component  | `src/components/bottom-nav/bottom-nav.component.test.tsx`       | done         |
| Нижняя панель навигации    | Маршрут вне навигации не подсвечивает ничего   |   P2 | Component  | `src/components/bottom-nav/bottom-nav.component.test.tsx`       | done         |
| Нижняя панель навигации    | Панель остаётся видимой при прокрутке          |   P1 | Manual     | скриншот Playwright, 390px                                      | done         |
| Профиль в нижней панели    | Гость                                          |   P1 | Component  | `src/components/bottom-nav/profile-tab.component.test.tsx`      | done         |
| Профиль в нижней панели    | Авторизованный пользователь                    |   P1 | Component  | `src/components/bottom-nav/profile-tab.component.test.tsx`      | done         |
| Выбор варианта навигации   | Серверная отрисовка содержит оба варианта      |   P1 | E2E        | `src/tests/e2e/header-nav.spec.ts`                              | done         |
| Выбор варианта навигации   | Отсутствие мерцания при загрузке               |   P1 | Manual     | —                                                               | не выполнено |

## Required automated tests

### Unit

- [x] `isActiveRoute` — таблица решений `pathname × href`: `('/', '/')` → true, `('/catalog', '/')` →
      false, `('/catalog', '/catalog')` → true, `('/catalog/abc', '/catalog')` → true,
      `('/catalogue', '/catalog')` → false (граничный случай префикса без слеша), `('/sign-in', '/')`
      → false, `('/sign-in', '/catalog')` → false

### Component

- [x] `Popover` — открытие по триггеру, Escape + возврат фокуса, outside-click, accessible name
      icon-only триггера
- [x] `Logo` — ведёт на `/`, имеет непустой accessible name
- [x] `MainNav` — состав ссылок (ровно две, с нужными `href`), `aria-current="page"` при `pathname`
      `/`, `/catalog/abc`, отсутствие подсветки при `/sign-in`
- [x] `AuthStatus` — гость: видна «Войти», не видна «Регистрация», не видна кнопка-аватар;
      пользователь с `image`: видна кнопка-аватар; пользователь без `image`: текстовый фолбэк
- [x] `ProfilePopover` — открытие по клику на аватар, `PopoverContent` имеет ширину 300px, видны
      имя/email/кнопка выхода, Escape закрывает, outside-click закрывает, активация выхода вызывает
      `signOut` и приводит к гостевому состоянию
- [x] `BurgerMenu` — открытие показывает обе ссылки, `aria-current` на `/catalog/abc`, Escape

### Integration

- [x] Отдельного уровня нет. Граница «серверный `AuthStatusSlot` → клиентский `AuthStatus`»
      наблюдаема только с реальной сессией в браузере и закрывается E2E; component-тесты работают с
      `AuthStatus` напрямую через `initialUser` и мок-клиент `@repo/api`

### E2E

- [x] `src/tests/e2e/header-auth.spec.ts` — P0 happy path: гость видит «Войти» → вход через
      `/sign-in` → в шапке появляется кнопка-аватар → попап показывает имя и email → выход → в шапке
      снова «Войти», без ручной перезагрузки
- [x] `src/tests/e2e/header-nav.spec.ts` — навигация «Главная ↔ Каталог» с проверкой
      `aria-current="page"`; там же проверка, что HTML ответа содержит оба варианта шапки

## Manual checks

- [ ] Раскладка десктопной шапки на 1280px: три зоны в одном ряду, логотип слева, навигация в
      середине, блок авторизации справа
- [x] Раскладка на 390px: верхней шапки нет, внизу панель «Главная / Каталог / Профиль», проверено
      скриншотами Playwright
- [x] Нижняя панель не перекрывает конец контента (отступ `pb-28`) — проверено на прокрученном
      каталоге
- [ ] Отсутствие смены варианта шапки после гидрации на 1280px и на 375px (автоматизация
      нестабильна — проверяется глазами или видеозаписью Playwright)
- [ ] Отсутствие смены варианта шапки в узком окне десктопного браузера (~500px) — случай, в котором
      прежняя UA-эвристика `getSsrWidthFromUserAgent` возвращала 1280px и ошибалась
- [ ] Фактическая ширина попапа профиля — 300px (измерение в DevTools)
- [ ] Попап профиля с длинным именем и длинным email не ломает раскладку и не выходит за 300px
- [ ] Каталог и детальная страница навыка на ширинах 992px и 1024px после смены Tailwind `lg`
      (задача 2.3) — визуальных регрессов нет
- [ ] Правая зона шапки не «прыгает» при стриминге `AuthStatusSlot` (скелетон занимает место кнопки)

## Test data

- Fixtures: `CurrentUser` из `src/lib/auth/get-session.ts` — два варианта: с `image` и без `image`
- API mocks: generated mock client `@repo/api/mocks` и Faker-фабрики для `GET /api/me`; свободных
  JSON-моков не используем
- User roles: гость и авторизованный пользователь; ролевой модели в приложении нет
- Seed data: для E2E — пользователь, созданный через `/sign-up` в рамках самого теста (существующие
  E2E уже работают по этой схеме); отдельный seed не вводим

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate rework-app-header --strict --no-interactive`
- [x] `npx oxfmt <изменённые файлы>`
- [x] `npm run tsc`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run test:e2e`
