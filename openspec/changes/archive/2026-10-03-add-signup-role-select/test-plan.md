# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                                                | Scenario                                                                     | Risk | Test level       | Test file                                                                                                                                                       | Status             |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- | ---: | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Регистрация по email и паролю                              | Успешная регистрация с обязательными полями (без lastName/age/avatar)        |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Регистрация по email и паролю                              | Регистрация с фамилией и возрастом                                           |   P2 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Регистрация по email и паролю                              | Регистрация с аватаром                                                       |   P2 | — (не затронуто) | —                                                                                                                                                               | Covered (existing) |
| Регистрация по email и паролю                              | Ошибка сохранения аватара                                                    |   P2 | — (не затронуто) | —                                                                                                                                                               | Covered (existing) |
| Регистрация по email и паролю                              | Email уже занят                                                              |   P2 | — (не затронуто) | —                                                                                                                                                               | Covered (existing) |
| Регистрация по email и паролю                              | Отказ при невалидных данных (role отсутствует/невалиден)                     |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Контракт GET /api/me (authMe)                              | Профиль авторизованного пользователя содержит role, опционально lastName/age |   P1 | Integration      | Waived — в проекте нет `@repo/api` test script (только `generate`); контракт проверен типами (`npm run tsc` на generated output) и generated Zod/Faker-фабрикой | Waived             |
| Контракт GET /api/me (authMe)                              | Контракт описан в спецификации                                               |   P1 | Static           | Нет отдельного `lint:openapi`-скрипта (см. tasks.md 1.3); YAML и regen проверены через `npm --workspace @repo/api run generate` + `npm run tsc`                 | Covered            |
| Страница регистрации                                       | Состав формы (поля lastName, age, role присутствуют)                         |   P1 | Component        | `app/(auth)/sign-up/_components/sign-up-form/sign-up-form.component.test.tsx`                                                                                   | Covered            |
| Страница регистрации                                       | Доступные варианты роли                                                      |   P1 | Component        | `sign-up-form.component.test.tsx`                                                                                                                               | Covered            |
| Страница регистрации                                       | Порядок и обозначение полей (звёздочки у обязательных)                       |   P2 | Component        | `sign-up-form.component.test.tsx`                                                                                                                               | Covered            |
| Страница регистрации                                       | Обязательные поля ещё не заполнены (без lastName/age)                        |   P1 | Component        | `sign-up-form.component.test.tsx`                                                                                                                               | Covered            |
| Страница регистрации                                       | Все обязательные поля заполнены (lastName/age пустые)                        |   P1 | Component        | `sign-up-form.component.test.tsx`                                                                                                                               | Covered            |
| Правила валидации формы регистрации                        | Пустая фамилия допустима                                                     |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Правила валидации формы регистрации                        | Заполненная фамилия короче 3 символов                                        |   P2 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Правила валидации формы регистрации                        | Не выбран пол или не указан возраст (gender required, age optional)          |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Правила валидации формы регистрации                        | Не выбрана роль                                                              |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Правила валидации формы регистрации                        | Недопустимое значение роли                                                   |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Правила валидации формы регистрации                        | Пустой возраст допустим                                                      |   P1 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Правила валидации формы регистрации                        | Возраст вне допустимого диапазона (если указан)                              |   P2 | Unit             | `src/modules/auth/schemas.unit.test.ts`                                                                                                                         | Covered            |
| Экран авторизованного профиля показывает полное имя и роль | Авторизованный пользователь с фамилией открывает профиль                     |   P1 | Component        | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                                                                                             | Covered            |
| Экран авторизованного профиля показывает полное имя и роль | Авторизованный пользователь без фамилии открывает профиль                    |   P1 | Component        | `profile-view.test.tsx`                                                                                                                                         | Covered            |
| Экран авторизованного профиля показывает полное имя и роль | Роль сопоставляется с читаемым названием                                     |   P1 | Component        | `profile-view.test.tsx`                                                                                                                                         | Covered            |
| Успешная регистрация (E2E happy path)                      | Гость с ролью и без фамилии/возраста регистрируется и попадает в `/`         |   P0 | E2E              | `src/tests/e2e/auth.spec.ts`                                                                                                                                    | Covered            |

## Required automated tests

### Unit

- [x] `src/modules/auth/schemas.unit.test.ts`: `role` обязателен и валидируется по enum; `lastName`
      и `age` необязательны, но валидируются при заполнении (минимальная длина фамилии, диапазон
      возраста); граничные значения (имя/фамилия 3 символа, пароль 8 символов, возраст 0).
- [x] `src/modules/auth/actions.unit.test.ts`: `lastName`/`age` не отправляются при отсутствии;
      `lastName` и `role` прокидываются в body `auth.api.signUpEmail`.

### Component

- [x] `sign-up-form.component.test.tsx`: рендер поля роли и списка опций; кнопка disabled без
      role/gender/name/email/password, но активна с пустыми lastName/age; звёздочки только у
      обязательных labels.
- [x] `profile-view.test.tsx` (экран `ProfileAuthenticated` через `ProfileView`): отображение
      фамилии рядом с именем при наличии `lastName`, скрытие при отсутствии; маппинг `role` →
      читаемый текст для всех 4 значений.

### Integration

- Waived — в проекте нет `@repo/api` test script (единственный скрипт — `generate`, см. tasks.md
  1.3). Контракт проверен через `npm run tsc` на сгенерированный output и generated Faker-фабрику
  `createAuthMe.ts` (поле `role` обязательно, `lastName`/`age` опциональны).

### E2E

- [x] `src/tests/e2e/auth.spec.ts`: добавлен сценарий «регистрация без фамилии и возраста с
      выбранной ролью показывает роль в профиле» — полный цикл регистрации с минимальным набором
      обязательных полей и выбранной ролью → редирект на `/` → переход на `/profile` → проверка
      отображения роли. Существующий `signUp()`-helper и инлайновые сценарии в этом файле обновлены
      под обязательное поле `role`, чтобы не ломать уже существующие тесты.
      **Известный факт, не связанный с этим change**: 5 из 8 тестов в `auth.spec.ts` (включая этот
      helper) падают на шаге проверки триггер-кнопки `/Сергей/` в сайдбаре/bottom-nav уже на
      немодифицированном `master` (воспроизведено через `git stash`) — предсуществующий флейк E2E,
      не покрытый текущим CI-пайплайном (см. AGENTS.md: GitLab pipeline не запускает Playwright
      E2E). Не входит в объём этого change.

## Manual checks

- [ ] Визуально проверить расположение поля «Фамилия» рядом с «Именем» и отсутствие звёздочки у
      необязательных labels (фамилия, возраст) на `/sign-up` в браузере (desktop + mobile ширина).
- [x] Проверить на дев-стенде, что существующий пользователь (созданный до миграции) после
      применения миграции получает `role = 'beginner'` — подтверждено напрямую через SQL
      (`information_schema.columns`: `role` NOT NULL с дефолтом `'beginner'::text` для старых
      строк).

## Test data

- Fixtures: расширить существующие Faker-фабрики `@repo/api` для `AuthMe` (поле `role` обязательно
  в фабрике, `lastName`/`age` опциональны).
- API mocks: generated mock routes `@repo/api/mocks` для `getAuthMe` с вариантами с/без
  `lastName`/`age`.
- User roles: не относится (бизнес-роль профиля — не роль доступа/авторизации).
- Seed data: один dev-пользователь без `lastName`/`age` (пограничный случай отображения) и один с
  обоими полями.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] openspec validate add-signup-role-select --strict --no-interactive
- [x] frontend: npm run tsc / npm run lint / таргетные `npx vitest run` (см. выше); `npm run build`
      не запускался в рамках этого change (нет изменений в `next.config.ts`/env/proxy)
- [x] api: `npm --workspace @repo/api run generate` (нет отдельных `lint:openapi`/`bundle`/`test`
      скриптов в этом проекте — см. tasks.md 1.3)
- [x] E2E: npx playwright test src/tests/e2e/auth.spec.ts (новый сценарий зелёный; про
      предсуществующий флейк остальных сценариев — см. выше)
