## Why

В проекте уже заложены точки под авторизацию — `AuthProvider`, `setOnUnauthorized`,
`src/lib/auth/client.ts` со заглушкой `getSession: async () => null`, security scheme
`auth_cookie` и теги `Registration`/`Me` в OpenAPI, — но реальной авторизации нет: зарегистрироваться
и войти невозможно, сессии нигде не хранятся, а фронт не умеет отличать гостя от вошедшего
пользователя. Без этого нельзя открывать пользовательский функционал (он будет описан отдельным
change), который должен быть доступен только авторизованным.

## What Changes

- Подключается **Better Auth** (email + пароль) как единственный источник аутентификации:
  серверный инстанс `auth` в `src/lib/auth/server.ts`, catch-all route handler
  `app/api/auth/[...all]/route.ts` через `toNextJsHandler`, плагин `nextCookies()` последним в
  списке плагинов (чтобы Server Actions могли ставить `Set-Cookie`).
- **Хранилище сессий и пользователей — та же Supabase-база**, но через прямое Postgres-подключение
  (`pg.Pool` к Supabase pooler), а не через PostgREST: Better Auth создаёт и читает таблицы
  `user`, `session`, `account`, `verification` в схеме `public`. Сессия — серверная, в БД; браузер
  получает только httpOnly cookie. Существующий PostgREST-доступ к `skills` не затрагивается.
- Схема Better Auth фиксируется в репозитории как обычная **Supabase-миграция**
  (`supabase/migrations/<ts>_create_better_auth_tables.sql`), сгенерированная `@better-auth/cli
generate` и дополненная `enable row level security` + deny-all политикой — по образцу
  `skills` (таблицы читаются только сервером, никогда напрямую из браузера).
- Пользовательская модель расширяется полями `gender` (обязательное, union) и `age`
  (обязательное, number) через `user.additionalFields`; `name`, `email`, `image` — встроенные поля
  Better Auth, `image` необязателен.
- **Валидация формы регистрации**: `name` ≥ 3 символов, `password` ≥ 8 символов, `email` —
  корректный email, `gender` и `age` обязательны, `image` (URL аватара) — опционально. Одни и те же
  Zod-схемы применяются на клиенте (до отправки) и на сервере (в Server Action), минимальная длина
  пароля дублируется в конфиге Better Auth (`emailAndPassword.minPasswordLength: 8`).
- Формы строятся на **TanStack Form**: в `@repo/core` появляется отсутствовавший до сих пор слой
  `form` (`useAppForm` через `createFormHook`, field-компоненты поверх существующих `Input`,
  `Select`, `Button`), описанный в `AGENTS.md`, но ещё не реализованный. Zod-схемы передаются в
  TanStack-валидаторы напрямую через Standard Schema.
- Добавляются две страницы: **`/sign-up`** (регистрация) и **`/sign-in`** (вход) с формами,
  inline-ошибками полей, ошибкой верхнего уровня (например, «email уже занят» / «неверные учётные
  данные»), состоянием отправки и редиректом на `/` после успеха. Авторизованного пользователя эти
  страницы редиректят на `/`.
- В OpenAPI-контракт добавляется операция **`GET /api/me`** (`operationId: getAuthMe`, тег `Me`,
  security `auth_cookie`): `200` — `{ id, name, email, gender, age, image? }`, `401` — гость.
  Эндпоинт живёт вне `/api/auth/*`, чтобы не конфликтовать с catch-all Better Auth, и реализуется
  route handler'ом поверх `auth.api.getSession`. По нему фронт (`@repo/api` React Query hook)
  понимает, авторизованы мы или нет, и получает данные профиля.
- `src/lib/auth/client.ts` заменяется на настоящий `createAuthClient` из `better-auth/react`
  (с `inferAdditionalFields`), `AuthProvider` на `onUnauthorized` инвалидирует кэш `getAuthMe`
  вместо вызова заглушки, в шапке появляется состояние «вошёл/не вошёл» с выходом (`signOut`).
- В `proxy.ts` добавляется шаг оптимистичной проверки cookie (`getSessionCookie`) — только для
  редиректа гостя со страниц, требующих авторизации; настоящая проверка сессии всегда делается на
  странице/в route handler через `auth.api.getSession`.
- Новые переменные окружения: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SUPABASE_DB_URL` — все
  server-only, с добавлением в `src/env/server.ts` и `.env.example`.

## Capabilities

### New Capabilities

- `user-auth`: аутентификация по email и паролю на Better Auth — регистрация, вход, выход,
  серверная сессия в Supabase Postgres, контракт `GET /api/me` (authMe) и правила доступа гостя и
  авторизованного пользователя.
- `auth-pages`: страницы `/sign-up` и `/sign-in` — поля форм, правила валидации, отображение ошибок,
  состояние отправки, редиректы для гостя и уже авторизованного пользователя.

### Modified Capabilities

_(нет — `skills-catalog`, `skills-catalog-filters`, `skills-catalog-data`, `ui-primitives` в
`openspec/specs/` этим изменением по поведению не затрагиваются)_

## Impact

- **Зависимости**: новые `better-auth`, `pg`, `@types/pg` (dev), `@better-auth/cli` (dev) и
  `@tanstack/react-form` (в `@repo/core`; devtools-пакет `@tanstack/react-form-devtools` уже стоит в
  корне). Ставятся npm с `save-exact` согласно `.npmrc`.
- **База данных**: новая миграция `supabase/migrations/*_create_better_auth_tables.sql` (таблицы
  `user`, `session`, `account`, `verification`, RLS deny-all); новое прямое Postgres-подключение
  (`SUPABASE_DB_URL`) параллельно существующему PostgREST-клиенту.
- **API-контракт**: `api/src/paths/api_me.yaml` + регистрация пути в `api/src/openapi.yaml`;
  перегенерация `@repo/api` (`npm --workspace @repo/api run generate`) добавит типы/Zod/клиент/hook
  для `getAuthMe` (группа `meController`). Маршруты Better Auth (`/api/auth/*`) в контракт **не**
  вносятся — это сторонний протокол, а не наш API.
- **Дизайн-система**: новый слой `packages/core/src/form` (`useAppForm`, field-компоненты) и его
  экспорт `@repo/core/form` — общий для всех будущих форм проекта, не только для auth.
- **Frontend**: новые `app/sign-in/`, `app/sign-up/` с `_components`, `src/modules/auth/`
  (Server Actions, Zod-схемы, серверные хелперы сессии), обновлённые
  `src/components/providers/auth-provider.tsx`, `src/components/header.tsx`,
  `src/lib/auth/client.ts`, `proxy.ts`.
- **Окружение и инфраструктура**: `src/env/server.ts`, `src/env/client.ts`, `.env.example`, разделы
  про auth в `docs/environment.md` и `docs/architecture.md`; mock-режим должен пропускать
  `/api/auth/*` мимо моков.
- **Безопасность**: секреты (`BETTER_AUTH_SECRET`, `SUPABASE_DB_URL`) — только server env, никогда
  не в client schema; сессионная cookie httpOnly/secure/sameSite=lax.

## Quality impact

- **Уровень риска**: P0 — изменение вводит аутентификацию, от которой зависит доступ к будущему
  приватному функционалу; ошибка означает либо невозможность войти, либо утечку доступа.
- **Затронутые маршруты**: `/sign-in`, `/sign-up`, `/api/auth/[...all]`, `/api/me`, корневой
  `proxy.ts`, root layout (`AuthProvider`, шапка).
- **Затронутые компоненты**: `AuthProvider`, `Header`/`MobileHeader`, новые формы регистрации и
  входа, `src/lib/auth/*`, `src/modules/auth/*`.
- **Затронутые API**: новый `GET /api/me` в контракте; служебные `/api/auth/*` от Better Auth;
  существующие `/api/skills*` не меняются.
- **Требуемые уровни тестов**: unit (Zod-схемы валидации, серверные хелперы сессии, route handler
  `/api/me`), component (формы `/sign-up` и `/sign-in`: валидация, ошибки, состояние отправки),
  E2E (регистрация → автоматический вход → `authMe` → выход; вход с неверным паролем).
- **Ручные проверки**: реальный прогон регистрации и входа на dev-стенде против настоящей
  Supabase-базы (строки в `user`/`session`/`account`, httpOnly cookie в браузере), проверка
  редиректов гостя и авторизованного.
- **Rollback**: удалить route handler'ы и страницы, вернуть заглушку `authClient`, откатить шаг
  проверки cookie в `proxy.ts` и запись пути в OpenAPI; миграция Better Auth оставляется в БД как
  неиспользуемая (дроп таблиц — отдельная миграция, чтобы не терять данные случайно).
