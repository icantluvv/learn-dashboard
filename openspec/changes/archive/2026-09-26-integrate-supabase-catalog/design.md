## Context

См. `proposal.md` — Why/What Changes. Отправная точка:

- OpenAPI-контракт (`api/src/openapi.yaml` → `api/src/paths/api_skills.yaml`, `api_skills_id.yaml`, `api/src/components/schemas/Skill.yaml`) уже описывает `GET /skills` (список, фильтры `search/topic/difficulty/minQuestionsCount/maxQuestionsCount`) и `GET /skills/{id}` (деталь: `title` + `questions`). Контракт **не меняется** этим изменением.
- Kubb генерирует из контракта в `packages/api/base/codegen`: типы, Zod-схемы, HTTP-клиенты (`clients/skillsController/getSkills.ts`, `getSkillById.ts`), React Query hooks (`useGetSkills`, `useGetSkillsSuspense`, `useGetSkillById`, `useGetSkillByIdSuspense`) и `queryOptions`-фабрики (`getSkillsQueryOptions`, `getSkillByIdQueryOptions`).
- Все HTTP-клиенты идут через единый `fetch` в `packages/api/base/client.ts`, который сейчас резолвит `baseURL` на внешний backend (`BACK_INTERNAL_URL` на сервере, `NEXT_PUBLIC_BFF_PATH`/`NEXT_PUBLIC_BACK_URL` в браузере) или уходит в mock-режим (`mock-client.ts` + Faker), если включён `MOCK_MODE`.
- SSR-страницы (`app/(home)/page.tsx`, `app/catalog/[id]/page.tsx`) сейчас прогревают TanStack Query cache через `queryClient.query(getSkillsQueryOptions())` — то есть Server Component сам делает HTTP self-fetch к тому же URL, что и клиент.
- Внешнего backend для skills больше не будет: единственный источник данных — таблица `skills` в Supabase Postgres, доступ к которой должен идти только с сервера (anon/service key не должны попасть в браузер).

## Goals / Non-Goals

**Goals:**

- Таблица `skills` в Supabase, покрывающая оба ответа контракта одним источником данных.
- `GET /skills` и `GET /skills/{id}` реально читают Supabase, сохраняя текущую форму ответа (валидируется существующими generated Zod-схемами).
- Клиентские хуки (`useGetSkills*`, `useGetSkillById*`) и TanStack Query кэширование на клиенте продолжают работать **без изменений** в компонентах, которые их вызывают.
- Ключи Supabase (URL, anon/service key) не попадают в client bundle и в браузерные network-запросы.
- SSR не делает лишний self-fetch по HTTP к собственному Route Handler — Server Component читает Supabase напрямую и вручную прогревает тот же query cache, что видит клиент.

**Non-Goals:**

- Не вводим аутентификацию/авторизацию пользователей Supabase (Auth) — таблица публично читаемая через server-only ключ, RLS ограничивает прямой анонимный доступ снаружи Next.js.
- Не переносим прочие домены (не-skills) на Supabase — mock-режим для них не трогаем.
- Не добавляем мутации (create/update/delete skills) — только чтение, наполнение делается сид-скриптом/SQL, не через API.
- Не меняем OpenAPI-контракт и form параметров фильтрации.

## Decisions

### 1. Route Handlers вместо Server Actions как "backend"

Next.js Route Handlers (`app/api/skills/route.ts`, `app/api/skills/[id]/route.ts`) реализуют существующий HTTP-контракт напрямую, поэтому сгенерированный `client.ts`-based fetch и React Query хуки продолжают работать как раньше — просто целевой домен меняется на собственный.

Альтернатива — Server Actions (`'use server'` функции) — была предложена изначально, но отклонена: Server Actions не адресуются обычным `fetch(url, {method, params})`, а значит потребовали бы переписывать generated HTTP-клиенты и client.ts под RPC-вызов, ломая совместимость со сгенерированными React Query hooks и client-side кэшированием, которые пользователь явно просил сохранить.

### 2. Второй Kubb-выход (`packages/api/database`) для прямого похода в Supabase

Вместо ручного `@supabase/supabase-js` query builder используем второй, отдельный Kubb pipeline, генерирующий типизированный HTTP-клиент прямо для PostgREST-поверхности Supabase — по аналогии с `base`, но в соседнем выходе.

- `packages/api/kubb.config.ts` экспортирует **массив** из двух конфигов Kubb (`name: 'base'`, `name: 'database'`), у каждого свой `input.path` и `output.path`:
    - `base`: как раньше, `../../api/src/openapi.yaml` → `./base/codegen` (типы/Zod/HTTP-клиент/React Query hooks/faker-моки для публичного контракта приложения).
    - `database`: новый контракт `../../api/src/database/openapi.yaml` → `./database/codegen` (только `pluginOas`+`pluginTs`+`pluginZod`+`pluginClient` — без React Query hooks и без faker-моков, этот транспорт никогда не используется на клиенте и не мокается на этом уровне).
- Новый контракт (`api/src/database/openapi.yaml`, `paths/skills.yaml`, `components/schemas/SkillRow.yaml`) описывает `GET /skills` **в терминах PostgREST**, а не публичного API: query-параметры — это сырые column-фильтры Supabase (`id`, `title`, `topic`, `difficulty`, `questions_count`), каждый со значением вида `"eq.js-closures"`, `"ilike.*Замыкания*"`, `"gte.5"` и т.д. `questions_count` объявлен как `array` (repeat-параметр), чтобы передать одновременно нижнюю и верхнюю границу (`gte.5` и `lte.20`) — `serializeSearchParams` (переиспользуется из `base/search-params.ts`) уже умеет сериализовать массивы как повторяющиеся query-ключи.
- Сгенерированная функция `getSkillRows({ params })` из `packages/api/database/codegen/clients/skillsController/getSkillRows.ts` уходит через собственный `packages/api/database/client.ts` (server-only транспорт с `baseURL = {SUPABASE_URL}/rest/v1`, заголовками `apikey`/`Authorization: Bearer <service role key>`), возвращает массив `SkillRow`, провалидированный сгенерированной Zod-схемой.
- `questions` в `SkillRow` — **необязательное** поле (PostgREST возвращает только выбранные `select`-колонки). Список скиллов явно указывает `select=id,title,topic,difficulty,questions_count` и никогда не тянет `questions` — массивы вопросов не нужны каталогу и заметно увеличивают объём ответа (у части скиллов свыше 100 вопросов). `getSkillById` явно указывает `select=title,questions` — вопросы запрашиваются только на странице конкретного скилла.
- Один server-only модуль-репозиторий (`src/modules/skills/server/skills-repository.ts`) — единственное место, которое **транслирует** публичные фильтры контракта в PostgREST-строки перед вызовом `getSkillRows`:
    - `search` → `title: \`ilike._${search}_\``
    - `topic` → `topic: \`eq.${topic}\``
    - `difficulty` → `difficulty: \`eq.${difficulty}\``
    - `minQuestionsCount`/`maxQuestionsCount` → `questions_count: [\`gte.${min}\`, \`lte.${max}\`]` (только присутствующие границы)
    - `getSkillById(id)` → `getSkillRows({ params: { id: \`eq.${id}\`, limit: 1 } })`, берёт первый элемент массива или возвращает `null`
    - Маппит `SkillRow` → `GetSkills200[number]` / `GetSkillById200` (публичная форма) и валидирует итоговую форму существующими Zod-схемами `@repo/api` (`base/codegen/zod`) перед возвратом наружу.

Такой раздел ответственности даёт: типобезопасность и валидацию на обеих границах (вход в Supabase и выход к клиенту), явный код перевода семантики фильтров в одном месте (в репозитории, не размазан по generated-коду), и at the same time переиспользует существующий Kubb-пайплайн проекта вместо ручного клиента supabase-js.

Альтернатива — `@supabase/supabase-js` SDK с query builder (`.ilike()`, `.eq()`, `.gte()`) — тоже рассматривалась и технически проще для сложных случаев (join'ы, RPC), но отклонена по явному запросу пользователя в пользу переиспользования уже принятого в проекте инструмента кодогенерации (Kubb) и единообразия с `base`-клиентом.

### 3. Supabase-клиент и ключи — server-only

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` добавлены в `src/env/server.ts` (не в `client.ts`) — читаются только в `packages/api/database/client.ts`, который импортирует пакет `server-only`, чтобы бандлинг в клиентский код падал явной ошибкой сборки.
- Используем **service role key**, а не anon key: таблица не должна быть публично читаемой напрямую (без RLS-policy на анонимный доступ), а единственная точка входа — наш собственный сервер через `packages/api/database/client.ts`. Row Level Security на таблице `skills` включается с политикой "нет доступа для anon/authenticated", весь доступ — только service role в обход RLS.
- `packages/api/database/client.ts` — это server-only транспорт (аналог `base/client.ts`, но без mock-режима и без cookie/401-retry логики, которая там не нужна): резолвит `baseURL` на `{SUPABASE_URL}/rest/v1`, добавляет `apikey`/`Authorization` заголовки на каждый запрос.

### 4. `client.ts` baseURL для skills — same-origin

`getBaseUrl()` перестаёт зависеть от `BACK_INTERNAL_URL`/`NEXT_PUBLIC_BACK_URL` для тех операций, чей backend теперь Route Handler в этом же Next.js приложении. Поскольку сейчас в проекте единственный домен — skills, самое простое решение: `baseURL` по умолчанию становится пустой строкой (relative path) и на сервере, и в браузере, а `config.url` для generated-клиентов уже содержит `/skills`, `/skills/{id}` — то есть запрос идёт на `/skills` того же origin. Next.js резолвит `/skills` как маршрут `app/api/skills/route.ts` только если сам путь совпадает — поэтому Route Handler размещается по пути `app/api/skills/route.ts`, а contract path `/skills` мапится на реальный URL `/api/skills` через `rewrites()` в `next.config.ts` (аналогично существующему `NEXT_PUBLIC_BFF_PATH` rewrite, но теперь и на сервере, и без внешнего upstream).
`BACK_INTERNAL_URL`/`NEXT_PUBLIC_BACK_URL`/`NEXT_PUBLIC_BFF_PATH` остаются как есть для случая, если в будущем появится другой домен (не skills) с внешним backend — эта ветка кода не удаляется, а `getBaseUrl` начинает разруливать по тому, начинается ли `config.url` с известного skills-префикса.

### 5. SSR: прямой вызов + ручной прогрев cache

`app/(home)/page.tsx` и `app/catalog/[id]/page.tsx` вместо `queryClient.query(getSkillsQueryOptions())` делают:

```ts
const filters = ... // из searchParams, как и раньше
const data = await getSkills(filters) // прямой вызов server-only репозитория
queryClient.setQueryData(getSkillsQueryOptions(filters).queryKey, data)
```

Так `HydrationBoundary` и клиентские хуки видят те же query keys, что и раньше (форма ключа не меняется — она приходит из generated `getSkillsQueryOptions`), а Server Component не делает лишний HTTP hop к самому себе. 404 для `getSkillById` обрабатывается так же, как раньше (`notFound()`), просто источник ошибки — `null` из репозитория вместо `error.cause.status === 404`.

### 6. Mock-режим для skills

`packages/api/base/client.ts`'s `isMockModeEnabled` продолжает работать как общий переключатель, но пути `/skills`, `/skills/{id}` в mock-режиме больше не имеют смысла как "заглушка для отсутствующего backend" — заменяем их назначение на "детерминированные данные для тестов/Storybook", оставляя `mock-client.ts` + Faker как есть (используется в компонентных тестах и Storybook), но убираем их как fallback в dev/prod при выключенном `MOCK_MODE`. Это не требует кода — просто явное решение: `MOCK_MODE=false` в `.env.example`/deploy для skills означает "точно идти в Supabase".

## Migration Plan

1. Создать SQL-миграцию `supabase/migrations/<timestamp>_create_skills_table.sql` (таблица + RLS + policy "deny all" для anon/authenticated).
2. Прогнать миграцию в Supabase-проекте (через Supabase SQL Editor или CLI — фиксируется в tasks.md).
3. Засеять таблицу seed-скриптом на основе текущих Faker-примеров/фикстур, чтобы каталог не был пустым сразу после переключения.
4. Добавить env-переменные и `@supabase/supabase-js` зависимость, задеплоить/прописать `.env` локально.
5. Реализовать репозиторий + Route Handlers, переключить `getBaseUrl`, переключить SSR.
6. Прогнать полный набор тестов (unit/component/integration), вручную smoke-test каталога и детали в браузере.

Откат: поскольку контракт не менялся, откат — это revert коммитов данного change; Supabase-таблицу можно оставить (не мешает mock-режиму) или удалить отдельной миграцией, если потребуется полностью откатить БД.

## Risks / Trade-offs

- **[Risk]** Service role key используется на сервере — при случайном импорте server-only файла в client bundle ключ утечёт. → **Mitigation**: пакет `server-only` в модуле создания Supabase-клиента + Oxlint import-boundary review в чек-листе задачи.
- **[Risk]** Ручной прогрев query cache (`setQueryData`) может разойтись по форме данных с тем, что вернул бы Route Handler (например, если Zod-валидация в Route Handler отбросит лишнее поле, а SSR-путь — нет). → **Mitigation**: обе точки входа (Route Handler и SSR) используют один и тот же репозиторий и одну и ту же Zod-валидацию перед возвратом наружу.
- **[Risk]** `questions_count` как generated column требует, чтобы миграция и seed всегда работали с массивом `questions`, а не отдельным числом — расхождение будет молча неверным числом на карточке. → **Mitigation**: `questions_count` объявляется `GENERATED ALWAYS AS (cardinality(questions)) STORED`, вручную не пишется никогда.
- **[Trade-off]** Отказ от PostgREST-прямого доступа означает on лишний слой (Route Handler) между клиентом и Supabase вместо прямого REST — чуть больше кода, но сохраняет текущий DX (generated hooks, TanStack Query) и снимает проблему несовместимого синтаксиса фильтров.

## Open Questions

- Нужен ли Supabase CLI (`supabase migration up`) в проекте или миграция накатывается вручную через Dashboard SQL Editor разово — не влияет на спеки/tasks, уточняется на этапе выполнения задачи по СУБД.
