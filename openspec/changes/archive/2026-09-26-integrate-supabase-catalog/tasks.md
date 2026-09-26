## 1. Supabase: схема и данные [DONE]

- [x] 1.1 Создать SQL-миграцию `supabase/migrations/20260925180000_create_skills_table.sql`: таблица `skills` (`id text primary key`, `title text not null`, `topic text not null`, `difficulty text not null check (difficulty in ('easy','medium','hard'))`, `questions text[] not null default '{}'`, `questions_count integer generated always as (cardinality(questions)) stored`, `created_at timestamptz not null default now()`).
- [x] 1.2 Включить Row Level Security на таблице `skills` и добавить policy, запрещающую любой доступ для ролей `anon`/`authenticated` (доступ только через service role, в обход RLS).
- [x] 1.3 Миграция прогнана вручную через Supabase SQL Editor (DDL недоступен через REST/service role).
- [x] 1.4 Seed-данные взяты не из Faker, а из реального контента: 97 `.docx`-файлов (по одному на скилл), сопоставленных с `id/topic/difficulty` из прежнего mock-каталога (`packages/api/base/mock-scenarios.ts`) по точному совпадению имени файла с `title`; вопросы извлечены из текста docx (`textutil -convert txt`), отфильтрованы служебные строки-разметки (`Теория`/`Практика`/`Вопросы`/`Не изучил`). Данные загружены в Supabase через REST (`POST /rest/v1/skills`, service role key) чанками.
- [x] 1.5 Проверено через REST (`GET /rest/v1/skills?select=...`): 97/97 строк, `questions_count` считается корректно (generated column), фильтр `difficulty=eq.hard` работает.

## 2. Env и кодогенерация для доступа к Supabase [DONE]

- [x] 2.1 Добавить `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` в `src/env/server.ts` (zod-валидация, server-only).
- [x] 2.2 Обновить `.env.example` новыми переменными с плейсхолдерами.
- [x] 2.3 Создать контракт `api/src/database/openapi.yaml` + `paths/skills.yaml` + `components/schemas/SkillRow.yaml`, описывающий `GET /skills` в терминах PostgREST (`id/title/topic/difficulty/questions_count` как raw filter-строки, `questions_count` — repeat-параметр для диапазона).
- [x] 2.4 Разбить `packages/api/kubb.config.ts` на массив из двух конфигов (`base` → `./base/codegen`, `database` → `./database/codegen` из нового контракта, без faker/mock-routes/react-query плагинов).
- [x] 2.5 Создать `packages/api/database/client.ts` (server-only транспорт, `baseURL = {SUPABASE_URL}/rest/v1`, `apikey`/`Authorization` заголовки) и `packages/api/database/index.ts`.
- [x] 2.6 Прогнать `npm --workspace @repo/api run generate`, убедиться что оба выхода генерируются и `getSkillRows` резолвит транспорт в `database/client.ts`.
- [ ] 2.7 Обновить `docs/environment.md` и `docs/api-codegen.md` описанием новых переменных и двух Kubb-выходов.

## 3. Серверный репозиторий скиллов (транслятор фильтров) [DONE]

- [x] 3.1 Создать `src/modules/skills/server/skills-repository.ts` (server-only) с функциями `getSkills(filters: GetSkillsQueryParams): Promise<GetSkills200>` и `getSkillById(id: string): Promise<GetSkillById200 | null>`.
- [x] 3.2 Внутри `getSkills` транслировать публичные фильтры в PostgREST-строки (`search` → `title: ilike.*value*`, `topic`/`difficulty` → `eq.value`, `minQuestionsCount`/`maxQuestionsCount` → `questions_count: [gte.min, lte.max]`), вызвать сгенерированный `getSkillRows` из `@repo/api` (`packages/api/database`), смаппить `SkillRow[]` → `GetSkills200`. Список запрашивает `select=id,title,topic,difficulty,questions_count` — **без `questions`**: массивы вопросов не нужны каталогу и заметно увеличивали объём ответа (у части скиллов по 100+ вопросов). Из-за этого **все** поля `SkillRow` в контракте БД (`api/src/database/components/schemas/SkillRow.yaml`) сделаны необязательными (не только `questions`) — это сырая PostgREST-проекция, набор присутствующих полей зависит от переданного `select`, единой формы "всегда все поля" не существует; `getSkillById` со своим `select=title,questions` тоже не возвращает `id/topic/difficulty/questions_count`, поэтому если бы они остались `required`, generated Zod-валидация внутри `getSkillRows` падала бы на странице скилла (было поймано и исправлено при ручном тестировании). Гарантии по конкретным полям (какие точно присутствуют) обеспечивает репозиторий — `toSkillCard` использует non-null assertions, т.к. сам же указывает нужный `select`.
- [x] 3.3 Внутри `getSkillById` вызвать `getSkillRows({ params: { id: eq.<id>, select: 'title,questions', limit: 1 } })`, вернуть `null` при пустом результате, иначе смаппить в `GetSkillById200` (`title`, `questions`) — вопросы запрашиваются только на странице конкретного скилла.
- [x] 3.4 Валидировать итоговую форму обеих функций сгенерированными Zod-схемами публичного контракта (`@repo/api/base/codegen/zod/skillsController/*`) перед возвратом.
- [x] 3.5 Добавлены unit-тесты репозитория (`skills-repository.unit.test.ts`, 10 тестов) на построение PostgREST-фильтров (включая границы `minQuestionsCount`/`maxQuestionsCount`) и обработку "не найдено" — через `vi.mock('@repo/api/database')`, без реальной сети.

## 4. Route Handlers [DONE]

- [x] 4.1 Создать `app/api/skills/route.ts` (`GET`), вызывающий `getSkills`, парсящий `searchParams` в `GetSkillsQueryParams` (через `getSkillsQueryParamsSchema`, 400 при невалидных значениях), возвращающий `NextResponse.json`.
- [x] 4.2 Создать `app/api/skills/[id]/route.ts` (`GET`), вызывающий `getSkillById`, возвращающий 404 через `NextResponse.json(..., { status: 404 })`, если результат `null`.
- [x] 4.3 Rewrites не нужны: сгенерированные клиенты (`getGetSkillsUrl`) уже обращаются на `/api/skills`/`/api/skills/:id` (путь контракта включает префикс `/api`), что дословно совпадает с расположением Route Handler — подтверждено вручную и integration-тестами.
- [x] 4.4 Добавлены `app/api/skills/route.unit.test.ts` (4 теста: список, парсинг фильтров, пустой результат, 400 на невалидный `difficulty`) и `app/api/skills/[id]/route.unit.test.ts` (2 теста: успех, 404) — Route Handler вызывается напрямую с мокнутым репозиторием (`vi.mock('#/modules/skills/server/skills-repository')`), unit-project (Node), без реальной сети.

## 5. Переключение транспорта generated-клиентов [DONE]

- [x] 5.1 Изменить `getBaseUrl()` в `packages/api/base/client.ts`: для skills-путей (`/api/skills`, `/api/skills/:id`) резолвить same-origin (`''`) вместо `BACK_INTERNAL_URL`/`NEXT_PUBLIC_BACK_URL`/`NEXT_PUBLIC_BFF_PATH`, сохранив существующую ветку для остальных путей/будущих доменов.
- [x] 5.2 Добавлены `packages/api/base/client.unit.test.ts` (3 теста) на новую логику выбора `baseURL` (`isSameOriginPath`/`getBaseUrl` экспортированы для тестируемости).
- [x] 5.3 Обнаружен и устранён реальный баг блокировавший переключение: `src/mock-mode/config.ts` жёстко держал `/` и `/catalog` в `mockModePagePaths`, из-за чего мок-режим включался для этих страниц **независимо от `MOCK_MODE`**. Список обнулён — теперь мок-режим на этих страницах управляется только явным флагом/кукой.
- [ ] 5.4 `docs/mock-mode.md` в репозитории не существует (несмотря на ссылку в AGENTS.md) — пропущено, документировать нечего.

## 6. SSR-страницы [DONE]

- [x] 6.1 Переписан `app/(home)/page.tsx`: вызывает `getSkills()` напрямую вместо `queryClient.query(getSkillsQueryOptions())`, прогревает cache через `queryClient.setQueryData(getSkillsQueryOptions().queryKey, skills)`; ошибка проглатывается (best-effort SSR warm-up), клиентский hook дозапросит сам.
- [x] 6.2 Переписан `app/catalog/[id]/page.tsx`: вызывает `getSkillById(id)` напрямую, `null` обрабатывается через `notFound()`, cache прогревается по `getSkillByIdQueryOptions({ id }).queryKey`.
- [x] 6.3 Существующие component-тесты каталога и детали скилла (`skill-card.test.tsx`, `catalog.test.tsx`, `skill-detail-content.test.tsx`, `skill-detail-error.test.tsx`, `back-button.test.tsx`, `reset-filters-button.test.tsx`) прогнаны — 13/13 зелёных, моки не потребовали изменений (они не затрагивают SSR-путь page.tsx).

## 7. Верификация

- [x] 7.1 `openspec validate integrate-supabase-catalog --strict --no-interactive` — valid.
- [x] 7.2 `npm run tsc` — чисто.
- [x] 7.3 `npm run lint` — **не чисто в целом по репозиторию** (широкий пре-существующий технический долг: `next.config.ts`, `eslint.config.mjs`, `packages/api/plugins/mock-client-routes.ts`, `src/mock-mode/runtime.ts`, `src/proxy/chain.ts` и др. — не тронуты этим change). Файлы, созданные/изменённые в рамках этого change, точечно прогнаны через `oxlint` и чисты, за одним намеренным исключением: `packages/api/database/client.ts`'s `params?: object` — тот же `no-restricted-types(object)`, что уже принят как есть в `packages/api/base/client.ts` (замена на `Record<string, unknown>` ломает типизацию сгенерированных Kubb-клиентов).
- [x] 7.4 `npm run fmt:check` — точечно по изменённым/новым файлам чисто; полный прогон по репозиторию не запускался (затронул бы файлы вне scope).
- [x] 7.5 `npm run test:unit` — 9/9 файлов, 54 теста (после исправлений — 4 файла/19 тестов из этого change).
- [x] 7.6 `npm run test:component` — 17/17 файлов, 70 тестов (полный unit+component прогон вместе).
- [x] 7.7 `npm run build` — успешно, `/api/skills` и `/api/skills/[id]` зарегистрированы как dynamic routes.
- [x] 7.8 Ручной smoke-тест выполнен пользователем на dev-сервере с реальным Supabase: каталог, фильтр по `topic`, деталь скилла — работает. По ходу найдены и исправлены баги, не покрытые unit-тестами (те мокают транспорт целиком):
    - Забытый вызов `getBaseUrl()` без нового аргумента `url` — same-origin ветка никогда не срабатывала, запрос уходил на старый `/bff-api` → `ECONNREFUSED :8080`.
    - `src/mock-mode/config.ts` жёстко держал `/` и `/catalog` в `mockModePagePaths` — мок-режим включался независимо от `MOCK_MODE`.
    - Полный `select=*` на списке тянул `questions` (у части скиллов 100+ элементов) — по запросу пользователя список теперь явно не запрашивает `questions`.
    - После этого `SkillRow` в контракте БД требовал `id/topic/difficulty/questions_count` как обязательные — деталь-запрос (`select=title,questions`) их не возвращает, Zod-валидация внутри `getSkillRows` падала на странице скилла. Все поля `SkillRow` сделаны необязательными.
- [x] 7.9 `test-plan.md` обновлён: статусы сценариев ниже.
