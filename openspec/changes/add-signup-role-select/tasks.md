## 1. API-контракт

- [x] 1.1 Добавить в `api/src/components/schemas/AuthMe.yaml` поле `role` (enum: `developer`,
      `analyst`, `student`, `beginner`, обязательное) и поле `lastName` (string, необязательное).
- [x] 1.2 Перенести `age` в `AuthMe.yaml` из `required` в необязательные поля.
- [x] 1.3 (Нет отдельных lint:openapi/bundle скриптов в этом проекте — используется Kubb, а не
      Redocly/Hey API; актуальный pipeline — один скрипт `generate`.)
- [x] 1.4 Запустить `npm --workspace @repo/api run generate`, проверить сгенерированные `types`,
      `zod`, `client` под `packages/api/base/codegen/*` (без ручных правок).
- [x] 1.5 Запустить `npm run tsc` на корне (включает generated output).

## 2. Серверная модель и better-auth

- [x] 2.1 Добавить SQL-миграцию (Supabase, не Prisma — в проекте нет Prisma, см.
      `supabase/migrations/`): nullable-колонка `lastName`, колонка `role` с дефолтом `'beginner'`
      для существующих строк → `NOT NULL`; сделать `age` nullable.
- [x] 2.2 Добавить `ROLE_VALUES` (`developer`, `analyst`, `student`, `beginner`) в
      `src/lib/auth/constants.ts`, по аналогии с `GENDER_VALUES`.
- [x] 2.3 Обновить `user.additionalFields` в `src/lib/auth/server.ts`: `lastName` (`required:
  false`), `role` (`required: true`, перечисление `ROLE_VALUES`); `age` → `required: false`.
- [x] 2.4 Обновить интерфейс `CurrentUser` и маппинг в `src/lib/auth/get-session.ts`: `lastName?`,
      `age?`, `role` (обязательное).

## 3. Валидация и server action регистрации

- [x] 3.1 Обновить `signUpSchema`/`signUpFormSchema` в `src/modules/auth/schemas.ts`: `lastName` —
      необязательная строка с минимальной длиной при заполнении; `age` — необязательное (убрать
      `refine`, требующий непустое значение); `role` — обязательный enum с `ROLE_VALUES`.
- [x] 3.2 Обновить `signUpAction`/`getSignUpValues` в `src/modules/auth/actions.ts`: прокинуть
      `lastName` и `role` в body `auth.api.signUpEmail`, не отправлять `lastName`/`age`, если не
      заданы.

## 4. Форма регистрации

- [x] 4.1 Создать `app/(auth)/sign-up/_constants/role-options.ts` с `ROLE_OPTIONS` (label на
      русском: «Разработчик», «Аналитик», «Студент», «Начинающий») по образцу
      `gender-options.ts`.
- [x] 4.2 В `sign-up-form.tsx` добавить `defaultValues.lastName`/`role`, расположить поле
      «Фамилия» рядом с полем «Имя», добавить `<field.SelectField>` для роли с `required`.
- [x] 4.3 Убрать обязательность у поля «Возраст» на форме (`required` только у name, email,
      password, gender, role) и красную звёздочку у фамилии/возраста.
- [x] 4.4 Обновить `sign-up-form.component.test.tsx`: добавить кейсы — отправка без фамилии и
      возраста, выбор роли, список вариантов роли (невалидная роль через UI невозможна — select
      ограничивает значения `ROLE_OPTIONS`; покрыта на уровне unit-теста Zod-схемы, см. 6.4).

## 5. Личный кабинет

- [x] 5.1 В `app/(main)/profile/_components/profile-view/profile-authenticated.tsx` вывести
      фамилию рядом с именем, если `lastName` задан, иначе — только имя.
- [x] 5.2 Добавить маппинг `role` → человекочитаемый текст («Разработчик», «Аналитик», «Студент»,
      «Начинающий») рядом с местом использования и вывести его на экране.
- [x] 5.3 Проверить/обновить компонентный тест `profile-authenticated` (или аналогичный) под новые
      поля, включая случай отсутствующей фамилии.

## 6. Проверка

- [x] 6.1 `npx oxfmt <изменённые файлы>`.
- [x] 6.2 `npm run lint` (прошёл; найденные ошибки — в несвязанных файлах, не затронутых этим
      change).
- [x] 6.3 `npm run tsc`.
- [x] 6.4 `npx vitest run src/modules/auth --project unit` (или актуальный путь unit-тестов auth).
- [x] 6.5 `npx vitest run app/\(auth\)/sign-up --project component` и профильные component-тесты
      `/profile`.
- [x] 6.6 Обновить `test-plan.md` по мере выполнения (статусы сценариев).
- [x] 6.7 `openspec validate add-signup-role-select --strict --no-interactive`.
