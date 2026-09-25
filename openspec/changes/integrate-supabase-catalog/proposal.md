## Why

Каталог скиллов и страница детали сейчас работают только через mock-режим (`packages/api/base/mock-client.ts` + Faker), потому что реального backend нет. В Supabase уже создан проект, но в нём нет ни одной таблицы. Нужно завести схему БД, наполнить её реальными данными и переключить `GET /skills` и `GET /skills/{id}` на настоящие запросы к Supabase, не раскрывая на клиенте домен и ключи БД.

## What Changes

- Создать в Supabase таблицу `skills` (SQL-миграция) с полями, покрывающими оба текущих ответа контракта (`GetSkills200`: id/title/questionsCount/difficulty/topic и `GetSkillById200`: title/questions), и наполнить её реальными данными — 97 скиллов, извлечённых из исходных `.docx`-материалов (id/topic/difficulty сопоставлены с прежним mock-каталогом по названию, вопросы взяты из содержимого документов). **Выполнено.**
- Добавить второй выход кодогенерации Kubb — `packages/api/database` (рядом с существующим `packages/api/base`), сгенерированный из нового контракта `api/src/database/openapi.yaml`, описывающего PostgREST-поверхность Supabase для таблицы `skills` (query-параметры в терминах PostgREST: `eq.`/`ilike.`/`gte.`/`lte.`). У этого выхода свой server-only транспорт `packages/api/database/client.ts` с `baseURL = {SUPABASE_URL}/rest/v1` и заголовками `apikey`/`Authorization` (service role key, никогда не уходит в браузер — гарантируется пакетом `server-only`). **Выполнено.**
- Реализовать `app/api/skills/route.ts` и `app/api/skills/[id]/route.ts` как настоящие Next.js Route Handlers по уже существующему публичному OpenAPI-контракту (`api/src/paths/api_skills.yaml`, `api_skills_id.yaml`): внутри они вызывают общий репозиторий скиллов, который транслирует публичные фильтры `search/topic/difficulty/minQuestionsCount/maxQuestionsCount` в PostgREST-строки и вызывает сгенерированный `getSkillRows` из `packages/api/database`, а результат валидирует сгенерированными Zod-схемами публичного контракта (`@repo/api`) перед отдачей клиенту.
- Изменить `packages/api/base/client.ts` (`getBaseUrl`) так, чтобы запросы к `skills` шли на собственный домен приложения (Route Handlers), а не на внешний `BACK_INTERNAL_URL`/`NEXT_PUBLIC_BACK_URL` — backend вне Next.js для этого капабилити больше не существует. Существующие сгенерированные React Query хуки (`useGetSkills`, `useGetSkillsSuspense`, `useGetSkillById`, `useGetSkillByIdSuspense`) и client-side кэширование TanStack Query остаются без изменений.
- SSR-запросы в `app/(home)/page.tsx` и `app/catalog/[id]/page.tsx` переключить на прямой вызов серверного репозитория скиллов (без HTTP self-fetch к своим же Route Handlers), с последующим ручным заполнением TanStack Query cache (`queryClient.setQueryData`) по тем же query key, что использует `getSkillsQueryOptions`/`getSkillByIdQueryOptions`, чтобы `HydrationBoundary` и клиентские хуки продолжали работать без изменений.
- Обновить `.env.example`, `src/env/server.ts` (и при необходимости `src/env/client.ts`) переменными подключения к Supabase (URL, anon key, service role key — используются только на сервере).
- Отключить/удалить mock-режим конкретно для skills-эндпоинтов (mock-scenario faker остаётся для остальных доменов, если такие появятся, но для `skills` он больше не источник данных в dev/prod).

## Capabilities

### New Capabilities

- `skills-catalog-data`: получение каталога скиллов (`GET /skills`) и одного скилла (`GET /skills/{id}`) из реального хранилища Supabase с фильтрацией по search/topic/difficulty/questionsCount, вместо статичных mock-данных.

### Modified Capabilities

_(нет — публичный контракт `GetSkills`/`GetSkillById` не меняется, меняется только источник данных за ним)_

## Impact

- **БД**: новая Supabase-таблица `skills` + SQL-миграция + seed-скрипт.
- **Env**: server-only переменные `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — добавлены в `.env.example` и `src/env/server.ts`. **Выполнено.**
- **Кодогенерация**: `packages/api/kubb.config.ts` теперь экспортирует массив из двух конфигов (`base`, `database`); новый контракт `api/src/database/openapi.yaml` + `paths/skills.yaml` + `components/schemas/SkillRow.yaml`; новый выход `packages/api/database/codegen`, `packages/api/database/client.ts`, `packages/api/database/index.ts`. **Выполнено**, `npm --workspace @repo/api run generate` проходит для обоих выходов.
- **Код (осталось)**: `packages/api/base/client.ts` (`getBaseUrl`) — переключить на same-origin для skills-путей; новые `app/api/skills/route.ts`, `app/api/skills/[id]/route.ts`; новый server-only репозиторий-транслятор фильтров (`src/modules/skills/server/skills-repository.ts`), вызывающий сгенерированный `getSkillRows` из `packages/api/database`; правки `app/(home)/page.tsx` и `app/catalog/[id]/page.tsx` (SSR data fetching).
- **Mock-режим**: `src/mock-mode/*` и `packages/api/base/mock-client.ts` — сузить область действия для skills-эндпоинтов (или полностью вывести skills из mock-scenario, см. design.md).
- **Тесты**: unit-тесты репозитория/фильтрации, integration-тесты Route Handlers, обновление существующих component/unit тестов каталога и детали скилла при необходимости.
- **Документация**: `docs/environment.md`, `docs/mock-mode.md`, `docs/api-codegen.md` — зафиксировать новую схему получения данных для skills.
