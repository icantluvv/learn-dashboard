# Test Plan

## Risk level

P0 — изменение вводит аутентификацию: от неё зависит доступ к будущему приватному функционалу, а
ошибка означает либо невозможность войти, либо доступ гостя к чужим данным.

## Scenario coverage

| Requirement                           | Scenario                                    | Risk | Test level       | Test file                                                                                                       | Status |
| ------------------------------------- | ------------------------------------------- | ---: | ---------------- | --------------------------------------------------------------------------------------------------------------- | ------ |
| Регистрация по email и паролю         | Успешная регистрация с обязательными полями |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Регистрация по email и паролю         | Регистрация с аватаром                      |   P2 | Unit             | `src/modules/auth/actions.unit.test.ts`                                                                         | done   |
| Регистрация по email и паролю         | Email уже занят                             |   P1 | Unit + Component | `src/modules/auth/actions.unit.test.ts`, `app/sign-up/_components/sign-up-form/sign-up-form.component.test.tsx` | done   |
| Регистрация по email и паролю         | Отказ при невалидных данных                 |   P0 | Unit             | `src/modules/auth/actions.unit.test.ts`, `src/modules/auth/schemas.unit.test.ts`                                | done   |
| Вход по email и паролю                | Успешный вход                               |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Вход по email и паролю                | Неверный пароль или несуществующий email    |   P0 | E2E + Unit       | `src/tests/e2e/auth.spec.ts`, `src/modules/auth/actions.unit.test.ts`                                           | done   |
| Серверное хранение сессии             | Сессия записана в базу                      |   P0 | Manual           | ручной прогон на dev-стенде                                                                                     | done   |
| Серверное хранение сессии             | Cookie недоступна скриптам                  |   P0 | Manual           | ручной прогон (DevTools → Application → Cookies)                                                                | done   |
| Серверное хранение сессии             | Сессия переживает перезагрузку страницы     |   P1 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Серверное хранение сессии             | Подделанная cookie не даёт доступа          |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Выход из системы                      | Выход завершает сессию                      |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Контракт `GET /api/me`                | Профиль авторизованного пользователя        |   P0 | Unit             | `app/api/me/route.unit.test.ts`                                                                                 | done   |
| Контракт `GET /api/me`                | Гость                                       |   P0 | Unit             | `app/api/me/route.unit.test.ts`                                                                                 | done   |
| Контракт `GET /api/me`                | Контракт описан в спецификации              |   P1 | Static           | `npm --workspace @learn-dashboard/api run lint` + `bundle` + `tsc` после генерации                              | done   |
| Состояние авторизации на сервере      | Главная страница доступна гостю             |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Состояние авторизации на сервере      | Cookie без валидной сессии не даёт доступа  |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Страница регистрации                  | Состав формы                                |   P2 | Component        | `app/sign-up/_components/sign-up-form/sign-up-form.component.test.tsx`                                          | done   |
| Страница регистрации                  | Успешная регистрация                        |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Страница регистрации                  | Занятый email                               |   P1 | Component        | `app/sign-up/_components/sign-up-form/sign-up-form.component.test.tsx`                                          | done   |
| Правила валидации регистрации         | Имя короче 3 символов                       |   P1 | Component + Unit | `sign-up-form.component.test.tsx`, `src/modules/auth/schemas.unit.test.ts`                                      | done   |
| Правила валидации регистрации         | Граница длины имени (ровно 3)               |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                         | done   |
| Правила валидации регистрации         | Пароль короче 8 символов                    |   P1 | Component + Unit | `sign-up-form.component.test.tsx`, `src/modules/auth/schemas.unit.test.ts`                                      | done   |
| Правила валидации регистрации         | Граница длины пароля (ровно 8)              |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                         | done   |
| Правила валидации регистрации         | Некорректный email                          |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                         | done   |
| Правила валидации регистрации         | Не выбран пол или не указан возраст         |   P1 | Component + Unit | `sign-up-form.component.test.tsx`, `src/modules/auth/schemas.unit.test.ts`                                      | done   |
| Правила валидации регистрации         | Возраст вне допустимого диапазона           |   P2 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                         | done   |
| Правила валидации регистрации         | Пустой аватар допустим                      |   P2 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                         | done   |
| Правила валидации регистрации         | Серверная валидация в обход формы           |   P0 | Unit             | `src/modules/auth/actions.unit.test.ts`                                                                         | done   |
| Страница входа                        | Состав формы                                |   P2 | Component        | `app/sign-in/_components/sign-in-form/sign-in-form.component.test.tsx`                                          | done   |
| Страница входа                        | Успешный вход                               |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Страница входа                        | Неверные учётные данные                     |   P1 | Component        | `sign-in-form.component.test.tsx`                                                                               | done   |
| Страница входа                        | Пустые поля                                 |   P2 | Component        | `sign-in-form.component.test.tsx`                                                                               | done   |
| Состояние отправки формы              | Повторный клик во время отправки            |   P1 | Component        | `sign-up-form.component.test.tsx`, `sign-in-form.component.test.tsx`                                            | done   |
| Редирект авторизованного пользователя | Авторизованный открывает страницу входа     |   P1 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |
| Отображение состояния авторизации     | Гость                                       |   P2 | Component        | `src/components/header.component.test.tsx`                                                                      | done   |
| Отображение состояния авторизации     | Авторизованный пользователь                 |   P2 | Component        | `src/components/header.component.test.tsx`                                                                      | done   |
| Отображение состояния авторизации     | Выход из шапки                              |   P1 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                    | done   |

## Required automated tests

### Unit

- [x] `src/modules/auth/schemas.unit.test.ts` — правила и границы валидации: `name` 2/3 символа,
      `password` 7/8 символов, корректный и некорректный email, обязательность `gender` и `age`,
      граничные значения возраста, пустой и невалидный `image`
- [x] `src/modules/auth/actions.unit.test.ts` — Server Action отвергает невалидные данные, не вызывая
      Better Auth; маппинг ошибок «email занят» и «неверные учётные данные»; успешная регистрация с
      `image` и без него
- [x] `app/api/me/route.unit.test.ts` — `200` с проекцией профиля, `401` для гостя, отсутствие пароля
      и идентификатора сессии в ответе, соответствие сгенерированной Zod-схеме
- [x] `packages/api/base/client.unit.test.ts` — `/api/auth/*` и `/api/me` не перехватываются
      mock-клиентом и остаются same-origin (исключение реализовано в API-клиенте, а не в
      `src/mock-mode`)

### Component

- [x] `app/sign-up/_components/sign-up-form/sign-up-form.component.test.tsx` — состав формы,
      inline-ошибки по каждому правилу (валидаторы TanStack Form поверх `signUpSchema`), отсутствие
      вызова Server Action при невалидной форме, ошибка «email уже используется», пришедшая через
      `setErrorMap`, с сохранением введённых значений, единственный вызов при двойном клике и
      loading-состояние `SubmitButton`
- [x] `app/sign-in/_components/sign-in-form/sign-in-form.component.test.tsx` — состав формы, ошибки
      обязательности при пустых полях, одинаковое сообщение при неверном пароле и несуществующем
      email, состояние отправки
- [x] `packages/core/src/form/*.component.test.tsx` — field-компоненты нового слоя
      `@repo/core/form`: показ ошибки валидации из `field.state.meta.errors`, `aria-invalid` и связь
      label/ошибки, блокировка `SubmitButton` при невалидной форме и во время `isSubmitting`
- [x] `src/components/auth-status/auth-status.component.test.tsx` — гостевое состояние (ссылки
      «Войти»/«Регистрация») и авторизованное (имя, аватар при наличии, выход), корректный первый
      кадр из серверного `initialUser` и переход в гостевое состояние при истёкшей сессии. Компонент
      вынесен отдельно: `Header`/`MobileHeader` в репозитории — пустые заглушки

### Integration

- [ ] Отдельный интеграционный слой не вводится: взаимодействие «форма → Server Action → Better Auth
      → БД» покрывается unit-тестами с моком `auth.api` и E2E-сценарием против реальной базы

### E2E

- [x] `src/tests/e2e/auth.spec.ts` — прогнан на реальной БД, 4/4 зелёные:
    - регистрация нового пользователя → редирект на `/` → имя в шапке → `GET /api/me` = `200`
    - перезагрузка страницы → пользователь остаётся авторизованным
    - выход → гостевая шапка → `GET /api/me` = `401`
    - вход с верными данными; вход с неверным паролем → сообщение об ошибке
    - подмена значения сессионной cookie на произвольное → приватный путь редиректит на `/sign-in`
    - гость на приватном пути → редирект на `/sign-in`

> **Статус прогона.** Всё покрытие закрыто на реальной БД. `npm run test` — 149 тестов, 36 файлов;
> `npx playwright test src/tests/e2e/auth.spec.ts` — 4/4; `npm run fmt:check`, `npm run tsc`,
> `npm run build` — зелёные. Ручные проверки выполнены против dev-проекта Supabase: строки в
> `user`/`session`/`account`, флаги cookie, удаление сессии при выходе, `permission denied` для
> `anon`/`authenticated` на auth-таблицах.

## Manual checks

- [x] Применение миграции Better Auth на чистой dev-базе Supabase проходит без ошибок
- [x] После регистрации в таблицах `user`, `session`, `account` появляются согласованные строки;
      в `user` записаны `gender` и `age`, `image` пуст при незаполненном поле
- [x] Сессионная cookie имеет флаги `httpOnly`, `sameSite=lax` (и `secure` на https-стенде) и
      недоступна из `document.cookie`
- [x] Таблица `user` не читается ролями `anon`/`authenticated`: RLS deny-all **и** `revoke all`
      (проверено `set local role anon; select … from "user"` → `permission denied`)
- [x] В ответах и логах нет пароля, хеша пароля, cookie и строки подключения к БД

## Test data

- Фикстуры: валидный профиль регистрации (`name` ≥ 3, `password` ≥ 8, `email`, `gender`, `age`) и
  набор невалидных вариантов по одному нарушению на случай — в `src/modules/auth/__fixtures__`
- API-моки: типизированные фабрики `@repo/api` (`packages/api/base/codegen/mocks/meController`) для
  `getAuthMe`; `auth.api.getSession`/`signUpEmail`/`signInEmail` мокаются через `vi.mock` типизованно
- Роли пользователей: гость и авторизованный пользователь (ролевой модели пока нет)
- Seed-данные: E2E создаёт пользователя с уникальным email на прогон и удаляет его в teardown

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate integrate-better-auth --strict --no-interactive`
- [x] frontend: `npm run verify:fast` (`fmt:check`, `lint`, `tsc`), `npm run test:unit`,
      `npm run test:component`, `npm run build`
- [x] api: `npm --workspace @learn-dashboard/api run lint` и `bundle`,
      `npm --workspace @repo/api run generate` — контракт изменён
- [x] E2E: `npx playwright test src/tests/e2e/auth.spec.ts` + ручной прогон на dev-стенде
      (риск P0)
