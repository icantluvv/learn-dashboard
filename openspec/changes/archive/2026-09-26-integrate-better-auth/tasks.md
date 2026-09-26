## 1. Зависимости и окружение

- [x] 1.1 Установить зависимости: `npm i better-auth pg`, `npm i -D @types/pg @better-auth/cli`
      и `npm --workspace @repo/core i @tanstack/react-form` (exact versions согласно `.npmrc`),
      обновить `package-lock.json`
- [x] 1.2 Добавить в `src/env/server.ts`: `BETTER_AUTH_SECRET: z.string()`,
      `BETTER_AUTH_URL: z.url()`, `SUPABASE_DB_URL: z.url()`
- [~] 1.3 `NEXT_PUBLIC_BETTER_AUTH_URL` в `src/env/client.ts` — добавлена и затем **удалена**
  (см. 13.18): браузерному клиенту базовый URL не нужен
- [x] 1.4 Дополнить `.env.example` четырьмя новыми переменными (с placeholder-значениями, без
      реальных секретов) и описать их в `docs/environment.md`

## 2. Схема базы данных

- [x] 2.1 Создать `src/lib/auth/server.ts` с минимальной конфигурацией `betterAuth` (Pool,
      `emailAndPassword`, `user.additionalFields` с `gender`/`age`) — нужна как вход для CLI
- [x] 2.2 SQL получен из `getAuthTables()` установленной версии better-auth: CLI `generate` для
      Kysely/pg делает интроспекцию живой БД и без доступа к Supabase падает на `ECONNREFUSED`;
      источник полей тот же самый. `@better-auth/cli` в devDependencies не добавлен (тянет prisma и
      better-sqlite3) — запускается через `npx` при необходимости
- [x] 2.3 Сохранить результат как `supabase/migrations/<timestamp>_create_better_auth_tables.sql`,
      дополнив каждую таблицу `enable row level security` и deny-all политикой для
      `anon`/`authenticated` (по образцу `20260925180000_create_skills_table.sql`)
- [x] 2.4 Миграция применена на dev-базе Supabase; проверено, что `anon`/`authenticated` не читают
      `user` (`set local role anon` → `permission denied`). Обнаружено попутно: Supabase по
      умолчанию выдаёт этим ролям полные табличные права, поэтому в миграцию добавлен
      `revoke all` — RLS перестала быть единственным слоем

## 3. Серверный инстанс Better Auth

- [x] 3.1 Завершить `src/lib/auth/server.ts`: `import 'server-only'`, синглтон `pg.Pool`
      (`globalThis`, `max: 1`, `sslmode=require`) на `serverEnvironment.SUPABASE_DB_URL`
- [x] 3.2 Конфигурация: `secret`, `baseURL`, `emailAndPassword: { enabled: true,
minPasswordLength: 8 }`, `user.additionalFields: { gender: { type: ['male','female','other'],
required: true }, age: { type: 'number', required: true } }`, `plugins: [nextCookies()]`
      (последним), cookie `httpOnly`/`sameSite=lax`/`secure` вне development
- [x] 3.3 Создать `app/api/auth/[...all]/route.ts`: `export const { GET, POST } =
toNextJsHandler(auth)`
- [x] 3.4 Добавить `src/lib/auth/get-session.ts` — серверный хелпер `getCurrentUser()` поверх
      `auth.api.getSession({ headers: await headers() })`, возвращающий проекцию профиля или `null`

## 4. Контракт `GET /api/me` и генерация клиента

- [x] 4.1 Создать `api/src/components/schemas/AuthMe.yaml`: `id`, `name`, `email`, `gender` (enum),
      `age` (integer), `image` (опционально, nullable)
- [x] 4.2 Создать `api/src/paths/api_me.yaml`: `GET`, `operationId: getAuthMe`, тег `Me`,
      `security: [{ auth_cookie: [] }]`, ответы `200` (`$ref` на `AuthMe`) и `401` без тела
- [x] 4.3 Зарегистрировать `/api/me: $ref: paths/api_me.yaml` и схему `AuthMe` в
      `api/src/openapi.yaml`
- [x] 4.4 `npm --workspace @learn-dashboard/api run lint` и `bundle`; зафиксировать в отчёте
      предсуществующие ошибки контракта, если они остаются
- [x] 4.5 `npm --workspace @repo/api run generate` — проверить появление
      `packages/api/base/codegen/{clients,hooks,types,zod}/meController/*AuthMe*`
- [x] 4.6 Реализовать `app/api/me/route.ts`: `getCurrentUser()` → `401` для гостя, иначе `200` с
      проекцией, провалидированной `getAuthMe200Schema`; ответ без кэша

## 5. Клиент авторизации и провайдер

- [x] 5.1 Заменить заглушку `src/lib/auth/client.ts` на `createAuthClient` из `better-auth/react`
      с `baseURL: clientEnvironment.NEXT_PUBLIC_BETTER_AUTH_URL` и
      `plugins: [inferAdditionalFields<typeof auth>()]` (импорт типа `auth` — только `import type`)
- [~] 5.2 `src/components/providers/auth-provider.tsx` — сначала переписан на инвалидацию
  `getAuthMe`, затем **удалён целиком** (см. 13.15)
- [x] 5.3 Исключить `/api/auth/*` и `/api/me` из перехвата mock-клиента (`src/mock-mode/*`),
      добавить unit-покрытие этого исключения

## 6. Форм-слой `@repo/core/form`

- [x] 6.1 Создать `packages/core/src/form/form-context.ts` — `createFormHookContexts()`
      (`useFieldContext`, `useFormContext`)
- [x] 6.2 Создать field-компоненты поверх существующих примитивов:
      `text-field.tsx` (`Input`), `select-field.tsx` (`Select`), `number-field.tsx`
      (`Input type="number"`), `submit-button.tsx` (`Button` + `form.Subscribe` по
      `canSubmit`/`isSubmitting`). Каждое поле рендерит label и сообщение об ошибке из
      `field.state.meta.errors`, проставляет `aria-invalid` и связывает ошибку через
      `aria-describedby`
- [x] 6.3 Создать `packages/core/src/form/index.ts` — `createFormHook({ fieldComponents,
formComponents })`, экспорт `useAppForm`, `withForm` и типов
- [x] 6.4 Добавить подпуть `@repo/core/form` в экспорты пакета и, при необходимости, в
      `tsconfig` paths; проверить, что серверные модули его не импортируют
- [x] 6.5 Component-тесты полей (`packages/core/src/form/*.component.test.tsx`): показ ошибки
      валидации, `aria-invalid`, блокировка `SubmitButton` при `isSubmitting`/невалидной форме
- [~] 6.6 Storybook stories для field-компонентов — **пропущено**: в репозитории нет ни каталога
  `.storybook`, ни единой существующей `*.stories.tsx`, то есть Storybook фактически не
  настроен. Заводить его ради этого change'а вне скоупа; задача возвращается вместе с
  настройкой Storybook

## 7. Схемы валидации и Server Actions

- [x] 7.1 Создать `src/modules/auth/schemas.ts`: `signUpSchema` (`name` min 3, `email` email,
      `password` min 8, `gender` enum обязателен, `age` integer в допустимом диапазоне,
      `image` optional URL) и `signInSchema` (`email`, непустой `password`)
- [x] 7.2 Создать `src/modules/auth/actions.ts` (`'use server'`): `signUpAction`/`signInAction`,
      принимающие уже типизированные значения формы — повторная валидация той же схемой, вызов
      `auth.api.signUpEmail`/`auth.api.signInEmail`, возврат дискриминированного результата
      (`{ ok: true }` | `{ ok: false, formError?, fieldErrors? }`) с ошибками «email уже
      используется» и «неверные учётные данные», `redirect('/')` при успехе
- [x] 7.3 Создать `src/modules/auth/index.ts` — публичный API модуля (схемы, типы результата
      action'ов, actions)

## 8. Страницы `/sign-up` и `/sign-in`

- [x] 8.1 `app/sign-up/page.tsx` — серверная страница: редирект на `/` для авторизованного
      (`getCurrentUser()`), рендер формы, общая обёртка `page-wrapper`
- [x] 8.2 `app/sign-up/_components/sign-up-form/` — `'use client'` форма на `useAppForm`
      (`@repo/core/form`): `validators: { onSubmit: signUpSchema }`, нативный `<form>` с
      `event.preventDefault()` и `void form.handleSubmit()`, поля `name`, `email`, `password`,
      `gender` (`SelectField`), `age` (`NumberField`), `image` через `form.AppField`,
      `SubmitButton` внутри `form.AppForm`; в `onSubmit` вызывается `signUpAction`, серверные ошибки
      раскладываются через `form.setErrorMap({ onServer: ... })` (по полю или на форму), значения
      полей при ошибке сохраняются
- [x] 8.3 `app/sign-in/page.tsx` — серверная страница по тому же шаблону
- [x] 8.4 `app/sign-in/_components/sign-in-form/` — `useAppForm` с `signInSchema`, поля
      `email`/`password`, единое сообщение об ошибке аутентификации на уровне формы, состояние
      отправки из `form.Subscribe`
- [x] 8.5 Взаимные ссылки: `/sign-up` → `/sign-in` и обратно
- [x] 8.6 Проверить, что при `cacheComponents: true` обе страницы собираются (динамические,
      без обращения к запросным данным вне Suspense)

## 9. Состояние авторизации в интерфейсе и guard

- [x] 9.1 Состояние авторизации в шапке: `src/components/auth-status/` — серверный
      `AuthStatusSlot` (резолвит сессию, засеивает query `getAuthMe`, передаёт `initialUser`) и
      клиентский `AuthStatus` (гость — ссылки «Войти»/«Регистрация»; авторизованный — имя, аватар,
      выход). `Header`/`MobileHeader` не тронуты: они пустые заглушки
- [x] 9.2 Обернуть auth-зависимую часть шапки в `<Suspense>` с гостевым fallback'ом
- [~] 9.3 `src/proxy/auth-guard.ts` — создан и затем **удалён** (см. 13.9): проверка cookie в proxy
  оказалась мёртвым кодом, редирект уже делают сами страницы серверной проверкой сессии
- [~] 9.4 Встраивание `authGuard` в `chainProxy` — отменено вместе с 9.3, `proxy.ts` вернулся к
  исходному виду

## 10. Тесты

- [x] 10.1 `src/modules/auth/schemas.unit.test.ts` — все правила и границы валидации (2/3 символа
      имени, 7/8 символов пароля, email, обязательность `gender`/`age`, диапазон возраста,
      пустой и невалидный `image`)
- [x] 10.2 `app/api/me/route.unit.test.ts` — `200` с проекцией, `401` для гостя, отсутствие пароля и
      идентификатора сессии в ответе
- [x] 10.3 `src/modules/auth/actions.unit.test.ts` — отказ по валидации без вызова Better Auth,
      маппинг «email занят» и «неверные учётные данные»
- [~] 10.4 `src/proxy/auth-guard.unit.test.ts` — удалён вместе с guard'ом (13.9); редирект
  авторизованного со `/sign-in`/`/sign-up` покрыт E2E
- [x] 10.5 `app/sign-up/_components/sign-up-form/sign-up-form.component.test.tsx` — inline-ошибки,
      отсутствие запроса при невалидной форме, единственный запрос при двойном клике, ошибка
      верхнего уровня
- [x] 10.6 `app/sign-in/_components/sign-in-form/sign-in-form.component.test.tsx` — аналогично для
      входа, включая одинаковое сообщение при неверном пароле и несуществующем email
- [x] 10.7 `src/components/header.component.test.tsx` — гостевое и авторизованное состояние шапки
- [x] 10.8 `src/tests/e2e/auth.spec.ts` — прогнан на реальной БД, 4/4 зелёные — регистрация → редирект на `/` → имя в шапке → `GET /api/me`
      = `200` → выход → `GET /api/me` = `401`; вход с неверным паролем; редирект гостя с приватного
      пути

## 11. Документация и test-plan

- [x] 11.1 Обновить `docs/environment.md` (новые переменные) и `docs/architecture.md` (раздел про
      auth: два способа доступа к БД, границы server/client, где живёт сессия)
- [x] 11.2 Описать в `docs/api-codegen.md` (или соответствующем разделе), что маршруты `/api/auth/*`
      намеренно не входят в контракт
- [x] 11.3 Поддерживать `openspec/changes/integrate-better-auth/test-plan.md` в актуальном
      состоянии: отмечать статус каждого сценария по мере реализации

## 12. Верификация

- [x] 12.1 `openspec validate integrate-better-auth --strict --no-interactive`
- [x] 12.2 `npm run verify:fast` (`fmt:check`, `lint`, `tsc`)
- [x] 12.3 `npm run test:unit` и `npm run test:component`
- [x] 12.4 `npm run build` (обязательно: меняются route handler'ы, proxy, env и конфиг Next.js)
- [x] 12.5 `npx playwright test src/tests/e2e/auth.spec.ts` — 4/4 зелёные
- [x] 12.6 Ручной прогон против реальной Supabase-базы: строки в `user`/`session`/`account`
      (включая `gender`/`age`, `image = null`, хеш пароля), флаги cookie
      (`httpOnly`, `SameSite=Lax`, `secure=false` в dev, `path=/`), удаление сессии при выходе,
      редиректы гостя и авторизованного

## 13. Правки по итогам E2E и ревью (после первой реализации)

- [x] 13.1 `advanced.defaultCookieAttributes` дополнен `path: '/'` — переопределение заменяет
      дефолты Better Auth целиком, и без `path` сессионная cookie оставалась в области `/sign-up`
- [x] 13.2 Редирект после успеха перенесён из Server Action в форму: action возвращает
      `{ ok: true }`, форма инвалидирует `getAuthMe` и делает `router.replace('/')`. `redirect()`
      в action'е не перемонтирует root layout, поэтому шапка показывала гостя до перезагрузки
- [x] 13.3 `AuthStatus` считает гостем `isError`, а выход вычищает запись через `removeQueries`:
      React Query сохраняет прошлые `data` при ошибке рефетча, из-за чего после `signOut` в шапке
      оставалось имя
- [x] 13.4 `revoke all` на auth-таблицах в миграции (дефолтные гранты Supabase для
      `anon`/`authenticated`)
- [x] 13.5 (По запросу пользователя) Удалён `SubmitButton` из `@repo/core/form` — кнопка собирается
      на месте из `Button` внутри `form.Subscribe`; зависимость `@tanstack/react-store` удалена
- [x] 13.6 Схемы переписаны на `zod/mini` (правило линтера проекта запрещает обычный `zod`)
- [x] 13.7 Формы получают Server Action пропом из страницы — клиентский модуль не должен тянуть
      `better-auth/server` и `next/headers` в свой граф (иначе падают component-тесты)
- [x] 13.8 `/api/me` и `/api/auth/*` исключены из mock-перехвата и из retry-по-401 в API-клиенте
      (`isAuthPath`): иначе `onUnauthorized` → инвалидация `getAuthMe` → повторный `/api/me` → 401
      давали бесконечный цикл
- [x] 13.9 (По замечанию пользователя) Удалены `src/proxy/auth-guard.ts` и его тест, `proxy.ts`
      вернулся к `chainProxy([injectHeaders])`. Проверка cookie в proxy ничего не давала: список
      приватных префиксов пуст, а редирект авторизованного со `/sign-in`/`/sign-up` уже делает
      серверная проверка сессии в самих страницах. E2E подтверждает, что поведение сохранилось.
      Спека `user-auth` переписана: требование сформулировано как «состояние авторизации
      определяется на сервере», добавлен сценарий «главная доступна гостю»
- [x] 13.10 (По замечанию пользователя) Шапка получает профиль серверным префетчем:
      `AuthStatusSlot` резолвит сессию через `getCurrentUser()`, засеивает query `getAuthMe`
      (`setQueryData` + `HydrationBoundary`, как на главной) и передаёт `initialUser` в клиентский
      `AuthStatus`. Первый кадр корректен и для гостя, и для вошедшего — раньше гость делал лишний
      клиентский запрос, а вошедший видел мигание пустой шапки
- [x] 13.11 (По замечанию пользователя) Кнопка выхода стала иконочной: `Button`
      `variant="ghost" size="icon-lg"` с `LogOutIcon` и `aria-label`/`title` «Выйти»
- [x] 13.12 (По замечанию пользователя) Аватар рендерится через `next/image`. Ссылка на аватар —
      произвольный внешний URL, а `images.remotePatterns` в `next.config.ts` разрешает только
      `storage.yandexcloud.net`, поэтому стоит `unoptimized`; тестовый мок `next/image` дополнен
      пропом `unoptimized`
- [x] 13.13 (По замечанию пользователя) `GuestLinks` вынесен в отдельный файл
      `src/components/auth-status/guest-links.tsx` — по одному компоненту на файл
- [x] 13.14 (По замечанию пользователя) Из кода этого change'а убраны все комментарии; обоснования
      решений и найденные подводные камни остаются в `design.md` и в этом списке задач
- [x] 13.15 (По замечанию пользователя) `AuthProvider` и его `setOnUnauthorized` удалены, root
      layout больше не оборачивает дерево этим провайдером. Обработчик не только был бесполезен
      (`/api/skills` публичный, `/api/me` из этой логики исключён), но и вредил: в
      `packages/api/base/client.ts` наличие `onUnauthorized` включает повтор запроса после `401`, а
      с cookie-сессиями обновлять нечего — повтор просто удваивал заведомо неуспешный запрос.
      Истёкшая сессия теперь обнаруживается штатно: `GET /api/me` отвечает `401`, React Query
      рефетчит его при возврате фокуса и навигации, выход делается кнопкой
- [x] 13.16 (По замечанию пользователя) `GENDER_OPTIONS` вынесены в
      `app/sign-up/_constants/gender-options.ts` по аналогии с `app/(home)/_constants/`
- [x] 13.17 Подчищены неиспользуемые экспорты, на которые указал `npm run knip`: баррель
      `src/modules/auth/index.ts` оставляет только actions (клиентские модули намеренно импортируют
      `./schemas` и `./types` напрямую, чтобы не тянуть server-only граф), из `@repo/core/form`
      убраны `withForm`, `useFieldContext`, `useFormContext`, из `schemas.ts` — неиспользуемые типы
- [x] 13.18 (По вопросу пользователя) `NEXT_PUBLIC_BETTER_AUTH_URL` удалена целиком (env-схема,
      `.env.example`, `vitest.config.ts`, README, `createAuthClient`). В `better-auth/dist/utils/url`
      видно, что без `baseURL` клиент в браузере берёт `window.location.origin` и дописывает
      `/api/auth` — а handler висит на том же origin, так что переменная была страховкой без смысла.
      Серверный `BETTER_AUTH_URL` остаётся: на сервере `window` нет
