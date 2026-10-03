# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                                               | Scenario                                           | Risk | Test level | Test file                                                                                                              | Status |
| --------------------------------------------------------- | -------------------------------------------------- | ---: | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| Пункт навигации «Профиль»                                 | Переход в профиль с десктопа                       |   P1 | E2E        | `src/tests/e2e/sidebar-nav.spec.ts`                                                                                    | done   |
| Пункт навигации «Профиль»                                 | Переход в профиль с мобильного                     |   P1 | Component  | `src/components/bottom-nav/bottom-nav.component.test.tsx`                                                              | done   |
| Пункт навигации «Профиль»                                 | Профиль не активен на других маршрутах             |   P2 | Unit       | `src/components/navigation/is-active-route.unit.test.ts`                                                               | done   |
| Пункт навигации «Профиль»                                 | Профиль не активен на других маршрутах             |   P2 | Component  | `src/components/navigation/main-nav.test.tsx`                                                                          | done   |
| Мобильная навигация содержит четыре элемента              | Состав нижней навигации                            |   P1 | Component  | `src/components/bottom-nav/bottom-nav.component.test.tsx`                                                              | done   |
| Мобильная навигация содержит четыре элемента              | Состав нижней навигации (плотность на 320/360px)   |   P2 | Manual     | —                                                                                                                      | done   |
| Блок аккаунта в Sidebar                                   | Sidebar для авторизованного пользователя           |   P1 | Component  | `src/components/sidebar/sidebar.component.test.tsx`, `src/components/auth-status/profile-card.component.test.tsx`      | done   |
| Блок аккаунта в Sidebar                                   | Sidebar для гостя                                  |   P2 | Component  | `src/components/auth-status/auth-status.component.test.tsx`                                                            | done   |
| Содержимое AccountDrawer                                  | Содержимое Drawer для авторизованного пользователя |   P1 | Component  | `src/components/account-drawer/account-drawer.component.test.tsx`                                                      | done   |
| Содержимое AccountDrawer                                  | Содержимое Drawer для гостя                        |   P2 | Component  | `src/components/account-drawer/account-drawer.component.test.tsx`                                                      | done   |
| Содержимое AccountDrawer                                  | Закрытие AccountDrawer                             |   P3 | Manual     | —                                                                                                                      | done   |
| Экран авторизованного профиля — единственная точка выхода | Выход из аккаунта со страницы профиля              |   P0 | Component  | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                                                    | done   |
| Экран авторизованного профиля — единственная точка выхода | Кнопка выхода доступна на мобильном экране         |   P1 | Manual     | —                                                                                                                      | done   |
| Экран авторизованного профиля — единственная точка выхода | Оболочка приложения не предлагает выход            |   P1 | Component  | `src/components/sidebar/sidebar.component.test.tsx`, `src/components/account-drawer/account-drawer.component.test.tsx` | done   |

## Required automated tests

### Unit

- [ ] `isActiveRoute('/profile', '/profile') === true`, `isActiveRoute('/profile', '/') === false`,
      `isActiveRoute('/', '/profile') === false`

### Component

- [ ] `MainNav`: три ссылки — `/`, `/catalog`, `/profile`; на `/profile` активен только «Профиль»
- [ ] `BottomNav`: четыре элемента в порядке «Главная», «Каталог», «Профиль», «Меню»; «Профиль» —
      ссылка на `/profile`, «Меню» — кнопка без `href`; на `/profile` активен «Профиль»
- [ ] `Sidebar`: присутствует ссылка «Профиль»; кнопка «Выйти» отсутствует
- [ ] `ProfileCard` / `AuthStatus`: для авторизованного видны имя и email, кнопки «Выйти» нет; для
      гостя — кнопка «Войти»
- [ ] `AccountDrawer`: у авторизованного — блок аккаунта и переключатель темы без кнопки «Выйти»;
      у гостя — кнопка «Войти»
- [ ] `ProfileView`: на экране авторизованного пользователя есть кнопка «Выйти», клик по ней
      выполняет выход

### Integration

- [ ] Не требуется: новых слоёв данных, провайдеров и API-контрактов изменение не вводит

### E2E

- [ ] `sidebar-nav.spec.ts`: клик по «Профиль» в `Sidebar` ведёт на `/profile`, ссылка получает
      `aria-current="page"`, прежняя активная ссылка его теряет
- [ ] `sidebar-nav.spec.ts`: серверная разметка оболочки не содержит действия выхода из аккаунта

## Manual checks

- [x] `BottomNav` на ширине 320px и 360px: четыре элемента в одну строку, подписи не обрезаны и не
      переносятся — проверено временным Playwright-прогоном: по 73px (320px) и 83px (360px) на
      элемент, одинаковый `top`, `scrollWidth === clientWidth`
- [x] На `lg+` в `Sidebar` нет кнопки выхода; в мобильном `AccountDrawer` нет кнопки выхода —
      покрыто component-тестами и E2E-проверкой оболочки
- [ ] Авторизованный пользователь на мобильной ширине открывает `/profile` из нижней навигации и
      успешно выходит из аккаунта — требует реальной сессии, не проверялось

## Test data

- Fixtures: `CurrentUser` из `#/lib/auth/get-session` (имя, email, gender, age), как в существующих
  тестах `auth-status` и `profile-view`
- API mocks: мок `getAuthMe` (успех / ошибка со `cause.status: 401`), мок `useGetAuthMe` для
  `ProfileView`, мок `#/lib/auth/client` для `signOut`
- User roles: гость и авторизованный пользователь
- Seed data: не требуется — данные каталога и БД изменение не затрагивает

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `npx openspec validate add-profile-nav-item --strict --no-interactive`
- [x] `npm run tsc`
- [x] `npm run lint` — новых нарушений нет (остались прежние в `packages/api`, `postcss.config.mjs`,
      `src/fonts/ttFors.ts`, `error-boundary.component.test.tsx`)
- [x] `npm run fmt:check` — изменённые файлы чистые
- [x] `npm run knip` — новых неиспользуемых экспортов нет
- [x] `npm run test` — 73 файла, 316 тестов зелёные
- [x] `npx playwright test src/tests/e2e/sidebar-nav.spec.ts` — новые тесты зелёные; тест пропорции
      1:5 падал и до изменения
- [x] Ручные проверки из раздела «Manual checks» (кроме выхода с реальной сессией)
