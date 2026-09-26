## Context

Мотивация — см. `proposal.md - Why`. Существенные для дизайна факты о текущем состоянии:

- Данные приложения лежат в Supabase, но читаются **не** через `@supabase/supabase-js`, а через
  PostgREST-транспорт `packages/api/database/client.ts` (service-role ключ, `server-only`), клиент
  сгенерирован kubb из `api/src/database/openapi.yaml`. Прикладной контракт — `api/src/openapi.yaml`,
  клиент/хуки/Zod генерируются в `packages/api/base/codegen`.
- В `api/src/openapi.yaml` уже объявлены теги `Registration` и `Me` и security scheme `auth_cookie`
  (cookie `session_id`), но ни один path их не использует.
- В коде уже есть точки расширения: `src/components/providers/auth-provider.tsx` (регистрирует
  `setOnUnauthorized`), `packages/api/base/client-handlers.ts`, заглушка
  `src/lib/auth/client.ts` (`getSession: async () => null`).
- Next.js 16 App Router, `cacheComponents: true`, корневой `proxy.ts` (chain из `injectHeaders`,
  matcher исключает `/api`), React 19, Zod 4 (`zod/mini` в env), TanStack Query v5.
- Библиотеки форм в проекте нет: `@repo/core` содержит только UI-примитивы (`Input`, `Select`,
  `Button`, …), TanStack Form не установлен, несмотря на упоминание `@repo/core/form` в `AGENTS.md`.
- Сборка идёт в standalone-образ и на Vercel — окружение серверless-подобное, долгоживущих процессов
  гарантировать нельзя.

## Goals / Non-Goals

**Goals:**

- Один источник истины по сессии — Better Auth поверх той же Supabase-БД, без второй системы
  пользователей.
- Прикладной фронтенд узнаёт о состоянии авторизации только через описанный в OpenAPI `GET /api/me`
  (и через серверный `getCurrentUser()` для первого рендера), а не через недокументированные ответы
  Better Auth.
- Валидация регистрации описана один раз (Zod) и применяется и на клиенте, и на сервере.
- Не ломать существующий PostgREST-доступ к `skills` и правило «секреты только на сервере».

**Non-Goals:**

- OAuth/социальные провайдеры, magic link, 2FA, подтверждение email, сброс пароля — отдельные
  change'и.
- Загрузка файла аватара (Supabase Storage). На этом этапе `image` — строка-URL.
- Роли/права и приватный функционал за авторизацией — будет описан отдельным change'ем; здесь
  фиксируется только механика «гость / авторизованный».
- Перенос `skills` на авторизованный доступ и RLS по пользователю.

## Decisions

### 1. Better Auth подключается к Supabase напрямую по Postgres, а не через PostgREST

**Решение**: `betterAuth({ database: new Pool({ connectionString: serverEnvironment.SUPABASE_DB_URL }) })`.
Строка подключения — Supabase **Session pooler** (Supavisor, порт `5432`-совместимый session mode),
`?sslmode=require`. Таблицы Better Auth живут в схеме `public` той же базы, что и `skills`. Pool
создаётся один раз в модуле (`globalThis`-синглтон, как принято для serverless) с `max: 1`.

**Почему**: Better Auth работает с БД через Kysely и ожидает SQL-доступ (транзакции, `on conflict`,
индексы). PostgREST-транспорт проекта — REST-обёртка над теми же данными; гонять через него
аутентификацию означало бы писать собственный адаптер Better Auth и лишиться транзакционности.

**Альтернативы**:

- Транзакционный пулер Supabase (порт 6543) — дешевле по соединениям, но ломает prepared statements
  Kysely; потребовал бы дополнительной настройки и даёт трудноуловимые ошибки. Отклонено.
- Свой адаптер Better Auth поверх PostgREST — большой объём кода и риск рассинхронизации с апстримом
  при отсутствии выигрыша. Отклонено.
- `@supabase/supabase-js` Auth вместо Better Auth — противоречит требованию задачи (нужен
  Better Auth) и тянет вторую систему пользователей. Отклонено.

### 2. Схема Better Auth фиксируется как Supabase-миграция, а не применяется CLI на лету

**Решение**: SQL генерируется командой `npx @better-auth/cli generate` и кладётся в
`supabase/migrations/<timestamp>_create_better_auth_tables.sql` рядом с
`20260925180000_create_skills_table.sql`. К каждой таблице (`user`, `session`, `account`,
`verification`) добавляется `enable row level security` и deny-all политика для `anon`/`authenticated`
— как у `skills`: доступ к этим таблицам есть только у серверного подключения с service-role/владельцем.

**Почему**: в репозитории уже есть один и только один способ описывать схему БД; `better-auth migrate`
изменял бы прод-базу вне этого потока и мимо ревью. RLS-политика важна отдельно: без неё таблица
`user` была бы доступна по PostgREST с anon-ключом.

**Альтернативы**: `better-auth migrate` в CI — отклонено (нет версионирования и отката);
Drizzle/Prisma-адаптер — отклонено, в проекте нет ORM и вводить его ради auth несоразмерно.

### 3. `authMe` живёт по `/api/me`, а не внутри `/api/auth/*`

**Решение**: catch-all Better Auth монтируется по каноническому пути `app/api/auth/[...all]/route.ts`
(`toNextJsHandler(auth)`). Наш собственный контрактный эндпоинт — `GET /api/me`
(`api/src/paths/api_me.yaml`, `operationId: getAuthMe`, тег `Me`, security `auth_cookie`),
реализован в `app/api/me/route.ts` поверх `auth.api.getSession({ headers: await headers() })`:
`200` c проекцией профиля (`id`, `name`, `email`, `gender`, `age`, `image?`) либо `401`.

**Почему**: любой путь под `/api/auth/*` перехватывается catch-all'ом Better Auth, так что
собственный `/api/auth/me` туда просто не попадёт. Кроме того, ответ `/api/auth/get-session`
принадлежит библиотеке и содержит лишнее (весь объект сессии) — контрактный `/api/me` даёт
стабильную, описанную в OpenAPI форму и генерируемый kubb React Query hook, как и весь остальной
фронтенд-доступ к данным.

**Альтернативы**: фронт напрямую дёргает `authClient.useSession()` — работает, но состояние
авторизации остаётся вне контракта и вне общего слоя `@repo/api`; оставляем `authClient` только для
мутаций (`signUp`/`signIn`/`signOut`), источник истины о профиле — `getAuthMe`.

### 4. Формы — TanStack Form через новый `@repo/core/form`, отправка в Server Action

**Решение**: формы строятся на TanStack Form, как и предписывает `AGENTS.md` (раздел «UI и
Storybook»). Поскольку слоя `@repo/core/form` фактически ещё нет, он создаётся этим change'ем:

- `packages/core/src/form/` — `createFormHook`/`createFormHookContexts` из `@tanstack/react-form`,
  экспорт `useAppForm`, `withForm` и набор field-компонентов поверх уже существующих примитивов:
  `TextField` (`Input`), `SelectField` (`Select`), `NumberField` (`Input type="number"`),
  `SubmitButton` (`Button` + `form.Subscribe` по `canSubmit`/`isSubmitting`). Каждое поле само
  рендерит label, ошибку (`field.state.meta.errors`) и связывает их через `aria-describedby` /
  `aria-invalid`.
- Экспорт `@repo/core/form` (подпуть в `package.json` пакета), чтобы auth-формы и все будущие формы
  использовали один слой.

Схемы `signUpSchema` / `signInSchema` объявляются один раз в `src/modules/auth/schemas.ts`
(Zod 4, `zod/mini` — того же требует линтер проекта) и передаются в
`validators: { onSubmit: … }` напрямую через Standard Schema — без адаптера. Для формы регистрации
используется `signUpFormSchema`: селект и числовое поле стартуют пустыми (`null`), поэтому UI-схема
принимает эту форму значений и превращает её в «поле обязательно», а сервер повторно парсит строгой
`signUpSchema`.

Разметка формы — нативный `<form>` с `onSubmit={(event) => { event.preventDefault();
void form.handleSubmit() }}`, поля через `form.AppField`, кнопка внутри `form.AppForm`.
В `onSubmit` формы вызывается Server Action `signUpAction` / `signInAction` из
`src/modules/auth/actions.ts`, который **повторно** валидирует те же данные и вызывает
`auth.api.signUpEmail` / `auth.api.signInEmail`; cookie ставит плагин `nextCookies()`.
Ошибки, известные только серверу (занятый email, неверные учётные данные), возвращаются из action'а
и раскладываются обратно в форму через `setFieldMeta` — по полю, если ошибка привязана к полю, иначе
как ошибка формы. Состояние отправки берётся из `form.Subscribe` (`isSubmitting`), повторная
отправка блокируется тем же флагом.

**Навигация после успеха живёт в форме, а не в action'е.** Server Action возвращает `{ ok: true }`,
и уже форма инвалидирует query `getAuthMe` и делает `router.replace('/')`. `redirect()` внутри
action'а выглядел естественнее, но не работает: `AuthStatus` находится в root layout, который при
такой навигации не размонтируется, поэтому React Query не перезапрашивает `/api/me` и шапка
продолжает показывать гостя до полной перезагрузки страницы (обнаружено E2E, см.
`tasks.md - 13`).

**Почему**: TanStack Form уже заявлен как стандарт проекта (и devDependency
`@tanstack/react-form-devtools` в корне это подтверждает), поддерживает Standard Schema (тот же Zod,
что и на сервере), даёт per-field валидацию, `isSubmitting`/`canSubmit` и типобезопасность без
ручного состояния. Server Action сохраняется как транспорт, поэтому требование спеки «валидация
работает и в обход клиентской формы» выполняется.

**Альтернативы**:

- `useActionState` + ручной `safeParse` без form-библиотеки — меньше зависимостей, но расходится с
  `AGENTS.md`, даёт ручную развязку ошибок по полям и не переиспользуется в будущих формах.
  Отклонено.
- TanStack Form + прямой клиентский `authClient.signUp.email()` вместо Server Action — меньше кода,
  но тогда авторитетной серверной валидации нашими схемами нет. Отклонено как основной путь;
  клиентский `authClient` используется только для `signOut` в шапке.
- Класть `useAppForm` в `src/components` вместо `@repo/core` — отклонено: `AGENTS.md` явно называет
  `@repo/core/form`, и форм-слой не содержит бизнес-логики.

### 5. Модель пользователя: `gender` и `age` как `additionalFields`

**Решение**:

```ts
user: {
    additionalFields: {
        gender: { type: ['male', 'female', 'other'], required: true, input: true },
        age: { type: 'number', required: true, input: true },
    },
}
```

`name`, `email`, `image` — встроенные поля Better Auth; `image` остаётся nullable. На клиенте
типы восстанавливаются через `inferAdditionalFields<typeof auth>()` в `createAuthClient`.
`emailAndPassword: { enabled: true, minPasswordLength: 8 }` дублирует требование к паролю на уровне
библиотеки, чтобы оно действовало и на прямых вызовах `/api/auth/*`.

**Альтернативы**: отдельная таблица `profile` с 1:1 на `user` — гибче для будущих полей, но требует
собственных запросов и транзакции при регистрации; при двух скалярных полях выигрыша нет. Отклонено
(вернёмся к этому, когда профиль начнёт расти).

### 6. Никакого guard'а в proxy: проверка только там, где она авторитетна

**Решение**: `proxy.ts` остаётся без auth-шага. Состояние авторизации определяется двумя местами:
`getCurrentUser()` в серверной части страницы (`/sign-in`, `/sign-up` редиректят авторизованного на
`/`; `AuthStatusSlot` отдаёт профиль в шапку) и `GET /api/me` для клиентского кэша.

**Почему**: первая версия содержала `src/proxy/auth-guard.ts` с оптимистичной проверкой cookie, как
советует документация Better Auth. На ревью выяснилось, что в этом проекте он не делает ничего:
список приватных префиксов пуст (приватного функционала пока нет), а единственное живое поведение —
редирект авторизованного со `/sign-in`/`/sign-up` — уже реализовано в самих страницах через
авторитетную проверку сессии. Два механизма для одного поведения, один из которых принципиально
ненадёжен, — хуже одного надёжного. E2E подтверждает, что после удаления guard'а редиректы работают.

**Когда вернуть**: если приватный раздел начнёт заметно мигать содержимым до серверного редиректа,
оптимистичная проверка cookie в proxy станет осмысленной оптимизацией UX — но и тогда она остаётся
дополнением к серверной проверке, а не заменой.

**Альтернативы**: оставить guard «на будущее» — отклонено: мёртвый код с ложным ощущением защиты.

### 7. `cacheComponents` и динамические данные авторизации

**Решение**: всё, что читает `headers()`/cookie (route handler `/api/me`, серверные проверки сессии
на страницах, серверная часть шапки), помечается как динамическое и оборачивается в `<Suspense>`
там, где встраивается в кэшируемое дерево: `AuthStatusSlot` — серверный компонент, который
резолвит сессию, засеивает ею query `getAuthMe` (`setQueryData` + `HydrationBoundary`, как на
главной странице) и передаёт профиль в клиентский `AuthStatus` как `initialUser`. Поэтому первый
кадр уже корректен и для гостя, и для вошедшего, а клиентский запрос не нужен для начального
рендера. Страницы `/sign-in` и `/sign-up`
динамические целиком. Кэширование ответа `/api/me` запрещено (`cache: 'no-store'` на уровне
запроса; в React Query — обычный query со `staleTime: 0`).

**Почему**: при `cacheComponents: true` любое обращение к запросным данным вне Suspense ломает
сборку; состояние авторизации по определению не кэшируется между пользователями.

### 8. Mock-режим не трогает auth

**Решение**: `/api/auth/*` и `/api/me` исключаются из перехвата mock-клиента; `src/mock-mode`
дополняется явным исключением, а для `getAuthMe` при включённом mock-режиме возвращается
гость (`401`) либо фиксированный профиль сценария — но без обращения к Better Auth.

**Почему**: mock-режим предназначен для прикладных данных; подмена сессии моками дала бы ложное
ощущение авторизации и расходилась бы с реальной cookie.

### 9. Окружение

| Переменная                    | Слой   | Назначение                                  |
| ----------------------------- | ------ | ------------------------------------------- |
| `BETTER_AUTH_SECRET`          | server | подпись cookie/токенов, обязательна         |
| `BETTER_AUTH_URL`             | server | базовый URL для Better Auth                 |
| `SUPABASE_DB_URL`             | server | Postgres connection string (session pooler) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | client | `baseURL` для `createAuthClient` в браузере |

Добавляются в `src/env/server.ts` / `src/env/client.ts`, `.env.example` и `docs/environment.md`.
`SUPABASE_DB_URL` и `BETTER_AUTH_SECRET` не попадают в client schema; логгер не пишет ни cookie, ни
заголовок `Authorization`.

## Test strategy

- **Static**: `npm run verify:fast` (`fmt:check`, `oxlint`, `tsc`), `npm --workspace
@learn-dashboard/api run lint` (Redocly) и `bundle` после правки контракта; проверка, что
  `src/env/client.ts` не содержит серверных секретов.
- **Unit** (Node project, `*.unit.test.ts`):
    - `src/modules/auth/schemas.unit.test.ts` — правила и границы валидации (3/8 символов, email,
      обязательность `gender`/`age`, диапазон возраста, опциональность `image`).
    - `app/api/me/route.unit.test.ts` — `200` с проекцией профиля при валидной сессии, `401` для
      гостя, отсутствие пароля/идентификатора сессии в ответе (мок `auth.api.getSession`).
    - `src/modules/auth/actions.unit.test.ts` — Server Action возвращает ошибки валидации без вызова
      Better Auth; маппинг ошибки «email занят» и «неверные учётные данные» в состояние формы.
- **Component** (browser project, `*.component.test.tsx`): формы `/sign-up` и `/sign-in` — inline
  ошибки по каждому правилу, отсутствие запроса при невалидной форме, блокировка кнопки и
  единственный запрос при двойном клике, показ ошибки верхнего уровня и серверной ошибки поля через
  `setErrorMap`; field-компоненты `@repo/core/form` (`TextField`, `SelectField`, `NumberField`,
  `SubmitButton`) — привязка label/ошибки, `aria-invalid`, дизейбл кнопки; шапка — гостевое и
  авторизованное состояние.
- **Integration**: покрывается unit-тестами route handler'а и action'ов с моком Better Auth;
  отдельного слоя не вводим.
- **E2E** (Playwright, mock/dev-стенд с реальной БД): регистрация нового пользователя → редирект на
  `/` → шапка показывает имя → `GET /api/me` отдаёт `200` → выход → `GET /api/me` отдаёт `401`;
  вход с неверным паролем показывает ошибку; гость на приватном пути редиректится на `/sign-in`.
- **Performance**: не требуется (нет нагрузочных требований); отдельно проверяется лишь, что на
  запрос страницы не создаётся новое Postgres-соединение при каждом рендере.
- **Manual**: реальная Supabase-база — строки в `user`/`session`/`account`, флаги cookie в
  DevTools, применение миграции на чистой базе, проверка, что anon-ключ не читает таблицу `user`.

## Risks / Trade-offs

- **[Исчерпание соединений Postgres в serverless]** → Supavisor session pooler + `max: 1` +
  синглтон Pool на `globalThis`; при переходе на транзакционный пулер потребуется отдельная проверка
  Kysely/prepared statements.
- **[Две системы доступа к одной базе (PostgREST + прямой Postgres)]** → разграничены явно:
  прикладные таблицы читает PostgREST-клиент, таблицы auth — только Better Auth; RLS deny-all на
  auth-таблицах не даёт прочитать их anon-ключом.
- **[Оптимистичная проверка cookie в proxy воспринимается как защита]** → зафиксировано в spec
  требованием авторитетной серверной проверки; в код добавляется комментарий, в review — чек.
- **[`cacheComponents: true` и динамические данные]** → auth-зависимые ветки под `<Suspense>`,
  `/api/me` без кэша; риск проявится на `npm run build`, поэтому build входит в verification.
- **[Расхождение правил валидации между клиентом, Server Action и Better Auth]** → одна Zod-схема на
  клиент и сервер + `minPasswordLength: 8` в конфиге; unit-тест на границы.
- **[Слой `@repo/core/form` создаётся впервые и выходит за рамки auth]** → сознательно ограничиваем
  его четырьмя field-компонентами, нужными двум формам; всё остальное (массивы полей, async
  валидация, файловые поля) добавится по реальной потребности. Слой покрывается собственными
  component-тестами и stories, чтобы следующие формы опирались на проверенный контракт.
- **[Cookie, привязанная к странице создания]** → `advanced.defaultCookieAttributes` заменяет
  дефолты Better Auth целиком, поэтому `path: '/'` нужно указывать явно: без него сессионная cookie
  оставалась в области `/sign-up` и следующий же переход выглядел как гостевой (обнаружено E2E).
- **[Устаревший профиль в кэше после падения рефетча]** → React Query сохраняет прошлые `data` при
  ошибке, поэтому `AuthStatus` считает гостем именно `isError`, а выход дополнительно вычищает
  запись через `removeQueries` — иначе после `signOut` в шапке оставалось имя.
- **[Дефолтные гранты Supabase на новых таблицах]** → RLS в Supabase не единственный слой: роли
  `anon`/`authenticated` по умолчанию получают полные табличные права, поэтому миграция ещё и
  делает `revoke all` на auth-таблицах. Проверено: `set local role anon; select … from "user"` →
  `permission denied`.
- **[Утечка секретов]** → `SUPABASE_DB_URL`/`BETTER_AUTH_SECRET` только в server env, `server-only`
  импорт в модуле `auth`, запрет логировать cookie.
- **[Дрейф между OpenAPI-контрактом и реальным ответом `/api/me`]** → route handler валидирует
  проекцию сгенерированной Zod-схемой `getAuthMe200Schema`, как это сделано в
  `skills-repository.ts`.

## Migration Plan

1. Установить зависимости (`better-auth`, `pg`, `@types/pg`, `@better-auth/cli`), добавить env в
   `.env.example` и в окружения стендов.
2. Сгенерировать SQL Better Auth, дополнить RLS-политиками, применить миграцию на dev-базе Supabase,
   затем на prod.
3. Выкатить код: auth-инстанс, catch-all handler, `/api/me`, страницы, guard.
4. Проверить на стенде E2E-сценарий регистрации и входа.
5. **Rollback**: снять шаг `authGuard` из `chainProxy`, убрать route handler'ы и страницы, вернуть
   заглушку `authClient`, удалить путь `/api/me` из контракта и перегенерировать `@repo/api`.
   Таблицы Better Auth остаются в базе (дроп — отдельной миграцией), поэтому откат кода безопасен и
   не теряет данные.
