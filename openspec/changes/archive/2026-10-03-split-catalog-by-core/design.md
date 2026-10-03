## Context

Мотивация — см. `proposal.md` → «Why». Здесь фиксируются только технические решения.

Текущее состояние, которое формирует подход:

- `app/(main)/catalog/page.tsx` — Server Component: SSR-прогрев `getSkills()` в `try/catch`,
  `HydrationBoundary`, обёртка `page-wrapper v-stack gap-4 md:flex-row md:gap-12`, внутри
  `<SidebarFilters />` и `<Catalog />`.
- `app/(main)/catalog/[id]/page.tsx` — страница навыка; `getSkillById(id)` + `notFound()`.
- Клиент: `Catalog` берёт фильтры из `useSkillsFilters()` (nuqs) и вызывает `useGetSkills({ params })`.
- Контракт живёт в `api/src/**` и генерируется Kubb (`npm --workspace @repo/api run generate`) в
  `packages/api/base/codegen` и `packages/api/database/codegen`; generated-код не правится руками.
- В БД `public.skills` — таблица с `difficulty text check (...)`; миграции лежат в
  `supabase/migrations/` и накатываются только вперёд (down-миграций в репозитории нет).
- Mock-режим (`packages/api/base/mock-scenarios.ts`) держит собственный набор карточек и свою
  реализацию фильтрации — он обязан повторять новую форму ответа.

## Goals / Non-Goals

**Goals:**

- Направление — часть данных и контракта, а не только URL: клиент не должен выводить направление
  из адреса, чтобы отрисовать карточку.
- Добавление пятого направления = одна запись в реестре + значение в check-ограничении БД и в
  enum контракта. Никаких новых файлов маршрутов и компонентов.
- Раздел `/catalog/frontend` — побайтово то же поведение, что сейчас на `/catalog`, кроме
  зафиксированного `core=frontend` в запросе.

**Non-Goals:**

- Редиректы со старых адресов `/catalog/{id}` и `/catalog?<фильтры>`.
- Наполнение разделов `backend`, `devops`, `design` реальными навыками.
- Фильтр по направлению в UI: направление выбирается маршрутом, а не контролом в панели фильтров.
- Админка/сидинг навыков новых направлений.

## Decisions

### Один динамический сегмент `[core]` вместо четырёх статических маршрутов

Маршруты: `app/(main)/catalog/page.tsx` (витрина), `app/(main)/catalog/[core]/page.tsx` (раздел),
`app/(main)/catalog/[core]/[id]/page.tsx` (навык).

Допустимые значения URL и тип `SkillCore` остаются в generated-контракте и узком реестре
`src/constants/skill-cores.ts`. Отображаемые данные направлений являются строками
`public.cores`, а не TypeScript-константами:

```ts
export const SKILL_CORES = ['frontend', 'backend', 'devops', 'design'] as const
export type SkillCore = (typeof SKILL_CORES)[number]
```

`[core]/page.tsx` резолвит сегмент через реестр и затем получает строку направления из БД:
неизвестное значение или отсутствующая строка → `notFound()`, `isAvailable: false` → заглушка,
`isAvailable: true` → текущая связка `SidebarFilters` + `Catalog`.

_Альтернатива — четыре статические директории `catalog/frontend`, `catalog/backend`, …_ Отклонена:
три из четырёх страниц были бы копиями заглушки, добавление направления требовало бы новой
директории, а `catalog/{core}/{id}` пришлось бы либо дублировать, либо всё равно вводить `[core]`.
Плюс статические сегменты рядом с `[id]` — ровно та коллизия, из-за которой деталь и переезжает.

_Альтернатива — `/catalog?core=frontend`._ Отклонена: направление — раздел, а не фильтр; оно должно
переживать сброс фильтров и давать разделам собственные адреса.

### `core` — обязательное поле ответа, а не выводимое из URL

`GET /api/skills` возвращает `core` в каждом элементе, `GET /api/skills/{id}` — в объекте навыка.
Это позволяет `SkillCard` строить ссылку `/catalog/{skill.core}/{skill.id}` из данных, а странице
навыка — проверять совпадение направления в адресе с направлением навыка и отдавать `notFound()`
при расхождении.

_Альтернатива — брать `core` из сегмента URL и не добавлять его в ответ._ Отклонена: тогда
`/catalog/backend/{id}` отрисовал бы фронтенд-навык под чужим адресом, и один и тот же навык был бы
доступен по четырём адресам.

### Фильтр `core` — отдельный query-параметр `GET /api/skills` с enum

В `api/src/paths/api_skills.yaml` добавляется параметр `core` с тем же enum, что и поле ответа.
Невалидное значение отсекается уже существующим `getSkillsQueryParamsSchema.parse` в
`app/api/skills/route.ts`, который на исключении отдаёт `400 invalid_query` — новый код обработки
ошибок не нужен.

В `src/modules/skills/server/skills-repository.ts` фильтр ложится в существующую схему PostgREST:
`core: 'eq.<value>'`, а `select` расширяется до `id,title,topic,difficulty,questions_count,core`.
`getSkillById` меняет `select` на `title,questions,core`.

### Направление в query key: явный параметр, а не отдельный ключ

SSR-прогрев раздела делает `getSkills({ core })` и кладёт результат в
`getSkillsQueryOptions({ params: { core } }).queryKey`. Клиент вызывает `useGetSkills({ params })`,
где `params` — результат `toSkillsQueryParams(filters, core)`: `core` всегда присутствует в
params раздела. Ключи совпадают только при полном совпадении объекта params, поэтому `core`
добавляется в params **до** отсечения пустого объекта в `toSkillsQueryParams` — это значит, что
функция больше никогда не возвращает `undefined` внутри раздела.

_Альтернатива — прогревать кэш ключом без `core` и фильтровать на клиенте._ Отклонена: клиент
получал бы навыки чужих направлений и при первом рендере делал бы лишний запрос.

`useSkillsFilters()` не трогается: направление не хранится в query-параметрах. Текущее направление
приходит в `Catalog` пропом от серверной страницы раздела.

### Миграция: `text` + check-ограничение, backfill, затем `drop default`

```sql
alter table public.skills add column core text not null default 'frontend'
    check (core in ('frontend', 'backend', 'devops', 'design'));
alter table public.skills alter column core drop default;
create index skills_core_idx on public.skills (core);
```

`default 'frontend'` в `add column` делает backfill существующих строк атомарно и без отдельного
`update`. `drop default` сразу после — чтобы будущие вставки указывали направление явно и новый
навык не «проваливался» во фронтенд по умолчанию.

`text` + `check` вместо Postgres `enum type` — ради единообразия с существующей колонкой
`difficulty` и потому что расширение списка направлений тогда остаётся обычным
`alter table ... drop constraint / add constraint`.

### Направления — отдельная таблица и серверный read-model

`public.cores` содержит `type` (PK), `name`, `description`, `icon`, `is_available` и
`display_order`. `skills.core` ссылается на `cores.type` через внешний ключ `ON UPDATE CASCADE ON
DELETE RESTRICT`. Миграция создаёт и заполняет направления до добавления обязательной колонки
`skills.core`, поэтому backfill `frontend` сразу удовлетворяет связи.

Database OpenAPI описывает `GET /cores`, публичный контракт — `GET /api/cores`. Репозиторий
направлений преобразует snake_case строку PostgREST в публичную модель и валидирует её generated
Zod-схемой. Клиентский лист `CoreBanners` на `/catalog` вызывает generated `useGetCores`, поэтому
браузер делает наблюдаемый `GET /api/cores`; компонент явно обрабатывает loading, error, empty и
success. Route Handler читает данные через серверный репозиторий. Страница `/catalog/{core}`
получает одну запись напрямую через репозиторий, без self-fetch к собственному HTTP API.

Иконка хранится как закрытый строковый ключ (`code`, `server`, `ship`, `palette`) и маппится на
локальный компонент Lucide. HTML или SVG из БД не исполняются. Ссылка баннера строится только из
валидированного `type`: `/catalog/{type}`.

### Перенос кода — `git mv`, тела компонентов не меняются

`_components/catalog/`, `_components/sidebar-filters/`, `_hooks/` и `[id]/` переезжают под
`[core]/` через `git mv` вместе с каталогами `__screenshots__/`. Правятся только относительные
импорты и точки, где действительно нужен `core`: `Catalog` (проп + params), `SkillCard` (ссылка),
`[core]/[id]/page.tsx` (сверка направления). Это даёт читаемый `git diff -M` и позволяет требовать,
чтобы перенесённые тесты прошли без правок тел.

### Mock-режим повторяет контракт

В `mock-scenarios.ts` всем карточкам проставляется `core: 'frontend'`, `filterSkillCards` получает
ветку по `params.core`, а `skillQuestions` — поле `core`. Иначе mock-режим отдаёт ответ, не
проходящий generated Zod-схему.

## Risks / Trade-offs

- **Старые ссылки `/catalog/{id}` и `/catalog?<фильтры>` ломаются** → Осознанный размен: сервис не
  опубликован широко, а редирект `/catalog/{id}` потребовал бы обращения в БД за направлением на
  каждый запрос несуществующего маршрута. Если ссылки окажутся нужны — добавляется отдельным
  change.
- **Расхождение трёх списков направлений** (TS-реестр, enum в OpenAPI, check в БД) → Unit-тест
  сверяет `SKILL_CORES` с generated-типом направления из `@repo/api`; расхождение с БД ловится
  `not null`/`check` при вставке и ручной проверкой миграции. Полностью автоматизировать сверку с
  БД в рамках этого change не планируется.
- **Ключи React Query перестают совпадать между SSR и клиентом** (самая вероятная регрессия) →
  E2E-проверка: на `/catalog/frontend` при первом рендере нет сетевого запроса к `/api/skills`;
  плюс component-тест на то, что `toSkillsQueryParams` всегда содержит `core`.
- **Скриншотные тесты каталога и фильтров после переноса** → каталоги `__screenshots__/` переносятся
  тем же `git mv`; расхождение снапшота будет означать реальное изменение вёрстки, а не переезд.
- **`drop default` ломает существующий сидинг/вставки без `core`** → в репозитории нет seed-скрипта
  для `skills`; вставки делаются вручную. Риск принимается, отражён в ручных проверках.
- **Typed routes и динамический сегмент** → ссылки строятся шаблоном `/catalog/${core}` и
  `/catalog/${core}/${id}`; если `next` typed routes не выведет их автоматически, применяется
  узкий хелпер, возвращающий `Route`, а не точечные `as` по коду.

## Migration Plan

1. Накатить миграцию `supabase/migrations/*_add_core_to_skills.sql` — совместима со старым кодом:
   все запросы идут с явным `select`, новая колонка их не ломает.
2. Выкатить код. С этого момента `/catalog/{id}` отдаёт 404, `/catalog` — витрину.
3. Откат: `git revert` кода. Колонка `core` остаётся в БД и предыдущей версии не мешает, поэтому
   down-миграция не пишется и не выполняется.

## Test strategy

- **Static**: `npm run tsc`, `npm run lint`, `npx oxfmt`, `npm run knip` (после переноса не должно
  остаться неиспользуемых экспортов), `openspec validate --strict`.
- **Unit** (`#modules`, route handler, реестр): фильтр и проекция `core` в `skills-repository`;
  `getSkillById` возвращает `core`; `GET /api/skills` с валидным и невалидным `core`; резолвер
  сегмента направления (известное / в разработке / неизвестное); `toSkillsQueryParams` всегда
  содержит `core`; сверка `SKILL_CORES` с generated-типом.
- **Component**: витрина — баннеры всех направлений и их `href`, пометка «в разработке»; заглушка
  раздела; `SkillCard` ведёт на `/catalog/{core}/{id}`; перенесённые тесты каталога и фильтров —
  без правок тел.
- **Integration**: не выделяется отдельным уровнем — связка «route handler → репозиторий» покрыта
  unit-тестами с замоканным database-клиентом, как это уже сделано в
  `app/api/skills/route.unit.test.ts`.
- **E2E** (`src/tests/e2e/catalog.spec.ts`): витрина → `/catalog/frontend` → карточка → навык;
  фильтр попадает в query-параметры `/catalog/frontend` и переживает перезагрузку, оставаясь в
  разделе; `/catalog/backend` показывает заглушку; `/catalog/mobile` даёт 404; на
  `/catalog/frontend` при первом рендере нет клиентского запроса к `/api/skills`.
- **Performance**: отдельный запрос направлений мал и выполняется один раз через TanStack Query;
  waterfall принят как явное требование наблюдаемого запроса `/api/cores` со страницы витрины.
- **Manual**: сравнение `/catalog/frontend` с прежним `/catalog`; вёрстка витрины на мобильной и
  десктопной ширине; проверка на реальной БД, что после миграции у всех навыков `core = 'frontend'`.
